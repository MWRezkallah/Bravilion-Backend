import { ObjectId } from "bson";
import { Response, Request } from "express"
import { ManufacturerRepository } from "../../../repositories";
import { IProject } from "../../../models";
import { extractImageModel } from "../../../lib";
import { ProductRepository } from "../../../repositories";

export const createProject = async (req: Request, res: Response) =>{

    try {
        const files = Object.values(req.files ? req.files : {} );
        const manuRepo = new ManufacturerRepository()
        const projectID = new ObjectId()
        const project:IProject = {"projectId": projectID}
        if(req.body.name){ project["name"] ={arabic: req.body.arabicName, english:req.body.englishName};}
        if(req.body.smallDescription){ project["smallDescription"] = req.body.smallDescription;}
        if(req.body.longDescription){ project["longDescription"] = req.body.longDescription;}
        if(req.body.productsId){
            const products = (req.body.productsId as Array<string>).map(product => new ObjectId(product));
            const prodRepo = new ProductRepository();
            if(!prodRepo.collection) await prodRepo.initCollection();
            await prodRepo.collection?.updateMany({$and:[{"_id":{$in:products}},{"ownerId":new ObjectId(res.locals.manufacturer._id)}]},
               {$push:{"projectsId":projectID}});
       }

        if(files[0][0]){ project["coverImage"] = extractImageModel(files[0][0]);}
        if(files[1] ) {
             project["images"] = (files[1] as Array<Express.Multer.File>).map( (file,i) => {
                return {image:extractImageModel(file),
                        description: req.body?.descriptions[i] || ""}
                });
    } 
        if(!manuRepo.collection) await manuRepo.initCollection();
        const updatedData = await manuRepo.collection?.findOneAndUpdate({"_id":new ObjectId(res.locals.manufacturer._id)},
             {$push:{"projects":project}}, {projection:{"_id":1 }})
        
        res.status(200).send({
            status:"success",
            message:`a project has  been created successfully for ${res.locals.manufacturer.name}`,
            data: {"manufacturerID":updatedData?.value._id, projectID}
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}