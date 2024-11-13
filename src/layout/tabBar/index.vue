<template>
  <div class="tabBar">
    <!-- 顶部左侧静态 -->
    <div class="tabBar_left">
      <breadCrumb></breadCrumb>
    </div>
    <!-- 右侧 -->
    <div class="tabBar_right">
      <setting></setting>
    </div>
  </div>
</template>

<script setup lang="ts">
import breadCrumb from './breadcrumb/index.vue'
import setting from './setting/index.vue'
</script>

<script lang="ts">
export default {
  name: 'TabBar',
}
</script>

<style scoped lang="scss">
.tabBar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  background-image: linear-gradient(
    to right,
    rgb(232, 223, 223),
    rgb(201, 178, 178),
    rgb(197, 165, 165)
  );
  .tabBar_left {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
  .tabBar_right {
    display: flex;
    align-items: center;
  }
}
</style>
