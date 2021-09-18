import { ObjectId } from "bson";
import { Response, Request } from "express"
import { ManufacturerRepository } from "../../../repositories";

export const getEnquiryies = async (req: Request, res: Response) =>{

    try {

        const query = (req.params.manufacturerId ) ? {"_id":new ObjectId(req.params.manufacturerId)} : {};
        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const enquiries:any = await manuRepo.collection?.find(query, {projection:{"manufacturerId":"$_id","_id":0, "enquiries":1}}).toArray()
        
        res.status(200).send({
            status:"success",
            data: enquiries[0]?.enquiries || []
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}


export const getEnquiry = async (req: Request, res: Response) =>{

    try {

        
        if(!req.params.enquiryId ) throw new Error("please provide a enquiry ID")

        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const enquiryID = new ObjectId(req.params.enquiryId);
        const enquiries:any = await manuRepo.collection?.find({"enquiries.enquiryId":enquiryID}, {projection:{"manufacturerId":"$_id","_id":0, "enquiries":{$elemMatch:{"enquiryId":enquiryID}}}}).toArray()
        res.status(200).send({
            status:"success",
            data: enquiries[0]?.enquiries || []
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}