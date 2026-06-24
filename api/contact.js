// Vercel Serverless Function — 接收家教咨询 + 管理后台

export default async function handler(req, res) {
  var origin = req.headers.origin || '';
  if (origin.includes('xuekefudao.cn') || origin.includes('app.codebuddy.work') || origin.includes('localhost')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET — 管理后台查看提交记录
  if (req.method === 'GET') {
    return handleGet(req, res);
  }

  // POST — 接收表单提交
  if (req.method === 'POST') {
    return handlePost(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// ========== 查看提交记录 ==========
async function handleGet(req, res) {
  const adminKey = process.env.ADMIN_KEY || 'xueke2024';
  const providedKey = req.query.key || '';
  if (providedKey !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(200).json({ success: true, submissions: [] });
  }

  try {
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: 'submissions/' });
    const submissions = [];

    for (const blob of blobs) {
      try {
        const resp = await fetch(blob.url);
        const data = await resp.json();
        submissions.push(data);
      } catch (e) {
        // skip corrupted files
      }
    }

    submissions.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
    return res.status(200).json({ success: true, submissions });
  } catch (err) {
    return res.status(500).json({ error: '读取失败: ' + err.message });
  }
}

// ========== 接收表单 ==========
async function handlePost(req, res) {
  try {
    // 兼容新旧 Vercel 运行时：新版可能没有 req.body，需手动解析
    let body = req.body;
    if (!body || Object.keys(body).length === 0) {
      const ct = req.headers['content-type'] || '';
      if (typeof req.text === 'function') {
        const raw = await req.text();
        if (ct.includes('application/json')) {
          try { body = JSON.parse(raw); } catch (e) { body = {}; }
        } else {
          body = Object.fromEntries(new URLSearchParams(raw));
        }
      }
    }

    const { grade, subject, city, contact, note, _native } = body || {};
    const isNative = _native === '1';
    const timestamp = new Date().toISOString();
    const id = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    const submission = { id, timestamp, grade, subject, city, contact, note };

    // 存储到 Vercel Blob（如已配置）
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob');
        await put('submissions/' + id + '.json', JSON.stringify(submission), {
          access: 'public',
          contentType: 'application/json',
        });
      } catch (e) {
        console.error('Blob store failed:', e.message);
      }
    }

    if (isNative) {
      res.setHeader('Location', '/?thanks=1');
      return res.status(302).end();
    }
    return res.status(200).json({ success: true, message: '提交成功！我们会尽快联系您。' });
  } catch (err) {
    console.error('handlePost error:', err);
    const body = req.body || {};
    if (body._native === '1') {
      res.setHeader('Location', '/?thanks=1');
      return res.status(302).end();
    }
    return res.status(500).json({ error: '服务器错误，请稍后重试' });
  }
}
