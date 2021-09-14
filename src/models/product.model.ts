import { ObjectId } from "bson";
import { IGeneric, IFile, ILang } from ".";

export interface IProduct {
    ownerId?:ObjectId,
    name:ILang,
    coverImage?:IFile,
    views?:Number,
    categories?:ObjectId[],
    properties?:IGeneric[],
    gallery?:IFile[],
    familyId?:ObjectId[],
    collectionId?:ObjectId[],
    projectsId?:ObjectId[]
}