import { Request, Response } from "express";
import { ObjectId } from "bson";
import { ClientRepository } from "../../../repositories";

export const updateRequest = async (req:Request, res:Response) => {
    try {
        const manufacturerID = new ObjectId(res.locals.manufacturer._id);
        if(!req.body.status) throw new Error("please provide a status for the order!")
        const status = req.body.status
        if(!req.params.requestId) throw new Error("please provide a request ID!")
        if(!req.params.orderId) throw new Error("please provide an order ID!")
        const requestID =  new ObjectId(req.params.requestId)
        const orderID =  new ObjectId(req.params.orderId)
        const clientRepo = new ClientRepository()            
        if(!clientRepo.collection) await clientRepo.initCollection()
        const request = await clientRepo.collection?.findOneAndUpdate({
            "requests.requestId":requestID,
            "requests.orders.manufacturerId":manufacturerID,
             "requests.orders.orderId":orderID
        },{$set:{
            "requests.$[request].orders.$[order].status":status
        }},{projection:{"requests":{$filter:{input:"$requests", cond:{$eq:["$$this.requestId",requestID]}}}}
        , arrayFilters:[
            {"request.requestId":requestID},
            {"order.orderId":orderID}
        ]})
        if(request?.ok == 1){
            res.status(200).send({
                status:"Success",
                data:request.value.requests
            })
        }else{
        res.status(500).send({
            status:"Error",
            message:`failed to update the order status to: ${status}` 
        })}

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}