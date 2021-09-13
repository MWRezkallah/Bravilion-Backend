import { IFile, ILang } from ".";


export interface ICategory{
    _id?:string;
    name:ILang;
    cover:IFile;
    parentCategoryId?:string[]
    level?:number
}