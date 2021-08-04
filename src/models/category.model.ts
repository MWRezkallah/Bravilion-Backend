import { IFile } from "./file.model";
import { ILang } from "./ILang";


export interface ICategory{
    _id?:string;
    name:ILang;
    cover:IFile
}