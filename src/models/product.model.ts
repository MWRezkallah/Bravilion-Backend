import { IBadge, IFile, ILang } from ".";


export interface IProduct{
    _id?:string;
    productDescription:string;
    name:ILang;
    img:IFile;
    price:number;
    afterSalePrice?:number;
    badges?:IBadge[];
    categories:string[];
}