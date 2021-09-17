import { ObjectId } from "bson";
import { IFile, ILang } from ".";

export interface IProject {
    projectId?:ObjectId,
    name?:ILang,
    coverImage?:IFile,
    images?:IProjectImage[],
    smallDescription?:string,
    longDescription?:string,
    productsId?:ObjectId[]
}

interface IProjectImage{
    coverImage:IFile,
    description?:string
}