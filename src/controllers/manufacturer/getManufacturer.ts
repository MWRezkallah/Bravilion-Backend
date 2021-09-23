import { ObjectId } from "bson";
import { Response, Request } from "express"
import { ManufacturerRepository } from "../../repositories";

export const getManufacturer = async (req: Request, res: Response) =>{

    try {

        const manufacturerID = (req.params.manufacturerId ) ? {"_id":new ObjectId(req.params.manufacturerId)} : {};
        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const collections = await manuRepo.collection?.aggregate([
            {$match:manufacturerID},
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


export const getManufacturerInfo = async (req: Request, res: Response) =>{

    try {

        const manufacturerID = {"_id":new ObjectId(res.locals.manufacturer._id)};
        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const collections = await manuRepo.collection?.aggregate([
            {$match:manufacturerID},
            {$project:{"_id":1, "name":1, "logo":1, "header":1, "about":1, "contactInfo":1, "email":1}}
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

