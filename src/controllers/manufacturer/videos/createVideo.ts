import { ObjectId } from "bson";
import { Response, Request } from "express"
import { ManufacturerRepository } from "../../../repositories";

export const createVideo = async (req: Request, res: Response) =>{

    try {

        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const videoID = new ObjectId()
        const updatedData = await manuRepo.collection?.findOneAndUpdate({"_id":new ObjectId(res.locals.manufacturer._id)},
             {$push:{"videos":{"videoId": videoID, name:req.body.name,
            url:req.body.url, description:req.body.description}}}, {projection:{"_id":1 }})
        
        res.status(200).send({
            status:"success",
            message:`video created for ${res.locals.manufacturer.name}`,
            data: {"manufacturerID":updatedData?.value._id, videoID}
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}