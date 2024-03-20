<template>
  <n-button>naive-ui</n-button>
</template>

<script setup>
import { NButton } from 'naive-ui'
import { defineProps, defineEmits } from "vue";

// 定义emits事件传值给父组件
const emits = defineEmits(["emit1", "emit2"]);
// 定义props接收父组件传值
const props = defineProps({

})
</script>