import { ObjectId } from "mongodb";
import { IRepository, Repository } from ".";
import { IProductOld } from "../models/oldproduct.model";

export class ProductRepositoryOld extends Repository<IProductOld> implements IRepository<IProductOld> {

    collectionName="ProductOld";
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