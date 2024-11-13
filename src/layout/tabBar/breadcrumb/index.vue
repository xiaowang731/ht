<template>
  <!-- 顶部左侧静态 -->
  <el-icon style="margin-right: 10px" @click="changIcon">
    <component :is="LayOutSettingStore.fold ? 'fold' : 'expand'"></component>
  </el-icon>
  <!-- 左侧面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 面包屑动态展示理由名字与标题 -->
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      v-show="item.meta.icon"
      :to="item.path"
    >
      <!-- 面包屑展示路由匹配的标题 -->
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span style="margin: 0 5px">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useLayOutSettingStore from '@/store/modules/setting'
import { useRoute, useRouter } from 'vue-router'

// 获取layout配置相关的仓库
const LayOutSettingStore = useLayOutSettingStore()

// 获取路由对象
const $route = useRoute()

// 定义一个响应式数据控制图标切换
let fold = ref(false) //用于控制菜单折叠还是展开切换
const changIcon = () => {
  LayOutSettingStore.fold = !LayOutSettingStore.fold
}
</script>

<script lang="ts">
export default {
  name: 'Breadcrumb',
}
</script>

<style scoped lang="scss"></style>
