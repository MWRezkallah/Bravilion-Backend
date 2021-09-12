import { Request, Response } from 'express'
import { ManufacturerRepository } from '../../repositories';

export const login = async (req: Request, res: Response) => {
    
    try{

        const manuRepo = new ManufacturerRepository();
        
        const manufacturer = await manuRepo.findOneByQuery({email:req.body.email});
        
        if(!manufacturer) {
            throw new Error("The user doesn't exists");
        }
        
        const isAuth = await manuRepo.validatePassword(req.body.password,  {email:req.body.email});
        if(!isAuth){
            throw new Error('invalid password try again!')
        }

        delete manufacturer.password;
        delete manufacturer.tokens;
        delete manufacturer.role;

        const token = await manuRepo.generateToken(manufacturer._id);
        res.status(200).send({
            status: 'Success',
            data: {
                manufacturer : {...manufacturer},
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
