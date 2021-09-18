import { ObjectId } from "bson";
import { Response, Request } from "express"
import { ManufacturerRepository } from "../../../repositories";

export const getVideos = async (req: Request, res: Response) =>{

    try {

        const query = (req.params.manufacturerId ) ? {"_id":new ObjectId(req.params.manufacturerId)} : {};
        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const videos:any = await manuRepo.collection?.find(query, {projection:{"_id":0, "videos":1}}).toArray()
        
        res.status(200).send({
            status:"success",
            data: videos[0]?.videos || []
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}


export const getVideo = async (req: Request, res: Response) =>{

    try {

        
        if(!req.params.videoId ) throw new Error("please provide a video ID")

        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const videoID = new ObjectId(req.params.videoId);
        const videos:any = await manuRepo.collection?.find({"videos.videoId":videoID}, {projection:{"_id":0, "videos":{$elemMatch:{"videoId":videoID}}}}).toArray()

        res.status(200).send({
            status:"success",
            data: videos[0]?.videos || []
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}