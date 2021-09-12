import { IFile } from '../models/index'

export const extractImageModel = (file:any, createdAt = Date.now()):IFile =>{
    const path  = file.path.split("\\").join("/");
    return {
        name:file.filename,
        type:file.mimetype,
        path:path,
        createdAt:createdAt,
        modifiedAt: Date.now()
    }
}

export const extractPdfModel = (file:any, createdAt = Date.now()):IFile =>{
    const path  = file.path.split("\\").join("/");
    return {
        name:file.filename,
        type:file.mimetype,
        path:path,
        createdAt:createdAt,
        modifiedAt: Date.now()
    }
}
