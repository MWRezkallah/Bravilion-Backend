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
        const iconImage = extractImageModel(values[1][0]);
        const data:ICategory = {
            name: {
                arabic:req.body.arabicName,
                english: req.body.englishName
            },
            cover: coverImageData,
            icon: iconImage,
            level:req.body.level || 0
        }
        const re = await CategoryRepo.create(data);
        const subCategories = (req.body.subCategories as Array<string>).map(category => new ObjectId(category))
        const filter = {"_id":{$in:subCategories}}
        const updateDocs = {$addToSet:{"parentCategoryId":new ObjectId(re)}}
        const cat = await CategoryRepo.collection?.updateMany(filter, updateDocs)

    
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
        const prevIconImage = category.icon;

        const storage = new Storage();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(prevCoverImage.name).delete();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(prevIconImage.name).delete();



        const values = Object.values(req.files !== undefined ? req.files: {});

        const coverImageData = extractImageModel(values[0][0], prevCoverImage.createdAt);
        const iconImage = extractImageModel(values[1][0], prevIconImage.createdAt);

        const data:ICategory = {
            name: {
                arabic:req.body.arabicName,
                english: req.body.englishName
            },
            cover: coverImageData,
            icon: iconImage,
            level: category.level || req.body.level || 0
        }
        
        let re = await CategoryRepo.update(_id,data);
        if (req.body.subCategories !== undefined ){
            const subCategories = (req.body.subCategories as Array<string>).map(category => new ObjectId(category))
            const filter = {"_id":{$in:subCategories}}
            const updateDocs = {$addToSet:{"parentCategoryId":new ObjectId(_id)}}
            let cat = await CategoryRepo.collection?.updateMany(filter, updateDocs)
            cat = await CategoryRepo.collection?.updateMany(
                {$and:[
                    {"_id":{$nin:subCategories}},
                    {"parentCategoryId":new ObjectId(_id)}
                ]},
                {$pull:{"parentCategoryId":new ObjectId(_id)}}                
            ) 
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
        const prevIconImage = category.icon.name;

        const storage = new Storage();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(prevCoverImage).delete();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(prevIconImage).delete();

        
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