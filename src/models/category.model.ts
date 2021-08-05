import { IFile } from "./file.model";
import { ILang } from "./language.model";


export interface ICategory{
    _id?:string;
    name:ILang;
    cover:IFile
}