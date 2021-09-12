import { ObjectId } from "bson";
import { Response, Request } from "express"
import { extractPdfModel } from "../../../lib";
import { ManufacturerRepository } from "../../../repositories";
import * as Storage from '@google-cloud/storage';

export const createCatalogue = async (req: Request, res: Response) =>{

    try {

        const values = Object.values(req.files !== undefined ? req.files: {});
        const pdf = extractPdfModel(values[0][0])
        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const catalogueID = new ObjectId()
        const updatedData = await manuRepo.collection?.findOneAndUpdate({"_id":new ObjectId(res.locals.manufacturer._id)},
             {$push:{"catalogues":{"catalogueId": catalogueID, pdf , ...req.body}}}, {projection:{"_id":1 }})
        
        res.status(200).send({
            status:"success",
            message:`a catalogue has  been created successfully for ${res.locals.manufacturer.name}`,
            data: {"manufacturerID":updatedData?.value._id, catalogueID}
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