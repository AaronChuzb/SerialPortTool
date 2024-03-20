"use strict";
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { SerialPort } = require("serialport");
let _options = {
  baudRate: 9600,
  // 波特率
  dataBits: 8,
  // 数据位
  parity: "none",
  // 校验位
  stopBits: 1,
  // 停止位
  flowControl: false
};
let _com = null;
const getSerialPortList = async (e) => {
  const res = await SerialPort.list();
  e.sender.send("main-message", { target: "getSerialPortList", res });
};
const setSerialPortOptions = (e, options) => {
  _options = options;
  e.sender.send("main-message", { target: "setSerialPortOptions", res: "ok" });
};
const getSerialPortOptions = (e) => {
  e.sender.send("main-message", { target: "getSerialPortOptions", res: _options });
};
const connectSerialPort = (e, path2) => {
  _com = new SerialPort(path2, option, false);
  e.sender.send("main-message", { target: "connectSerialPort", res: "ok" });
  _com.on("readable", () => {
    const data = _com.read();
    e.sender.send("data", data);
  });
};
const sendSerialPortData = (e, data) => {
  _com.write(data);
  e.sender.send("main-message", { target: "sendSerialPortData", res: "ok" });
};
const disconnectSerialPort = (e) => {
  _com.close(() => {
  });
  e.sender.send("main-message", { target: "disconnectSerialPort", res: "ok" });
};
ipcMain.on("render-message", async (e, arg) => {
  console.log(arg);
  switch (arg.target) {
    case "getSerialPortList":
      getSerialPortList(e);
      break;
    case "setSerialPortOptions":
      setSerialPortOptions(e, arg.data.options);
      break;
    case "getSerialPortOptions":
      getSerialPortOptions(e);
      break;
    case "connectSerialPort":
      connectSerialPort(e, arg.data.path);
      break;
    case "sendSerialPortData":
      sendSerialPortData(e, arg.data);
      break;
    case "disconnectSerialPort":
      disconnectSerialPort(e);
      break;
    default:
      e.sender.send("main-message", { target: arg.target, res: "未定义方法" });
      break;
  }
});
app.whenReady().then(() => {
  const win = new BrowserWindow({
    title: "Main window",
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js")
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile("dist/index.html");
  }
  win.webContents.openDevTools();
});
