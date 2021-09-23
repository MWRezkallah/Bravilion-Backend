import { Request, Response } from "express";
import { ProductRepository } from "../../../../../repositories";

export const getProducts = async (req: Request, res: Response) => {
    try {
        const prodRepo = new ProductRepository();
        const products = await prodRepo.getAllProducts();
        res.status(200).send({
            status:"Success",
            data: products
        })
    } catch (error) {
        res.status(400).send({
            status:"Error",
            message:error
        })
    }
}