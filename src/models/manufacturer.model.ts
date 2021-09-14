import { ObjectId } from "bson";
import { IFile, IGeneric } from ".";

export interface IManufacturer{

    email:string,
    password:string,
    name:string,
    logo?:IFile,
    header?:IFile,
    about?:string,
    contactInfo?:IGeneric[],
    
    articlesId?:string[],
    tradeFairsId?:string[],
    productsId?:string[],
    ordersId?:string[],

    catalogues?:{name:string, pdf:IFile, description:string}[],
    enquiries?:IGeneric[],
    projects?:IGeneric[],
    videos?:{name:string, url:string, description:string}[],

    family?:IGeneric[],
    collections?:IGeneric[],
    
    tokens?:string[]

}