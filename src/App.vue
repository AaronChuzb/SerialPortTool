<template>
  <n-config-provider :theme="darkTheme">
    <!-- <div> -->
      <!-- <div v-for="(item, index) in comList" :key="index">{{ item.path }}</div>
    <button @click="send">发送</button>
    <div>
      {{ JSON.stringify(options) }}
    </div>

    <button @click="getOptions">获取参数</button>
    <button @click="setOptions">设置参数</button> -->
      <Channel></Channel>
    <n-global-style />
  </n-config-provider>
</template>
<script setup>
import { ref, computed } from 'vue'
import Channel from './components/Channel.vue'
import { NConfigProvider } from 'naive-ui'
import { darkTheme } from 'naive-ui'
import { NButton } from 'naive-ui'

// const _darkTheme = computed(() => {
//   return darkTheme
// })

const comList = ref([])
const options = ref({})
// const darkTheme
window._ipcRenderer.on('main-message', (e, arg) => {
  console.log('vue收到消息内容', arg)
  // 接收消息集中处理
  switch (arg.target) {
    case 'getSerialPortList':
      comList.value = arg.res
      break
    case 'getSerialPortOptions':
      options.value = arg.res
      break
    default:
      console.log()
      break
  }
})

window._ipcRenderer.on('data', (e, arg) => {
  console.log('串口数据', arg)
})

const getSerialPortList = () => {
  window._ipcRenderer.send('render-message', { target: 'getSerialPortList', data: {} })
}

const setOptions = () => {
  window._ipcRenderer.send('render-message', {
    target: 'setSerialPortOptions',
    data: {
      options: {
        baudRate: 115200, // 波特率
        dataBits: 8, // 数据位
        parity: 'none', // 校验位
        stopBits: 1, // 停止位
        flowControl: false,
      },
    },
  })
}

const getOptions = () => {
  window._ipcRenderer.send('render-message', { target: 'getSerialPortOptions', data: {} })
}

const connectSerialPort = () => {
  window._ipcRenderer.send('render-message', { target: 'connectSerialPort', data: {path: 'COM1'} }) // 这个path一定要先获取串口列表
}
</script>
