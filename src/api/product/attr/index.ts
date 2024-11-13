import request from "@/utils/request"
import type { CategoryResponseData, AttrResponseData, Attr } from "./type"

// 属性模块接口地址
enum API {
    C1_URL = '/admin/product/getCategory1',
    C2_URL = '/admin/product/getCategory2/',
    C3_URL = '/admin/product/getCategory3/',
    // 获取分类下已有的属性与属性值接口
    ATTR_URL = '/admin/product/attrInfoList/',
    // 添加或者修改已有的属性接口
    ADDORUPDATEATTR_URL = '/admin/product/saveAttrInfo',
    // 删除某一个已有的属性
    DELETEATTR_URL = '/admin/product/deleteAttr/'
}

// 获取一级分类的接口方法
export const reqC1 = () => {
    return request.get<any, CategoryResponseData>(API.C1_URL)
}
// 获取二级分类的接口方法
export const reqC2 = (category1Id: number | string) => {
    return request.get<any, CategoryResponseData>(API.C2_URL + category1Id)
}
// 获取三级分类的接口方法
export const reqC3 = (category2Id: number | string) => {
    return request.get<any, CategoryResponseData>(API.C3_URL + category2Id)
}
// 获取对应分类下已有的属性与属性值方法
export const reqAttr = (category1Id: number | string, category2Id: number | string, category3Id: number | string) => {
    return request.get<any, AttrResponseData>(API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`)
}
// 新增或者修改已有的属性接口方法
export const reqAddOrUpdateAttr = (data: Attr) => {
    return request.post<any, any>(API.ADDORUPDATEATTR_URL, data)
}

// 删除某一个已有的属性业务
export const reqRemoveAttr = (attrId: number) => {
    return request.delete<any, any>(API.DELETEATTR_URL + attrId)
}