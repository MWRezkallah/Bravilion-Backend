import { Request, Response } from 'express'
import { CategoryRepository } from '../../../../../repositories/categoryRepository';

export const getAllCategories = async (req: Request, res: Response) => {
    try{
        const CategoryRepo = new CategoryRepository();
        if(!CategoryRepo.collection) await CategoryRepo.initCollection()
        const categories = await CategoryRepo.collection?.find().toArray();
        res.status(200).send({
            status: 'success',
            data: categories
        });
    }catch(e){
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
}
