/**
 * dsh-jarvis-boot — browser half.
 *
 * Renders a full-screen arc-reactor boot overlay the first time the web GUI
 * boots: red/gold HUD rings, a typed boot log, a progress gate, then a READY
 * plate that waits for a click (or Enter) before revealing the app.
 *
 * Host contract (see @deepseek-ai/dsh-client-modules):
 *   window.__ModuleLoader__.load({ id, factory }) -> exports.apply / exports.inject
 * The overlay needs no slot and no server route, so `inject` is empty.
 *
 * Everything is scoped inside a shadow root: the host's CSS cannot flatten the
 * HUD and our CSS cannot leak into the app.
 */

window.__ModuleLoader__.load({
	id: "dsh-jarvis-boot",
	factory: () => {
		const PLUGIN_ID = "dsh-jarvis-boot";
		const HOST_ID = "jarvis-boot-host";
		const VERSION = "0.1.0";

		// Timeline (ms from mount). Short enough to wait through, long enough to read.
		const DURATION = 3400;
		const FADE = 420;

		const LOG = [
			{ at: 180, key: "SYS", text: "KERNEL IMAGE", value: "LOADED" },
			{ at: 640, key: "MEM", text: "NEURAL LATTICE", value: "4.2 PB" },
			{ at: 1120, key: "LNK", text: "NEURAL HANDSHAKE", value: "SYNCED" },
			{ at: 1660, key: "CORE", text: "DEEPSEEK INFERENCE", value: "ARMED" },
			{ at: 2180, key: "ENV", text: "THREAT MODEL", value: "CLEAR" },
			{ at: 2660, key: "ARC", text: "REACTOR SPIN-UP", value: "IGNITING", hot: true }
		];

		const CSS = String.raw`
			:host { all: initial; }
			* { box-sizing: border-box; }
			.jb-stage {
				--red: #c8141f;
				--hot: #ff4438;
				--gold: #e3ae4e;
				--pale: #ffdb98;
				--ink: #f4e9db;
				position: fixed;
				inset: 0;
				z-index: 2147483000;
				overflow: hidden;
				background: #070507;
				color: var(--ink);
				font-family: "Bahnschrift", "DIN Alternate", "Segoe UI", system-ui, sans-serif;
				opacity: 1;
				transition: opacity .42s ease;
				cursor: default;
				user-select: none;
			}
			.jb-stage.jb-out { opacity: 0; }
			.jb-bg {
				position: absolute;
				inset: 0;
				background:
					radial-gradient(46vmin 46vmin at 50% 44%, rgba(200, 20, 31, .22), rgba(200, 20, 31, .05) 56%, transparent 74%),
					radial-gradient(80vmin 62vmin at 50% 44%, rgba(227, 174, 78, .07), transparent 66%),
					#070507;
			}
			.jb-bg::after {
				content: "";
				position: absolute;
				inset: 0;
				background: radial-gradient(120% 100% at 50% 50%, transparent 26%, rgba(0, 0, 0, .9) 100%);
			}
			.jb-scan {
				position: absolute;
				inset: 0;
				pointer-events: none;
				opacity: .5;
				background: repeating-linear-gradient(0deg, rgba(255, 255, 255, .035) 0 1px, transparent 1px 3px);
				mix-blend-mode: screen;
			}
			.jb-beam {
				position: absolute;
				left: 0;
				right: 0;
				top: 44%;
				height: 2px;
				background: linear-gradient(90deg, transparent, rgba(255, 170, 90, .16) 28%, rgba(255, 220, 160, .5) 50%, rgba(255, 170, 90, .16) 72%, transparent);
			}
			.jb-beam::after {
				content: "";
				position: absolute;
				left: 0;
				right: 0;
				top: -14px;
				height: 28px;
				background: linear-gradient(90deg, transparent, rgba(255, 150, 80, .12) 35%, rgba(255, 190, 120, .22) 50%, rgba(255, 150, 80, .12) 65%, transparent);
				filter: blur(12px);
			}
			.jb-rings {
				position: absolute;
				left: 50%;
				top: 44%;
				width: min(78vmin, 700px);
				height: min(78vmin, 700px);
				transform: translate(-50%, -50%);
				overflow: visible;
			}
			.jb-rings g { transform-origin: 0 0; }
			.jb-r1 { animation: jb-spin 30s linear infinite; }
			.jb-r2 { animation: jb-spin 16s linear infinite reverse; }
			.jb-r3 { animation: jb-spin 52s linear infinite; }
			@keyframes jb-spin { to { transform: rotate(360deg); } }
			.jb-core {
				position: absolute;
				left: 50%;
				top: 44%;
				width: min(10vmin, 84px);
				height: min(10vmin, 84px);
				transform: translate(-50%, -50%);
				border-radius: 50%;
				background: radial-gradient(circle, #fff 0 10%, #ffd98a 22%, #ff8a3a 42%, rgba(200, 20, 31, .5) 64%, transparent 74%);
				box-shadow: 0 0 60px 18px rgba(255, 130, 50, .32), 0 0 140px 60px rgba(200, 20, 31, .16);
				animation: jb-pulse 3.4s ease-in-out infinite;
				transition: box-shadow .8s ease, filter .8s ease;
			}
			.jb-stage.jb-ready .jb-core {
				filter: brightness(1.15);
				box-shadow: 0 0 70px 24px rgba(255, 150, 60, .4), 0 0 170px 80px rgba(200, 20, 31, .2);
			}
			@keyframes jb-pulse {
				0%, 100% { opacity: .82; transform: translate(-50%, -50%) scale(.97); }
				50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
			}
			.jb-head {
				position: absolute;
				left: 6vw;
				top: 4vh;
				font: 500 11px/1.6 "Cascadia Mono", Consolas, monospace;
				letter-spacing: .24em;
				color: rgba(244, 233, 219, .58);
			}
			.jb-head .dot {
				display: inline-block;
				width: 6px;
				height: 6px;
				border-radius: 50%;
				margin-right: 10px;
				vertical-align: 1px;
				background: var(--hot);
				box-shadow: 0 0 10px var(--hot);
			}
			.jb-clock {
				position: absolute;
				right: 6vw;
				top: 4vh;
				font: 500 11px/1.6 "Cascadia Mono", Consolas, monospace;
				letter-spacing: .2em;
				color: rgba(244, 233, 219, .5);
				font-variant-numeric: tabular-nums;
			}
			.jb-log {
				position: absolute;
				left: 6vw;
				bottom: 25vh;
				margin: 0;
				padding: 0;
				list-style: none;
				font: 500 clamp(10px, 1.05vmin, 13px)/1.95 "Cascadia Mono", Consolas, monospace;
				letter-spacing: .06em;
			}
			.jb-log li {
				display: flex;
				gap: 12px;
				white-space: nowrap;
				opacity: 0;
				transform: translateY(3px);
				transition: opacity .34s ease, transform .34s ease;
			}
			.jb-log li.on { opacity: 1; transform: none; }
			.jb-log .k { width: 42px; color: rgba(244, 233, 219, .42); }
			.jb-log .t { color: rgba(244, 233, 219, .82); }
			.jb-log .v { margin-left: auto; padding-left: 26px; color: rgba(255, 219, 152, .9); }
			.jb-log li.hot .v { color: var(--hot); }
			.jb-tele {
				position: absolute;
				right: 6vw;
				bottom: 25vh;
				text-align: right;
				font: 500 clamp(10px, 1.05vmin, 13px)/1.95 "Cascadia Mono", Consolas, monospace;
			}
			.jb-tele .h {
				color: rgba(244, 233, 219, .38);
				letter-spacing: .3em;
				margin-bottom: 8px;
			}
			.jb-tele .row { color: rgba(244, 233, 219, .68); }
			.jb-tele .row b { color: var(--pale); font-weight: 500; }
			.jb-bar-label {
				position: absolute;
				left: 6vw;
				bottom: calc(10.5vh + 16px);
				font: 500 11px/1 "Cascadia Mono", Consolas, monospace;
				letter-spacing: .3em;
				color: rgba(244, 233, 219, .5);
				text-transform: uppercase;
			}
			.jb-bar {
				position: absolute;
				left: 6vw;
				right: 6vw;
				bottom: 10.5vh;
				height: 3px;
				background: rgba(244, 233, 219, .1);
			}
			.jb-bar .fill {
				height: 100%;
				width: 0%;
				background: linear-gradient(90deg, rgba(200, 20, 31, .9), #e3ae4e 68%, #ffe3ad);
				box-shadow: 0 0 14px rgba(255, 180, 90, .55);
			}
			.jb-bar .pct {
				position: absolute;
				right: 0;
				top: -28px;
				font: 500 13px/1 "Cascadia Mono", Consolas, monospace;
				letter-spacing: .16em;
				color: var(--pale);
				font-variant-numeric: tabular-nums;
			}
			.jb-plate {
				position: absolute;
				left: 50%;
				top: 72%;
				transform: translateX(-50%);
				width: 100%;
				text-align: center;
			}
			.jb-word {
				font-size: clamp(22px, 3.6vmin, 42px);
				font-weight: 300;
				letter-spacing: .46em;
				text-indent: .46em;
				color: #fff4e4;
				text-shadow: 0 0 26px rgba(255, 196, 120, .32);
			}
			.jb-sub {
				margin-top: 12px;
				font: 500 clamp(9px, .95vmin, 11px)/1 "Cascadia Mono", Consolas, monospace;
				letter-spacing: .36em;
				text-indent: .36em;
				color: rgba(244, 233, 219, .6);
			}
			.jb-ready-panel {
				position: absolute;
				left: 50%;
				top: calc(72% + 78px);
				transform: translateX(-50%);
				width: 100%;
				text-align: center;
				opacity: 0;
				transition: opacity .5s ease .1s;
			}
			.jb-stage.jb-ready .jb-ready-panel { opacity: 1; }
			.jb-ready-title {
				font-size: clamp(12px, 1.5vmin, 16px);
				letter-spacing: .34em;
				text-indent: .34em;
				color: var(--gold);
			}
			.jb-ready-hint {
				margin-top: 14px;
				font: 500 12px/1.6 "Cascadia Mono", Consolas, monospace;
				letter-spacing: .16em;
				color: rgba(244, 233, 219, .78);
				animation: jb-blink 2.6s ease-in-out infinite;
			}
			.jb-ready-hint kbd {
				font: inherit;
				color: var(--pale);
				border-bottom: 1px solid rgba(255, 219, 152, .5);
			}
			@keyframes jb-blink { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
			.jb-skip {
				position: absolute;
				right: 6vw;
				bottom: 4.6vh;
				display: flex;
				align-items: center;
				gap: 10px;
				padding: 9px 14px;
				border: 1px solid rgba(244, 233, 219, .26);
				border-radius: 2px;
				background: rgba(7, 5, 7, .35);
				color: rgba(244, 233, 219, .78);
				font: 500 11px/1 "Cascadia Mono", Consolas, monospace;
				letter-spacing: .2em;
				cursor: pointer;
				transition: border-color .2s ease, color .2s ease, opacity .3s ease;
			}
			.jb-skip:hover { border-color: var(--gold); color: var(--pale); }
			.jb-skip kbd {
				font: inherit;
				padding: 2px 5px;
				border: 1px solid rgba(244, 233, 219, .28);
				border-radius: 2px;
				color: rgba(244, 233, 219, .6);
				letter-spacing: .1em;
			}
			.jb-stage.jb-ready .jb-skip { opacity: 0; pointer-events: none; }
			/* ready state: strip the boot HUD so the plate stands alone */
			.jb-bar, .jb-bar-label, .jb-log, .jb-tele {
				transition: opacity .55s ease;
			}
			.jb-stage.jb-ready .jb-bar,
			.jb-stage.jb-ready .jb-bar-label,
			.jb-stage.jb-ready .jb-log,
			.jb-stage.jb-ready .jb-tele { opacity: 0; }
			/* the finished progress ring would cut through the wordmark; tuck it in */
			.jb-rings { transition: transform .8s cubic-bezier(.2, .7, .2, 1); }
			.jb-stage.jb-ready .jb-rings { transform: translate(-50%, -50%) scale(.9); }
			.jb-corner {
				position: absolute;
				width: 34px;
				height: 34px;
				border: 1px solid rgba(244, 233, 219, .2);
			}
			.jb-corner.tl { left: 2.4vw; top: 2.6vh; border-right: 0; border-bottom: 0; }
			.jb-corner.tr { right: 2.4vw; top: 2.6vh; border-left: 0; border-bottom: 0; }
			.jb-corner.bl { left: 2.4vw; bottom: 2.6vh; border-right: 0; border-top: 0; }
			.jb-corner.br { right: 2.4vw; bottom: 2.6vh; border-left: 0; border-top: 0; }
			@media (max-width: 720px) {
				.jb-log, .jb-tele { display: none; }
				.jb-head { font-size: 9px; letter-spacing: .16em; }
				.jb-clock { font-size: 9px; }
			}
			@media (prefers-reduced-motion: reduce) {
				.jb-r1, .jb-r2, .jb-r3, .jb-core, .jb-ready-hint { animation: none; }
			}
		`;

		/** One circle in the centered (-360..360) viewBox. */
		function ring(r, stroke, width, dash, rotate, opacity) {
			const dashAttr = dash ? ` stroke-dasharray="${dash}"` : "";
			const rot = rotate ? ` transform="rotate(${rotate})"` : "";
			return `<circle r="${r}" fill="none" stroke="${stroke}" stroke-width="${width}"${dashAttr}${rot} opacity="${opacity}"/>`;
		}

		function markup(reduced) {
			const ticks = [];
			for (let i = 0; i < 120; i += 1) {
				const a = (i * 3 * Math.PI) / 180;
				const long = i % 10 === 0;
				const r0 = 330;
				const r1 = long ? 318 : 324;
				ticks.push(
					`<line x1="${(Math.cos(a) * r0).toFixed(1)}" y1="${(Math.sin(a) * r0).toFixed(1)}" x2="${(Math.cos(a) * r1).toFixed(1)}" y2="${(Math.sin(a) * r1).toFixed(1)}" stroke="#f4e9db" stroke-width="${long ? 1.2 : 0.7}" opacity="${long ? 0.42 : 0.2}"/>`
				);
			}
			const logRows = LOG.map(
				(l, i) =>
					`<li data-i="${i}"${l.hot ? ' class="hot"' : ""}><span class="k">${l.key}</span><span class="t">${l.text}</span><span class="v">${l.value}</span></li>`
			).join("");

			return `
			<div class="jb-stage${reduced ? " jb-ready" : ""}">
				<div class="jb-bg"></div>
				<div class="jb-scan"></div>
				<div class="jb-beam"></div>
				<svg class="jb-rings" viewBox="-360 -360 720 720" aria-hidden="true">
					<g class="jb-r1">${ring(330, "#f4e9db", 0.8, "2 26", 0, 0.16)}${ticks.join("")}</g>
					<g class="jb-r2">${ring(300, "#e3ae4e", 1.1, "120 1765", 0, 0.5)}${ring(300, "#c8141f", 1.4, "70 1815", 150, 0.42)}</g>
					<g class="jb-r3">${ring(252, "#f4e9db", 0.8, "4 14", 0, 0.18)}${ring(252, "#e3ae4e", 2, "220 1363", 40, 0.55)}</g>
					<circle r="276" fill="none" stroke="rgba(244,233,219,.10)" stroke-width="1"/>
					<circle class="jb-prog" r="258" fill="none" stroke="#ffb457" stroke-width="2.4" pathLength="100"
						stroke-dasharray="100" stroke-dashoffset="100" stroke-linecap="butt" transform="rotate(-90)" opacity=".95"/>
					<circle r="196" fill="none" stroke="rgba(244,233,219,.16)" stroke-width="1" stroke-dasharray="1 7"/>
					<circle r="150" fill="none" stroke="rgba(227,174,78,.22)" stroke-width="1"/>
				</svg>
				<div class="jb-core"></div>
				<div class="jb-head"><span class="dot"></span>STARK INDUSTRIES // SECURE ENCLAVE 0X8841</div>
				<div class="jb-clock">T+<span class="jb-time">00.00</span></div>
				<ul class="jb-log">${logRows}</ul>
				<div class="jb-tele">
					<div class="h">TELEMETRY</div>
					<div class="row">REACTOR OUTPUT <b class="jb-gw">1.04 GW</b></div>
					<div class="row">CORE TEMP <b>36.4 °C</b></div>
					<div class="row">SHIELD INTEGRITY <b>100%</b></div>
					<div class="row">UPLINK <b>4.2 PB/S</b></div>
				</div>
				<div class="jb-plate">
					<div class="jb-word">J.A.R.V.I.S.</div>
					<div class="jb-sub">DEEPSEEK INTELLIGENCE INTERFACE</div>
				</div>
				<div class="jb-ready-panel">
					<div class="jb-ready-title">系统就绪 · SYSTEM READY</div>
					<div class="jb-ready-hint">点击任意处进入 / 按 <kbd>ENTER</kbd></div>
				</div>
				<div class="jb-bar-label">SPINNING UP ARC REACTOR</div>
				<div class="jb-bar">
					<div class="fill"></div>
					<div class="pct">0%</div>
				</div>
				<button class="jb-skip" type="button">跳过引导 <kbd>ESC</kbd></button>
				<div class="jb-corner tl"></div>
				<div class="jb-corner tr"></div>
				<div class="jb-corner bl"></div>
				<div class="jb-corner br"></div>
			</div>`;
		}

		/** eased progress with two short holds, 0..100 */
		function progress(t) {
			const seg = [
				[0, 700, 0, 22, 1],
				[700, 900, 22, 24, 2],
				[900, 1700, 24, 52, 1],
				[1700, 1880, 52, 54, 2],
				[1880, 2620, 54, 79, 1],
				[2620, 2800, 79, 82, 2],
				[2800, DURATION, 82, 100, 1]
			];
			for (const [a, b, from, to, mode] of seg) {
				if (t <= b) {
					const k = Math.min(1, Math.max(0, (t - a) / (b - a)));
					const e = mode === 2 ? k * k * (3 - 2 * k) : k * k * (3 - 2 * k);
					return from + (to - from) * e;
				}
			}
			return 100;
		}

		const noopDispose = () => {};

		function mount() {
			if (typeof document === "undefined") return noopDispose;
			if (document.getElementById(HOST_ID)) return noopDispose;
			const body = document.body;
			if (!body) return noopDispose;

			const reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

			const host = document.createElement("div");
			host.id = HOST_ID;
			const shadow = host.attachShadow({ mode: "open" });
			shadow.innerHTML = `<style>${CSS}</style>${markup(reduced)}`;
			body.appendChild(host);

			const stage = shadow.querySelector(".jb-stage");
			const fill = shadow.querySelector(".jb-bar .fill");
			const pct = shadow.querySelector(".jb-bar .pct");
			const timeEl = shadow.querySelector(".jb-time");
			const gwEl = shadow.querySelector(".jb-gw");
			const prog = shadow.querySelector(".jb-prog");
			const rows = Array.from(shadow.querySelectorAll(".jb-log li"));
			const skip = shadow.querySelector(".jb-skip");

			let raf = 0;
			let timers = [];
			let ready = false;
			let gone = false;
			const t0 = performance.now();

			const clearTimers = () => {
				timers.forEach((id) => clearTimeout(id));
				timers = [];
			};

			const paint = (t) => {
				const p = ready ? 100 : progress(t);
				fill.style.width = p.toFixed(2) + "%";
				pct.textContent = Math.round(p) + "%";
				prog.setAttribute("stroke-dashoffset", (100 - p).toFixed(2));
				const secs = (t / 1000).toFixed(2).split(".");
				timeEl.textContent = `${secs[0].padStart(2, "0")}.${secs[1]}`;
				gwEl.textContent = (1.04 + p * 0.0217).toFixed(2) + " GW";
				if (document.hidden) return;
			};

			const enterReady = () => {
				if (ready) return;
				ready = true;
				clearTimers();
				cancelAnimationFrame(raf);
				rows.forEach((r) => r.classList.add("on"));
				paint(DURATION);
				stage.classList.add("jb-ready");
			};

			const tick = (now) => {
				if (gone) return;
				const t = now - t0;
				if (t >= DURATION) {
					enterReady();
					return;
				}
				paint(t);
				raf = requestAnimationFrame(tick);
			};

			const dismiss = () => {
				if (gone) return;
				gone = true;
				clearTimers();
				cancelAnimationFrame(raf);
				window.removeEventListener("keydown", onKey, true);
				stage.classList.add("jb-out");
				window.setTimeout(() => {
					host.remove();
				}, FADE + 40);
				if (api) api.dismissed = true;
			};

			const onKey = (e) => {
				if (gestureHandled(e)) return;
				if (!ready) {
					if (e.key === "Escape") {
						e.preventDefault();
						e.stopPropagation();
						enterReady();
					}
					return;
				}
				if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					e.stopPropagation();
					dismiss();
				}
			};

			const gestureHandled = (e) => {
				if (e.key === "Escape" || e.key === "Enter" || e.key === " ") return false;
				return false;
			};

			const onClick = (e) => {
				if (e.target && e.target.closest && e.target.closest(".jb-skip")) {
					e.preventDefault();
					enterReady();
					return;
				}
				if (ready) {
					e.preventDefault();
					dismiss();
				}
			};

			stage.addEventListener("click", onClick);
			window.addEventListener("keydown", onKey, true);

			if (reduced) {
				rows.forEach((r) => r.classList.add("on"));
				ready = true;
				paint(DURATION);
			} else {
				LOG.forEach((l, i) => {
					timers.push(
						window.setTimeout(() => {
							rows[i]?.classList.add("on");
						}, l.at)
					);
				});
				timers.push(window.setTimeout(enterReady, DURATION));
				raf = requestAnimationFrame(tick);
			}

			const api = {
				version: VERSION,
				plugin: PLUGIN_ID,
				dismissed: false,
				/** test hook: jump to a point on the timeline */
				seek(ms) {
					clearTimers();
					cancelAnimationFrame(raf);
					if (ms >= DURATION) {
						enterReady();
						return;
					}
					LOG.forEach((l, i) => {
						if (l.at <= ms) rows[i]?.classList.add("on");
					});
					paint(ms);
				},
				skip: enterReady,
				dismiss
			};
			window.__JARVIS_BOOT__ = api;

			return () => {
				gone = true;
				clearTimers();
				cancelAnimationFrame(raf);
				window.removeEventListener("keydown", onKey, true);
				stage.removeEventListener("click", onClick);
				host.remove();
				if (window.__JARVIS_BOOT__ === api) delete window.__JARVIS_BOOT__;
			};
		}

		const inject = [];

		const safeMount = () => {
			try {
				return mount();
			} catch (err) {
				// never take the app down with us: log and do nothing
				console.error("[jarvis-boot] mount failed", err);
				return noopDispose;
			}
		};

		function apply(ctx) {
			const effect =
				ctx && typeof ctx.effect === "function"
					? ctx.effect.bind(ctx)
					: (fn) => {
							const dispose = fn();
							return typeof dispose === "function" ? dispose : noopDispose;
						};

			effect(() => {
				if (window.__JARVIS_BOOT_DISABLED__ === true) return noopDispose;
				if (document && document.body) return safeMount();
				const start = () => safeMount();
				window.addEventListener("DOMContentLoaded", start, { once: true });
				return () => window.removeEventListener("DOMContentLoaded", start);
			}, PLUGIN_ID + ": overlay");
		}

		const module = { exports: {} };
		module.exports.apply = apply;
		module.exports.inject = inject;
		module.exports.__version = VERSION;
		return module.exports;
	}
});
