import {Request, Response} from 'express';
import { ServiceRepository } from '../repositories';
import { ObjectId } from 'mongodb';


export const createService = async (req: Request, res: Response) =>{

    try {
        const serviceRepo = new ServiceRepository();
        let service = await serviceRepo.findOneByQuery({
            $or:[
                {'name.english': req.body.englishName},
                {'name.arabic': req.body.arabicName}
             ]});
        if (service) throw new Error(`${service.name.arabic}/${service.name.english} already exists!`);
        service = await serviceRepo.create({name:{arabic:req.body.arabicName, english:req.body.englishName}});
        
        res.status(200).send({
            stauts:"Success!",
            data:service
        });

    } catch (error) {
        res.status(400).send({
            status:"Error",
            message: error.message
        });
    }
}

export const getServices = async (req: Request, res: Response) =>{
    try {
        const serviceRepo = new ServiceRepository();
        const services = await serviceRepo.findAll();
        res.status(200).send({
            status: "Success",
            data: services
        });

    } catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
}

export const getService = async (req: Request, res: Response) => {
    try {
        const serviceRepo = new ServiceRepository();
        const service = await serviceRepo.findOneByQuery({ _id :new ObjectId(req.params.id) })
        if(!service) throw new Error("service not found!")
        res.status(200).send({
            status: "Success",
            data: service
        });
    } catch (error) {
        res.status(404).send({
            status:"Error",
            message: error.message            
        });
    }
}

export const updateService = async (req: Request, res: Response) =>{
    try {
        const serviceRepo = new ServiceRepository();
        const service = await serviceRepo.findOneByQuery({
            $and:[
                { _id : { $ne : new ObjectId (req.params.id) } },
                { $or : [ {'name.arabic': req.body.arabicName} , {'name.english': req.body.englishName} ] }
            ]
        });
        if (service) throw new Error(`service's name: ${service.name.arabic}/${service.name.english} belongs to another service`);
        const updatedService = await serviceRepo.update( req.params.id,
                               {  name: {arabic: req.body.arabicName, english: req.body.englishName } } );
        res.status(200).send({
            status:"Success",
            data: updatedService
        });
    } catch (error) {
        res.status(400).send({
            status:"Error",
            message: error.message
        });
    }
}

export const deleteService = async (req: Request, res: Response) => {
    try {
        const serviceRepo = new ServiceRepository();
        await serviceRepo.delete(req.params.id);
        res.status(200).send({
            status: "Success",
            message: "Service deleted successfully!"
        });
    } catch (error) {
        res.status(400).send({
            status:"Error",
            error: error
        });
    }
}