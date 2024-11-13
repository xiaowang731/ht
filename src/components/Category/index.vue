<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select
          style="width: 200px"
          v-model="CategoryStore.c1Id"
          @change="handler(1)"
          :disabled="scene == 0 ? false : true"
        >
          <el-option
            v-for="c1 in CategoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          style="width: 200px"
          v-model="CategoryStore.c2Id"
          @change="handler(2)"
          :disabled="scene == 0 ? false : true"
        >
          <el-option
            v-for="c2 in CategoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          style="width: 200px"
          v-model="CategoryStore.c3Id"
          :disabled="scene == 0 ? false : true"
        >
          <el-option
            v-for="c3 in CategoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
// 引入仓库
import useCategoryStore from '@/store/modules/category'
let CategoryStore = useCategoryStore()
// 接受父组件传递过来的scene
defineProps(['scene'])
// 获取一级分类方法
const getC1 = () => {
  CategoryStore.getC1()
}

onMounted(() => {
  getC1()
})
//分类的下拉菜单的change事件
const handler = (nm: number) => {
  if (nm == 1) {
    // 清除二级分类数据
    CategoryStore.c2Id = ''
    CategoryStore.c3Id = ''
    // 通知仓库获取二级分类的数据
    CategoryStore.getC2()
  } else if (nm == 2) {
    CategoryStore.c3Id = ''
    //通知仓库获取三级分类的数据
    CategoryStore.getC3()
  }
}
</script>

<style lang="scss" scoped></style>
