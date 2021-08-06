import { IBadge,IFile,ILang,IProperty } from ".";

export interface IProductDetails{
    _id?:string;
    name:ILang;
    productDescription:string;
    details:ILang;
    images:IFile[];
    price:number;
    afterSalePrice?:number;
    badges?:IBadge[];
    properties:IProperty[];
    detailedProperties:IProperty[];
    suppliers:string[];
    categories:string[];
}