# Changelog

## 0.2.2 — 2026-11-13

- 皮肤改为直接注入样式表，不再依赖宿主主题服务：宿主把 `--dsw-*` token 定义在 `body` 与 `body[data-ds-dark-theme]` 上，插件在 `head` 末尾追加一条 `!important` 覆盖，两种配色都被压住，内联样式也盖得住；
- 同时给 `body` 补 `data-ds-dark-theme` 与 `color-scheme: dark`，让不读 token 的深色规则（滚动条、原生控件）也跟着走；
- 主题服务仍然会尝试注册（有的话就能在外观里看到 `jarvis` 并手动切回），拿不到也不影响皮肤；
- 想关掉皮肤：`localStorage.setItem("dsh-jarvis-boot:skin", "off")`。

## 0.2.1 — 2026-11-13

- 尝试在加载时自动选中 `jarvis` 主题。该版本依赖 `ctx.theme` 注入，在部分构建上拿不到服务，皮肤不生效，已被 0.2.2 取代。

## 0.2.0 — 2026-11-13

- 点击进入改为「闸门式」上下分开转场：覆盖层一分为二向上下滑出，露出主界面，接缝带一条金色发光线；两半复用的是冻结当帧的 HUD，环不会回跳；
- 新增内置皮肤 `jarvis`：通过宿主 `ctx.theme` 注册的第三方主题，覆盖约 80 个 `--dsw-*` 语义 token（暖黑底、金强调、红主按钮、金描边），在「设置 → 通用 → 外观」里选择即可。

## 0.1.0 — 2026-11-13

首个可用版本。

- 全屏方舟反应堆开机动画：SVG 三层同心环（30s / 16s 反向 / 52s）、刻度环、进度弧；
- 六行启动日志按时间轴逐条淡入，末行 `REACTOR SPIN-UP / IGNITING` 高亮为红色；
- 右侧遥测读数随进度变化，底部进度条 + 百分比；
- 就绪页：核心呼吸、就绪文案、「点击任意处进入 / 按 ENTER」；
- 交互：跳过按钮、`Esc` 跳就绪、就绪后点击 / `Enter` / 空格进入并淡出；
- Shadow DOM 隔离、`prefers-reduced-motion` 直通就绪、`window.__JARVIS_BOOT__` 调试入口；
- 离线预览器 `test/preview.html` 与 CDP 截图脚本 `test/shot.mjs`。
