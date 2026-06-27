# 电商视觉作品集使用说明

这是一个无需安装依赖的纯静态作品集网站，双击 `index.html` 即可预览。

## 替换个人信息

在 `index.html` 中搜索并替换：

- `林一`、`LINYI`
- `hello@example.com`
- `your_wechat`
- 工作年限、项目数量与所在地

## 替换为真实作品

1. 在当前目录新建 `assets` 文件夹，并放入 JPG、PNG、WebP 或 MP4 文件。
2. 将项目卡片中的示例画面替换为图片，例如：

```html
<img src="assets/你的主图.jpg" alt="项目名称">
```

3. 录屏可以替换为：

```html
<video controls poster="assets/录屏封面.jpg">
  <source src="assets/直播间录屏.mp4" type="video/mp4">
</video>
```

## 发布网站

整个 `ecommerce-portfolio` 文件夹可直接上传至 GitHub Pages、Cloudflare Pages、Netlify 或自己的服务器。
