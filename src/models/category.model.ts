import { ObjectId } from "bson";
import { IFile, ILang } from ".";


export interface ICategory{
    _id?:string;
    name:ILang;
    coverImage:IFile;
    parentCategoryId?:ObjectId
    level?:number
}