import { Request, Response } from "express";
import { ObjectId } from "bson";
import { ManufacturerRepository } from "../../../repositories";


export const getManufacturerProducts = async (req: Request, res: Response) =>{

    try {

        const manufacturerID = (req.params.manufacturerId ) ? {"_id":new ObjectId(req.params.manufacturerId)} : {};
        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const products = await manuRepo.collection?.aggregate([
            {$match:manufacturerID},
            {
                $lookup:{
                    from:"Product",
                    localField:"_id",
                    foreignField:"ownerId",
                    as:"Products"
                }
            },
            {$unwind:"$Products"},
            {$replaceRoot:{"newRoot":"$Products"}}
        ]).toArray()
        
        res.status(200).send({
            status:"success",
            data: products
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}