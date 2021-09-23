import { Request, Response } from "express";
import { HomePageRepository } from "../../../../repositories";
import { ObjectId } from "bson";

export const deleteHomePageSection = async (req:Request, res:Response) => {
    try {
        if(!req.params.sectionId) throw new Error("please provide a section Id")
        const sectionID = new ObjectId(req.params.sectionId)
        const homePageRepo = new HomePageRepository()
        if(!homePageRepo.collection) await homePageRepo.initCollection();
        const homePage = await homePageRepo.collection?.deleteOne({"_id":sectionID});
        if(!(homePage?.result.ok == 1)) throw new Error(`couldn't delete section with id: ${sectionID}`)
        res.status(200).send({
            status:"Success",
            message:`home-page section with id: ${sectionID} deleted successfully!`
        }) 
    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}