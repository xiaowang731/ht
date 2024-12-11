export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}
// 定义sku对象的ts类型
//平台属性
export interface Attr {
    id?: number,
    valueName?: string
    attrId: string | number, //平台属性的ID
    valueId: string | number, //平台属性值的ID
}
//销售属性
export interface saleArr {
    id?: number,
    saleAttrValueName?: string,
    saleAttrId: string | number, // 属性ID
    saleAttrValueId: string | number, //属性值的ID
}
// 图片类型
export interface skuImageList {
    id: number,
    imgName: string,
    imgUrl: string,
    isDefault: string | number,
    skuId: number | string,
    spuImgId: string | number,
}
// sku的ts类型
export interface SkuData {
    category3Id?: string | number, //三级分类的id
    spuId?: string | number, //已有的SPU的ID
    tmId?: string | number, //SPU品牌的ID
    skuName?: string, // sku的名字
    price?: string | number, // sku的价格
    weight?: string | number, // sku的重量
    skuDesc?: string, //sku的描述
    skuAttrValueList?: Attr[],//平台属性的收集 
    skuSaleAttrValueList?: saleArr[],//销售属性
    skuDefaultImg?: string, //sku图片地址
    skuImageList?: skuImageList[]
    isSale?: number,//商品状态
    id?: number | string,
}
// 获取sku接口返回数据ts类型
export interface SkuResponseData extends ResponseData {
    data: {
        records: SkuData[],
        total: number,
        size: number,
        current: number,
        orders: [],
        optimizeCountSql: boolean,
        hitCount: boolean,
        countId: null,
        maxLimit: null,
        searchCount: boolean,
        pages: number
    }
}
// 获取sku详情接口ts类型
export interface SkuInfoData extends ResponseData {
    data: SkuData
}