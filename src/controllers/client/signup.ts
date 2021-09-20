import { Request, Response } from 'express'
import { extractImageModel } from '../../lib';
import { IClient } from '../../models';
import { ClientRepository } from '../../repositories';

export const signUp = async (req: Request, res: Response) =>{

    try{

    const values = Object.values(req.files !== undefined ? req.files: {});

    const clientRepo = new ClientRepository()
        const newClient: IClient = {
            email: req.body.email,
            password: await clientRepo.encrypPassword(req.body.password),
            name : {arabic:req.body.arabicName, english:req.body.englishName},
            phone:req.body.phone
        };


    const clientId = await clientRepo.create(newClient as IClient);
    const token = await clientRepo.generateToken(clientId);
    res.status(200).send({
        status: 'success',
        data: {name: newClient.name, email: newClient.email,  id: clientId },
        token: token
    });

    }
    
    catch(e){
        res.status(400).json(e);
    }

}