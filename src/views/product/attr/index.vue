<template>
  <!-- 三级分类全局组件 -->
  <Category :scene="scene"></Category>
  <!-- 下部分 -->
  <el-card style="margin: 10px 0">
    <div v-show="scene == 0">
      <el-button
        type="primary"
        size="default"
        icon="Plus"
        :disabled="categoryStore.c3Id ? false : true"
        style="margin-bottom: 20px"
        @click="addAttr"
      >
        添加属性
      </el-button>
      <el-table style="width: 100%" border :data="attrArr">
        <el-table-column label="序号" width="80px" type="index" />
        <el-table-column label="属性名称" width="120px" prop="attrName" />
        <el-table-column label="属性值名称">
          <template #="{ row }">
            <el-tag
              v-for="item in row.attrValueList"
              :key="item.id"
              style="margin: 5px"
            >
              {{ item.valueName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #="{ row }">
            <el-button
              type="warning"
              size="small"
              icon="edit"
              @click="updateAttr(row)"
            ></el-button>
            <el-popconfirm
              :title="`你确定要删除${row.attrName}品牌吗?`"
              width="200px"
              icon="Delete"
              @confirm="deleteAttr(row.id)"
            >
              <template #reference>
                <el-button type="danger" size="small" icon="delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="scene == 1">
      <el-form :inline="true">
        <el-form-item label="属性名称">
          <el-input
            placeholder="请输入属性名字"
            v-model="attrParams.attrName"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        size="default"
        icon="plus"
        :disabled="attrParams.attrName ? false : true"
        @click="addAttrValue"
      >
        添加属性值
      </el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
      <el-table border style="margin: 10px 0" :data="attrParams.attrValueList">
        <el-table-column
          label="序号"
          width="80px"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column label="属性值名称">
          <template #="{ row, $index }">
            <el-input
              placeholder="请输入属性值"
              v-model="row.valueName"
              @blur="toLook(row, $index)"
              v-if="row.flag"
              size="small"
              :ref="(vc: any) => (inputArr[$index] = vc)"
            />
            <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="属性值操作">
          <template #="{ $index }">
            <el-button
              type="primary"
              size="small"
              icon="delete"
              @click="attrParams.attrValueList.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="primary"
        size="default"
        :disabled="attrParams.attrValueList.length > 0 ? false : true"
        @click="save"
      >
        保存
      </el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { watch, ref, reactive, nextTick, onBeforeMount } from 'vue'
// 引入获取已有属性与属性值的接口
import {
  reqAddOrUpdateAttr,
  reqAttr,
  reqRemoveAttr,
} from '@/api/product/attr/index'
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
// 获取分类的仓库
import useCategoryStore from '@/store/modules/category'
import { ElMessage } from 'element-plus'
let categoryStore = useCategoryStore()

//存储已有的属性与属性值
let attrArr = ref<Attr[]>([])
// 定义card组件的切换
let scene = ref<number>(0)
// 收集新增属性的数据
let attrParams = reactive<Attr>({
  attrName: '', //新增属性的名字
  attrValueList: [],
  categoryId: '', //三级分类id
  categoryLevel: 3, //某一个三级分类
})
// 准备一个数组,将来存储对应的组件实例el-input
let inputArr = ref<any>([])
// 0添加属性按钮回调
const addAttr = () => {
  // 切换添加与属性结构
  scene.value = 1
  // 每一次点击的时候，清空数据再收集
  Object.assign(attrParams, {
    id: '',
    attrName: '',
    attrValueList: [],
    categoryId: categoryStore.c3Id,
    categoryLevel: 3,
  })
}
// table修改属性按钮回调
const updateAttr = (row: Attr) => {
  // 将已有的属性对象赋值给attrParams对象
  // 对象合并
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
  // 切换为添加与修改属性的结构
  scene.value = 1
}
// 监听仓库三级分类id变换
watch(
  () => categoryStore.c3Id,
  () => {
    // 清空上一次查询的属性与属性值
    attrArr.value = []
    // 保证三级分类有才发请求
    if (!categoryStore.c3Id) return
    // 获取属性与属性值
    getAttr()
  },
)
// 获取已有属性与属性值的方法
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code == 200) attrArr.value = result.data
}
// 取消按钮回调
const cancel = () => {
  scene.value = 0
}
// 1添加属性值方法
const addAttrValue = () => {
  // 点击添加属性值按钮的时候,向数组添加一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, //控制每一个input编辑模式
  })
  // 获取最有一个input组件并且聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}
// 保存按钮回调
const save = async () => {
  // 发送请求
  const result: any = await reqAddOrUpdateAttr(attrParams)
  if (result.code == 200) {
    ElMessage.success(attrParams.id ? '修改成功' : '添加成功')
    // 获取全部已有的属性与属性值
    getAttr()
  } else {
    ElMessage.error(attrParams.id ? '修改失败' : '添加失败')
  }
  scene.value = 0
}
// 删除某一个已有属性方法
const deleteAttr = async (attrId: number) => {
  let result = await reqRemoveAttr(attrId)
  // 删除成功
  if (result.code == 200) {
    ElMessage.success('删除成功')
    // 再获取已有的属性与属性值
    getAttr()
  } else {
    ElMessage.error('删除失败')
  }
}

// 属性值报表单元素失去焦点事件回调
const toLook = (row: AttrValue, $index: number) => {
  // 非法情况判断
  if (row.valueName.trim() == '') {
    // 删除对应属性值为空的属性
    attrParams.attrValueList.splice($index, 1)
    return ElMessage.error('属性值不能为空')
  }
  // 判断是否重复
  let repeat = attrParams.attrValueList.find((item) => {
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  // 重复的提示信息，并且删除
  if (repeat) {
    attrParams.attrValueList.splice($index, 1)
    return ElMessage.error('属性值不能重复')
  }
  row.flag = false
}
// 属性值div点击事件
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}
// 路由组件销毁的时候,把仓库分类相关的数据清空
onBeforeMount(() => {
  categoryStore.$reset()
})
</script>
<script lang="ts">
export default {
  name: 'Attr',
}
</script>

<style lang="scss" scoped></style>
