import { ILang, IFile, IContactInfo } from ".";


export interface ISupplier {
    name:ILang,
    code:string,
    logo:IFile,
    headQuarter:IContactInfo,
    branches?:[IContactInfo]
}