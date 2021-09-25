import { Request, Response } from "express";
import { ObjectId } from "bson";
import { ManufacturerRepository } from "../../../repositories";
export const getFamily = async (req: Request, res: Response) =>{

    try {

        
        if(!req.params.familyId ) throw new Error("please provide a family ID")

        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const familyID = new ObjectId(req.params.familyId);
        const family = await manuRepo.collection?.aggregate([{$match:{"families.familyId":familyID}},
             {$project:{
              "families":{$filter:{
                input:"$families",
                as:"family",
                cond:{$eq:["$$family.familyId",familyID]}}}}
            },
            {$unwind:"$families"},
            {$lookup:{
                from:"Product",
                localField:"families.familyId",
                foreignField:"familyId",
                as:"families.products"
            }},
        {
            $replaceRoot:{newRoot:"$families"}
        }]).toArray()
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



export const getFamilies = async (req: Request, res: Response) =>{

    try {

        const manufacturerID = (req.params.manufacturerId ) ? {"_id":new ObjectId(req.params.manufacturerId)} : {};
        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const families = await manuRepo.collection?.aggregate([
            {$match:manufacturerID},{$unwind:"$families"},
            {$replaceRoot:{"newRoot":"$families"}}
        ]).toArray()
        
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

