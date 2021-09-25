import { ObjectId } from "bson"
import { Response, Request } from "express"
import { ProductRepository } from "../../../repositories"

export const searchForProduct = async (req: Request, res: Response) => {
    try {
        const prodRepo = new ProductRepository();
        const pipeline:any = [];
        if(req.body.name) {
            pipeline.push(
                {
                    $match:{
                        $or:[
                            {"name.arabic":new RegExp(req.body.name,"i")},
                            {"name.english":new RegExp(req.body.name, "i")}
                        ]
                    }
                })
        }
        if(req.body.categories) {
            const categories = ([].concat(req.body.categories) as Array<string>).map(category => new ObjectId(category));
            pipeline.push(
                {
                    $match:{
                        "categories":{$in:[...categories]}
                    }
                })
        }
        const products = await prodRepo.aggregate(pipeline);
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
