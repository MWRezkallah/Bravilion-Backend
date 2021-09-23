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
                  '$lookup': {
                    'from': 'Category', 
                    'localField': 'categories', 
                    'foreignField': '_id', 
                    'as': 'categories'
                  }
                }
        ]).toArray()
    }
}