// Electron 主进程
const { app, BrowserWindow, shell } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

const isDev = process.env.NODE_ENV === "development";
const PORT = 3800;

function createWindow() {
  const win = new BrowserWindow({
    width: 420,
    height: 780,
    resizable: true,
    title: "AI Flashcards",
  });
  win.setMenuBarVisibility(false);

  // 轮询等待服务器就绪
  let attempts = 0;
  const tryLoad = setInterval(() => {
    require("http").get(`http://localhost:${PORT}`, (res) => {
      clearInterval(tryLoad);
      win.loadURL(`http://localhost:${PORT}`);
    }).on("error", () => {});
    if (++attempts > 40) {
      clearInterval(tryLoad);
      shell.openExternal(`http://localhost:${PORT}`);
      app.quit();
    }
  }, 500);
}

app.whenReady().then(() => {
  if (isDev) {
    createWindow();
  } else {
    // 生产模式：用 spawn 启动 next start，传入 ELECTRON_RUN_AS_NODE 让 Electron 的内置 Node 执行
    const nodeExe = process.execPath;
    const nextBin = path.join(__dirname, "node_modules", ".bin", "next");
    const child = spawn(nodeExe, [nextBin, "start", "-p", String(PORT)], {
      cwd: __dirname,
      env: { ...process.env, ELECTRON_RUN_AS_NODE: "1" },
      stdio: "pipe",
    });
    child.stderr.on("data", (d) => console.error(d.toString()));
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
