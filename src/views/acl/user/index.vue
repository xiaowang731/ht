<template>
  <el-card style="height: 75px">
    <el-form class="form">
      <el-form-item label="用户名:">
        <el-input
          placeholder="请输入搜索用户名"
          style="width: 150px"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">搜索</el-button>
        <el-button type="primary">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary">添加用户</el-button>
    <el-button type="danger">批量删除</el-button>
    <!-- 表格展示用户信息 -->
    <el-table style="margin: 10px 0" border>
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center"></el-table-column>
      <el-table-column label="ID" align="center"></el-table-column>
      <el-table-column label="用户名字" align="center"></el-table-column>
      <el-table-column label="用户名称" align="center"></el-table-column>
      <el-table-column label="用户角色" align="center"></el-table-column>
      <el-table-column label="创建时间" align="center"></el-table-column>
      <el-table-column label="更新时间" align="center"></el-table-column>
      <el-table-column
        label="操作"
        width="200px"
        align="center"
      ></el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout="prev, pager, next, jumper,->,total, sizes"
        :total="100"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 默认页码
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
</script>

<script lang="ts">
export default {
  name: 'userIndex',
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
