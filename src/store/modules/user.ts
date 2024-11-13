// 创建用户相关的小仓库
import { defineStore } from "pinia";
// 引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
// 引入数据类型
import type { UserState } from './type/type'
import type { loginFormData, LoginResponseData, userInfo } from '@/api/user/userType'

// 调用localStorage方法
import { GET_TOKEN, SET_TOKEN, REMOVE_TOKEN } from "@/utils/token";

// 引入路由(常量路由)
import { constantRoute } from "@/router/routes";


// 创建用户小仓库
const useUserStore = defineStore('User', {
    state: (): UserState => {
        return {
            token: GET_TOKEN() || '',//用户唯一表示
            menuRouters: constantRoute, //仓库存储生成菜单需要数据(路由)
            username: '',//用户名
            avatar: ''//头像
        }
    },
    // 异步|逻辑的地方
    actions: {
        // 用户登录方法
        async userLogin(date: loginFormData) {
            // 登录请求
            let result: LoginResponseData = await reqLogin(date)

            // 登录请求:成功200->token
            if (result.code === 200) {
                // pinia仓库存储token
                this.token = (result.data as string)
                // 本地存储一份
                SET_TOKEN((result.data as string))
                return true
            } else {
                // 登录请求:失败201->登录失败错误的信息
                return Promise.reject(new Error(result.data))
            }
        },
        // 获取用户信息
        async userInfo() {
            // 获取用户信息,并且存入仓库中[头像,名字]
            let result: userInfo = await reqUserInfo()
            // 如果获取用户信息成功，存储用户信息
            if (result.code === 200) {
                this.username = result.data.name
                this.avatar = result.data.avatar
                return 'ok'
            } else {
                return Promise.reject(new Error(result.message))
            }
        },
        // 退出登录方法
        async userLogout() {
            // 目前没有mock接口,退出登录接口,通知服务器本地用户唯一标识失效
            let result: any = await reqLogout()
            if (result.code == 200) {
                this.token = ''
                this.username = ''
                this.avatar = ''
                REMOVE_TOKEN()
                return 'ok'
            } else {
                return Promise.reject(new Error(result.message))
            }
        }
    },
    // 计算
    getters: {
    }
})

// 暴露仓库
export default useUserStore