import { ObjectId } from "mongodb";
import { IRepository, Repository } from ".";
import { IProductDetails } from "../models/oldproductDetails.model";

export class ProductDetailsRepository extends Repository<IProductDetails> implements IRepository<IProductDetails> {

    collectionName="ProductDetails";
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
                $lookup:{
                    from:"Supplier",
                    localField:"suppliers",
                    foreignField:"_id",
                    as: "supplierInfo"
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
            },
            {
                $lookup:{
                    from:"Supplier",
                    localField:"suppliers",
                    foreignField:"_id",
                    as: "supplierInfo"
                }
            }
        ]).toArray();
    }
}