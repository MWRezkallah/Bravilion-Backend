import { ObjectId } from "bson";
import { Response, Request } from "express"
import { extractImageModel } from "../../../lib";
import { ManufacturerRepository } from "../../../repositories";
import * as Storage from '@google-cloud/storage';
import { ProductRepository } from "../../../repositories";
export const updateFamily = async (req: Request, res: Response) =>{

    try {

        
        if(!req.params.familyId ) throw new Error("please provide a family ID")


        const values = Object.values(req.files !== undefined ? req.files: {});
        const familyID = new ObjectId(req.params.familyId);
        let update = {  $set:{"families.$":{"familyId":familyID, ...req.body}}}
        let hasImageChanged = false;

        if(values[0][0].filename){
            const coverImage = extractImageModel(values[0][0])
            update = {  $set:{"families.$":{familyId:familyID, coverImage,name:req.body.name}}}
            hasImageChanged = true;
        }
        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();

        const family = await manuRepo.collection?.findOneAndUpdate({$and:[{"_id":new ObjectId(res.locals.manufacturer._id)},{"families.familyId":familyID}]}, 
                update,
                {projection:{"manufacturerId":"$_id","_id":0, "families":{$elemMatch:{"familyId":familyID}}}}
             )

        if(req.body.products){
            const products = (req.body.products as Array<string>).map(product => new ObjectId(product));
            const prodRepo = new ProductRepository();
            if(!prodRepo.collection) await prodRepo.initCollection();
            await prodRepo.collection?.updateMany({$and:[{"_id":{$in:products}},{"ownerId":new ObjectId(res.locals.manufacturer._id)}]},
                {$push:{"familyId":familyID}});
            
            await prodRepo.collection?.updateMany({$and:[{"_id":{$nin:products}},{"familyId":familyID},{"ownerId":new ObjectId(res.locals.manufacturer._id)}]},
                {$pull:{"familyId":familyID}});
        }

        if(hasImageChanged){
            const storage = new Storage();
            if(family?.value?.collections[0]?.coverImage?.name)
            await storage.bucket(`${process.env.GCS_BUCKET}`).file(family?.value.families[0].coverImage.name).delete();
        }

        res.status(200).send({
            status:"success",
            data: family?.value 
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