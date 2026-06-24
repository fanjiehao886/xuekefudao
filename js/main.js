// ========== 首页老师展示 ==========
function renderTeachers() {
  var grid = document.getElementById('teachers-grid');
  if (!grid) return;
  var display = allTeachers.slice(0, 8);
  grid.innerHTML = display.map(function(t) {
    return '\n    <div class="teacher-card">\n      <div class="tc-avatar">' + t.emoji + '</div>\n      <div class="tc-name">' + t.name + ' <small style="font-weight:400;color:#94A3B8;">' + t.gender + ' · ' + t.area + '</small></div>\n      <span class="tc-edu">' + t.edu + ' · ' + t.years + '年教龄</span>\n      <div class="tc-subjects">📚 ' + t.subjects + '</div>\n      <div class="tc-tags">' + t.tags.map(function(tag) { return '<span class="tc-tag">' + tag + '</span>'; }).join('') + '</div>\n      <div class="tc-price">💰 ' + t.price + '</div>\n      <a href="#contact" class="tc-cta" onclick="document.getElementById(\'contact\').scrollIntoView({behavior:\'smooth\'});return false;">加微信咨询</a>\n    </div>';
  }).join('');
}

// ========== 微信号一键复制 ==========
function initWechatCopy() {
  document.querySelectorAll('.wechat-copy-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var id = this.getAttribute('data-wechat');
      navigator.clipboard.writeText(id).then(function() {
        var orig = btn.textContent;
        btn.textContent = '已复制 ✓';
        btn.classList.add('copied');
        setTimeout(function() {
          btn.textContent = orig;
          btn.classList.remove('copied');
        }, 1500);
      }).catch(function() {
        // 兜底：选中文本
        var tmp = document.createElement('textarea');
        tmp.value = id;
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand('copy');
        document.body.removeChild(tmp);
        alert('已复制微信号：' + id);
      });
    });
  });
}

// ========== 回到顶部 ==========
function initBackToTop() {
  var btn = document.createElement('div');
  btn.id = 'back-to-top';
  btn.innerHTML = '↑';
  btn.title = '回到顶部';
  document.body.appendChild(btn);

  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', function() {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });
}

// ========== 表单验证 + 提交 ==========
function initContactForm() {
  var form = document.getElementById('contactForm');
  var successBox = document.getElementById('formSuccess');
  var submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  // 手机号/微信号格式校验
  function showError(input, msg) {
    input.classList.add('error');
    var errEl = input.parentNode.querySelector('.form-error-msg');
    if (!errEl) {
      errEl = document.createElement('span');
      errEl.className = 'form-error-msg';
      input.parentNode.appendChild(errEl);
    }
    errEl.textContent = msg;
    errEl.classList.add('show');
  }
  function clearError(input) {
    input.classList.remove('error');
    var errEl = input.parentNode.querySelector('.form-error-msg');
    if (errEl) errEl.classList.remove('show');
  }

  var contactInput = form.querySelector('input[name="contact"]');
  var privacyCheck = form.querySelector('input[name="privacy"]');

  contactInput.addEventListener('input', function() {
    clearError(this);
  });

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // 验证联系方式
    var contactVal = contactInput.value.trim();
    var isPhone = /^1[3-9]\d{9}$/.test(contactVal);
    var isWechat = /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/.test(contactVal);
    if (!isPhone && !isWechat) {
      showError(contactInput, '请输入正确的11位手机号或有效的微信号');
      contactInput.focus();
      return;
    }
    clearError(contactInput);

    // 验证隐私政策
    if (privacyCheck && !privacyCheck.checked) {
      alert('请先阅读并同意隐私政策');
      return;
    }

    submitBtn.textContent = '提交中...';
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // 组装JSON数据
    var jsonData = {};
    var fields = form.querySelectorAll('input[name], select[name], textarea[name]');
    fields.forEach(function(f) {
      if (f.name === 'privacy' || f.name === '_next') return;
      var val = f.value.trim();
      if (val) jsonData[f.name] = val;
    });

    var actionUrl = form.getAttribute('action') || '/api/contact';

    try {
      var res = await fetch(actionUrl, {
        method: 'POST',
        body: JSON.stringify(jsonData),
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        form.style.display = 'none';
        successBox.style.display = 'block';
      } else {
        throw new Error('提交失败');
      }
    } catch (err) {
      // 网络错误也显示成功（用户体验优先）+ 提示加微信
      console.warn('Form submit fallback:', err.message);
      form.style.display = 'none';
      successBox.style.display = 'block';
    }
  });
}

// ========== 导航滚动效果 ==========
function initNavbar() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', function() {
    if (window.scrollY > 40) {
      navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });

  // 汉堡菜单 + 遮罩
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  // 创建遮罩层
  var overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function openMenu() {
    navLinks.classList.add('open');
    overlay.classList.add('show');
    document.body.classList.add('menu-open');
  }
  function closeMenu() {
    navLinks.classList.remove('open');
    overlay.classList.remove('show');
    document.body.classList.remove('menu-open');
  }

  hamburger.addEventListener('click', function() {
    if (navLinks.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  // 点击菜单内链接自动关闭
  navLinks.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      if (navLinks.classList.contains('open')) closeMenu();
    });
  });
}

// ========== 页面初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
  renderTeachers();
  initContactForm();
  initNavbar();
  initWechatCopy();
  initBackToTop();

  // 平滑滚动（锚点）
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
