
import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import User from '../models/base/user.model';
import { connect } from '../controllers/connect.controller';

export const authorizeAdmin = async (req: Request, res: Response, next:any) =>{

    try{
        await connect();
        const token = req.header('Authorization') !== undefined? req.header('Authorization')?.replace('Bearer ', ''): "";
        if(!token) {throw new Error("Token is missing!")}

        const decoded = jwt.verify(token ,`${process.env.apiSecretKey}`, {complete : true}) as any;
        const admin = await User.findOne({"tokens.token":token});
        if(!admin) throw new Error("Invalid Token")
        

        res.locals.admin = admin
        res.locals.token  = token;
        next();

    }catch(err:any){
        res.status(401).send({
            error: err.message
        })
    }
}