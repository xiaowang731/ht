<template>
  <el-form label-width="100px">
    <el-form-item label="spu名称">
      <el-input
        placeholder="请输入spu名称"
        v-model="SpuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="spu品牌">
      <el-select style="width: 200px" v-model="SpuParams.tmId">
        <el-option
          v-for="item in AllTradeMark"
          :key="item.id"
          :value="item.id"
          :label="item.tmName"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="spu描述">
      <el-input
        type="textarea"
        placeholder="请输入spu描述"
        autosize="{ minRows: 2, maxRows: 6 }"
        v-model="SpuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="spu照片">
      <el-upload
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        v-model:file-list="imgList"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handleUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img
          :src="dialogImageUrl"
          w-full
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="spu销售属性">
      <el-select style="width: 200px">
        <el-option :label="1"></el-option>
        <el-option :label="2"></el-option>
        <el-option :label="3"></el-option>
      </el-select>
      <el-button
        type="primary"
        size="default"
        icon="plus"
        style="margin-left: 10px"
      >
        添加属性值
      </el-button>
      <!-- table展示销售属性与属性值的地方 -->
      <el-table border style="margin: 10px 0" :data="saleAttr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="销售属性名字"
          width="120px"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="销售属性值">
          <template #="{ row }">
            <el-tag
              closable
              v-for="item in row.spuSaleAttrValueList"
              :key="row.id"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-button type="primary" size="small" icon="plus"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px"></el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
} from '@/api/product/spu'
import type {
  SpuData,
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  Trademark,
  SpuImage,
  SaleAttr,
  HasSaleAttr,
} from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
const $emit = defineEmits(['changeScene'])

// 点击取消按钮,通知父组件切换场景
const cancel = () => {
  $emit('changeScene', 0)
}
// 存储已有的spu这些数据
let AllTradeMark = ref<Trademark[]>([])
// 商品图片
let imgList = ref<SpuImage[]>([])
// 已有spu销售属性
let saleAttr = ref<SaleAttr[]>([])
// 全部销售属性
let allSaleAttr = ref<HasSaleAttr[]>([])
// 控制对话框的显示隐藏
let dialogVisible = ref<boolean>(false)
// 存储预览照片地址
let dialogImageUrl = ref<string>('')
// 存储已有的spu对象
let SpuParams = ref<SpuData>({
  category3Id: '', //三级分类id
  description: 'string', //spu描述
  spuName: 'string', //spu名字
  tmId: '', //spu品牌id
  spuImageList: [],
  spuSaleAttrList: [],
})
// 子组件书写一个方法
const initHasSpuData = async (spu: SpuData) => {
  // 存储已有的spu对象,将来在模板中展示
  SpuParams.value = spu
  // spu:父组件传递过来的已有spu的数据[不完整]
  // 获取全部品牌的数据
  let result: AllTradeMark = await reqAllTradeMark()
  // 获取某一个品牌下全部售卖商品的图片
  let result1: SpuHasImg = await reqSpuImageList(spu.id as number)
  // 获取已有spu销售属性的数据
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  // 获取整个项目全部spu的销售属性
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr()
  // 存储全部品牌的数据
  AllTradeMark.value = result.data
  // spu对应商品图片
  imgList.value = result1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  // 存储已有的spu的销售属性
  saleAttr.value = result2.data
  // 存储全部的销售属性
  allSaleAttr.value = result3.data
}
// 照片墙点击预览按钮的时候触发的钩子
const handlePictureCardPreview = (file: any) => {
  // 存储要预览图片的地址
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}
// 照片墙删除文件的钩子 v-model已近完成效果了
const handleRemove = (uploadFile: any, uploadFiles: any) => {
  // console.log(uploadFile, '--------', uploadFiles)
}
// 照片墙上传成功之前的钩子
const handleUpload = (file: any) => {
  if (
    file.type == 'image/jpeg' ||
    file.type == 'image/png' ||
    file.type == 'image/gif'
  ) {
    if (file.size / 1024 / 1024 < 4) {
      ElMessage.success('上传成功')
      return true
    } else {
      ElMessage.error('请上传4M以下的jpeg|png|gif格式的图片')
      return false
    }
  } else {
    ElMessage.error('请上传4M以下的jpeg|png|gif格式的图片')
    return false
  }
}
// 对外暴露
defineExpose({ initHasSpuData })
</script>

<style lang="scss" scoped></style>
