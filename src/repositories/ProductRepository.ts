import { ObjectId } from "bson";
import { Repository, IRepository } from ".";
import { IProduct } from "../models";

export class ProductRepository extends Repository<IProduct> implements IRepository<IProduct>{

    collectionName = "Product";
    constructor(){
        super();
    }

    getProduct = async (productId:ObjectId, manufacturerId:ObjectId )=>{
        if(! this.collection) await this.initCollection();
        // await this.collection?.updateOne({"_id":productId}, {$inc:{"views":1}});
        return await this.collection?.aggregate([
            {
                $match:{
                    $and:[
                        {"_id":productId},{ownerId:manufacturerId}
                    ]
                }
            },
                {
                  '$lookup': {
                    'from': 'Category', 
                    'localField': 'categories', 
                    'foreignField': '_id', 
                    'as': 'categories'
                  }
                }
              
        ]).toArray()
    }
    getProducts = async (manufacturerId:ObjectId)=>{
        if(! this.collection) await this.initCollection();
        return await this.collection?.aggregate([
            {
                $match:{ownerId:manufacturerId}
            },
                {
                  '$lookup': {
                    'from': 'Category', 
                    'localField': 'categories', 
                    'foreignField': '_id', 
                    'as': 'categories'
                  }
                }
        ]).toArray()
    }
    getAllProducts = async ()=>{
        if(! this.collection) await this.initCollection();
        return await this.collection?.aggregate([
                {
                  $project:{
                    "name":1, "coverImage":1, "_id":1, "ownerId":1, "views":1
                  }
                }
        ]).toArray()
    }
    
    getProductFull= async(productId:ObjectId)=>{
      const pipeline = [
        {
          '$lookup': {
            'from': 'Manufacturer', 
            'localField': 'ownerId', 
            'foreignField': '_id', 
            'as': 'ownerId'
          }
        }, {
          '$unwind': {
            'path': '$ownerId'
          }
        }, {
          '$match': {
            '_id': productId
          }
        }, {
          '$addFields': {
            'families': {
              '$cond': {
                'if': {
                  '$ne': [
                    {
                      '$type': '$familyId'
                    }, 'missing'
                  ]
                }, 
                'then': {
                  '$filter': {
                    'input': '$ownerId.families', 
                    'cond': {
                      '$in': [
                        '$$this.familyId', '$familyId'
                      ]
                    }
                  }
                }, 
                'else': ''
              }
            }, 
            'collections': {
              '$cond': {
                'if': {
                  '$ne': [
                    {
                      '$type': '$collectionId'
                    }, 'missing'
                  ]
                }, 
                'then': {
                  '$filter': {
                    'input': '$ownerId.collections', 
                    'cond': {
                      '$in': [
                        '$$this.collectionId', '$collectionId'
                      ]
                    }
                  }
                }, 
                'else': ''
              }
            }, 
            'projects': {
              '$cond': {
                'if': {
                  '$ne': [
                    {
                      '$type': '$projectId'
                    }, 'missing'
                  ]
                }, 
                'then': {
                  '$filter': {
                    'input': '$ownerId.projects', 
                    'cond': {
                      '$in': [
                        '$$this.projectId', '$projectsId'
                      ]
                    }
                  }
                }, 
                'else': ''
              }
            }, 
            'owner': {
              'ownerId': '$ownerId._id', 
              'name': '$ownerId.name', 
              'logo': '$ownerId.logo', 
              'header': '$ownerId.header', 
              'about': '$ownerId.about', 
              'contactInfo': '$ownerId.contactInfo', 
              'enquiries': '$ownerId.enquiries', 
              'videos': '$ownerId.videos', 
              'catalogues': '$ownerId.catalogues'
            }
          }
        }, {
          '$lookup': {
            'from': 'Product', 
            'let': {
              'famId': '$familyId'
            }, 
            'pipeline': [
              {
                '$match': {
                  '$expr': {
                    '$and': [
                      {
                        '$ne': [
                          {
                            '$type': '$$famId'
                          }, 'missing'
                        ]
                      }, {
                        '$eq': [
                          '$familyId', '$$famId'
                        ]
                      }
                    ]
                  }
                }
              }
            ], 
            'as': 'familyProducts'
          }
        }, {
          '$lookup': {
            'from': 'Product', 
            'let': {
              'collId': '$collectionId'
            }, 
            'pipeline': [
              {
                '$match': {
                  '$expr': {
                    '$and': [
                      {
                        '$ne': [
                          {
                            '$type': '$$collId'
                          }, 'missing'
                        ]
                      }, {
                        '$eq': [
                          '$collectionId', '$$collId'
                        ]
                      }
                    ]
                  }
                }
              }
            ], 
            'as': 'similarProducts'
          }
        }, {
          '$lookup': {
            'from': 'Category', 
            'localField': 'categories', 
            'foreignField': '_id', 
            'as': 'categories'
          }
        }, {
          '$project': {
            'ownerId': 0, 
            'collectionId': 0, 
            'familyId': 0, 
            'projectsId': 0
          }
        }
      ]
    if(! this.collection) await this.initCollection();
      await this.collection?.updateOne({"_id":productId}, {$inc:{"views":1}});
      return await this.collection?.aggregate(pipeline).toArray()
    }

    aggregate = async (pipeline:any)=>{
      if(! this.collection) await this.initCollection();
      return await this.collection?.aggregate(pipeline).toArray()
    }
}