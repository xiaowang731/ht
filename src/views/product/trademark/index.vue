<template>
  <el-card class="box-card">
    <!-- 卡片顶部添加按钮 -->
    <el-button
      type="primary"
      size="default"
      @click="addTrademark()"
      icon="Plus"
    >
      添加品牌
    </el-button>
    <!-- 表格组件:展示数据 -->
    <el-table border style="margin: 10px 0px" :data="trademarkArr">
      <el-table-column
        label="序号"
        width="80px"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column label="品牌名称" align="center">
        <template #="{ row }">
          <pre style="color: coral">{{ row.tmName }}</pre>
        </template>
      </el-table-column>
      <el-table-column label="品牌LOGO">
        <template #="{ row, $index }">
          <img :src="row.logoUrl" style="height: 100px; width: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="品牌操作">
        <template #="{ row, $index }">
          <el-button
            type="warning"
            size="small"
            icon="edit"
            @click="updateTrademark(row)"
          ></el-button>
          <el-popconfirm
            :title="`你确定要删除${row.tmName}品牌吗?`"
            width="250px"
            icon="Delete"
            @confirm="DeleteTradeMark(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器组件 -->
    <el-pagination
      @current-change="getHasTrademark"
      @size-change="sizeChange"
      :pager-count="9"
      v-model:current-page="pageNum"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9, 11]"
      layout="prev, pager, next, jumper,->,total, sizes"
      :total="total"
    />
  </el-card>
  <!-- 对话框组件:在添加品牌与修改已有品牌的业务时候使用结构 -->
  <!-- 
    v-model:属性用户控制对话框的显示与隐藏 true显示, false隐藏
    title:设置对话框左上角标题
  -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
  >
    <el-form
      style="width: 80%"
      :model="trademarkParams"
      :rules="rules"
      ref="formRef"
    >
      <el-form-item label="品牌名称" label-width="100px" prop="tmName">
        <el-input
          placeholder="请输入品牌名称"
          v-model="trademarkParams.tmName"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="trademarkParams.logoUrl"
            :src="trademarkParams.logoUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- 具名插槽 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
        <el-button type="primary" size="default" @click="confirm">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTradeMark,
} from '@/api/product/trademark'
import { onMounted, ref, reactive, nextTick } from 'vue'
import type {
  Records,
  TradeMarkResponseData,
  TradeMark,
} from '@/api/product/trademark/type'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
// 当前页码
let pageNum = ref<number>(1)
// 每一页展示多少条数据
let limit = ref<number>(3)
// 存储已有品牌数据总数
let total = ref<number>(0)
// 对话框的显示隐藏
let dialogFormVisible = ref<boolean>(false)
// 存储已有品牌的数据
let trademarkArr = ref<Records>([])
// 定义收集新增品牌数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
})
// 获取已有品牌的接口封装为一个函数,在任河情况下获取数据,调用此函数即可
const getHasTrademark = async (pager = 1) => {
  // 当前页码
  pageNum.value = pager
  const result: TradeMarkResponseData = await reqHasTrademark(
    pageNum.value,
    limit.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}
// 组件挂载
onMounted(() => {
  getHasTrademark()
})
// 品牌自定义校验规则
const validatorTmName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('请输入至少2为的品牌名称'))
  }
}
// 获取el-form组件实例
let formRef = ref()
// 品牌logo图片的自定义校验方法
const validatorLogoUrl = (rule: any, value: any, callback: any) => {
  if (value) {
    callback()
  } else {
    callback(new Error('必须上传logo图片'))
  }
}

// 表单校验规则对象
const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
}

// 清除校验信息函数
const clearFormRules = () => {
  formRef.value?.clearValidate('logoUrl')
  formRef.value?.clearValidate('tmName')
}

// 事件
// 当下拉菜单发生变化的时候触发
// 这个自定义事件,分页器组件会将下拉菜单选择数据返回
const sizeChange = (result: any) => {
  // 当前每一页的数据量发生变化的时候,当前页面归1
  getHasTrademark()
}

// 添加品牌按钮的回调
const addTrademark = () => {
  dialogFormVisible.value = true
  // 清空收集的数据
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  trademarkParams.id = 0
  // 清空校验错误图片信息
  nextTick(() => {
    clearFormRules()
  })
}
// 修改品牌按钮的回调
const updateTrademark = (row: any) => {
  dialogFormVisible.value = true
  // ES6合并对象,与下面写法一样,把已有的数据拷贝一份给前面的对象
  Object.assign(trademarkParams, row)
  //   trademarkParams.id = row.id
  //   trademarkParams.logoUrl = row.logoUrl
  //   trademarkParams.tmName = row.tmName
  nextTick(() => {
    clearFormRules()
  })
}
// 对话框底部取消按钮
const cancel = () => {
  // 对话框隐藏
  dialogFormVisible.value = false
}
// 对话框底部确认按钮
const confirm = async () => {
  // 在发请求之前,对整个表单进行校验
  // 调用这个方法进行全部的表单校验
  await formRef.value.validate()
  let res: any = await reqAddOrUpdateTrademark(trademarkParams)
  // 添加成功
  if (res.code == 200) {
    // 再次发请求
    getHasTrademark(trademarkParams.id ? pageNum.value : 1)
    // 弹出提示信息
    ElMessage.success(trademarkParams.id ? '修改品牌成功' : '添加品牌成功')
  } else {
    // 添加失败
    ElMessage.error(trademarkParams.id ? '修改品牌失败' : '添加品牌失败')
  }
  dialogFormVisible.value = false
}
// 气泡框确认删除按钮
const DeleteTradeMark = async (id: number) => {
  let result = await reqDeleteTradeMark(id)
  // 删除品牌成功
  if (result.code == 200) {
    ElMessage.success('删除品牌成功')
    // 再次获取信息
    getHasTrademark(
      trademarkArr.value.length > 1 ? pageNum.value : pageNum.value - 1,
    )
  } else {
    // 删除失败
    ElMessage.error(result.message)
  }
}
// 上传图片组件-->上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 钩子是在图片上传成功之前触发,上传文件之前可以约束文件类型与大小
  // 要求:上传文件格式png|jpg|gif| 4M
  if (
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage.error('上传的文件格式务必是png|jpg|gif且小于4M')
      return false
    }
  } else {
    ElMessage.error('上传的文件格式务必是png|jpg|gif')
    return false
  }
}

// 图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  trademarkParams.logoUrl = response.data
  // 图片上传成功,清除校验结果
  formRef.value.clearValidate('logoUrl')
}
</script>

<script lang="ts">
export default {
  name: 'trademark',
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
