import { Request, Response } from 'express'
import { HomePageAssetsRepository } from '../repositories';
import * as Storage from '@google-cloud/storage';
import { extractImageModel } from '../lib/index';
import { ObjectId } from 'bson';


export const createHomePage = async (req: Request, res: Response) => {
    
    try{
        const homePageRepo = new HomePageAssetsRepository();

        const values = Object.values(req.files !== undefined ? req.files: {});
        let homePage = {...req.body}
        values.forEach(file => {
                //  Object.fromEntries([[`${file.fieldname}`, extractImageModel(file)]])
                homePage[`${file.fieldname}`]= extractImageModel(file);
        })
        
        if(!homePageRepo.collection) await homePageRepo.initCollection();
        const homep = await homePageRepo.collection?.findOne({});
        let result;
        if (homep){
            result = await homePageRepo.collection?.replaceOne({},{...homePage});
            const storage = new Storage();
            for (let i in homep){
                if(homep[i].name && homep[i].path && homep[i].type && homep[i].createdAt){
                    await storage.bucket(`${process.env.GCS_BUCKET}`).file(homep[i].name).delete();
                }
            }
        }else {
            result = await homePageRepo.collection?.insertOne({...homePage})
        }

        
        res.status(200).send({
            status: 'success',
            data: result
        });

    }catch(e){
        res.status(400).send({
            err:e
        });
    }
};

export const getHomePages = async (req: Request, res: Response) => {
    try{
        const homePageRepo = new HomePageAssetsRepository();

        const homePages = await homePageRepo.findAll();
    
        res.status(200).send({
            status: 'success',
            data: homePages
        });
    }catch(e){
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
}


export const getHomePage = async (req: Request, res: Response) => {
    try{
        const homePageRepo = new HomePageAssetsRepository();
        const _id = req.params.id;
        const homePage = await homePageRepo.findOne(_id);
    
        res.status(200).send({
            status: 'success',
            data: homePage
        });
    }catch(e){
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
}

export const updateHomePage = async (req: Request, res: Response) => {
    
    try{
        const homePageRepo = new HomePageAssetsRepository();

        const _id = req.params.id;
        const homePage:any = await homePageRepo.findOne(_id);
        
        // const prevDesktopImage = slider.desktopImage.path;
        // const prevMobileImage  = slider.mobileImage.path;
        // unlinkSync(prevDesktopImage);
        // unlinkSync(prevMobileImage);

  
        
        
        const values = Object.values(req.files !== undefined ? req.files: {});
        
        
        let updatedHomePage = {...req.body}
        values.forEach(file => {
            //  Object.fromEntries([[`${file.fieldname}`, extractImageModel(file)]])
            updatedHomePage[`${file.fieldname}`]= extractImageModel(file);
        })
        
        const re = await homePageRepo.collection?.replaceOne({"_id":new ObjectId(_id)}, updatedHomePage);
        
        const storage = new Storage();
        for (let i in homePage){
            if(homePage[i].name && homePage[i].path && homePage[i].type && homePage[i].createdAt){
                await storage.bucket(`${process.env.GCS_BUCKET}`).file(homePage[i].name).delete();
            }
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

export const deleteHomePage = async (req: Request, res: Response) => {
    try{
        const homePageRepo = new HomePageAssetsRepository();
        const _id = req.params.id;
        const homePage:any = await homePageRepo.findOne(_id);
  
        
        
        
        await homePageRepo.delete(_id);
        
        const storage = new Storage();
        for (let i in homePage){
            if(homePage[i].name && homePage[i].path && homePage[i].type && homePage[i].createdAt){
                await storage.bucket(`${process.env.GCS_BUCKET}`).file(homePage[i].name).delete();
            }
        }
    
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