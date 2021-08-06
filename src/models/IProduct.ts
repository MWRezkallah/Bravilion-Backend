import { ObjectId } from "mongodb";
import {  ILang, IFile, IProperty} from ".";

export interface IProduct {
    _id?:string;
    name:ILang;
    description:ILang;
    logo: IFile;
    price:number;
    afterSalePrice:number;
    images:IFile[];
    properties?:IProperty[];
    detailedProperties?:IProperty[];
    supplier?:ObjectId[];
    categories?:ObjectId[];
    badges?:ObjectId[];
}