import { Repository, IRepository } from ".";
import { ITopCategory } from "../models";
import { ObjectId } from "bson";


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
            '$lookup': {
              'from': 'Category', 
              'localField': 'parent', 
              'foreignField': '_id', 
              'as': 'parent'
            }
          }, {
            '$unwind': {
              'path': '$parent'
            }
          }, {
            '$lookup': {
              'from': 'Category', 
              'localField': 'childern', 
              'foreignField': '_id', 
              'as': 'childern'
            }
          }, {
            '$unwind': {
              'path': '$childern'
            }
          }, {
            '$lookup': {
              'from': 'Category', 
              'localField': 'childern._id', 
              'foreignField': 'parentCategoryId', 
              'as': 'childern.subCatgories'
            }
          }, {
            '$group': {
              '_id': {
                '_id': '$_id', 
                'parent': '$parent', 
                'name': '$name'
              }, 
              'childern': {
                '$push': '$childern'
              }
            }
          }, {
            '$project': {
              '_id': '$_id._id', 
              'parent': '$_id.parent', 
              'name': '$_id.name', 
              'childern': '$childern'
            }
          }
        
        ]).toArray();
    }
 
    async getTopCategory(id:string){
        
        if (!this.collection) {
            await this.initCollection();
        }

       return await this.collection?.aggregate([

        
          {
            '$match': {
              '_id': new ObjectId(id)
            }
          }, {
            '$lookup': {
              'from': 'Category', 
              'localField': 'parent', 
              'foreignField': '_id', 
              'as': 'parent'
            }
          }, {
            '$unwind': {
              'path': '$parent'
            }
          }, {
            '$lookup': {
              'from': 'Category', 
              'localField': 'childern', 
              'foreignField': '_id', 
              'as': 'childern'
            }
          }, {
            '$unwind': {
              'path': '$childern'
            }
          }, {
            '$lookup': {
              'from': 'Category', 
              'localField': 'childern._id', 
              'foreignField': 'parentCategoryId', 
              'as': 'childern.subCatgories'
            }
          }, {
            '$group': {
              '_id': {
                '_id': '$_id', 
                'parent': '$parent', 
                'name': '$name'
              }, 
              'childern': {
                '$push': '$childern'
              }
            }
          }, {
            '$project': {
              '_id': '$_id._id', 
              'parent': '$_id.parent', 
              'name': '$_id.name', 
              'childern': '$childern'
            }
          }
        
        ]).toArray();

    }
}