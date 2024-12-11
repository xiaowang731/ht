<template>
  <el-card>
    <el-table border :data="skuArr" style="margin: 10px 0">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80px"
      ></el-table-column>
      <el-table-column
        label="名称"
        show-overflow-tooltip
        width="150px"
        prop="skuName"
      ></el-table-column>
      <el-table-column
        label="描述"
        show-overflow-tooltip
        prop="skuDesc"
      ></el-table-column>
      <el-table-column label="图片" width="150px">
        <template #="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column
        label="重量(g)"
        width="150px"
        prop="weight"
      ></el-table-column>
      <el-table-column
        label="价格(元)"
        width="150px"
        prop="price"
      ></el-table-column>
      <el-table-column label="操作" width="210px" fixed="right">
        <template #="{ row }">
          <el-button
            :type="row.isSale == 1 ? 'success' : 'info'"
            size="small"
            :icon="row.isSale == 1 ? 'bottom' : 'top'"
            @click="updateSale(row)"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            icon="edit"
            @click="updateSku"
          ></el-button>
          <el-button
            type="info"
            size="small"
            icon="infoFilled"
            @click="findSku(row)"
          ></el-button>
          <el-popconfirm
            @confirm="removeSku(row.id)"
            :title="`你确定删除${row.skuName}?`"
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
        :page-sizes="[3, 10, 20, 30]"
        :background="true"
        layout="prev, pager, next, jumper,->,total, sizes"
        :total="total"
        @current-change="getHasSku"
        @size-change="changeSize"
      />
    </div>
    <!-- 抽屉组件,展示商品详情 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>查看商品详情</h4>
      </template>
      <template #default>
        <el-row style="margin: 10px 0">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag
              style="margin: 2px 5px"
              v-for="item in skuInfo.skuAttrValueList"
              :key="item.attrId"
            >
              {{ item.valueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag
              type="info"
              style="margin: 2px 5px"
              v-for="item in skuInfo.skuSaleAttrValueList"
              :key="item.id"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item
                v-for="item in skuInfo.skuImageList"
                :key="item.id"
              >
                <img :src="item.imgUrl" style="width: 100%; height: 100%" />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import {
  reqCanselSale,
  reqSaleSku,
  reqSkuList,
  reqSkuInfo,
  reqDeleteSku,
} from '@/api/product/sku'
import type {
  SkuData,
  SkuResponseData,
  SkuInfoData,
} from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

// 分页器当前页码
let pageNo = ref<number>(1)
//每一页展示几条数据
let pageSize = ref<number>(3)
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])
let skuInfo = ref<SkuData>({})
// 抽屉组件显示隐藏
const drawer = ref<boolean>(false)
// 定义一个请求函数
const getHasSku = async (pager = 1) => {
  // 当前分页器的页码
  pageNo.value = pager
  let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code == 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}
// 分页器下拉菜单发生变化时触发
const changeSize = () => {
  getHasSku()
}
onMounted(() => {
  getHasSku()
})
// 商品上架与下架操作
const updateSale = async (row: SkuData) => {
  // 当前商品的isSale==1,说明当前商品时上架状态>更新为下架
  if (row.isSale == 1) {
    let result: any = await reqCanselSale(row.id as number)
    if (result.code == 200) {
      // 提示信息
      ElMessage.success('下架成功')
      // 更新完成后获更新完毕全部的spu
      getHasSku(pageNo.value)
    } else {
      ElMessage.error(result.message)
    }
  } else {
    let result: any = await reqSaleSku(row.id as number)
    if (result.code == 200) {
      // 提示信息
      ElMessage.success('上架成功')
      // 更新完成后获更新完毕全部的spu
      getHasSku(pageNo.value)
    } else {
      ElMessage.error(result.message)
    }
  }
}
// 更新已有的SKU
const updateSku = () => {
  ElMessage.success('程序员在努力的更新中……')
}
// 查看商品详情按钮的回调
const findSku = async (row: SkuData) => {
  drawer.value = true
  let result: SkuInfoData = await reqSkuInfo(row.id as number)
  // 存储已有的sku
  skuInfo.value = result.data
}
// 删除已有的sku
const removeSku = async (skuId: number) => {
  let result: any = await reqDeleteSku(skuId)
  if (result.code == 200) {
    ElMessage.success('删除成功')
    getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除失败')
  }
}
</script>

<script lang="ts">
export default {
  name: 'sku',
}
</script>
<style lang="scss" scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
