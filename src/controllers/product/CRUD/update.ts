import { ObjectId } from "bson"
import { Response, Request } from "express"
import { ProductRepository } from "../../../repositories"
import { IProduct } from "../../../models"
import { extractImageModel } from "../../../lib"
import { IFile } from "../../../models"
import * as Storage from '@google-cloud/storage';

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const productId = new ObjectId(req.params.productId);
        const ownerId = new ObjectId(res.locals.manufacturer._id);

        const files = Object.values(req.files?req.files:{});
        const product:IProduct={
            ownerId : ownerId,
            name : req.body.name,
            coverImage: extractImageModel(files[0][0]),
            views:0,
        };
        req.body.properties?  product["properties"] = req.body.properties:{};
        req.body.families? product["familyId"] = ((req.body.families as Array<string>).map(family => new ObjectId(family))):[];
        req.body.collectionId? product["collectionId"]= (req.body.collections as Array<string>).map(collection => new ObjectId(collection)) : [];
        req.body.projectsId? product["projectsId"] = (req.body.projects as Array<string>).map(project => new ObjectId(project)): [];
        req.body.categories? product["categories"] = (req.body.categories as Array<string>).map(category => new ObjectId(category)) : [];
        req.body.gallery? product["gallery"] = (files[1] as Array<Express.Multer.File>).map( file => extractImageModel(file)) : []

        const prodRepo = new ProductRepository();
        if(!prodRepo.collection) await prodRepo.initCollection();
        const result = await prodRepo.collection?.findOneAndUpdate({$and:[{"_id":productId}, {ownerId:ownerId}]},{$set:{...product}});
        if(result?.ok == 1){
            const storage = new Storage();
            if(result.value.coverImage){
                await storage.bucket(`${process.env.GCS_BUCKET}`).file(result.value.coverImage.name).delete();            
            }
            if(result.value.gallery && result.value.gallery.length>0){
                (result.value.gallery as Array<IFile>).map(async image =>
                    await storage.bucket(`${process.env.GCS_BUCKET}`).file(image.name).delete())
                }
        }
        res.status(200).send({
            status:(result?.ok ==1)?"Success":"Failed to update",
            data:result?.value
        })

        
    } catch (error) {
        
        res.status(400).send({
            status:"Error",
            message:error
        })
    }
}