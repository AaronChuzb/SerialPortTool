<template>
  <!-- <n-button>naive-ui</n-button> -->
  <div class="box">
    <n-card class="card" content-class="content">
      <div class="card-title">高通</div>
      <n-form label-placement="left" ref="formRef" :model="highPass" size="small">
        <n-form-item label="频率">
          <n-input v-model:value="highPass.freq">
            <template #suffix> Hz </template>
          </n-input>
        </n-form-item>
        <n-form-item label="斜率">
          <n-select v-model:value="highPass.slop" :options="options" />
        </n-form-item>
        <n-form-item label="类型">
          <n-select v-model:value="highPass.types" :options="optionsType" />
        </n-form-item>
      </n-form>
      <div class="card-title">低通</div>
      <n-form label-placement="left" ref="formRef1" :model="lowPass" size="small">
        <n-form-item label="频率">
          <n-input v-model:value="lowPass.freq">
            <template #suffix> Hz </template>
          </n-input>
        </n-form-item>
        <n-form-item label="斜率">
          <n-select v-model:value="lowPass.slop" :options="options" />
        </n-form-item>
        <n-form-item label="类型">
          <n-select v-model:value="lowPass.types" :options="optionsType" />
        </n-form-item>
      </n-form>
    </n-card>
    <div>
      <div class="charts" id="charts"></div>
    </div>
    <div class="channer">
      <!-- <div v-for=""></div> -->
    </div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted, defineProps, defineEmits, ref } from 'vue'
const options = ref([
  {
    label: '12dB/Oct',
    value: 12,
  },
])

const optionsType = ref([
  {
    label: '贝塞尔',
    value: 0,
  },
])
const highPass = ref({
  freq: 3400,
  slop: 12,
  types: 0,
})

const lowPass = ref({
  freq: 32000,
  slop: 12,
  types: 0,
})

const channles = ref([
  {
    name: '',

  }
])
// 定义emits事件传值给父组件
const emits = defineEmits(['emit1', 'emit2'])
// 定义props接收父组件传值
const props = defineProps({})
onMounted(() => {
  var app = {}

  var chartDom = document.getElementById('charts')
  console.log(chartDom)
  var myChart = echarts.init(chartDom)
  var option

  option = {
    // title: {
    //   text: 'Stacked Line'
    // },
    tooltip: {
      trigger: 'axis',
    },
    // legend: {
    //   data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
    // },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
      min: -12,
      max: 12,
      splitNumber: 8,
      axisLabel: {
        // formatter: '{value}' // 自定义Y轴
        formatter: (value) => {
          return value > 0 ? ('+' + value): value
        },
      },
    },
    series: [
      {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        smooth: true,
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: 'Union Ads',
        type: 'line',
        stack: 'Total',
        smooth: true,
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: 'Video Ads',
        type: 'line',
        stack: 'Total',
        smooth: true,
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: 'Direct',
        type: 'line',
        stack: 'Total',
        smooth: true,
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: 'Search Engine',
        type: 'line',
        stack: 'Total',
        smooth: true,
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
  }

  option && myChart.setOption(option)
})
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  .card {
    width: 180px;
    .card-title {
      text-align: center;
      color: #e24b25;
    }
  }
  .charts {
    width: 600px;
    height: 400px;
  }
}
</style>
<style lang="scss">
.content {
  padding: 10px !important;
}
</style>
