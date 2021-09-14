import { ObjectId } from "bson";
import { Response, Request } from "express"
import { ManufacturerRepository } from "../../../repositories";

export const getFamilies = async (req: Request, res: Response) =>{

    try {

        const query = (req.params.manufacturerId ) ? {"_id":new ObjectId(req.params.manufacturerId)} : {};
        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const families = await manuRepo.collection?.find(query, {projection:{"manufacturerId":"$_id","_id":0, "families":1}}).toArray()
        
        res.status(200).send({
            status:"success",
            data: families
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}


export const getFamily = async (req: Request, res: Response) =>{

    try {

        
        if(!req.params.familyId ) throw new Error("please provide a family ID")

        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const familyID = new ObjectId(req.params.familyId);
        const family = await manuRepo.collection?.aggregate([{$match:{"families.familyId":familyID}},
             {$project:{"manufacturerId":"$_id","_id":0,
              "families":{$filter:{
                input:"$families",
                as:"family",
                cond:{$eq:["$$family.familyId",familyID]}}}}
            },
            {$lookup:{
                from:"Product",
                localField:"families.familyId",
                foreignField:"familyId",
                as:"products"
            }}]).toArray()
        res.status(200).send({
            status:"success",
            data: family 
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}