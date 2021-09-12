import { ObjectId } from "bson";
import { Response, Request } from "express"
import { ManufacturerRepository } from "../../../repositories";

export const getProjects = async (req: Request, res: Response) =>{

    try {

        const query = (req.params.manufacturerId ) ? {"_id":new ObjectId(req.params.manufacturerId)} : {};
        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const projects = await manuRepo.collection?.find(query, {projection:{"manufacturerId":"$_id","_id":0, "projects":1}}).toArray()
        
        res.status(200).send({
            status:"success",
            data: projects
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}


export const getProject = async (req: Request, res: Response) =>{

    try {

        
        if(!req.params.projectId ) throw new Error("please provide a project ID")

        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const projectID = new ObjectId(req.params.projectId);
        const projects = await manuRepo.collection?.find({"projects.projectId":projectID}, {projection:{"manufacturerId":"$_id","_id":0, "projects":{$elemMatch:{"projectId":projectID}}}}).toArray()
        res.status(200).send({
            status:"success",
            data: projects 
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}