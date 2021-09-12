import { ObjectId } from "bson";
import { Response, Request } from "express"
import { ManufacturerRepository } from "../../../repositories";
import * as Storage from '@google-cloud/storage';

export const deleteCatalogue = async (req: Request, res: Response) =>{

    try {

        
        if(!req.params.catalogueId ) throw new Error("please provide a catalogue ID")

        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const catalogueID = new ObjectId(req.params.catalogueId);

        const catalogue = await manuRepo.collection?.findOneAndUpdate({$and:[{"_id":new ObjectId(res.locals.manufacturer._id)},{"catalogues.catalogueId":catalogueID}]}, 
                {  $pull:{"catalogues":{"catalogueId":catalogueID}}},
                {projection:{"manufacturerId":"$_id","_id":0, "catalogues":{$elemMatch:{"catalogueId":catalogueID}}}}
             )

        const storage = new Storage();
        if(catalogue?.value.catalogues[0].pdf.name)
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(catalogue?.value.catalogues[0].pdf.name).delete();

            res.status(200).send({
            status:"success",
            data: catalogue?.value 
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}