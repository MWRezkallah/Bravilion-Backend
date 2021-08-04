import { Request, Response } from 'express'
import { UserRepository } from '../repositories/UserRepository';


export const userRegister = async (req : Request, res : Response, next:any)=>{

    const userRepo = new UserRepository();
    const result = await userRepo.findOneByQuery({ $or:[ { email : req.body.email} , { phone : req.body.phone } ] })
    if(result){
        return res.status(400).send({
            status : "Error",
            Error : "This User is already registered, try to login!"
        }
        )
    }else{
        next();
    }
}