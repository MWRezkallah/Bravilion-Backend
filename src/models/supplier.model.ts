import { ILang } from "./ILang";
import { IFile } from "./file.model";
import { IContactInfo } from "./IContactInfo";


export interface ISupplier {
    name:ILang,
    code:string,
    logo:IFile,
    headQuarter:IContactInfo,
    branches?:[IContactInfo]
}