import { Request, Response } from 'express'
import { IUser } from '../models/interfaces/user.interface';
import { UserRepository } from '../repositories/UserRepository';

export const login = async (req: Request, res: Response) => {
    
    try{
        const userRepo = new UserRepository();
        
        const user = await userRepo.findOneByQuery({ $or: [{email:req.body.email}, {phone: req.body.phone}]});
        
        if(!user) {
            throw new Error("The user doesn't exists");
        }
        
        const isAuth = await userRepo.validatePassword(req.body.password, { $or: [{email:req.body.email}, {phone: req.body.phone}]});
        if(!isAuth){
            throw new Error('invalid password try again!')
        }

        const token = await userRepo.generateToken(user._id);
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
        const userRepo = new UserRepository()
        await userRepo.updateByQuery(req.body.user._id, {tokens : req.body.user.tokens})
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

    const userRepo = new UserRepository()

        const newUser = {
            name : req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            phone : req.body.phone,
        };

    try{

    const userId = await userRepo.create(newUser as IUser);
    const token = await userRepo.generateToken(userId);
    res.status(200).send({
        status: 'success',
        data: {username: newUser.username, email: newUser.email, name:newUser.name, phone:newUser.phone },
        token: token
    });

    }
    
    catch(e){
        res.status(400).json(e);
    }

}