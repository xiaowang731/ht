// 商品分类全局组件方法
import { defineStore } from "pinia"
import { reqC1, reqC2, reqC3 } from "@/api/product/attr";

import type { CategoryResponseData } from '@/api/product/attr/type'
import type { CategoryState } from './type/type'
let useCategoryStore = defineStore('Category', {
    state: (): CategoryState => {
        return {
            // 一级分类数据
            c1Arr: [],
            // 二级分类数据
            c2Arr: [],
            // 三级分类数据
            c3Arr: [],
            // 一级分类id
            c1Id: '',
            // 二级分类id
            c2Id: '',
            // 三级分类id
            c3Id: '',
        }
    },
    actions: {
        // 一级分类的方法
        async getC1() {
            let result: CategoryResponseData = await reqC1()
            if (result.code = 200) this.c1Arr = result.data
        },
        // 二级分类的方法
        async getC2() {
            let result: CategoryResponseData = await reqC2(this.c1Id)
            if (result.code = 200) this.c2Arr = result.data
        },
        // 三级分类的方法
        async getC3() {
            let result: CategoryResponseData = await reqC3(this.c2Id)
            if (result.code = 200) this.c3Arr = result.data
        }
    },
    getters: {

    }
})

export default useCategoryStore