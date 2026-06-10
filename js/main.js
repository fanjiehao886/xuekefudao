// ========== 样本老师数据 ==========
const teachers = [
  { name: "王晓明", gender: "男", edu: "985硕士", area: "北京", subjects: "数学·物理", years: 8, tags: ["竞赛专项", "高考冲刺", "耐心细致"], price: "200-280元/时", emoji: "王" },
  { name: "李思雨", gender: "女", edu: "211本科", area: "上海", subjects: "英语·语文", years: 5, tags: ["口语流利", "写作提升", "亲和力强"], price: "180-250元/时", emoji: "李" },
  { name: "陈建国", gender: "男", edu: "名校博士", area: "广州", subjects: "化学·生物", years: 10, tags: ["竞赛教练", "实验讲解", "逻辑清晰"], price: "260-350元/时", emoji: "陈" },
  { name: "张美丽", gender: "女", edu: "师范本科", area: "成都", subjects: "小学全科", years: 6, tags: ["启蒙专家", "趣味教学", "家长好评"], price: "120-180元/时", emoji: "张" },
  { name: "刘志强", gender: "男", edu: "985本科", area: "南京", subjects: "数学·信息", years: 7, tags: ["奥数金牌", "编程竞赛", "逻辑思维"], price: "220-300元/时", emoji: "刘" },
  { name: "赵雅婷", gender: "女", edu: "211硕士", area: "杭州", subjects: "英语·历史", years: 4, tags: ["托福满分", "双语教学", "外向活泼"], price: "200-280元/时", emoji: "赵" },
  { name: "孙浩然", gender: "男", edu: "重点本科", area: "武汉", subjects: "物理·化学", years: 9, tags: ["理综专家", "题型总结", "提分快"], price: "180-240元/时", emoji: "孙" },
  { name: "周晨曦", gender: "女", edu: "师范硕士", area: "西安", subjects: "语文·政治", years: 6, tags: ["答题技巧", "作文满分", "文科全能"], price: "160-220元/时", emoji: "周" },
];

function renderTeachers() {
  const grid = document.getElementById('teachers-grid');
  if (!grid) return;
  const display = teachers.slice(0, 8);
  grid.innerHTML = display.map(t => `
    <div class="teacher-card">
      <div class="tc-avatar">${t.emoji}</div>
      <div class="tc-name">${t.name} <small style="font-weight:400;color:#94A3B8;">${t.gender} · ${t.area}</small></div>
      <span class="tc-edu">${t.edu} · ${t.years}年教龄</span>
      <div class="tc-subjects">📚 ${t.subjects}</div>
      <div class="tc-tags">${t.tags.map(tag => `<span class="tc-tag">${tag}</span>`).join('')}</div>
      <div class="tc-price">💰 ${t.price}</div>
      <a href="#contact" class="tc-cta" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'});return false;">加微信咨询</a>
    </div>
  `).join('');
}

// ========== 表单处理 ==========
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successBox = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    submitBtn.textContent = '提交中...';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const action = form.getAttribute('action');

    // 如果 Formspree ID 还没配置，直接显示成功（演示模式）
    if (action.includes('YOUR_FORM_ID')) {
      setTimeout(() => {
        form.style.display = 'none';
        successBox.style.display = 'block';
      }, 800);
      return;
    }

    try {
      const res = await fetch(action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.style.display = 'none';
        successBox.style.display = 'block';
      } else {
        throw new Error('提交失败');
      }
    } catch (err) {
      submitBtn.textContent = '免费提交，获取匹配方案';
      submitBtn.disabled = false;
      alert('提交遇到问题，请直接加微信：fanlaoshiwx');
    }
  });
}

// ========== 导航滚动效果 ==========
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });

  // 汉堡菜单
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
      if (navLinks.style.display === 'flex') {
        Object.assign(navLinks.style, {
          flexDirection: 'column',
          position: 'absolute',
          top: '60px', left: '0', right: '0',
          background: '#fff',
          padding: '16px 20px',
          borderBottom: '1px solid #E2E8F0',
          gap: '14px',
          zIndex: '999'
        });
      }
    });
  }
}

// ========== 页面初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
  renderTeachers();
  initContactForm();
  initNavbar();

  // 平滑滚动（锚点）
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
