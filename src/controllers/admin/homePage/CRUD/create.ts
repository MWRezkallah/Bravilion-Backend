import { Request, Response } from "express";
import { HomePageRepository } from "../../../../repositories";
import { IHomePageSection } from "../../../../models";

export const createHomePageSection = async (req:Request, res:Response) => {
    try {
        const homePageSection:IHomePageSection = {
            header:req.body.header,
            isSlider: `${req.body.isSlider}`.toLowerCase() === 'true',
            order: Number(req.body.order),
            sectionType:req.body.sectionType,
            items:req.body.items,
            createdBy: {admin:res.locals.admin._id, at:new Date()}
        }
        const homePageRepo = new HomePageRepository()
        if(!homePageRepo.collection) await homePageRepo.initCollection();
        const homePage = await homePageRepo.collection?.insert(homePageSection);
        res.status(200).send({
            status:"Success",
            message:`home-page section created successfully with id: ${homePage?.insertedIds[0]} and order:${req.body.order}`
        }) 
    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}