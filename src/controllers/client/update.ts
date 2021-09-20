import { ObjectId } from 'bson';
import { Request, Response } from 'express'
import { extractImageModel } from '../../lib';
import { IClient } from '../../models';
import { ClientRepository } from '../../repositories';
import * as Storage from '@google-cloud/storage';

export const update = async (req: Request, res: Response) =>{

    try{

    const values = Object.values(req.files !== undefined ? req.files: {});

    const clientRepo = new ClientRepository()
        const updatedClient:any = {}
            if(req.body.email){ updatedClient["email"] = req.body.email;}
            if(req.body.phone) { updatedClient["phone"]=req.body.phone;}             
            if(req.body.password) { updatedClient["password"] = await clientRepo.encrypPassword(req.body.password);}
            if(req.body.arabicName && req.body.englishName){ updatedClient["name"] = {arabic:req.body.arabicName, english:req.body.englishName};}
            if(values[0][0]) { updatedClient["avatar"] = extractImageModel(values[0][0]);}
            if(values[1][0]) { updatedClient["coverImage"] = extractImageModel(values[1][0]);}
            if(req.body.contactInfo) {updatedClient["contactInfo"] = req.body.contactInfo;}

        const clientId = new ObjectId(res.locals.client._id)
        if(!clientRepo.collection) await clientRepo.initCollection()
        const result = await clientRepo.collection?.findOneAndUpdate({"_id":clientId},{$set:updatedClient})

        if(result?.ok == 1)
        {
            const storage = new Storage();
            if(values[0][0] && result?.value.avatar.name){
                await storage.bucket(`${process.env.GCS_BUCKET}`).file(result.value.avatar.name).delete();            
            }
            if(values[1][0] && result?.value.coverImage.name){
                await storage.bucket(`${process.env.GCS_BUCKET}`).file(result.value.coverImage.name).delete();            
            }
        }

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