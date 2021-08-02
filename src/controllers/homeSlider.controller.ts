import { Request, Response } from 'express'
import { HomeSliderRepository } from '../repositories/HomeSliderRepository';
// import { IHomeSlider } from '../models';


export const createHomeSlider = async (req: Request, res: Response) => {
    
    try{
        const homeSliderRepo = new HomeSliderRepository();
        // const data:IHomeSlider = {
        //     header: req.body.header,
        //     subHeader: req.body.subHeader
        // }

    
        res.status(200).send({
            status: 'success'
        });
    }catch(e){
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
};
