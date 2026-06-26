// Next.js 服务启动脚本 — 由 Electron fork 启动
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  server.listen(3456, () => {
    if (process.send) process.send("ready");
  });
});
