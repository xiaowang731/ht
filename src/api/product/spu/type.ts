// 服务器全部接口返回的数据类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

//spu数据的ts类型 
export interface SpuData {
    id: number,
    spuName: string,
    description: string,
    category3Id: string | number,
    tmId: number,
    spuSaleAttrList: null, //销售属性字段
    spuImageList: null,//照片属性字段
}
// 数组:元素都是已有SPU数据类型
export type Records = SpuData[]
// 定义获取已有的spu接口返回的数据ts类型
export interface HasSpuResponseData extends ResponseData {
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        searchCount: boolean,
        pages: number
    }
}