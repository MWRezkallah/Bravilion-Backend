import { ObjectId } from "bson";
import { Response, Request } from "express"
import { ManufacturerRepository } from "../../../repositories";

export const updateEnquiry = async (req: Request, res: Response) =>{

    try {

        
        if(!req.params.enquiryId ) throw new Error("please provide a enquiry ID")

        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const enquiryID = new ObjectId(req.params.enquiryId);

        const enquiry = await manuRepo.collection?.findOneAndUpdate({$and:[{"_id":new ObjectId(res.locals.manufacturer._id)},{"enquiries.enquiryId":enquiryID}]}, 
                {  $set:{"enquiries.$":{enquiryId:enquiryID, name:req.body.name, question:req.body.question, answer:req.body.answer}}},
                {projection:{"manufacturerId":"$_id","_id":0, "enquiries":{$elemMatch:{"enquiryId":enquiryID}}}}
             )

        res.status(200).send({
            status:"success",
            data: enquiry?.value 
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}