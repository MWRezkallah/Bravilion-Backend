import { Request, Response } from 'express'
import User from '../models/base/user.model';


export const getAdmins = async (req: Request, res: Response) => {
    
    try{
        const data = await User.find({});
        res.status(200).send({
            status: 'success',
            data: data
        });
    }catch(e){
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
};


export const getAdmin = async (req: Request, res: Response) => {
    
    try{
        const id = req.params.id
        const data = await User.findById(id);
        res.status(200).send({
            status: 'success',
            data: data
        });
    }catch(e){
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
};