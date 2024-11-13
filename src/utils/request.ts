// 进行axios二次封装,使用请求与响应拦截器
import axios from "axios";
import { ElMessage } from "element-plus";
// 引入用户相关的仓库
import useUserStore from "@/store/modules/user";

// 第一步:利用axios对象的create方法,创建axios实例
const request = axios.create({
    baseURL: '/api',
    timeout: 5000,
})
// 第二步:request实例添加请求拦截器
request.interceptors.request.use((config) => {
    // 获取用户相关的向仓库:获取仓库内部token,登录成功以后携带给服务器
    const userStore = useUserStore()
    if (userStore.token) {
        config.headers.token = userStore.token
    }
    // config配置对象,headers属性请求头,经常给服务器携带公共参数
    // 返回配置对象
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 第三步:request实例添加响应拦截器
request.interceptors.response.use((response) => {
    // 对响应数据做点什么
    // 成功回调
    return response.data;
}, function (error) {
    // 对响应错误做点什么
    // 定义一个变量
    let message = ''
    // http状态码
    let status = error.request.status
    switch (status) {
        case 401:
            message = 'TOKEN过期'
            break
        case 403:
            message = '无权访问'
            break
        case 404:
            message = '请求地址错误'
            break
        case 500:
            message = '服务器出现问题'
            break
        default:
            message = '网络出现问题'
            break
    }
    // 提示错误信息
    ElMessage.error(message)
    return Promise.reject(error);
});

export default request