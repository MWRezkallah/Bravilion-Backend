import { ObjectId } from "mongodb";
import { IFile } from "./file.model";
import { ILang } from "./language.model";


export interface IProduct{
    _id?:string;
    name:ILang;
    logo:IFile;
    description:ILang;
    price:number;
    afterSalePrice?:number;
    badges?:ObjectId[];
    categories?:ObjectId[];
    productDetailsId:ObjectId;
}