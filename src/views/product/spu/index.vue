<template>
  <!-- 三级分类结构 -->
  <Category :scene="scene"></Category>
  <!-- 卡片 -->
  <el-card style="margin: 10px 0">
    <el-button
      type="primary"
      size="default"
      icon="plus"
      :disabled="categoryStore.c3Id ? false : true"
    >
      添加SPU
    </el-button>
    <el-table style="margin: 10px 0" border :data="records">
      <el-table-column
        label="序号"
        type="index"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column label="SPU名称" prop="spuName"></el-table-column>
      <el-table-column
        label="SPU描述"
        prop="description"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="SPU操作">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            icon="Plus"
            title="添加SPU"
          ></el-button>
          <el-button
            type="warning"
            size="small"
            icon="edit"
            title="修改SPU"
          ></el-button>
          <el-button
            type="info"
            size="small"
            icon="view"
            title="查看SPU列表"
          ></el-button>
          <el-button
            type="danger"
            size="small"
            icon="delete"
            title="删除SPU"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout="prev, pager, next, jumper,->,total, sizes"
        :total="total"
        @current-change="getHasSpu"
        @size-change="changeSize"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { reqHasSpu } from '@/api/product/spu'
import type { Records, HasSpuResponseData } from '@/api/product/spu/type'
// 引入分类的仓库
import useCategoryStore from '@/store/modules/category'
const categoryStore = useCategoryStore()

// 场景的数据
let scene = ref<number>(0)
// 当前页码
let pageNo = ref<number>(1)
// 每一页展示多少条数据
let pageSize = ref<number>(3)
// 存储已有spu总数
let total = ref<number>(0)
// 存储SPU数据
let records = ref<Records>([])

// 此方法执行:获取某一个三级分类下全部的已有SPU
const getHasSpu = async (pager = 1) => {
  pageNo.value = pager
  let result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}
// 监听三级分类ID变化
watch(
  () => categoryStore.c3Id,
  () => {
    // 务必保证有三级分类Id
    if (!categoryStore.c3Id) return
    getHasSpu()
  },
)
// 分页器下拉菜单发生变化触发
const changeSize = () => {
  getHasSpu()
}
</script>

<style lang="scss" scoped></style>
