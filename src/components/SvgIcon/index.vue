<template>
  <!-- svg:图标外层容器节点,内部需要与use标签结合使用 -->
  <svg :style="{ width, height }">
    <!-- xlink：href执行哪一个图标，属性值必须# icon-图标名字 -->
    <!-- use标签fill属性可以设置图标的颜色 -->
    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
</template>

<script setup lang="ts">
defineProps({
  // xlink:href属性值的前缀
  prefix: {
    type: String,
    default: '#icon-'
  },
  // 提供使用的图标名字
  name: String,
  // 提供使用图标的颜色
  color: {
    type: String,
    default: ''
  },
  //   接收父组件传递的图标宽度
  width: {
    type: String,
    default: '16px'
  },
  //   接收父组件传递的图标高度
  height: {
    type: String,
    default: '16px'
  }
})
</script>

<style scoped></style>
