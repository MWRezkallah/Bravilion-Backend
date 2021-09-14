import { ObjectId } from "bson";
import { Repository, IRepository } from ".";
import { IProduct } from "../models";

export class ProductRepository extends Repository<IProduct> implements IRepository<IProduct>{

    collectionName = "Product";
    constructor(){
        super();
    }

    getProduct = async (id:ObjectId)=>{
        if(! this.collection) await this.initCollection();
        await this.collection?.updateOne({"_id":id}, {$inc:{"views":1}});
        return await this.collection?.aggregate([
            {$match:{"_id":id}}
        ]).toArray()
    }
    getProducts = async ()=>{
        if(! this.collection) await this.initCollection();
        return await this.collection?.aggregate().toArray()
    }
}