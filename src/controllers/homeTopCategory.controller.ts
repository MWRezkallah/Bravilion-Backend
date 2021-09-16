import { ObjectId } from "bson"
import { Request, Response } from "express"
import { HomeTopCategoryRepository, CategoryRepository } from "../repositories"
export const createHomeTopCategory = async (req: Request, res: Response) => {

    try {
        const categories = [].concat(req.body.category).map(cat => {return {"category": new ObjectId(cat)}})
        console.log(categories)
        console.log(req.body.category)
        const homeTopCat =  new HomeTopCategoryRepository()
        if(!homeTopCat.collection) await homeTopCat.initCollection();
        const result = await homeTopCat.collection?.insertMany(categories)

        res.status(200).send({
            status:"Success",
            message:result
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
        
    }

}

export const getHomeTopCategory = async (req: Request, res: Response) => {

    try {
        const homeTopCat =  new HomeTopCategoryRepository()
        if(!homeTopCat.collection) await homeTopCat.initCollection();
        const categories = await homeTopCat.getHomeTopCategories();

        res.status(200).send({
            status:"Success",
            data:categories
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
        
    }

}


export const getHomeExcludedTopCategory = async (req: Request, res: Response) => {

    try {
        const homeTopCat =  new CategoryRepository()
        if(!homeTopCat.collection) await homeTopCat.initCollection();
        const categories = await homeTopCat.getHomeTopCategoriesExcluded();

        res.status(200).send({
            status:"Success",
            data:categories
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
        
    }

}

export const updateHomeTopCategory = async (req: Request, res: Response) => {

    try {
        const categories = [].concat(req.body.category).map(cat => {return {"category": new ObjectId(cat)}})
        const homeTopCat =  new HomeTopCategoryRepository()
        if(!homeTopCat.collection) await homeTopCat.initCollection();
        await homeTopCat.collection?.deleteMany({})
        const result = await homeTopCat.collection?.insertMany(categories);

        res.status(200).send({
            status:"Success",
            message:result
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
        
    }

}

export const deleteHomeTopCategory = async (req: Request, res: Response) => {

    try {
        let filter ={}
        if(req.params.id)
        {filter =  {"category":new ObjectId(req.params.id)}}
        const homeTopCat =  new HomeTopCategoryRepository()
        if(!homeTopCat.collection) await homeTopCat.initCollection();
        const result = await homeTopCat.collection?.deleteMany(filter)

        res.status(200).send({
            status:"Success",
            message:result
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
        
    }

}