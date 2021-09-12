import { ObjectId } from "bson";
import { Response, Request } from "express"
import { ManufacturerRepository } from "../../../repositories";

export const updateProject = async (req: Request, res: Response) =>{

    try {

        
        if(!req.params.projectId ) throw new Error("please provide a project ID")

        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const projectID = new ObjectId(req.params.projectId);

        const project = await manuRepo.collection?.findOneAndUpdate({$and:[{"_id":new ObjectId(res.locals.manufacturer._id)},{"projects.projectId":projectID}]}, 
                {  $set:{"projects.$":{projectId:projectID, ...req.body}}},
                {projection:{"manufacturerId":"$_id","_id":0, "projects":{$elemMatch:{"projectId":projectID}}}}
             )

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