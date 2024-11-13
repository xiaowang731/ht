<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <Logo></Logo>
      <!-- 展示菜单 -->
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          background-color="#001529"
          text-color="#fff"
          active-text-color="yellowgreen"
          :default-active="$route.path"
          :collapse="LayOutSettingStore.fold ? true : false"
        >
          <!-- 根据路由动态生成菜单 -->
          <Menu :menuList="userStore.menuRouters"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div
      class="layout_tabBar"
      :class="{ fold: LayOutSettingStore.fold ? true : false }"
    >
      <!-- layout组件顶部导航TabBar -->
      <TabBar></TabBar>
    </div>
    <!-- 内容展示区 -->
    <div
      class="layout_main"
      :class="{ fold: LayOutSettingStore.fold ? true : false }"
    >
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入左侧菜单logo子组件
import Logo from './logo/index.vue'
// 引入菜单组件
import Menu from './menu/index.vue'
// 引入右侧展示内容
import Main from './main/index.vue'
// 引入顶部tabBar组件
import TabBar from './tabBar/index.vue'

// 获取路由对象
import { useRoute } from 'vue-router'
// 获取用户相关的小仓库
import useUserStore from '@/store/modules/user'
import useLayOutSettingStore from '@/store/modules/setting'

// 使用仓库路由
const $route = useRoute()
const userStore = useUserStore()
const LayOutSettingStore = useLayOutSettingStore()
</script>

<script lang="ts">
export default {
  name: 'Layout',
}
</script>
<style lang="scss" scoped>
// 整体盒子样式
.layout_container {
  width: 100%;
  height: 100vh;
  // 左侧导航栏
  .layout_slider {
    // color: #fff;
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    transition: all 0.3s;
    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);
      .el-menu {
        border-right: none;
      }
    }
  }
  // 上面tabBar
  .layout_tabBar {
    width: calc(100% - $base-menu-width);
    height: $base-tabBar-height;
    position: fixed;
    top: 0;
    left: $base-menu-width;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - $base-menu-width-min);
      left: $base-menu-width-min;
    }
  }
  // 右侧内容区
  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabBar-height);
    top: $base-tabBar-height;
    left: $base-menu-width;
    padding: 20px;
    overflow: auto;
    background: white;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - $base-menu-width-min);
      left: $base-menu-width-min;
    }
  }
}

.el-collapse {
  background-color: #001529; /* 默认折叠时的背景色 */
}
</style>
