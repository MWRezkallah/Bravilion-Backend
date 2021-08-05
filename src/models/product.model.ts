import { IBadge } from "./badge.model";
import { IFile } from "./file.model";
import { ILang } from "./language.model";


export interface IProduct{
    _id?:string;
    productDescription:string;
    name:ILang;
    img:IFile;
    price:number;
    afterSalePrice?:number;
    badges?:IBadge[];
}