import { ObjectId } from "bson"
import { Response, Request } from "express"
import { ProductRepository } from "../../../repositories"
import { IProduct } from "../../../models"
import { extractImageModel } from "../../../lib"
export const createProduct = async (req: Request, res: Response) => {
    try {
        const files = Object.values(req.files?req.files:{});
        let product:IProduct={
            ownerId : new ObjectId(res.locals.manufacturer._id),
            name : {arabic:req.body.arabicName, english:req.body.englishName},
            coverImage: extractImageModel(files[0][0]),
            views:0,
        };
        req.body.properties?  product["properties"] = req.body.properties:{};
        req.body.families? product["familyId"] = ((req.body.families as Array<string>).map(family => new ObjectId(family))):[];
        req.body.collectionId? product["collectionId"]= (req.body.collections as Array<string>).map(collection => new ObjectId(collection)) : [];
        req.body.projectsId? product["projectsId"] = (req.body.projects as Array<string>).map(project => new ObjectId(project)): [];
        req.body.categories? product["categories"] = (req.body.categories as Array<string>).map(category => new ObjectId(category)) : [];
        if(files[1]) {product["gallery"] = (files[1] as Array<Express.Multer.File>).map( file => extractImageModel(file)) ;}
        const prodRepo = new ProductRepository();
        const result = await prodRepo.create(product);
        
        res.status(200).send({
            status:"Success",
            data:{productId: result}
        })

        
    } catch (error) {
        
        res.status(400).send({
            status:"Error",
            message:error
        })
    }
}