import { Request, Response } from "express";
import { ObjectId } from "bson";
import { ManufacturerRepository } from "../../../repositories";



export const getManufacturer = async (req: Request, res: Response) =>{

    try {

        const manufacturerID = (req.params.manufacturerId ) ? {"_id":new ObjectId(req.params.manufacturerId)} : {};
        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const manufacturer = await manuRepo.collection?.aggregate([
            {$match:manufacturerID},
            {$project:{"_id":1, "name":1, "logo":1, "header":1, "about":1, "contactInfo":1, "email":1, "enquiries":1 }}
        ]).toArray()
        
        res.status(200).send({
            status:"success",
            data: manufacturer
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}


