import { Request, Response } from 'express'
import { ManufacturerRepository } from '../../repositories';

export const logout = async (req: Request, res: Response) => {
    try {
        res.locals.manufacturer.tokens = res.locals.manufacturer.tokens.filter((token: any) => {
            return token.token != res.locals.token
             
        })
        const manuRepo = new ManufacturerRepository()
        await manuRepo.update(res.locals.manufacturer._id,  res.locals.manufacturer)
        res.status(200).send({
            status: 'Success',
            data: {
                message :`${res.locals.manufacturer.name} logged out successfully!`
            }
        })    } catch (error) {
        res.status(500).send(error)
    }
};
