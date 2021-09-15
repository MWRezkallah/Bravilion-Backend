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
            coverImage: coverImageData,
            level: Number.parseInt(req.body.level) || 0,
        }
        if(req.body.parentCategoryId)
        {
            data["parentCategoryId"]= new ObjectId(req.body.parentCategoryId)
        }
        const re = await CategoryRepo.create(data);


    
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


        const prevCoverImage = category.coverImage;
        
        
        
        const values = Object.values(req.files !== undefined ? req.files: {});

        const coverImageData = extractImageModel(values[0][0], prevCoverImage.createdAt);
        
        const data:ICategory = {
            name: {
                arabic:req.body.arabicName,
                english: req.body.englishName
            },
            coverImage: coverImageData,
            level:  Number.parseInt(req.body.level) || Number.parseInt(category.level) || 0,
        }
        if(req.body.parentCategoryId)
        {
            data["parentCategoryId"]= new ObjectId(req.body.parentCategoryId)
        }
        
        let re = await CategoryRepo.update(_id,data);
        
        
                const storage = new Storage();
                await storage.bucket(`${process.env.GCS_BUCKET}`).file(prevCoverImage.name).delete();

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
        
        const prevCoverImage = category.coverImage.name;
        
        
        await CategoryRepo.delete(_id);
        await CategoryRepo.collection?.updateMany({"parentCategoryId":new ObjectId(_id)}, {$unset:{"parentCategoryId":""}})
        
                const storage = new Storage();
                await storage.bucket(`${process.env.GCS_BUCKET}`).file(prevCoverImage).delete();
    
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