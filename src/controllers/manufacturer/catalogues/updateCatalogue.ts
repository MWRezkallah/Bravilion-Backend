import { ObjectId } from "bson";
import { Response, Request } from "express"
import { extractPdfModel } from "../../../lib";
import { ManufacturerRepository } from "../../../repositories";
import * as Storage from '@google-cloud/storage';

export const updateCatalogue = async (req: Request, res: Response) =>{

    try {

        
        if(!req.params.catalogueId ) throw new Error("please provide a catalogue ID")


        const values = Object.values(req.files !== undefined ? req.files: {});
        const catalogueID = new ObjectId(req.params.catalogueId);
        let update = {  $set:{"catalogues.$":{catalogueId:catalogueID, ...req.body}}}
        let hasPdfChanged = false;

        if(values[0][0].filename){
            const pdf = extractPdfModel(values[0][0])
            update = {  $set:{"catalogues.$":{catalogueId:catalogueID, pdf,...req.body}}}
            hasPdfChanged = true;
        }
        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();

        const catalogue = await manuRepo.collection?.findOneAndUpdate({$and:[{"_id":new ObjectId(res.locals.manufacturer._id)},{"catalogues.catalogueId":catalogueID}]}, 
                update,
                {projection:{"manufacturerId":"$_id","_id":0, "catalogues":{$elemMatch:{"catalogueId":catalogueID}}}}
             )

        if(hasPdfChanged){
            const storage = new Storage();
            if(catalogue?.value?.catalogues[0]?.pdf?.name)
            await storage.bucket(`${process.env.GCS_BUCKET}`).file(catalogue?.value.catalogues[0].pdf.name).delete();
        }

        res.status(200).send({
            status:"success",
            data: catalogue?.value 
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