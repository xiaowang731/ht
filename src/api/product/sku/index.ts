import request from "@/utils/request"
import type { SkuResponseData, SkuInfoData } from "./type"

enum API {
    // 获取已有商品数据-SKU
    SKU_URL = '/admin/product/list/',
    //上架
    SALE_URL = '/admin/product/onSale/',
    //下架  
    CANCELSALE_URL = '/admin/product/cancelSale/',
    //获取商品详情接口 
    SKUINFO_URL = '/admin/product/getSkuInfo/',
    // 删除已有的商品
    DELETESKU_URL = '/admin/product/deleteSku/',
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
// 获取sku详情接口
export const reqSkuInfo = (skuId: number) => {
    return request.get<any, SkuInfoData>(API.SKUINFO_URL + skuId)
}
// 删除已有sku接口
export const reqDeleteSku = (skuId: number) => {
    return request.delete<any, any>(API.DELETESKU_URL + skuId)
}