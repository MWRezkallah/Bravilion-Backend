import { ObjectId } from "bson";
import { Response, Request } from "express"
import { ManufacturerRepository } from "../../../repositories";
import * as Storage from '@google-cloud/storage';
import {IFile} from '../../../models'
import { ProductRepository } from "../../../repositories";


export const deleteProject = async (req: Request, res: Response) =>{

    try {

        
        if(!req.params.projectId ) throw new Error("please provide a project ID")

        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const projectID = new ObjectId(req.params.projectId);

        const project = await manuRepo.collection?.findOneAndUpdate({$and:[{"_id":new ObjectId(res.locals.manufacturer._id)},{"projects.projectId":projectID}]}, 
                {  $pull:{"projects":{"projectId":projectID}}},
                {projection:{"manufacturerId":"$_id","_id":0, "projects":{$elemMatch:{"projectId":projectID}}}}
             )



             const prodRepo = new ProductRepository();
             if(!prodRepo.collection) await prodRepo.initCollection();
             await prodRepo.collection?.updateMany({$and:[{"ownerId":new ObjectId(res.locals.manufacturer._id)},{"projectsId":projectID}]},
                 {$pull:{"projectsId":projectID}})

             if(project?.ok == 1){
                const storage = new Storage();
                if(project.value.coverImage){
                    await storage.bucket(`${process.env.GCS_BUCKET}`).file(project.value.coverImage.name).delete();            
                }
                if(project.value.images && project.value.images.length>0){
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