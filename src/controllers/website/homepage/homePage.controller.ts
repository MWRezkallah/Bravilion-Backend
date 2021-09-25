import { Request, Response } from "express";
import { HomePageRepository, HomePageAssetsRepository } from "../../../repositories";

export const getHomePageAssets = async (req:Request, res:Response)=>{
    try {
        const homePageRepo = new HomePageAssetsRepository();
        if(!homePageRepo.collection) await homePageRepo.initCollection();
        const homePageAssets = await homePageRepo.collection?.findOne({},{projection:{"_id":0}});
        res.status(200).send({
            status: "Success",
            data: homePageAssets
        })
    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}

export const getHomePageSections = async (req:Request, res:Response) => {
    try {
        const homePageRepo = new HomePageRepository()
        if(!homePageRepo.collection) await homePageRepo.initCollection();
        const homePage = await homePageRepo.collection?.find().sort({"order":1}).toArray();
        res.status(200).send({
            status:"Success",
            data:homePage
        }) 
    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}