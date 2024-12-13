<template>
  <!-- 三级分类结构 -->
  <Category :scene="scene"></Category>
  <!-- 卡片 -->
  <el-card style="margin: 10px 0">
    <div v-show="scene == 0">
      <el-button
        type="primary"
        size="default"
        icon="plus"
        :disabled="categoryStore.c3Id ? false : true"
        @click="addSpu"
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
        <el-table-column label="SPU操作" width="210px">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="Plus"
              title="添加SKU"
              @click="addSku(row)"
            ></el-button>
            <el-button
              type="warning"
              size="small"
              icon="edit"
              title="修改SPU"
              @click="updateSpu(row)"
            ></el-button>
            <el-button
              type="info"
              size="small"
              icon="view"
              title="查看SPU列表"
              @click="findSku(row)"
            ></el-button>
            <el-popconfirm
              @confirm="deleteSpu(row.id)"
              :title="`你确定删除${row.spuName}?`"
              width="200px"
            >
              <template #reference>
                <el-button
                  type="danger"
                  size="small"
                  icon="delete"
                  title="删除SPU"
                ></el-button>
              </template>
            </el-popconfirm>
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
    </div>
    <!-- 添加spu|修改spu子组件 -->
    <spuForm ref="spu" v-show="scene == 1" @changeScene="changeScene"></spuForm>
    <!-- 添加sku子组件 -->
    <skuForm ref="sku" v-show="scene == 2" @changeScene="changeScene"></skuForm>
    <!-- dialog对话框:展示已有的sku数据 -->
    <el-dialog title="SKU列表" v-model="show">
      <el-table border :data="skuArr">
        <el-table-column label="SKU名字" prop="skuName"></el-table-column>
        <el-table-column label="SKU价格" prop="price"></el-table-column>
        <el-table-column label="SKU重量" prop="weight"></el-table-column>
        <el-table-column label="SKU图片">
          <template #="{ row, $index }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { watch, ref, onBeforeUnmount } from 'vue'
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu'
import type {
  Records,
  HasSpuResponseData,
  SpuData,
  SkuInfoData,
  SkuData,
} from '@/api/product/spu/type'
import spuForm from './spuForm.vue'
import skuForm from './skuForm.vue'
// 引入分类的仓库
import useCategoryStore from '@/store/modules/category'
import { ElMessage } from 'element-plus'
const categoryStore = useCategoryStore()
// 场景的数据
let scene = ref<number>(0) //0显示已有spu,1:添加或者修改spu,2:添加sku
// 当前页码
let pageNo = ref<number>(1)
// 每一页展示多少条数据
let pageSize = ref<number>(3)
// 存储已有spu总数
let total = ref<number>(0)
// 存储SPU数据
let records = ref<Records>([])
// 获取子组件SpuForm
let spu = ref<any>()
// 获取子组件SkuForm
let sku = ref<any>()
// 存储全部sku数据
let skuArr = ref<SkuData[]>([])
let show = ref<boolean>(false)
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
// 0添加新的spu按钮的回调
const addSpu = () => {
  scene.value = 1
  spu.value.initAddSpu(categoryStore.c3Id)
}
// 0修改已有spu按钮回调
const updateSpu = (row: SpuData) => {
  scene.value = 1
  // 调用子组件实例方法,获取完整spu数据
  spu.value.initHasSpuData(row)
}
// 子组件spuForm的自定义事件
const changeScene = (obj: any) => {
  // 子组件点击取消,返回场景0
  scene.value = obj.flag
  if (obj.params == 'update') {
    // 更新回到当前页
    getHasSpu(pageNo.value)
  } else {
    // 添加回到第一页
    getHasSpu()
  }
}
//添加sku按钮的回调
const addSku = (row: SpuData) => {
  // 点击添加sku,切换场景为2
  scene.value = 2
  // 调用子组件的方法获取初始化的数据
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}
//查看SKU列表的数据
const findSku = async (row: SpuData) => {
  let result: SkuInfoData = await reqSkuList(row.id as number)
  if (result.code == 200) {
    skuArr.value = result.data
    show.value = true
  }
}
// 删除一个已有的spu
const deleteSpu = async (spuId: number) => {
  let result = await reqRemoveSpu(spuId)
  if (result.code == 200) {
    ElMessage.success('删除成功')
    // 获取剩余已有SPU数据
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除失败')
  }
}
// 路由组件销毁前,清空仓库关于分类的数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style lang="scss" scoped></style>
