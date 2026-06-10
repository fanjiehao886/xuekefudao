# 学科辅导网 - xuekefudao.cn

## 项目简介
全国家长引流静态网站，部署在 Vercel，使用 xuekefudao.cn 域名。

## 技术栈
- 纯静态 HTML / CSS / JS（无后端、无数据库）
- 表单使用 Formspree（免费，提交后发邮件通知）
- 部署平台：Vercel

## 页面结构
- `index.html` - 首页（Hero + 学科 + 老师展示 + 表单）
- `teachers.html` - 老师列表（带筛选）
- `about.html` - 关于我们
- `subjects.html` - 学科大全（TODO）
- `css/style.css` - 全站样式
- `js/main.js` - 交互逻辑 + 老师数据

## 关键配置
- 微信号：fanlaoshiwx
- 表单：Formspree（需要注册后替换 YOUR_FORM_ID）
- 部署：vercel.json 已配置

## 部署步骤
1. `cd /Users/nantongribao/Desktop/workspace/xuekefudao`
2. `npx vercel --prod`（首次会引导登录）
3. 在 Vercel 控制台绑定域名 xuekefudao.cn

## Formspree 配置
1. 访问 https://formspree.io，注册账号
2. 新建 Form，获取 Form ID（如 xkgzpqvw）
3. 替换 index.html 中的 YOUR_FORM_ID

## Cloudflare 加速（建议）
域名解析到 Vercel 时，套一层 Cloudflare CDN 可大幅提升国内访问速度：
1. 将 xuekefudao.cn 迁移到 Cloudflare DNS
2. CNAME xuekefudao.cn → cname.vercel-dns.com
3. 开启 Cloudflare 代理（橙色云朵）
