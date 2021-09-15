/* eslint-disable space-before-blocks */
import { Repository } from "./base/repository";
import { IRepository } from "./base/iRepository";
import { IHomeTopCategory } from "../models";
import { ObjectId } from "bson";


export class HomeTopCategoryRepository extends Repository<IHomeTopCategory> implements IRepository<IHomeTopCategory>{


    collectionName = 'HomeTopCategory';

    constructor() {
        super();
    } 


    async getHomeTopCategories(){
        
        if (!this.collection) {
            await this.initCollection();
        }

       return await this.collection?.aggregate([
        
            {
              '$lookup': {
                'from': 'Category', 
                'localField': 'category', 
                'foreignField': '_id', 
                'as': 'HomeTopCategory'
              }
            }, {
              '$unwind': {
                'path': '$HomeTopCategory'
              }
            }, {
              '$lookup': {
                'from': 'Category', 
                'localField': 'HomeTopCategory._id', 
                'foreignField': 'parentCategoryId', 
                'as': 'HomeTopCategory.subCategories'
              }
            }, {
              '$project': {
                'HomeTopCategory.subCategories.parentCategoryId': 0, 
                'category': 0, 
                '_id': 0
              }
            }, {
              '$replaceRoot': {
                'newRoot': '$HomeTopCategory'
              }
            }
          
        ]).toArray();

    }

    


}