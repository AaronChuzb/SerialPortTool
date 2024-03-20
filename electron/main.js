/*
 * @Date: 2024-03-19 11:59:58
 * @LastEditors: AaronChu
 * @LastEditTime: 2024-03-19 19:40:33
 */
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { SerialPort } = require('serialport')

// 连接串口的属性
let _options = {
  baudRate: 9600, // 波特率
  dataBits: 8, // 数据位
  parity: 'none', // 校验位
  stopBits: 1, // 停止位
  flowControl: false,
}

// 串口对象
let _com = null

/**
 * @description: 获取串口列表
 * @param {*} e ipcMainEvent
 */
const getSerialPortList = async (e) => {
  const res = await SerialPort.list()
  e.sender.send('main-message', { target: 'getSerialPortList', res: res })
}

// 设置串口连接参数
const setSerialPortOptions = (e, options) => {
  _options = options
  e.sender.send('main-message', { target: 'setSerialPortOptions', res: 'ok' })
}

// 获取接口参数
const getSerialPortOptions = (e) => {
  e.sender.send('main-message', { target: 'getSerialPortOptions', res: _options })
}

// 连接串口
const connectSerialPort = (e, path) => {
  _com = new SerialPort(path, option, false)
  e.sender.send('main-message', { target: 'connectSerialPort', res: 'ok' })
  // 连接成功后设置监听
  _com.on('readable', () => {
    // console.log(_com.read())
    const data = _com.read()
    e.sender.send('data', data)
  })
  // _com.write('hello world')
  // _com.close(() => {})
}

// 发送数据
const sendSerialPortData = (e, data) => {
  _com.write(data)
  e.sender.send('main-message', { target: 'sendSerialPortData', res: 'ok' })
}

// 断开连接

const disconnectSerialPort = (e) => {
  _com.close(() => {})
  e.sender.send('main-message', { target: 'disconnectSerialPort', res: 'ok' })
}

// 接收页面消息
ipcMain.on('render-message', async (e, arg) => {
  console.log(arg)
  switch (arg.target) {
    case 'getSerialPortList':
      getSerialPortList(e)
      break
    case 'setSerialPortOptions':
      setSerialPortOptions(e, arg.data.options)
      break
    case 'getSerialPortOptions':
      getSerialPortOptions(e)
      break
    case 'connectSerialPort':
      connectSerialPort(e, arg.data.path)
      break
    case 'sendSerialPortData':
      sendSerialPortData(e, arg.data)
      break
    case 'disconnectSerialPort':
      disconnectSerialPort(e)
      break
    default:
      e.sender.send('main-message', { target: arg.target, res: '未定义方法' })
      break
  }
})

app.whenReady().then(() => {
  const win = new BrowserWindow({
    title: 'Main window',
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    // Load your file
    win.loadFile('dist/index.html')
  }
  win.webContents.openDevTools() // 打开控制台
})
