import { ObjectId } from "mongodb";
import { IRepository, Repository } from ".";
import { IProduct } from "../models/product.model";

export class ProductRepository extends Repository<IProduct> implements IRepository<IProduct> {

    collectionName="Product";
    constructor(){
        super();
    }

    async getProduct(id:string){
        
        if (!this.collection) {
            await this.initCollection();
        }

       return await this.collection?.aggregate([
            {
                $lookup:{
                    from:"Badge",
                    localField:"badges",
                    foreignField: "_id",
                    as:"badgeInfo"
                },
            },
            {
                $lookup:{
                    from: "Category",
                    localField:"categories",
                    foreignField:"_id",
                    as:"categoryInfo"
                }
            },
            {
                   $match:{
                        $and:[{"_id":new ObjectId (id)}]
                   }
            }
        ]).toArray();

    }


    async getProducts(){
            
        if (!this.collection) {
            await this.initCollection();
        }

       return await this.collection?.aggregate([
            {
                $lookup:{
                    from:"Badge",
                    localField:"badges",
                    foreignField: "_id",
                    as:"badgeInfo"
                },
            },
            {
                $lookup:{
                    from: "Category",
                    localField:"categories",
                    foreignField:"_id",
                    as:"categoryInfo"
                }
            }
        ]).toArray();
    }
}