import { IBadge,IFile,ILang,IProperty } from ".";

export interface IProductDetails{
    _id?:string;
    name:ILang;
    details:ILang;
    images:IFile[];
    price:number;
    afterSalePrice?:number;
    badges?:IBadge[];
    properties:IProperty[];
    detailedProperties:IProperty[];

    //TODO:: Supplier
}