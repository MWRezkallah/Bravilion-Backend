import { Request, Response } from 'express'
import { ClientRepository } from '../../repositories';

export const login = async (req: Request, res: Response) => {
    
    try{

        const clientRepo = new ClientRepository();
        
        const client = await clientRepo.findOneByQuery({$or:[{email:req.body.email}, {phone:req.body.phone}]});
        
        if(!client) {
            throw new Error("The user doesn't exists");
        }
        
        const isAuth = await clientRepo.validatePassword(req.body.password,  {$or:[{email:req.body.email}, {phone:req.body.phone}]});
        if(!isAuth){
            throw new Error('invalid password try again!')
        }

        delete client.password;
        delete client.tokens;
        delete client.role;

        const token = await clientRepo.generateToken(client._id);
        res.status(200).send({
            status: 'Success',
            data: {
                client : {...client},
                token : token
            }
        })
    }catch(e:any){
        res.status(400).send({
            status: 'Error',
            Error: e.message
        })
    }

};
