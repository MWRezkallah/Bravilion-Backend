
import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken';
import { ClientRepository } from '../repositories';
import * as Storage from '@google-cloud/storage';
import { ObjectId } from 'bson';


export const clientRegister = async (req : Request, res : Response, next:any)=>{

    try {
        const isEmail = req.body.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        const isPhone = req.body.phone.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
        
        if (! (isEmail && isPhone) ){
            
            throw new Error(`${isEmail?"":"invalid email!"} ${isPhone?"":"invalid phone!"}`);
            
        }
        if(req.body.password.length<6) throw new Error("password should at least be 6 or more characters!")
        const clientRepo = new ClientRepository();
        const result = await clientRepo.findOneByQuery({ $or:[{email : new RegExp(req.body.email,"i")},{phone:req.body.phone}]} )
        if(result) throw new Error("This company is already registered, try to login!")
        const existedName = await clientRepo.findOneByQuery({name:{english:new RegExp(req.body.englishName,"i"), arabic:req.body.arabicName}})
        if(existedName) throw new Error(`The name: ${req.body.englishName} / ${req.body.arabicName} already exists!, try another one...`)
        next();
        
    } catch (error:any) {
      
         res.status(400).send({
            status : "Error",
            message:error.message
        })
    }

}


export const clientUpdate = async (req : Request, res : Response, next:any)=>{

    try {
        const token = req.header('Authorization') !== undefined? req.header('Authorization')?.replace('Bearer ', ''): "";
        if(!token) {throw new Error("Token is missing!")}

        const decoded = jwt.verify(token ,`${process.env.apiSecretKey}`, {complete : true}) as any;

        const clientRepo = new ClientRepository();
        const client = await clientRepo.findOneByQuery({"tokens":{token:token}});
        if(!client) throw new Error("Invalid Token")
        

        res.locals.client  = client;
        res.locals.token  = token;

        if(req.body.email){
            const isEmail = req.body.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            const isPhone = req.body.phone.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
        
            if (! (isEmail && isPhone) ){
                
                throw new Error(`${isEmail?"":"invalid email!"} ${isPhone?"":"invalid phone!"}`);
                
            }
            const result = await clientRepo.findOneByQuery({ $and:[{"_id":{$ne:new ObjectId(client._id)}},{email : new RegExp(req.body.email,"i")}]} )
            if(result) throw new Error("This email is taken, try to another one!")
        }
        if(req.body.password){
            if(req.body.password.length<6) throw new Error("password should at least be 6 or more characters!")            
        }
        if(req.body.englishName && req.body.arabicName){
            const result = await clientRepo.findOneByQuery({ $and:[{"_id":{$ne:new ObjectId(client._id)}},{name : {english:{$regex: new RegExp(req.body.englishName,"i")}, arabic:req.body.arabicName}}]} )
            if(result) throw new Error("This  name is taken, try to another one!")
        }
        next();
        
    } catch (error:any) {
        const values = Object.values(req.files !== undefined ? req.files: {});
        const storage = new Storage();
        if(values[0][0])await storage.bucket(`${process.env.GCS_BUCKET}`).file(values[0][0].filename).delete();
        if(values[1][0])await storage.bucket(`${process.env.GCS_BUCKET}`).file(values[1][0].filename).delete();

         res.status(400).send({
            status : "Error",
            message:error.message
        })
    }

}



export const authenticateClient = async (req: Request, res: Response, next:any) =>{

    try{
        const token = req.header('Authorization') !== undefined? req.header('Authorization')?.replace('Bearer ', ''): "";
        if(!token) {throw new Error("Token is missing!")}

        const decoded = jwt.verify(token ,`${process.env.apiSecretKey}`, {complete : true}) as any;

        const clientRepo = new ClientRepository();
        const client = await clientRepo.findOneByQuery({"tokens":{token:token}});
        if(!client) throw new Error("Invalid Token")
        

        res.locals.client  = client;
        res.locals.token  = token;
        next();

    }catch(err:any){
        res.status(401).send({
            error: err.message
        })
    }
}


export const authorizeClient = async (req: Request, res: Response, next:any) =>{

    try{
        const token = req.header('Authorization') !== undefined? req.header('Authorization')?.replace('Bearer ', ''): "";
        if(!token) {throw new Error("Token is missing!")}

        const decoded = jwt.verify(token ,`${process.env.apiSecretKey}`, {complete : true}) as any;
        const clientRepo = new ClientRepository()
        const client = await clientRepo.findOneByQuery({"tokens.token":token});
        if(!client) throw new Error("Invalid Token")
        
        res.locals.client  = client;
        res.locals.token  = token;
        next();

    }catch(err:any){
        res.status(401).send({
            error: err.message
        })
    }
}