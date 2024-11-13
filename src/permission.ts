//路由鉴权
import router from "./router/index"
import nprogress from "nprogress"
// 引入setting组件
import setting from "./setting"
//引入进度条样式
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false })
// 获取用户先关的小仓库内部token，去判断用户是否登录成功
import pinia from "./store"
import useUserStore from "./store/modules/user"
const userStore = useUserStore(pinia)

// 全局守卫：项目中任意路由切换都会触发的沟子
// 路由前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
    document.title = setting.title + '-' + to.meta.title
    // to:将要访问的路由
    // from:从那个路由而来
    // next:放行函数
    // 访问某个路由之前守卫
    nprogress.start()
    // 获取token,去判断用户登录,还是未登录
    const token = userStore.token
    // 获取用户信息
    let username = userStore.username
    // 用户登录判断
    if (token) {
        // 登录成功阻止访问登录页
        if (to.path == '/login') {
            next({ path: '/' })
        } else {
            // 登录成功访问其余的路由
            // 有用户信息
            if (username) {
                next()
            } else {
                // 没有用户信息,守卫发请求获取用户信息
                try {
                    await userStore.userInfo()
                    next()
                } catch (error) {
                    // token 过期,获取不到用户信息
                    // 用户手动修改本地存储token
                    // 退出登录>清空用户相关信息
                    await userStore.userLogout()
                    next({ path: '/login', query: { redirect: to.path } })
                }
            }
        }
    } else {//未登录
        if (to.path == '/login') {
            next()
        } else {
            next({ path: '/login', query: { redirect: to.path } })
        }
    }
})

// 路由后置守卫
router.afterEach((to: any, from: any) => {
    nprogress.done()
})

// 路由切换实现进度条业务 --nprogress
// 路由鉴权,路由组件访问权限的设置
// 全部路由组件:登录|404|任意路由|数据大屏|权限管理（三个子路由）|商品管理（四个子路由）
// 用户未登录，可以访问login，其余的不能访问（指向login）
// 用户登录成功，不可以访问login【指向首页】，其余的路由可以访问
