import { Request, Response } from 'express'
import { IUser } from '../models/interfaces/user.interface';
import User from '../models/base/user.model';
import {connect} from './connect.controller'

export const login = async (req: Request, res: Response) => {
    
    try{
        const userInfo = await User.findOne({email: req.body.email, password: req.body.password});
        if(!userInfo){
            throw new Error('The user does not exists')
        }
        const token = await userInfo.generateToken();
        res.status(200).send({
            status: 'Success',
            data: {
                admin: userInfo,
                token: token
            }
        })
    }catch(e){
        res.status(400).send({
            status: 'Error',
            Error: e
        })
    }

};

export const logout = async (req: Request, res: Response) => {
    try {
        req.body.user.tokens = req.body.user.tokens.filter((token: any) => {
            return token.token != req.body.token
        })
        await req.body.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
};

export const signUp = async (req: Request, res: Response) =>{
    try{
        connect();
        const newUser: IUser = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        newUser.password = await newUser.encrypPassword(newUser.password);
        console.log("========================>", newUser);
        const savedUser = await newUser.save();
        const token =  await newUser.generateToken();

        console.log("==============================================================>", token)
        res.status(200).send({
            status: 'success',
            data: savedUser,
            token: token
        });
    }
    catch(e){
        res.status(400).json(e);
    }

}