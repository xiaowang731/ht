// spu管理模块接口
import request from "@/utils/request"
import type { HasSpuResponseData, AllTradeMark, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData, SpuData } from "./type"
enum API {
    // 获取已有SPU的数据
    HASSPU_URL = '/admin/product/',
    // 获取全部品牌的数据
    ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
    // 获取某一个spu照片墙数据
    IMAGE_URL = '/admin/product/spuImageList/',
    // 获取某一个spu下全部已有的销售属性接口地址
    SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
    // 获取整个项目全部的销售属性
    ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
    // 追加一个新的spu
    ADDSPU_URL = '/admin/product/saveSpuInfo',
    // 更新一个已有spu
    UPDATESPU_URL = '/admin/product/updateSpuInfo'
}

// 获取某一个三级分类下已有的SPU参数
export const reqHasSpu = (page: number, limit: number, category3Id: number | string) => {
    return request.get<any, HasSpuResponseData>(API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`)
}
// 获取全部的spu品牌的数据
export const reqAllTradeMark = () => {
    return request.get<any, AllTradeMark>(API.ALLTRADEMARK_URL)
}
// 获取某一个已有spu全部商品照片墙数据
export const reqSpuImageList = (spuId: number) => {
    return request.get<any, SpuHasImg>(API.IMAGE_URL + spuId)
}
// 获取某一个已有spu用用多少个销售属性
export const reqSpuHasSaleAttr = (spuId: number) => {
    return request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + spuId)
}
// 获取全部销售属性
export const reqAllSaleAttr = () => {
    return request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)
}
// 追加一个新的spu接口
// 更新一个已有spu接口
export const reqAddOrUpdateSpu = (data: SpuData) => {
    // 有id,更新spu
    if (data.id) {
        return request.post<any, any>(API.UPDATESPU_URL, data)
    } else {
        return request.post<any, any>(API.ADDSPU_URL, data)
    }
}