// 服务器全部接口返回的数据类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}
//spu数据的ts类型 
export interface SpuData {
    id?: number,
    spuName: string,
    tmId: number | string,
    description: string,
    category3Id: string | number,
    spuSaleAttrList: null | SaleAttr[], //销售属性字段
    spuImageList: null | SpuImage[],//照片属性字段
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
// 所有品牌数据的ts类型
export interface Trademark {
    id: number,
    tmName: string,
    logoUrl: string
}
// 品牌接口返回的ts数据类型
export interface AllTradeMark extends ResponseData {
    data: Trademark[]
}
// 商品图片的ts类型
export interface SpuImage {
    id?: number,
    spuId?: number,
    createTime?: string,
    updateTime?: string,
    imgName?: string,
    imgUrl?: string,
    name?: string,
    url?: string
}
// 已有spu照片墙返回数据类型
export interface SpuHasImg extends ResponseData {
    data: SpuImage[]
}
// 已有销售属性值对象数据类型
export interface SaleAttrValue {
    id?: number,
    createTime?: null,
    updateTime?: null,
    spuId?: number,
    baseSaleAttrId: number | string,
    saleAttrValueName: string,
    saleAttrName?: string,
    isChecked?: null
}
// 存储已有销售属性值数组类型
export type SpuSaleAttrValueList = SaleAttrValue[]
// 销售属性对象ts类型
export interface SaleAttr {
    id?: number,
    createTime?: null,
    updateTime?: null,
    spuId?: number,
    baseSaleAttrId: number | string,
    saleAttrName: string,
    spuSaleAttrValueList: SpuSaleAttrValueList,
    flag?: boolean,
    saleAttrValue?: string
}
// spu已有销售属性接口返回数据ts类型
export interface SaleAttrResponseData extends ResponseData {
    data: SaleAttr[]
}
// 已有全部spu返回数据ts类型
export interface HasSaleAttr {
    id: number,
    name: string
}
export interface HasSaleAttrResponseData extends ResponseData {
    data: HasSaleAttr[]
}

//平台属性
export interface Attr {
    attrId: string | number, //平台属性的ID
    valueId: string | number, //平台属性值的ID
}
//销售属性
export interface saleArr {
    saleAttrId: string | number, // 属性ID
    saleAttrIdValueId: string | number, //属性值的ID
}
// sku的ts类型
export interface SkuData {
    category3Id: string | number, //三级分类的id
    spuId: string | number, //已有的SPU的ID
    tmId: string | number, //SPU品牌的ID
    skuName: string, // sku的名字
    price: string | number, // sku的价格
    weight: string | number, // sku的重量
    skuDesc: string, //sku的描述
    skuAttrValueList?: Attr[],//平台属性的收集 
    skuSaleAttrValueList?: saleArr[],//销售属性
    skuDefaultImg: string, //sku图片地址
}