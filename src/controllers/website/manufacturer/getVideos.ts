import { Request, Response } from "express";
import { ObjectId } from "bson";
import { ManufacturerRepository } from "../../../repositories";



export const getVideos = async (req: Request, res: Response) =>{

    try {

        const manufacturerID = (req.params.manufacturerId ) ? {"_id":new ObjectId(req.params.manufacturerId)} : {};
        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const videos = await manuRepo.collection?.aggregate([
            {$match:manufacturerID},
            {$unwind:"$videos"},
            {$replaceRoot:{"newRoot":"$videos"}}
        ]).toArray()
        
        res.status(200).send({
            status:"success",
            data: videos
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}


