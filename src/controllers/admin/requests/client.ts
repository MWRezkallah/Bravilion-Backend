import { ObjectId } from "bson";
import { request, Request, Response } from "express";
import { ClientRepository } from "../../../repositories";

export  const getRequestsByStatusForClient = async (req:Request, res:Response) => {
    try {
        let filter = {}
        if(req.body.status) {filter={"requests.orders.status":new RegExp(req.body.status,"i")}}
        let clientFilter = {}
        if(req.params.clientId){
            clientFilter =   {
                    "_id":new ObjectId(req.params.clientId)
                }
        }
        const clientRepo = new ClientRepository()
        if(!clientRepo.collection) await clientRepo.initCollection();
        const requests = await clientRepo.collection?.aggregate([
              {"$match":clientFilter},
                {
                  '$unwind': {
                    'path': '$requests'
                  }
                }, {
                  '$unwind': {
                    'path': '$requests.orders'
                  }
                },{"$match":filter}
                , {
                  '$lookup': {
                    'from': 'Product', 
                    'localField': 'requests.orders.productId', 
                    'foreignField': '_id', 
                    'as': 'requests.orders.product'
                  }
                }, {
                  '$unwind': {
                    'path': '$requests.orders.product'
                  }
                }, {
                  '$group': {
                    '_id': {"reqId":'$requests.requestId', "clientId":"_id"}, 
                    'orders': {
                      '$push': '$requests.orders'
                    }
                  }
                }, {
                  '$project': {
                    'requestId': '$_id.reqId',
                    "clientId":"$_id.clientId", 
                    '_id': 0, 
                    'orders': 1
                  }
                }
        ]).toArray();
  
        res.status(200).send({
            status:"Success",
            data:requests
        })
  
    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
  }
  