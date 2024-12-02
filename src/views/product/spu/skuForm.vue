<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        placeholder="价格(元)"
        type="number"
        v-model="skuParams.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input
        placeholder="重量(克)"
        v-model="skuParams.weight"
        type="number"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        placeholder="SKU描述"
        v-model="skuParams.skuDesc"
        type="textarea"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true" label-width="100px">
        <el-form-item
          v-for="item in attrArr"
          :key="item.id"
          :label="item.attrName"
        >
          <el-select style="width: 170px" v-model="item.attrIdAndValueId">
            <el-option
              v-for="attrValue in item.attrValueList"
              :key="attrValue.id"
              :value="`${item.id}:${attrValue.id}`"
              :label="attrValue.valueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true" label-width="100px">
        <el-form-item
          v-for="item in SaleAttr"
          :key="item.id"
          :label="item.saleAttrName"
        >
          <el-select style="width: 170px" v-model="item.saleIdAndValueId">
            <el-option
              v-for="saleAttrValue in item.spuSaleAttrValueList"
              :value="`${item.id}:${saleAttrValue.id}`"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="图片">
          <template #="{ row, index }">
            <img :src="row.imgUrl" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" @click="handler(row)">
              设置默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import type {
  SaleAttrResponseData,
  SpuData,
  SpuHasImg,
  SpuImage,
  SkuData,
} from '@/api/product/spu/type'
import type { AttrResponseData } from '@/api/product/attr/type'
// 引入请求接口
import { reqAttr } from '@/api/product/attr'
import {
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAddSku,
} from '@/api/product/spu'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

// 存储平台属性
let attrArr = ref<any>([])
// 存储销售属性
let SaleAttr = ref<any>([])
// 存储照片数据
let imgArr = ref<SpuImage[]>([])
// 获取table组件实力vc
let table = ref<any>()
// 收集sku的参数
let skuParams = reactive<SkuData>({
  category3Id: '', //三级分类的id
  spuId: '', //已有的SPU的ID
  tmId: '', //SPU品牌的ID
  // v-model收集
  skuName: '', // sku的名字
  price: '', // sku的价格
  weight: '', // sku的重量
  skuDesc: '', //sku的描述
  skuAttrValueList: [
    //平台属性的收集
    {
      attrId: '', //平台属性的ID
      valueId: '', //平台属性值的ID
    },
  ],
  skuSaleAttrValueList: [
    //销售属性
    {
      saleAttrId: '', // 属性ID
      saleAttrValueId: '', //属性值的ID
    },
  ],
  skuDefaultImg: '', //sku默认图片地址
})
// 当前子组件获取数据的方法
const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: SpuData,
) => {
  Object.assign(skuParams, {
    category3Id: '', //三级分类的id
    spuId: '', //已有的SPU的ID
    tmId: '', //SPU品牌的ID
    // v-model收集
    skuName: '', // sku的名字
    price: '', // sku的价格
    weight: '', // sku的重量
    skuDesc: '', //sku的描述
    skuAttrValueList: [
      //平台属性的收集
      {
        attrId: '', //平台属性的ID
        valueId: '', //平台属性值的ID
      },
    ],
    skuSaleAttrValueList: [
      //销售属性
      {
        saleAttrId: '', // 属性ID
        saleAttrValueId: '', //属性值的ID
      },
    ],
    skuDefaultImg: '', //sku默认图片地址
  })
  // 收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id as number
  skuParams.tmId = spu.tmId
  // 获取数据
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, spu.category3Id)
  let result1: SpuHasImg = await reqSpuImageList(spu.id as number)
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  attrArr.value = result.data
  SaleAttr.value = result2.data
  imgArr.value = result1.data
}
// 设置默认图片回调
const handler = (row: any) => {
  // 复选框选中 点击事先让全部不勾选
  imgArr.value.forEach((item) => {
    table.value.toggleRowSelection(item, false)
  })
  table.value.toggleRowSelection(row, true)

  skuParams.skuDefaultImg = row.imgUrl
}
// 保存按钮回调
const save = async () => {
  // 整理参数
  // 平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      // 拆分
      let [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({ attrId, valueId })
    }
    return prev
  }, [])
  // 销售属性
  skuParams.skuSaleAttrValueList = SaleAttr.value.reduce(
    (prev: any, next: any) => {
      if (next.saleIdAndValueId) {
        let [saleAttrId, saleAttrIdValueId] = next.saleIdAndValueId.split(':')
        prev.push({ saleAttrId, saleAttrIdValueId })
      }
      return prev
    },
    [],
  )
  // 发请求
  let result = await reqAddSku(skuParams)
  if (result.code == 200) {
    ElMessage.success('添加SKU成功')
    cancel()
  } else {
    ElMessage.error('添加SKU失败')
  }
}

// 对外暴露
defineExpose({ initSkuData })
// 自定义事件方法
let $emit = defineEmits(['changeScene'])
// 取消按钮回调
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' })
}
</script>

<script lang="ts">
export default {
  name: 'skuForm',
}
</script>
<style lang="scss" scoped></style>
