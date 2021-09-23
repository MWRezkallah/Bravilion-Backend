import { Request, Response } from 'express'
import { CategoryRepository } from '../../../../../repositories/categoryRepository';

export const getAllCategories = async (req: Request, res: Response) => {
    try{
        const CategoryRepo = new CategoryRepository();

        const categories = await CategoryRepo.getCategories();
        res.status(200).send({
            status: 'success',
            data: categories,
        });
    }catch(e){
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
}
