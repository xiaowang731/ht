// 引入项目中全部的全局组件
import SvgIcon from '@/components/SvgIcon/index.vue'
import Paginator from '@/components/Paginator/index.vue'
import Category from '@/components/Category/index.vue'
// 引入elementary-plus提供全部图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 创建全局对象
const allGlobalComponent: any = { SvgIcon, Paginator, Category }

//对外暴露插件对象
export default {
  //务必叫做install方法
  install(app: any) {
    //注册项目全部的全局组件
    Object.keys(allGlobalComponent).forEach((key) => {
      //注册为全局组件
      app.component(key, allGlobalComponent[key])
    })
    // 将element-plus提供图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
