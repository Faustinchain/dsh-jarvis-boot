# Changelog

## 0.1.0 — 2026-11-13

首个可用版本。

- 全屏方舟反应堆开机动画：SVG 三层同心环（30s / 16s 反向 / 52s）、刻度环、进度弧；
- 六行启动日志按时间轴逐条淡入，末行 `REACTOR SPIN-UP / IGNITING` 高亮为红色；
- 右侧遥测读数随进度变化，底部进度条 + 百分比；
- 就绪页：核心呼吸、就绪文案、「点击任意处进入 / 按 ENTER」；
- 交互：跳过按钮、`Esc` 跳就绪、就绪后点击 / `Enter` / 空格进入并淡出；
- Shadow DOM 隔离、`prefers-reduced-motion` 直通就绪、`window.__JARVIS_BOOT__` 调试入口；
- 离线预览器 `test/preview.html` 与 CDP 截图脚本 `test/shot.mjs`。
