import { ObjectId } from "mongodb";
import { IRepository, Repository } from ".";
import { IProduct } from "../models/IProduct";

export class ProductRepository extends Repository<IProduct> implements IRepository<IProduct> {

    collectionName="Product";
    constructor(){
        super();
    }

    async simplifiedProduct(id:string){
        
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
                    localField:"supplier",
                    foreignField:"_id",
                    as: "supplierInfo"
                }
            },
            {
                   $match:{
                        $and:[{"_id":new ObjectId (id)}]
                   }
            },
            {
                $project:{
                    _id:1,
                    name:1,
                    description:1,
                    logo:1,
                    price:1,
                    afterSalePrice:1,
                    badges:"$badgeInfo",
                    categories:"$categoryInfo.name",
                    supplier:"$supplierInfo.name"

                }
            }
        ]).toArray();

    }


    async simplifiedProducts(){
            
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
                    localField:"supplier",
                    foreignField:"_id",
                    as: "supplierInfo"
                }
            },
            {
                $project:{
                    _id:1,
                    name:1,
                    description:1,
                    logo:1,
                    price:1,
                    afterSalePrice:1,
                    badges:"$badgeInfo",
                    categories:"$categoryInfo",
                    supplier:"$supplierInfo"

                }
            }
        ]).toArray();
    }
}