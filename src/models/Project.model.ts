import { ObjectId } from "bson";
import { IFile, ILang } from ".";

export interface IProject {
    projectId?:ObjectId,
    name?:ILang,
    coverImage?:IFile,
    images?:IFile[],
    smallDescription?:ILang,
    longDescription?:ILang,
    productsId?:ObjectId[]
}

// interface IProjectImage{
//     image:IFile
// }