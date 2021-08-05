
import { Request, Response } from 'express'
export interface IController{
    create(req: Request, res: Response):any;
    findAll(req: Request, res: Response):any;
    findOne(req: Request, res: Response):any;
    update(req: Request, res: Response):any;
    delete(req: Request, res: Response):any;
}