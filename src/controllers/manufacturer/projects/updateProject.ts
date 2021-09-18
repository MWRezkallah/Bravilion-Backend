import { ObjectId } from "bson";
import { Response, Request } from "express"
import { ManufacturerRepository } from "../../../repositories";
import { IProject } from "../../../models";
import { extractImageModel } from "../../../lib";
import * as Storage from '@google-cloud/storage';
import {IFile} from '../../../models'
import { ProductRepository } from "../../../repositories";


export const updateProject = async (req: Request, res: Response) =>{

    try {

        
        if(!req.params.projectId ) throw new Error("please provide a project ID")

        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const projectID = new ObjectId(req.params.projectId);
        const files = Object.values(req.files ? req.files : {} );

        const updatedProject:IProject = {"projectId": projectID}
        if(req.body.name){ updatedProject["name"] ={arabic:req.body.arabicName, english:req.body.englishName};}
        if(req.body.smallDescription){ updatedProject["smallDescription"] = req.body.smallDescription;}
        if(req.body.longDescription){ updatedProject["longDescription"] = req.body.longDescription;}
        if(req.body.productsId){
            const products = (req.body.productsId as Array<string>).map(product => new ObjectId(product));
            const prodRepo = new ProductRepository();
            if(!prodRepo.collection) await prodRepo.initCollection();
            await prodRepo.collection?.updateMany({$and:[{"_id":{$in:products}},{"ownerId":new ObjectId(res.locals.manufacturer._id)}]},
                {$push:{"projectsId":projectID}});
            
            await prodRepo.collection?.updateMany({$and:[{"_id":{$nin:products}},{"projectsId":projectID},{"ownerId":new ObjectId(res.locals.manufacturer._id)}]},
                {$pull:{"projectsId":projectID}});
        }

        if(files[0][0]){ updatedProject["coverImage"] = extractImageModel(files[0][0]);}
        if(files[1] ) {
             updatedProject["images"] = (files[1] as Array<Express.Multer.File>).map( (file,i) => {
                return {image:extractImageModel(file),
                        description: req.body?.descriptions[i] || ""}
                });
    } 

        const project = await manuRepo.collection?.findOneAndUpdate({$and:[{"_id":new ObjectId(res.locals.manufacturer._id)},{"projects.projectId":projectID}]}, 
                {  $set:{"projects.$":updatedProject}},
                {projection:{"manufacturerId":"$_id","_id":0, "projects":{$elemMatch:{"projectId":projectID}}}}
             )

             if(project?.ok == 1){
                const storage = new Storage();
                if(project.value.coverImage){
                    await storage.bucket(`${process.env.GCS_BUCKET}`).file(project.value.coverImage.name).delete();            
                }
                if(files[1] && project.value.images && project.value.images.length>0){
                    (project.value.images as Array<IFile>).map(async image =>
                        await storage.bucket(`${process.env.GCS_BUCKET}`).file(image.name).delete())
                    }
            }

        res.status(200).send({
            status:"success",
            data: project?.value 
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}