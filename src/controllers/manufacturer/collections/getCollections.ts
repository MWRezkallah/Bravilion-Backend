import { ObjectId } from "bson";
import { Response, Request } from "express"
import { ManufacturerRepository } from "../../../repositories";

export const getCollections = async (req: Request, res: Response) =>{

    try {

        const query = (res.locals.manufacturer._id ) ? {"_id":new ObjectId(res.locals.manufacturer._id)} : {};
        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const collections:any = await manuRepo.collection?.find(query, {projection:{"_id":0, "collections":1}}).toArray()
        
        res.status(200).send({
            status:"success",
            data: collections[0]?.collections || []
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}


export const getCollection = async (req: Request, res: Response) =>{

    try {

        
        if(!req.params.collectionId ) throw new Error("please provide a collection ID")
        const query = (res.locals.manufacturer._id ) ? {"_id":new ObjectId(res.locals.manufacturer._id)} : {};

        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const collectionID = new ObjectId(req.params.collectionId);
        const collections = await manuRepo.collection?.aggregate([{$match:{...query,"collections.collectionId":collectionID}},
             {$project:{"_id":0,
              "collections":{$filter:{
                input:"$collections",
                as:"collection",
                cond:{$eq:["$$collection.collectionId",collectionID]}}}}
            },
            {$unwind:"$collections"},
            {$lookup:{
                from:"Product",
                localField:"collections.collectionId",
                foreignField:"collectionId",
                as:"collections.products"
            }},
            {$replaceRoot:{newRoot:"$collections"}}
        ]).toArray()
        res.status(200).send({
            status:"success",
            data: collections
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}