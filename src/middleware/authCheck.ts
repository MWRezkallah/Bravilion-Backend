
import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken';
import User from '../models/base/user.model';

const authCheck = async (req: Request, res: Response, next:any) =>{
    try{
        const token       = req.header('Authorization') !== undefined? req.header('Authorization').replace('Bearer ', ''): "";
        const decoded     = jwt.verify(token, 'FuckersYouKNowNothing');
        const userInfo    = await User.findOne({_id:decoded._id, 'tokens.token': token});
        if(!userInfo){
            throw new Error('')
        }
        req.body.admin  = userInfo;
        req.body.token  = token;
        next();
    }catch(err){
        res.status(401).send({
            error: 'Authentication Failed'
        })
    }
}