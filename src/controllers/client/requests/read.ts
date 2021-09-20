import { ObjectId } from "bson";
import { request, Request, Response } from "express";
import { ClientRepository } from "../../../repositories";

export  const getRequests = async (req:Request, res:Response) => {
    try {
        const clientID = new ObjectId(res.locals.client._id)
        const clientRepo = new ClientRepository()
        if(!clientRepo.collection) await clientRepo.initCollection();
        const requests = await clientRepo.collection?.aggregate([
                {
                    $match:{
                        "_id":clientID
                    }
                },
                {
                  '$unwind': {
                    'path': '$requests'
                  }
                }, {
                  '$unwind': {
                    'path': '$requests.orders'
                  }
                }, {
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
                    '_id': '$requests.requestId', 
                    'orders': {
                      '$push': '$requests.orders'
                    }
                  }
                }, {
                  '$project': {
                    'requestId': '$_id', 
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

export  const getRequest = async (req:Request, res:Response) => {
    try {
        const clientID = new ObjectId(res.locals.client._id)
        if(!req.params.requestId) throw new Error ("please provide a request id!")
        const requestID = new ObjectId(req.params.requestId)
        const clientRepo = new ClientRepository()
        if(!clientRepo.collection) await clientRepo.initCollection();
        const requests = await clientRepo.collection?.aggregate([
                {
                    $match:{
                        "_id":clientID
                    }
                },
                {
                  '$unwind': {
                    'path': '$requests'
                  }
                }, {
                  '$unwind': {
                    'path': '$requests.orders'
                  }
                }, {
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
                    '_id': '$requests.requestId', 
                    'orders': {
                      '$push': '$requests.orders'
                    }
                  }
                }, {
                    $match:{
                        "_id":requestID
                    }
                },{
                  '$project': {
                    'requestId': '$_id', 
                    '_id': 0, 
                    'orders': 1
                  }
                },
                {
                    $unwind:"$orders"
                },{
                    $replaceRoot:{newRoot:"$orders"}
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