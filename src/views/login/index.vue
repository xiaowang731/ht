<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>hello</h1>
          <h2>欢迎光临</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="default"
              class="login_btn"
              @click="userLogin"
              :loading="loading"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
// 引入仓库
import useUserStore from '@/store/modules/user'
let useStore = useUserStore()

// 引入路由器
import { useRoute, useRouter } from 'vue-router'
let $router = useRouter()
let $route = useRoute()

// 引入工具函数
import { getTime } from '@/utils/time'

// 自定义校验规则函数
const validatorUserName = (rule: any, value: any, callback: any) => {
  // rule: 即为校验规则对象
  // value：表单元素文本内容
  // callback 如果符合条件,callback放行,如果不符条件,callback注入错误提示
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('请输入5-10位的数字'))
  }
}

const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少6位'))
  }
}

//表单校验规则
const rules = {
  // 规则对象属性:
  username: [
    // { required: true, message: '用户名不能为空', trigger: 'blur' },
    { trigger: 'blur', validator: validatorUserName },
    {
      required: true,
      min: 4,
      max: 10,
      message: '请输入4-10位的字符',
      trigger: 'blur',
    },
  ],
  password: [
    // { required: true, message: '密码不能为空', trigger: 'blur' },
    { trigger: 'blur', validator: validatorPassword },
    {
      required: true,
      min: 6,
      max: 15,
      message: '请输入6-15位的字符',
      trigger: 'blur',
    },
  ],
}

// 收集账号密码的数据
let loginForm = reactive({
  username: 'admin',
  password: '111111',
})

// 控制按钮加载效果
let loading = ref(false)

// 获取el-form表单组件
let loginForms = ref()

// 登录按钮回调
const userLogin = async () => {
  // 保证全部表单校验通过再发请求
  await loginForms.value.validate()

  // 加载效果,开始加载
  loading.value = true
  try {
    // 保证登录成功
    await useStore.userLogin(loginForm)
    // 编程式导航跳转主页
    // 判断登录路由路径是否有query参数
    let redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    ElNotification({
      type: 'success',
      title: 'Hi,' + getTime() + '好!',
      message: '欢迎回来',
    })
  } catch (err) {
    ElNotification({
      type: 'error',
      message: (err as Error).message,
    })
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;
    h1 {
      color: #fff;
      font-size: 40px;
    }
    h2 {
      color: #fff;
      font-size: 20px;
      margin: 20px 0;
    }
    .login_btn {
      width: 100%;
    }
  }
}
</style>
