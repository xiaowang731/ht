<template>
  <el-button
    size="small"
    icon="Refresh"
    circle
    @click="upDateRefresh"
  ></el-button>
  <el-button
    size="small"
    icon="FullScreen"
    circle
    @click="fullScreen"
  ></el-button>
  <el-button size="small" icon="Setting" circle></el-button>
  <img
    :src="userStore.avatar"
    style="
      height: 24px;
      width: 24px;
      margin: 0px 10px;
      border-radius: 10%;
      overflow: hidden;
    "
  />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
// 获取骨架的小仓库
import useLayOutSettingStore from '@/store/modules/setting'
// 获取用户信息相关的仓库
import useUserStore from '@/store/modules/user'
// 引入路由器
import { useRoute, useRouter } from 'vue-router'

const LayOutSettingStore = useLayOutSettingStore()
const userStore = useUserStore()
const $router = useRouter()
const $route = useRoute()
// 刷新点击事件
const upDateRefresh = () => {
  LayOutSettingStore.refresh = !LayOutSettingStore.refresh
}
// 全屏点击事件
const fullScreen = () => {
  // dom对象的一个属性,可以用来判断当前是不是全屏模式[全屏:true,不是全屏:false]
  let full = document.fullscreenElement
  // 切换为全屏模式
  if (!full) {
    //利用根节点的方法requestFullscreen,实现全屏模式
    document.documentElement.requestFullscreen()
  } else {
    // 退出全屏模式
    document.exitFullscreen()
  }
}

// 退出登录事件
const logout = async () => {
  // 第一件事情:需要向服务器发请求,[退出登录接口]
  // 第二件事情:仓库中关于用户相关的数据清空[token,username,avatar]
  await userStore.userLogout()
  // 跳转到登录页面
  $router.push({ path: '/login', query: { redirect: $route.fullPath } })
}
</script>

<script lang="ts">
export default {
  name: 'Setting',
}
</script>

<style scoped lang="scss"></style>
