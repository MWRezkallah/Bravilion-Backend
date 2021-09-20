import { ObjectId } from "bson";
import { Response, Request } from "express"
import { ClientRepository } from "../../../repositories";

export const deleteRequest = async (req: Request, res: Response) =>{

    try {

        
        if(!req.params.requestId ) throw new Error("please provide a request ID")

        const clientRepo = new ClientRepository()
        if(!clientRepo.collection) await clientRepo.initCollection();
        const requestID = new ObjectId(req.params.requestId);

        const request = await clientRepo.collection?.findOneAndUpdate({$and:[{"_id":new ObjectId(res.locals.client._id)},{"requests.requestId":requestID}]}, 
                {  $pull:{"requests":{"requestId":requestID}}},
                {projection:{"clientId":"$_id","_id":0, "requests":{$elemMatch:{"requestId":requestID}}}}
             )

        res.status(200).send({
            status:"success",
            data: request?.value 
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}