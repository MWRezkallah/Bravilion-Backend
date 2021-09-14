import { ObjectId } from "bson";
import { Response, Request } from "express"
import { extractImageModel } from "../../../lib";
import { ManufacturerRepository } from "../../../repositories";
import * as Storage from '@google-cloud/storage';
import { ProductRepository } from "../../../repositories";
export const updateCollection = async (req: Request, res: Response) =>{

    try {

        
        if(!req.params.collectionId ) throw new Error("please provide a collection ID")


        const values = Object.values(req.files !== undefined ? req.files: {});
        const collectionID = new ObjectId(req.params.collectionId);
        let update = {  $set:{"collections.$":{collectionId:collectionID, ...req.body}}}
        let hasImageChanged = false;

        if(values[0][0].filename){
            const coverImage = extractImageModel(values[0][0])
            update = {  $set:{"collections.$":{collectionId:collectionID, coverImage,name:req.body.name}}}
            hasImageChanged = true;
        }
        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();

        const collection = await manuRepo.collection?.findOneAndUpdate({$and:[{"_id":new ObjectId(res.locals.manufacturer._id)},{"collections.collectionId":collectionID}]}, 
                update,
                {projection:{"manufacturerId":"$_id","_id":0, "collections":{$elemMatch:{"collectionId":collectionID}}}}
             )

        if(req.body.products){
            const products = (req.body.products as Array<string>).map(product => new ObjectId(product));
            const prodRepo = new ProductRepository();
            if(!prodRepo.collection) await prodRepo.initCollection();
            await prodRepo.collection?.updateMany({$and:[{"_id":{$in:products}},{"ownerId":new ObjectId(res.locals.manufacturer._id)}]},
                {$push:{"collectionId":collectionID}});
            
            await prodRepo.collection?.updateMany({$and:[{"_id":{$nin:products}},{"collectionId":collectionID},{"ownerId":new ObjectId(res.locals.manufacturer._id)}]},
                {$pull:{"collectionId":collectionID}});
        }

        if(hasImageChanged){
            const storage = new Storage();
            if(collection?.value?.collections[0]?.coverImage?.name)
            await storage.bucket(`${process.env.GCS_BUCKET}`).file(collection?.value.collections[0].coverImage.name).delete();
        }

        res.status(200).send({
            status:"success",
            data: collection?.value 
        })

    } catch (error:any) {
        const values = Object.values(req.files !== undefined ? req.files: {});
        if(values[0][0])
        {
            const storage = new Storage();
            await storage.bucket(`${process.env.GCS_BUCKET}`).file(values[0][0].filename).delete();
        }
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}