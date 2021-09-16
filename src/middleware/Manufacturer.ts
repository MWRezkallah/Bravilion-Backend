
import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken';
import { ManufacturerRepository } from '../repositories';
import * as Storage from '@google-cloud/storage';
import { ObjectId } from 'bson';


export const manuRegister = async (req : Request, res : Response, next:any)=>{

    try {
        const isEmail = req.body.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!isEmail) throw new Error(`${isEmail?"":"invalid email!"}`)
        if(req.body.password.length<6) throw new Error("password should at least be 6 or more characters!")
        const manuRepo = new ManufacturerRepository();
        const result = await manuRepo.findOneByQuery({ email : new RegExp(req.body.email,"i")} )
        if(result) throw new Error("This company is already registered, try to login!")
        const existedName = await manuRepo.findOneByQuery({name:new RegExp(req.body.name,"i")})
        if(existedName) throw new Error(`The name: ${req.body.name} already exists!, try another one...`)
        next();
        
    } catch (error:any) {
        // const values = Object.values(req.files !== undefined ? req.files: {});
        // const storage = new Storage();
        // await storage.bucket(`${process.env.GCS_BUCKET}`).file(values[0][0].filename).delete();
        // await storage.bucket(`${process.env.GCS_BUCKET}`).file(values[1][0].filename).delete();

         res.status(400).send({
            status : "Error",
            message:error.message
        })
    }

}


export const manuUpdate = async (req : Request, res : Response, next:any)=>{

    try {
        const token = req.header('Authorization') !== undefined? req.header('Authorization')?.replace('Bearer ', ''): "";
        if(!token) {throw new Error("Token is missing!")}

        const decoded = jwt.verify(token ,`${process.env.apiSecretKey}`, {complete : true}) as any;

        const manuRepo = new ManufacturerRepository();
        const manufacturer = await manuRepo.findOneByQuery({"tokens":{token:token}});
        if(!manufacturer) throw new Error("Invalid Token")
        

        res.locals.manufacturer  = manufacturer;
        res.locals.token  = token;

        if(req.body.email){
            const isEmail = req.body.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            if (!isEmail) throw new Error(`${isEmail?"":"invalid email!"}`)
            const result = await manuRepo.findOneByQuery({ $and:[{"_id":{$ne:new ObjectId(manufacturer._id)}},{email : new RegExp(req.body.email,"i")}]} )
            if(result) throw new Error("This email is taken, try to another one!")
        }
        if(req.body.password){
            if(req.body.password.length<6) throw new Error("password should at least be 6 or more characters!")            
        }
        if(req.body.name){
            const result = await manuRepo.findOneByQuery({ $and:[{"_id":{$ne:new ObjectId(manufacturer._id)}},{name : {$regex: new RegExp(req.body.name,"i")}}]} )
            if(result) throw new Error("This company name is taken, try to another one!")
        }
        next();
        
    } catch (error:any) {
        const values = Object.values(req.files !== undefined ? req.files: {});
        const storage = new Storage();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(values[0][0].filename).delete();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(values[1][0].filename).delete();

         res.status(400).send({
            status : "Error",
            message:error.message
        })
    }

}



export const authenticateManufacturer = async (req: Request, res: Response, next:any) =>{

    try{
        const token = req.header('Authorization') !== undefined? req.header('Authorization')?.replace('Bearer ', ''): "";
        if(!token) {throw new Error("Token is missing!")}

        const decoded = jwt.verify(token ,`${process.env.apiSecretKey}`, {complete : true}) as any;

        const manuRepo = new ManufacturerRepository();
        const manufacturer = await manuRepo.findOneByQuery({"tokens":{token:token}});
        if(!manufacturer) throw new Error("Invalid Token")
        

        res.locals.manufacturer  = manufacturer;
        res.locals.token  = token;
        next();

    }catch(err:any){
        res.status(401).send({
            error: err.message
        })
    }
}


export const authorizeManufacturer = async (req: Request, res: Response, next:any) =>{

    try{
     
        const token = req.header('Authorization') !== undefined? req.header('Authorization')?.replace('Bearer ', ''): "";
        if(!token) {throw new Error("Token is missing!")}

        const decoded = jwt.verify(token ,`${process.env.apiSecretKey}`, {complete : true}) as any;
        const manuRepo = new ManufacturerRepository()
        const manufacturer = await manuRepo.findOneByQuery({"tokens.token":token});
        if(!manufacturer) throw new Error("Invalid Token")
        
        res.locals.manufacturer  = manufacturer;
        res.locals.token  = token;
        next();

    }catch(err:any){
        res.status(401).send({
            error: err.message
        })
    }
}