import { Request, Response } from 'express'
import { CategoryRepository } from '../repositories/categoryRepository';
import { ICategory } from '../models';
import { extractImageModel } from '../lib';
import * as Storage from '@google-cloud/storage';



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
            cover: coverImageData   
        }

        const re = await CategoryRepo.create(data);
        

    
        res.status(200).send({
            status: 'success',
            data: re
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

        const categories = await CategoryRepo.findAll();
        res.status(200).send({
            status: 'success',
            data: categories
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
        const slider = await CategoryRepo.findOne(_id);
    
        res.status(200).send({
            status: 'success',
            data: slider
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
            cover: coverImageData   
        }
        
        const re = await CategoryRepo.update(_id,data);
        

    
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