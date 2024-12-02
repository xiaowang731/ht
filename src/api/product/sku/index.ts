import request from "@/utils/request"
import type { SkuResponseData } from "./type"

enum API {
    // 获取已有商品数据-SKU
    SKU_URL = '/admin/product/list/',
    //上架
    SALE_URL = '/admin/product/onSale/',
    //下架  
    CANCELSALE_URL = '/admin/product/cancelSale/',
}
// 获取商品sku的接口
export const reqSkuList = (page: number, limit: number) => {
    return request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)
}
// 上架接口
export const reqSaleSku = (skuId: number) => {
    return request.get<any, any>(API.SALE_URL + skuId)
}
// 下架接口
export const reqCanselSale = (skuId: number) => {
    return request.get<any, any>(API.CANCELSALE_URL + skuId)
}