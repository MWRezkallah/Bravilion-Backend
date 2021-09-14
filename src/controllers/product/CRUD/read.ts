import { ObjectId } from "bson"
import { Response, Request } from "express"
import { ProductRepository } from "../../../repositories"

export const getProduct = async (req: Request, res: Response) => {
    try {
        const productId = new ObjectId(req.params.productId);
        const prodRepo = new ProductRepository();
        const product = await prodRepo.getProduct(productId);
        res.status(200).send({
            status:"Success",
            data: product
        })
    } catch (error) {
        res.status(400).send({
            status:"Error",
            message:error
        })
    }
}

export const getProducts = async (req: Request, res: Response) => {
    try {
        const prodRepo = new ProductRepository();
        const products = await prodRepo.getProducts();
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