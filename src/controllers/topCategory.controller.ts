import { Request, Response  } from "express";
import { ITopCategory } from "../models";
import { TopCategoryRepository, CategoryRepository } from "../repositories/";
import { ObjectId } from "bson";

export const createTopCategory = async (req: Request, res: Response) => {
    try {
        const topCatRepo = new TopCategoryRepository();
        const topcategory:ITopCategory ={
            name:req.body.name,
        }
        if(req.body.parent) topcategory["parent"] = new ObjectId(req.body.parent);
        req.body.childern? topcategory["childern"] = ((req.body.childern as Array<string>).map(child => new ObjectId(child))):[];

        const topCat  = await topCatRepo.create(topcategory);

        res.status(200).send({
            status:"Success",
            data: topCat
        });

    } catch (error) {
        res.status(400).send({
            status:"Error",
            message:error.message
        });
    }
}

export const getTopCategories = async(req:Request, res: Response) => {
    try {
        const topCatRepo = new TopCategoryRepository();
        const topCategories = await topCatRepo.getTopCategories();
        res.status(200).send({
            status:"success",
            data:topCategories
        });
    } catch (error) {
        res.status(400).send({
            status:"Error",
            message:error.message
        });
    }
}
export const getTopCategory = async(req:Request, res: Response) => {
    try {
        const topCatRepo = new TopCategoryRepository();
        const topCategory = await topCatRepo.getTopCategory(req.params.id);
        res.status(200).send({
            status:"success",
            data:topCategory
        });
    } catch (error) {
        res.status(400).send({
            status:"Error",
            message:error.message
        });
    }
}
export const updateTopCategory = async (req: Request, res: Response)=>{
    try {
        const topCatID = new ObjectId(req.params.id);
        const topCatRepo = new TopCategoryRepository();
        const topcategory:ITopCategory ={
            name:req.body.name,
        }
        if(req.body.parent) topcategory["parent"] = new ObjectId(req.body.parent);
        req.body.childern? topcategory["childern"] = ((req.body.childern as Array<string>).map(child => new ObjectId(child))):[];

     

        if(!topCatRepo.collection) await topCatRepo.initCollection();
        const topCat  = await topCatRepo.collection?.findOneAndUpdate({"_id":topCatID}, {$set:{...topcategory}});

        

        res.status(200).send({
            status:"Success",
            data:  topCat?.value
        });
        
    
    } catch (error) {
        res.status(400).send({
            status:"Error",
            message:error.message
        });
    }
}

export const deleteTopCategory = async (req:Request, res:Response) => {
    try {
        const topCatRepo = new TopCategoryRepository();
        if(!topCatRepo.collection) await topCatRepo.initCollection();
        await topCatRepo.collection?.deleteOne({"_id":new ObjectId(req.params.id)});
        res.status(200).send({
            status:"success",
            message:`category with id: ${req.params.id} deleted successfully`
        })

    } catch (error) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}