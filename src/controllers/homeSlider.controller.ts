import { unlinkSync } from 'fs';
import { Request, Response } from 'express'
import { HomeSliderRepository } from '../repositories/HomeSliderRepository';
import { IHomeSlider } from '../models';

import { extractImageModel } from '../lib/index';



export const createHomeSlider = async (req: Request, res: Response) => {
    
    try{
        const homeSliderRepo = new HomeSliderRepository();

        const values = Object.values(req.files !== undefined ? req.files: {});
        const desktopImageData = extractImageModel(values[0][0]);
        const mobileImageData  = extractImageModel(values[1][0]);

        const data:IHomeSlider = {
            header: req.body.header,
            subHeader: req.body.subHeader,
            desktopImage: desktopImageData,
            mobileImage: mobileImageData
        }

        const re = await homeSliderRepo.create(data);
        

    
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

export const getAllHomeSliders = async (req: Request, res: Response) => {
    try{
        const homeSliderRepo = new HomeSliderRepository();

        const sliders = await homeSliderRepo.findAll();
    
        res.status(200).send({
            status: 'success',
            data: sliders
        });
    }catch(e){
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
}


export const getHomeSlider = async (req: Request, res: Response) => {
    try{
        const homeSliderRepo = new HomeSliderRepository();
        const _id = req.params.id;
        const slider = await homeSliderRepo.findOne(_id);
    
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

export const updateHomeSlider = async (req: Request, res: Response) => {
    
    try{
        const homeSliderRepo = new HomeSliderRepository();

        const _id = req.params.id;
        const slider:any = await homeSliderRepo.findOne(_id);
        
        // const prevDesktopImage = slider.desktopImage.path;
        // const prevMobileImage  = slider.mobileImage.path;
        // unlinkSync(prevDesktopImage);
        // unlinkSync(prevMobileImage);

        const prevDesktopImage = slider.desktopImage;
        const prevMobileImage  = slider.mobileImage;
        unlinkSync(prevDesktopImage.path);
        unlinkSync(prevMobileImage.path);


        const values = Object.values(req.files !== undefined ? req.files: {});

        // const desktopImageData = extractImageModel(values[0][0]);
        // const mobileImageData  = extractImageModel(values[1][0]);
        const desktopImageData = extractImageModel(values[0][0], prevDesktopImage.createdAt);
        const mobileImageData  = extractImageModel(values[1][0], prevMobileImage.createdAt);

        const data:IHomeSlider = {
            header: req.body.header,
            subHeader: req.body.subHeader,
            desktopImage: desktopImageData,
            mobileImage: mobileImageData
        }
        
        const re = await homeSliderRepo.update(_id,data);
        

    
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

export const deleteHomeSlider = async (req: Request, res: Response) => {
    try{
        const homeSliderRepo = new HomeSliderRepository();
        const _id = req.params.id;
        const slider:any = await homeSliderRepo.findOne(_id);
        
        const prevDesktopImage = slider.desktopImage.path;
        const prevMobileImage  = slider.mobileImage.path;
        unlinkSync(prevDesktopImage);
        unlinkSync(prevMobileImage);
        
        await homeSliderRepo.delete(_id);
    
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