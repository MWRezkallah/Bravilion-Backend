import { ObjectId } from "bson";
import { Response, Request } from "express"
import { ManufacturerRepository } from "../../../repositories";
import * as Storage from '@google-cloud/storage';
import { ProductRepository } from "../../../repositories";
export const deleteCollection = async (req: Request, res: Response) =>{

    try {

        
        if(!req.params.collectionId ) throw new Error("please provide a collection ID")

        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const collectionID = new ObjectId(req.params.collectionId);

        const collection = await manuRepo.collection?.findOneAndUpdate({$and:[{"_id":new ObjectId(res.locals.manufacturer._id)},{"collections.collectionId":collectionID}]}, 
                {  $pull:{"collections":{"collectionId":collectionID}}},
                {projection:{"manufacturerId":"$_id","_id":0, "collections":{$elemMatch:{"collectionId":collectionID}}}}
             )


        const prodRepo = new ProductRepository();
        if(!prodRepo.collection) await prodRepo.initCollection();
        await prodRepo.collection?.updateMany({$and:[{"ownerId":new ObjectId(res.locals.manufacturer._id)},{"collectionId":collectionID}]},
            {$pull:{"collectionId":collectionID}})

        const storage = new Storage();
        if(collection?.value.collections[0].coverImage.name)
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(collection?.value.collections[0].coverImage.name).delete();

            res.status(200).send({
            status:"success",
            data: collection?.value 
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}