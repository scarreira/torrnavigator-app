const { app, BrowserWindow } = require("electron");
const path = require("path");
const { getWindowSettings, saveBounds, saveMaximized, getWinMaximized } = require("./src/js/settings");

if (require("electron-squirrel-startup")) app.quit();

const createWindow = () => {
  const bounds = getWindowSettings();

  const win = new BrowserWindow({
    width: bounds[0],
    height: bounds[1],
    webPreferences: {
      preload: path.resolve(__dirname, "./preload.js"),
      sandbox: false,
    },
  });

  if (getWinMaximized()) {
    win.maximize();
  }
  win.on("maximize", () => saveMaximized(true));
  win.on("unmaximize", () => saveMaximized(false));
  win.on("resized", () => saveBounds(win.getSize()));

  //win.webContents.openDevTools();
  win.loadFile("./src/index.html");
};

app.whenReady().then(() => {
  createWindow();
});
