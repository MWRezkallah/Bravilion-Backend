import { Request, Response } from "express";
import { ObjectId } from "bson";
import { ManufacturerRepository } from "../../../repositories";



export const getCatalogues = async (req: Request, res: Response) =>{

    try {

        const manufacturerID = (req.params.manufacturerId ) ? {"_id":new ObjectId(req.params.manufacturerId)} : {};
        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const catalogues = await manuRepo.collection?.aggregate([
            {$match:manufacturerID},
            {$unwind:"$catalogues"},
            {$replaceRoot:{"newRoot":"$catalogues"}}
        ]).toArray()
        
        res.status(200).send({
            status:"success",
            data: catalogues
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}


