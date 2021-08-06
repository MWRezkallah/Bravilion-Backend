import { ObjectId } from "mongodb";
import { IFile,ILang,IProperty } from ".";

export interface IProductDetails{
    _id?:string;
    name:ILang;
    description:ILang;
    logo:IFile;
    images:IFile[];
    price:number;
    afterSalePrice?:number;
    badges?:ObjectId[];
    categories?:ObjectId[];
    properties:IProperty[];
    detailedProperties:IProperty[];
    suppliers:ObjectId[]

}