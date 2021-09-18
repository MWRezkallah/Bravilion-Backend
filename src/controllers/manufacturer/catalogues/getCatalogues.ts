import { ObjectId } from "bson";
import { Response, Request } from "express"
import { ManufacturerRepository } from "../../../repositories";

export const getCatalogues = async (req: Request, res: Response) =>{

    try {

        const query = (req.params.manufacturerId ) ? {"_id":new ObjectId(req.params.manufacturerId)} : {};
        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const catalogues:any = await manuRepo.collection?.find(query, {projection:{"manufacturerId":"$_id","_id":0, "catalogues":1}}).toArray()

        res.status(200).send({
            status:"success",
            data: catalogues[0]?.catalogues || []
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}


export const getCatalogue = async (req: Request, res: Response) =>{

    try {

        
        if(!req.params.catalogueId ) throw new Error("please provide a catalogue ID")

        const manuRepo = new ManufacturerRepository()
        if(!manuRepo.collection) await manuRepo.initCollection();
        const catalogueID = new ObjectId(req.params.catalogueId);
        const catalogues:any = await manuRepo.collection?.find({"catalogues.catalogueId":catalogueID}, {projection:{"manufacturerId":"$_id","_id":0, "catalogues":{$elemMatch:{"catalogueId":catalogueID}}}}).toArray()
        res.status(200).send({
            status:"success",
            data: catalogues[0]?.catalogues
        })

    } catch (error:any) {
        res.status(400).send({
            status:"Error",
            message:error.message
        })
    }
}