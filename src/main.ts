import { createApp } from 'vue'
import App from './App.vue'
// 引入element-plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'

// 引入路由
import router from './router';
// 引入pinia
import pinia from './store';

// 获取应用实例对象
const app = createApp(App)

//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//安装element-plus插件
app.use(ElementPlus, {
    locale: zhCn // element-plus国际化设置
})

// svg需要的配置代码
import 'virtual:svg-icons-register'

// 引入自定义插件对象:注册整个项目全局组件
import globalComponents from '@/components/index'
// 安装自定义插件
// 安装路由
app.use(globalComponents).use(router).use(pinia)

// 引入模板的全局样式
import "@/styles/index.scss"
// 引入鉴权文件
import '@/permission'

// 挂载
app.mount('#app')

