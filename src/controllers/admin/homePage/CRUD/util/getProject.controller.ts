import { ObjectId } from "bson";
import { Response, Request } from "express"
import { ManufacturerRepository } from "../../../../../repositories";

export const getProjects = async (req: Request, res: Response) =>{

    try {

        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const projects = await manuRepo.collection?.aggregate([
            {$project:{"manufacturerId":"$_id","_id":0, "projects":1}},
            {$unwind:"$projects"},
            {
                $lookup:{
                    from:"Product",
                    localField:"projects.projectId",
                    foreignField:"projectsId",
                    as:"projects.products"
                }
            },
            {$replaceRoot:{newRoot:"$projects"}},
            {$project:{"projectId":1,"name":1,"coverImage":1}}
            ]).toArray()
        
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
