import { ObjectId } from "bson";
import { Request, Response } from "express";
import { ManufacturerRepository } from "../../../repositories";

export const getRequests = async (req:Request, res:Response)=>{
    try {
        const manufacturerId = new ObjectId(res.locals.manufacturer._id)
        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection()
        const requests = await manuRepo.collection?.aggregate([
            {
                $match:{
                    "_id":manufacturerId
                }
            },
                {
                  '$lookup': {
                    'from': 'Client', 
                    'localField': '_id', 
                    'foreignField': 'requests.orders.manufacturerId', 
                    'as': 'clients'
                  }
                }, {
                  '$unwind': {
                    'path': '$clients'
                  }
                }, {
                  '$unwind': {
                    'path': '$clients.requests'
                  }
                }, {
                  '$project': {
                    'requestId': '$clients.requests.requestId', 
                    'requests': {
                      '$filter': {
                        'input': '$clients.requests.orders', 
                        'cond': {
                          '$eq': [
                            '$$this.manufacturerId', '$_id'
                          ]
                        }
                      }
                    }
                  }
                }, {
                  '$unwind': {
                    'path': '$requests'
                  }
                }, {
                  '$lookup': {
                    'from': 'Product', 
                    'localField': 'requests.productId', 
                    'foreignField': '_id', 
                    'as': 'requests.product'
                  }
                }, {
                  '$unwind': {
                    'path': '$requests.product'
                  }
                }, {
                  '$group': {
                    '_id': {
                      'manufacturerId': '$_id', 
                      'requestId': '$requestId'
                    }, 
                    'orders': {
                      '$push': '$requests'
                    }
                  }
                }, {
                  '$replaceRoot': {
                    'newRoot': {
                      'requestId': '$_id.requestId', 
                      'orders': '$orders'
                    }
                  }
                }
          ]).toArray()

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

export const getRequest = async (req:Request, res:Response)=>{
    try {
        if(!req.params.requestId) throw new Error("please provide a request ID!")
        const requestID = new ObjectId(req.params.requestId)
        const manufacturerId = new ObjectId(res.locals.manufacturer._id)
        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection()
        const requests = await manuRepo.collection?.aggregate([
            {
                $match:{
                    "_id":manufacturerId
                }
            },
            
                {
                  '$lookup': {
                    'from': 'Client', 
                    'localField': '_id', 
                    'foreignField': 'requests.orders.manufacturerId', 
                    'as': 'clients'
                  }
                }, {
                  '$unwind': {
                    'path': '$clients'
                  }
                }, {
                  '$unwind': {
                    'path': '$clients.requests'
                  }
                }, {
                  '$project': {
                    'requestId': '$clients.requests.requestId', 
                    'requests': {
                      '$filter': {
                        'input': '$clients.requests.orders', 
                        'cond': {
                          '$eq': [
                            '$$this.manufacturerId', '$_id'
                          ]
                        }
                      }
                    }
                  }
                }, {
                  '$match': {
                    'requestId': requestID
                  }
                }, {
                  '$unwind': {
                    'path': '$requests'
                  }
                }, {
                  '$lookup': {
                    'from': 'Product', 
                    'localField': 'requests.productId', 
                    'foreignField': '_id', 
                    'as': 'requests.product'
                  }
                }, {
                  '$unwind': {
                    'path': '$requests.product'
                  }
                }, {
                  '$group': {
                    '_id': {
                      'manufacturerId': '$_id', 
                      'requestId': '$requestId'
                    }, 
                    'orders': {
                      '$push': '$requests'
                    }
                  }
                }, {
                    $unwind:"$orders"
                },{
                  '$replaceRoot': {
                    'newRoot':'$orders'
                  }
                }
              
          ]).toArray()

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

