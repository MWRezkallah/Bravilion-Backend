import { ObjectId } from "bson";
import { Response, Request } from "express"
import { ManufacturerRepository } from "../../../../../repositories";

export const getManufacturers = async (req: Request, res: Response) =>{

    try {

        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const collections = await manuRepo.collection?.aggregate([
            {
                $lookup:{
                    from:"Product",
                    localField:"_id",
                    foreignField:"ownerId",
                    as:"Products"
                }
            },
            {$project:{"tokens":0, "password":0}}
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

