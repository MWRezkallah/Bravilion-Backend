/* eslint-disable space-before-blocks */
import { Repository } from "./base/repository";
import { IRepository } from "./base/iRepository";
import { ICategory } from "../models";
import { ObjectId } from "bson";


export class CategoryRepository extends Repository<ICategory> implements IRepository<ICategory>{


    collectionName = 'Category';

    constructor() {
        super();
    } 


    async getCategory(id:string){
        
        if (!this.collection) {
            await this.initCollection();
        }

       return await this.collection?.aggregate([
           
           {
                   $match:{
                        "_id":new ObjectId (id)
                   }
            },
           {
                $lookup:{
                    from:"Category",
                    localField:"_id",
                    foreignField: "parentCategoryId",
                    as:"subCategories"
                },
            },
            {$project:{"subCategories.parentCategoryId":0}}
        ]).toArray();

    }

    async getCategories(){
        
        if (!this.collection) {
            await this.initCollection();
        }

       return await this.collection?.aggregate([
           {
                $lookup:{
                    from:"Category",
                    localField:"_id",
                    foreignField: "parentCategoryId",
                    as:"subCategories"
                },
            },
            {$project:{"subCategories.parentCategoryId":0}}

        ]).toArray();

    }

}