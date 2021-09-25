import { Request, Response } from "express";
import { ObjectId } from "bson";
import { ManufacturerRepository } from "../../../repositories";
export const getCollection = async (req: Request, res: Response) =>{

    try {

        
        if(!req.params.collectionId ) throw new Error("please provide a collection ID")

        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const collectionID = new ObjectId(req.params.collectionId);
        const collection = await manuRepo.collection?.aggregate([{$match:{"collections.collectionId":collectionID}},
             {$project:{
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
        {
            $replaceRoot:{newRoot:"$collections"}
        }]).toArray()
        res.status(200).send({
            status:"success",
            data: collection 
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}


export const getCollections = async (req: Request, res: Response) =>{

    try {

        const manufacturerID = (req.params.manufacturerId ) ? {"_id":new ObjectId(req.params.manufacturerId)} : {};
        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const collections = await manuRepo.collection?.aggregate([
            {$match:manufacturerID},{$unwind:"$collections"},
            {$replaceRoot:{"newRoot":"$collections"}}
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

