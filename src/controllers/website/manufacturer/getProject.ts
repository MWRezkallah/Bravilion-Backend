import { Request, Response } from "express";
import { ObjectId } from "bson";
import { ManufacturerRepository } from "../../../repositories";
export const getProject = async (req: Request, res: Response) =>{

    try {

        
        if(!req.params.projectId ) throw new Error("please provide a project ID")

        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const projectID = new ObjectId(req.params.projectId);
        const project = await manuRepo.collection?.aggregate([{$match:{"projects.projectId":projectID}},
             {$project:{
              "projects":{$filter:{
                input:"$projects",
                as:"project",
                cond:{$eq:["$$project.projectId",projectID]}}}}
            },
            {$unwind:"$projects"},
            {$lookup:{
                from:"Product",
                localField:"projects.projectId",
                foreignField:"projectsId",
                as:"projects.products"
            }},
        {
            $replaceRoot:{newRoot:"$projects"}
        }]).toArray()
        res.status(200).send({
            status:"success",
            data: project 
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}



export const getProjects = async (req: Request, res: Response) =>{

    try {

        const manufacturerID = (req.params.manufacturerId ) ? {"_id":new ObjectId(req.params.manufacturerId)} : {};
        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const catalogues = await manuRepo.collection?.aggregate([
            {$match:manufacturerID},{$unwind:"$projects"},
            {$replaceRoot:{"newRoot":"$projects"}}
        ]).toArray()
        
        res.status(200).send({
            status:"success",
            data: catalogues
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}

