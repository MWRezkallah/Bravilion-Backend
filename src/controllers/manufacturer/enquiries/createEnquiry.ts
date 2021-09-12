import { ObjectId } from "bson";
import { Response, Request } from "express"
import { ManufacturerRepository } from "../../../repositories";

export const createEnquiry = async (req: Request, res: Response) =>{

    try {

        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const enquiryID = new ObjectId()
        const updatedData = await manuRepo.collection?.findOneAndUpdate({"_id":new ObjectId(res.locals.manufacturer._id)},
             {$push:{"enquiries":{"enquiryId": enquiryID, ...req.body}}}, {projection:{"_id":1 }})
        
        res.status(200).send({
            status:"success",
            message:`a enquiry has  been created successfully for ${res.locals.manufacturer.name}`,
            data: {"manufacturerID":updatedData?.value._id, enquiryID}
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}