# 欧尼小厨房

面向中国用户的韩语学习网页小游戏，使用 Vite + React + TypeScript + Tailwind CSS + Zustand + Phaser。

## 本地运行

```bash
npm install
npm run dev
```

打开：

```text
http://localhost:5173/
```

## 生产构建

```bash
npm run build
```

构建产物目录：

```text
dist
```

## Cloudflare Pages 配置

在 Cloudflare Pages 连接 GitHub 仓库后填写：

```text
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: /
```

Vite 的 `base` 保持默认 `/`，适合 Cloudflare Pages 默认域名。
