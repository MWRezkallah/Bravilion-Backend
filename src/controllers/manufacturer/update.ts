import { ObjectId } from 'bson';
import { Request, Response } from 'express'
import { extractImageModel } from '../../lib';
import { IManufacturer } from '../../models';
import { ManufacturerRepository } from '../../repositories';

export const update = async (req: Request, res: Response) =>{

    try{

        // email:string,
        // password:string,
        // name:string,
        // logo:IFile,
        // header:IFile,
        // about:string,
        // contactInfo:IGeneric[],
        // videos:{name:string, url:string, description:string}
        // enquiries:IGeneric[],
        // projects:IGeneric[],
        // catalogues:{name:string, pdf:IFile, description:string},
        //collection
        //family
        
        // articlesId:string[],
        // tradeFairsId:string[],
        // productsId:string[],
        // ordersId:string[],
    
    const values = Object.values(req.files !== undefined ? req.files: {});

    const manuRepo = new ManufacturerRepository()
        const updateManu:any = {}
            if(req.body.email){ updateManu["email"] = req.body.email;}             
            if(req.body.password) { updateManu["password"] = await manuRepo.encrypPassword(req.body.password);}
            if(req.body.name){ updateManu["name"] = req.body.name;}
            if(values[0][0]) { updateManu["logo"] = extractImageModel(values[0][0]);}
            if(values[1][0]) { updateManu["header"] = extractImageModel(values[1][0]);}
            if(req.body.arabicAbout && req.body.englishAbout) {updateManu["about"] = {arabic:req.body.arabicAbout, english:req.body.englishAbout};}
            if(req.body.contactInfo) {updateManu["contactInfo"] = req.body.contactInfo;}

        const manuId = new ObjectId(res.locals.manufacturer._id)
        if(!manuRepo.collection) await manuRepo.initCollection()
        const result = await manuRepo.collection?.updateOne({"_id":manuId},{$set:updateManu})

        

    res.status(200).send({
        status: 'success',
        message: result
        });

    }
    
    catch(e:any){
        res.status(400).send({
            status:"Error",
            message:e.message
        });
    }

}