import { ObjectId } from "bson";
import { Response, Request } from "express"
import { extractImageModel } from "../../../lib";
import { ManufacturerRepository } from "../../../repositories";
import * as Storage from '@google-cloud/storage';
import { ProductRepository } from "../../../repositories";

export const createFamily = async (req: Request, res: Response) =>{

    try {

        const values = Object.values(req.files !== undefined ? req.files: {});
        const coverImage = extractImageModel(values[0][0])
        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const familyID = new ObjectId()
        const family = {
            familyId: familyID,
             coverImage,
             name:req.body.name
        };
        
        const updatedData = await manuRepo.collection?.findOneAndUpdate({"_id":new ObjectId(res.locals.manufacturer._id)},
        {$push:{"families":family}}, {projection:{"_id":1 }})

        if(req.body.products){
             const products = (req.body.products as Array<string>).map(product => new ObjectId(product));
             const prodRepo = new ProductRepository();
             if(!prodRepo.collection) await prodRepo.initCollection();
             await prodRepo.collection?.updateMany({$and:[{"_id":{$in:products}},{"ownerId":new ObjectId(res.locals.manufacturer._id)}]},
                {$push:{"familyId":familyID}});
        }
        
        res.status(200).send({
            status:"success",
            message:`a family has  been created successfully for ${res.locals.manufacturer.name}`,
            data: {"manufacturerID":updatedData?.value._id, familyID}
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