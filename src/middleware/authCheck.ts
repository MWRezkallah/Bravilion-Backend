
import { Request, Response } from 'express'
import e = require('express');
import * as jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import User from '../models/base/user.model';
import { connect } from '../controllers/connect.controller';

export const authCheck = async (req: Request, res: Response, next:any) =>{

    try{
        connect();
        const token = req.header('Authorization') !== undefined? req.header('Authorization')?.replace('Bearer ', ''): "";
        if(!token) {throw new Error("Token is missing!")}

        const decoded = jwt.verify(token ,`${process.env.apiSecretKey}`, {complete : true}) as any;
        const user = await User.findOne({"tokens.token":token});
        if(!user) throw new Error("Invalid Token")
        

        req.body.user  = user;
        req.body.token  = token;
        next();

    }catch(err){
        res.status(401).send({
            error: err.message
        })
    }
}