import { Request, Response } from "express";
import { HomePageRepository } from "../../../../repositories";
import { IHomePageSection } from "../../../../models";
import { ObjectId } from "bson";

export const updateHomePageSection = async (req:Request, res:Response) => {
    try {
        if(!req.params.sectionId) throw new Error("please provide a sectionId")
        const sectionID = new ObjectId(req.params.sectionId)
        const homePageSection:IHomePageSection = {
            header:req.body.header,
            isSlider: `${req.body.isSlider}`.toLowerCase() === 'true',
            order: Number(req.body.order),
            sectionType:req.body.sectionType,
            items:req.body.items,
            modifiedBy: {admin:res.locals.admin._id, at:new Date()}
        }
        const homePageRepo = new HomePageRepository()
        if(!homePageRepo.collection) await homePageRepo.initCollection();
        const homePage = await homePageRepo.collection?.findOneAndUpdate({"_id":sectionID}, {$set:{...homePageSection}});
        if(!(homePage?.ok==1)) throw new Error(`couldn't update section with id: ${sectionID}`)
        res.status(200).send({
            status:"Success",
            message:`section with id: ${sectionID} updated successfully!`,
            data:homePage?.value
        }) 
    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}