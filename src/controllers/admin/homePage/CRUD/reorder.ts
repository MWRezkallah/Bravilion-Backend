import { ObjectId } from "bson"
import { Request, Response } from "express"
import { HomePageRepository } from "../../../../repositories"

export const reorderSections = async (req:Request, res:Response)=>{
    try {
        if(!req.body.sections) throw new Error("please provide the sections")
        const updates =
        (req.body.sections as Array<{"id":string, order:string}>).map(section => {
            return {
                        updateOne:{
                            "filter":{"_id":new ObjectId(section.id)},
                            "update":{$set: {"order": Number(section.order), "modifiedBy":{admin:res.locals.admin._id, at:new Date()}} }
                        }
                    }
        });
        const homePageRepo = new HomePageRepository();
        if(!homePageRepo.collection) await homePageRepo.initCollection();
        const results = await homePageRepo.collection?.bulkWrite(updates,{ordered:false})

        res.status(200).send({
            status:"Success",
            message:`${results?.modifiedCount} documents modified succussfully!`
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            Message:error.message
        })
    }
}