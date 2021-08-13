import { Request, Response  } from "express";
import { ITopCategory } from "../models";
import { TopCategoryRepository, CategoryRepository } from "../repositories/";
import { ObjectId } from "mongodb";

export const createTopCategory = async (req: Request, res: Response) => {
    try {
        const topCatRepo = new TopCategoryRepository();
        const catId = new ObjectId(req.body.categoryId)
        const topCategory = await topCatRepo.findOneByQuery({categoryId: catId});
        if (topCategory) throw new Error(`Category with id ${catId} is already exists in top category`);
        const catRepo = new CategoryRepository();
        const category = await catRepo.findOneByQuery({_id: catId})
        if (!category) throw new Error(`Category with id: ${catId}, doesn't exists in the category collection`)
        const topCat = await topCatRepo.create({categoryId:catId})

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
        const catRepo = new CategoryRepository();
        const newCatId = new ObjectId(req.body.categoryId)
        const category = await catRepo.findOneByQuery({_id: newCatId})
        if (!category) throw new Error(`there is no category with id: ${req.body.categoryId} in the category collection`);
        const topCatRepo = new TopCategoryRepository();
        const catId = new ObjectId(req.params.id)
        const topCategory = await topCatRepo.findOneByQuery({categoryId:catId});
        if (!topCategory) throw new Error(`Category with id:${req.params.id} doesn't exists in the top category collection`)
        const updatedTopCategory = await topCatRepo.update(topCategory._id, {categoryId:newCatId})
        res.status(200).send({
            status:"success",
            data: updatedTopCategory
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
        await topCatRepo.deleteByQuery({categoryId: new ObjectId(req.params.id)});
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