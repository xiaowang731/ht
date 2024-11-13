// 小仓库:Layout组件相关配置仓库
import { defineStore } from "pinia";
let useLayOutSettingStore = defineStore('SettingStore', {
    state: () => {
        return {
            fold: <boolean>false,//用于控制菜单折叠还是收起控制
            refresh: <boolean>false
        }
    }
})

export default useLayOutSettingStore