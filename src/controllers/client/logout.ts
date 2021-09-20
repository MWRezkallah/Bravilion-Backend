import { Request, Response } from 'express'
import { ClientRepository } from '../../repositories';

export const logout = async (req: Request, res: Response) => {
    try {
        res.locals.client.tokens = res.locals.client.tokens.filter((token: any) => {
            return token.token != res.locals.token
             
        })
        const clientRepo = new ClientRepository()
        await clientRepo.update(res.locals.client._id,  res.locals.client)
        res.status(200).send({
            status: 'Success',
            data: {
                message :`${res.locals.client.name.arabic} / ${res.locals.client.name.english} logged out successfully!`
            }
        })    } catch (error) {
        res.status(500).send(error)
    }
};
