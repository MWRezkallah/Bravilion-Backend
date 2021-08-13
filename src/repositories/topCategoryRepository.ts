import { Repository, IRepository } from ".";
import { ITopCategory } from "../models";
import { ObjectId } from "mongodb";


export class TopCategoryRepository extends Repository<ITopCategory> implements IRepository<ITopCategory>{

    collectionName = 'TopCategory';
    constructor(){
        super();
    }

    async getTopCategories(){
        if (!this.collection) {
            await this.initCollection();
        }

       return await this.collection?.aggregate([
            {
                $lookup:{
                    from:"Category",
                    localField:"categoryId",
                    foreignField: "_id",
                    as:"TopCategories"
                },
            }
        ]).toArray();
    }
 
    async getTopCategory(id:string){
        
        if (!this.collection) {
            await this.initCollection();
        }

       return await this.collection?.aggregate([
            {
                $lookup:{
                    from:"Category",
                    localField:"categoryId",
                    foreignField: "_id",
                    as:"TopCategory"
                },
            },
            {
                   $match:{
                        $and:[{"_id":new ObjectId (id)}]
                   }
            }
        ]).toArray();

    }
}