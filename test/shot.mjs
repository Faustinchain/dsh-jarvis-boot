// Drive a headless Edge over CDP: navigate, run one expression, screenshot.
// Usage: node shot.mjs <url> <out.png> [jsExpression]
import fs from "node:fs";

const url = process.argv[2];
const out = process.argv[3];
const expr = process.argv[4] ?? "1";
const port = Number(process.env.CDP_PORT ?? 9334);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function targets() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === "page");
      if (page?.webSocketDebuggerUrl) return page;
    } catch {}
    await sleep(250);
  }
  throw new Error("no debuggable page on port " + port);
}

const target = await targets();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.addEventListener("open", res, { once: true });
  ws.addEventListener("error", rej, { once: true });
});

let id = 0;
const pending = new Map();
ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(JSON.stringify(msg.error)));
    else resolve(msg.result);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    id += 1;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });

await send("Page.enable");
await send("Runtime.enable");
// headless browsers report prefers-reduced-motion: reduce by default, which
// short-circuits the animation; force the normal path for screenshots.
await send("Emulation.setEmulatedMedia", {
  features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
});
await send("Emulation.setDeviceMetricsOverride", { width: 1600, height: 1000, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url });
await sleep(1200);
const result = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
const value = result?.result?.value;
await sleep(450);
const shot = await send("Page.captureScreenshot", { format: "png" });
fs.writeFileSync(out, Buffer.from(shot.data, "base64"));
console.log(JSON.stringify({ value, out, bytes: fs.statSync(out).size }));
ws.close();
