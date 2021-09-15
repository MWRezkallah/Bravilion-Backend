import { ObjectId } from "bson"
import { Request, Response } from "express"
import { HomeTopCategoryRepository } from "../repositories"
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
        const categories = [].concat(req.body.category).map(cat => new ObjectId(cat))
        const homeTopCat =  new HomeTopCategoryRepository()
        if(!homeTopCat.collection) await homeTopCat.initCollection();
        const result = await homeTopCat.collection?.deleteMany({"category":{$in:categories}})

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