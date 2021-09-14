import { ObjectId } from "bson";
import { Response, Request } from "express"
import { ManufacturerRepository } from "../../../repositories";
import * as Storage from '@google-cloud/storage';
import { ProductRepository } from "../../../repositories";
export const deleteFamily = async (req: Request, res: Response) =>{

    try {

        
        if(!req.params.familyId ) throw new Error("please provide a family ID")

        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const familyID = new ObjectId(req.params.familyId);

        const family = await manuRepo.collection?.findOneAndUpdate({$and:[{"_id":new ObjectId(res.locals.manufacturer._id)},{"families.familyId":familyID}]}, 
                {  $pull:{"families":{"familyId":familyID}}},
                {projection:{"manufacturerId":"$_id","_id":0, "families":{$elemMatch:{"familyId":familyID}}}}
             )


        const prodRepo = new ProductRepository();
        if(!prodRepo.collection) await prodRepo.initCollection();
        await prodRepo.collection?.updateMany({$and:[{"ownerId":new ObjectId(res.locals.manufacturer._id)},{"familyId":familyID}]},
            {$pull:{"familyId":familyID}})

        const storage = new Storage();
        if(family?.value.families[0].coverImage.name)
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(family?.value.families[0].coverImage.name).delete();

            res.status(200).send({
            status:"success",
            data: family?.value 
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}