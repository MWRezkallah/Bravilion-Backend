import { ObjectId } from "bson";
import { IFile, IGeneric, ILang } from ".";

export interface IClient{

    email:string,
    password:string,
    name:ILang,
    phone:string,
    avatar?:IFile,
    coverImage?:IFile
    contactInfo?:IGeneric[],
    
    requests?:{
        requestId?:ObjectId,
        orders?:{
             orderId?:ObjectId
             productId:ObjectId,
             quantity:Number,
             status:string,
             manufacturerId:ObjectId
            }[],
    }[],
    favoriteProducts?:ObjectId[],
    favoriteManufacturer?:ObjectId[]

    tokens?:string[]

}