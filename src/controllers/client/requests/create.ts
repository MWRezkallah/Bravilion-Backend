import { ObjectId } from "bson";
import { Request, Response } from "express";
import { IClient } from "../../../models";
import { ClientRepository } from "../../../repositories";

export const createRequest = async (req:Request, res:Response) => {
    try {
    
        const clientId = new ObjectId(res.locals.client._id);
        const requestId = new ObjectId();
        let request:any = {
            requestId:requestId
        }
        if(req.body.orders && req.body.orders.length>0){
           request["orders"] = (req.body.orders as Array<{productId:ObjectId, quantity:Number, status:string, manufacturerId:ObjectId}>).map(request=>{
                return {
                    orderId:new ObjectId(),
                    productId:new ObjectId(request.productId), 
                    quantity:Number.parseInt(`${request.quantity || 1}`),
                    status:"pending",
                    manufacturerId:new ObjectId(request.manufacturerId) }
           }) 
        }

        const clientRepo = new ClientRepository();
        if(!clientRepo.collection) await clientRepo.initCollection();
        const result = await clientRepo.collection?.findOneAndUpdate({"_id":clientId},{$push:{"requests":{...request}}}, {projection:{"_id":1}});
        
        res.status(200).send({
            status:"Success",
            message:`a request has been issued for ${res.locals.client.name.english} / ${res.locals.client.name.arabic}`,
            data:{"clientID":result?.value._id, "requestID":requestId}
        })
    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}