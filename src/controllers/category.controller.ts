import { Request, Response } from 'express'
import { CategoryRepository } from '../repositories/categoryRepository';
import { ICategory } from '../models';
import { extractImageModel } from '../lib';
import * as Storage from '@google-cloud/storage';
import { ObjectId } from 'bson';



export const createCategory = async (req: Request, res: Response) => {
    
    try{
        const CategoryRepo = new CategoryRepository();

        const values = Object.values(req.files !== undefined ? req.files: {});
        const coverImageData = extractImageModel(values[0][0]);
        const data:ICategory = {
            name: {
                arabic:req.body.arabicName,
                english: req.body.englishName
            },
            cover: coverImageData,
            level:req.body.level || 0
        }
        const re = await CategoryRepo.create(data);
        if(req.body.parentCategories){
            const parentCategories = (req.body.parentCategories as Array<string>).map(category => new ObjectId(category))
            const filter = {"_id":new ObjectId(re)}
            const updateDocs = {$addToSet:{"parentCategoryId":{$each:parentCategories}}}
            const cat = await CategoryRepo.collection?.updateMany(filter, updateDocs)
        }

    
        res.status(200).send({
            status: 'success',
            data: re,
        });
    }catch(e){
        res.status(400).send({
            err:e
        });
    }
};

export const getAllCategories = async (req: Request, res: Response) => {
    try{
        const CategoryRepo = new CategoryRepository();

        const categories = await CategoryRepo.getCategories();
        res.status(200).send({
            status: 'success',
            data: categories,
        });
    }catch(e){
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
}


export const getCategory = async (req: Request, res: Response) => {
    try{
        const CategoryRepo = new CategoryRepository();
        const _id = req.params.id;
        const category = await CategoryRepo.getCategory(_id)
    
        res.status(200).send({
            status: 'success',
            data: category,
        });
    }catch(e){
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    
    try{
        const CategoryRepo = new CategoryRepository();

        const _id = req.params.id;
            
        const category:any = await CategoryRepo.findOne(_id);


        const prevCoverImage = category.cover;

        const storage = new Storage();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(prevCoverImage.name).delete();



        const values = Object.values(req.files !== undefined ? req.files: {});

        const coverImageData = extractImageModel(values[0][0], prevCoverImage.createdAt);

        const data:ICategory = {
            name: {
                arabic:req.body.arabicName,
                english: req.body.englishName
            },
            cover: coverImageData,
            level:  req.body.level || category.level || 0
        }
        
        let re = await CategoryRepo.update(_id,data);
        if (req.body.parentCategories !== undefined ){
            const parentCategories = (req.body.parentCategories as Array<string>).map(category => new ObjectId(category))
            const filter = {"_id":new ObjectId(_id)}
            const updateDocs = {$set:{"parentCategoryId":parentCategories}}
            const cat = await CategoryRepo.collection?.updateMany(filter, updateDocs)
        }

        res.status(200).send({
            status: 'success',
            data: re
        });
    }catch(e){
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try{
        const CategoryRepo = new CategoryRepository();
        const _id = req.params.id;
        const category:any = await CategoryRepo.findOne(_id);
        
        const prevCoverImage = category.cover.name;

        const storage = new Storage();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(prevCoverImage).delete();

        
        await CategoryRepo.delete(_id);
        await CategoryRepo.collection?.updateMany({"parentCategoryId":new ObjectId(_id)}, {$pull:{"parentCategoryId":new ObjectId(_id)}})
    
        res.status(200).send({
            status: 'successfully delete',
        });
    }catch(e){
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
}

export const getAllCategoriesOptions = async (req: Request, res: Response) => {
    try{
        const CategoryRepo = new CategoryRepository();

        const categories = await CategoryRepo.getCategoriesOptions();
        res.status(200).send({
            status: 'success',
            data: categories,
        });
    }catch(e){
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
}