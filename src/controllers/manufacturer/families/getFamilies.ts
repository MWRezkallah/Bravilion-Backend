import { ObjectId } from "bson";
import { Response, Request } from "express"
import { ManufacturerRepository } from "../../../repositories";

export const getFamilies = async (req: Request, res: Response) =>{

    try {

        const query = (res.locals.manufacturer._id ) ? {"_id":new ObjectId(res.locals.manufacturer._id)} : {};
        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const families:any = await manuRepo.collection?.find(query, {projection:{"manufacturerId":"$_id","_id":0, "families":1}}).toArray()
        
        res.status(200).send({
            status:"success",
            data: families[0].families || []
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
        const query = (res.locals.manufacturer._id ) ? {"_id":new ObjectId(res.locals.manufacturer._id)} : {};

        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const familyID = new ObjectId(req.params.familyId);
        const family = await manuRepo.collection?.aggregate([{$match:{...query,"families.familyId":familyID}},
             {$project:{"manufacturerId":"$_id","_id":0,
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