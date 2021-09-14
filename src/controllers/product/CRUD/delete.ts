import { ObjectId } from "bson"
import { Response, Request } from "express"
import { ProductRepository } from "../../../repositories"
import { IProduct } from "../../../models"
import { extractImageModel } from "../../../lib"
import { IFile } from "../../../models"
import * as Storage from '@google-cloud/storage';

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const productId = new ObjectId(req.params.productId);
        const ownerId = new ObjectId(res.locals.manufacturer._id);

        const prodRepo = new ProductRepository();
        if(!prodRepo.collection) await prodRepo.initCollection();
        const result = await prodRepo.collection?.findOneAndDelete({$and:[{"_id":productId}, {ownerId:ownerId}]});
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
            status:(result?.ok ==1)?"Success":"Failed to delete",
            data:result?.value
        })

        
    } catch (error) {
        
        res.status(400).send({
            status:"Error",
            message:error
        })
    }
}