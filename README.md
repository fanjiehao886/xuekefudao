# 学科辅导网 - xuekefudao.cn

## 项目简介
全国家长引流静态网站，部署在 Vercel，使用 xuekefudao.cn 域名。

## 技术栈
- 纯静态 HTML / CSS / JS
- Serverless API：`api/contact.js`（接收表单提交）
- 部署平台：Vercel

## 页面结构
- `index.html` - 首页（Hero + 学科 + 老师展示 + 表单）
- `teachers.html` - 老师列表（科目/年级/学历/城市/关键词筛选）
- `about.html` - 关于我们
- `subjects.html` - 学科大全
- `404.html` - 自定义404页面
- `css/style.css` - 全站样式
- `js/teachers-data.js` - 教师数据（统一维护，24位老师）
- `js/main.js` - 交互逻辑（导航/表单/微信复制/回到顶部）
- `api/contact.js` - Vercel Serverless 函数（表单提交接口）

## 关键配置
- 微信号：fanlaoshiwx（全站已添加一键复制按钮）
- 表单：POST 到 `/api/contact`，Vercel Serverless 处理
- 表单验证：已添加手机号格式校验 + 隐私政策勾选框
- SEO：sitemap.xml + robots.txt + OG标签 + canonical + 结构化数据已配置
- 部署：vercel.json 已配置静态资源缓存

## 部署步骤
1. `cd /Users/nantongribao/Desktop/workspace/xuekefudao`
2. `npx vercel --prod`（首次会引导登录）
3. 在 Vercel 控制台绑定域名 xuekefudao.cn

## 教师数据维护
统一编辑 `js/teachers-data.js`，首页和老师列表页自动同步更新。

## Cloudflare 加速（建议）
域名解析到 Vercel 时，套一层 Cloudflare CDN 可大幅提升国内访问速度：
1. 将 xuekefudao.cn 迁移到 Cloudflare DNS
2. CNAME xuekefudao.cn → cname.vercel-dns.com
3. 开启 Cloudflare 代理（橙色云朵）
