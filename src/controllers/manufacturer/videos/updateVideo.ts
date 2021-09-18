import { ObjectId } from "bson";
import { Response, Request } from "express"
import { ManufacturerRepository } from "../../../repositories";

export const updateVideo = async (req: Request, res: Response) =>{

    try {

        
        if(!req.params.videoId ) throw new Error("please provide a video ID")

        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const videoID = new ObjectId(req.params.videoId);

        const video = await manuRepo.collection?.findOneAndUpdate({$and:[{"_id":new ObjectId(res.locals.manufacturer._id)},{"videos.videoId":videoID}]}, 
                {  $set:{"videos.$":{videoId:videoID, name:req.body.name,
                url:req.body.url, description:req.body.description}}},
                {projection:{"manufacturerId":"$_id","_id":0, "videos":{$elemMatch:{"videoId":videoID}}}}
             )

        res.status(200).send({
            status:"success",
            data: video?.value 
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}