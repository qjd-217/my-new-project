# 智能考试平台（示例）

这是一个最小可运行的前端演示工程，包含用户提供的 `App` 组件示例，使用 Vite + React + TailwindCSS。

快速开始：

1. 安装依赖

```bash
cd "智能考试平台"
npm install
```

2. 启动开发服务器

```bash
npm run dev
```

3. 在浏览器打开终端给出的 URL（通常是 http://localhost:5173 ）

说明：
- 该项目仅包含前端演示（UI + 模拟数据），AI 出题逻辑为本地模拟。要接入真实 AI/文件解析，请在 `src/App.jsx` 中替换 `handleGenerateExam` 中的模拟部分，调用后端或云端 AI 服务。
