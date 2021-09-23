import { Request, Response } from "express";
import { HomePageRepository } from "../../../../repositories";
import { IHomePageSection } from "../../../../models";
import { ObjectId } from "bson";

export const getHomePageSection = async (req:Request, res:Response) => {
    try {
        if(!req.params.sectionId) throw new Error("please provide a sectionId")
        const sectionID = new ObjectId(req.params.sectionId)
        const homePageRepo = new HomePageRepository()
        if(!homePageRepo.collection) await homePageRepo.initCollection();
        const homePage = await homePageRepo.collection?.findOne({"_id":sectionID});
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

export const getHomePageSections = async (req:Request, res:Response) => {
    try {
        const sectionID = new ObjectId(req.params.sectionId)
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