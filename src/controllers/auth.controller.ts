import { Request, Response } from 'express'
import { IUser } from '../models/interfaces/user.interface';
import { UserRepository } from '../repositories/UserRepository';
import {connect} from './connect.controller'
import User from '../models/base/user.model'

export const login = async (req: Request, res: Response) => {
    
    try{
        await connect();
        const user = await User.findOne({ $or: [{email:req.body.email}, {phone: req.body.phone}]});
        
        if(!user) {
            throw new Error("The user doesn't exists");
        }

        const isAuth = await user.validatePassword(req.body.password);
                
        if(!isAuth){
            throw new Error('invalid password try again!')
        }

        const token = await user.generateToken();

        res.status(200).send({
            status: 'Success',
            data: {
                user : {username : user.username, email:user.email, name:user.name},
                token : token
            }
        })
    }catch(e){
        res.status(400).send({
            status: 'Error',
            Error: e.message
        })
    }

};

export const logout = async (req: Request, res: Response) => {
    try {
        req.body.user.tokens = req.body.user.tokens.filter((token: any) => {
            return token.token != req.body.token
        })
        req.body.user.save()
        res.status(200).send({
            status: 'Success',
            data: {
                message :`${req.body.user.username} logged out successfully!`
            }
        })    } catch (error) {
        res.status(500).send(error)
    }
};

export const signUp = async (req: Request, res: Response) =>{

    try{
        await connect();
        const newUser: IUser = new User({
            name : req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            phone : req.body.phone,
        });

        newUser.password = await newUser.encrypPassword(newUser.password);

        const user = await newUser.save();
        const token = await user.generateToken();
        res.status(200).send({
            status: 'success',
            data: {username: user.username, email: user.email, name:user.name, phone:user.phone },
            token: token
        });

    }
    
    catch(e){
        res.status(400).json(e);
    }

}