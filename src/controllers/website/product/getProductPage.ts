import { ObjectId } from "bson"
import { Response, Request } from "express"
import { ProductRepository } from "../../../repositories"



export const getProductFull = async (req: Request, res: Response) => {
    try {
        const productId = new ObjectId(req.params.productId);
        const prodRepo = new ProductRepository();
        
        const product = await prodRepo.getProductFull(productId);
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