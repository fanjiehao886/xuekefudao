// Vercel Serverless Function — 接收家教咨询
// 优先邮件通知（Resend）→ 其次 Vercel Blob 存储

// TODO: 删除此行，改为 Vercel 环境变量 RESEND_API_KEY
var FALLBACK_RESEND_KEY = 're_c8yKcr4w_AswNCxqYcdDT46WRyAYeRQ4T';
var DEPLOY_TIME = '2026-06-25T10:20+08';

export default async function handler(req, res) {
  var origin = req.headers.origin || '';
  if (origin.includes('xuekefudao.cn') || origin.includes('app.codebuddy.work') || origin.includes('localhost')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return handleGet(req, res);
  if (req.method === 'POST') return handlePost(req, res);
  return res.status(405).json({ error: 'Method not allowed' });
}

// ========== 查看提交记录 ==========
async function handleGet(req, res) {
  const adminKey = process.env.ADMIN_KEY || 'xueke2024';
  if ((req.query.key || '') !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(200).json({ success: true, submissions: [], hint: 'Blob 存储未配置，提交通过邮件发送', deployTime: DEPLOY_TIME });
  }
  try {
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: 'submissions/' });
    const submissions = [];
    for (const blob of blobs) {
      try { const resp = await fetch(blob.url); submissions.push(await resp.json()); } catch (e) {}
    }
    submissions.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
    return res.status(200).json({ success: true, submissions });
  } catch (err) {
    return res.status(500).json({ error: '读取失败: ' + err.message });
  }
}

// ========== 发送邮件通知（Resend） ==========
async function sendEmailNotification(submission) {
  var apiKey = process.env.RESEND_API_KEY || FALLBACK_RESEND_KEY;
  if (!apiKey) return false;
  try {
    const subjectMap = { 'grade': '年级', 'subject': '科目', 'city': '城市', 'contact': '联系方式', 'note': '备注' };
    var text = '【学科辅导网】新咨询\n\n';
    for (var key of ['grade', 'subject', 'city', 'contact', 'note']) {
      text += (subjectMap[key] || key) + '：' + (submission[key] || '—') + '\n';
    }
    text += '\n时间：' + (submission.timestamp || '') + '\n';

    var resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: '学科辅导网 <onboarding@resend.dev>',
        to: [process.env.NOTIFY_EMAIL || 'fanjieboy@gmail.com'],
        subject: '【新咨询】' + (submission.grade || '') + '·' + (submission.subject || '') + ' — ' + (submission.city || ''),
        text: text
      })
    });
    return resp.ok;
  } catch (e) {
    console.error('Email send failed:', e.message);
    return false;
  }
}

// ========== 接收表单 ==========
async function handlePost(req, res) {
  try {
    // 解析 body（兼容新旧 Vercel 运行时）
    var body = req.body;
    if (!body || Object.keys(body).length === 0) {
      var ct = req.headers['content-type'] || '';
      if (typeof req.text === 'function') {
        var raw = await req.text();
        if (ct.includes('application/json')) {
          try { body = JSON.parse(raw); } catch (e) { body = {}; }
        } else {
          body = Object.fromEntries(new URLSearchParams(raw));
        }
      }
    }

    var { grade, subject, city, contact, note, _native } = body || {};
    var isNative = _native === '1';
    var timestamp = new Date().toISOString();
    var id = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    var submission = { id, timestamp, grade, subject, city, contact, note };

    var stored = false;

    // 1. 优先：邮件通知
    if (process.env.RESEND_API_KEY || FALLBACK_RESEND_KEY) {
      var emailed = await sendEmailNotification(submission);
      if (emailed) stored = true;
    }

    // 2. 其次：Vercel Blob 存储
    if (!stored && process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        var { put } = await import('@vercel/blob');
        await put('submissions/' + id + '.json', JSON.stringify(submission), {
          access: 'public',
          contentType: 'application/json',
        });
        stored = true;
      } catch (e) {
        console.error('Blob store failed:', e.message);
      }
    }

    // 未配置任何存储时记录警告
    if (!stored) {
      console.warn('⚠️ 表单数据未持久化：', JSON.stringify(submission));
      console.warn('请配置 RESEND_API_KEY 或 BLOB_READ_WRITE_TOKEN 环境变量');
    }

    // 检测是否浏览器原生表单提交（非 fetch/XHR）
    var accept = (req.headers.accept || '').toLowerCase();
    var isBrowserForm = !accept.includes('*/*') && accept.includes('text/html');
    if (isNative || isBrowserForm) {
      res.setHeader('Location', '/?thanks=1');
      return res.status(302).end();
    }
    return res.status(200).json({ success: true, message: '提交成功！我们会尽快联系您。' });
  } catch (err) {
    console.error('handlePost error:', err);
    var bd = req.body || {};
    if (bd._native === '1') {
      res.setHeader('Location', '/?thanks=1');
      return res.status(302).end();
    }
    // 浏览器原生表单提交：即使出错也跳回首页显示成功
    if (bd.grade && bd.subject) {
      res.setHeader('Location', '/?thanks=1');
      return res.status(302).end();
    }
    return res.status(500).json({ error: '服务器错误，请稍后重试' });
  }
}
 
