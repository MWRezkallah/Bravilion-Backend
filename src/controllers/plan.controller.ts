import {Request, Response} from 'express';
import { PlanRepository } from '../repositories';
import { ObjectId } from 'mongodb';


export const createPlan = async (req: Request, res: Response) =>{

    try {
        const planRepo = new PlanRepository();
        let plan = await planRepo.findOneByQuery({
            $or:[
                {'name.english': req.body.englishName},
                {'name.arabic': req.body.arabicName}
             ]});
        if (plan) throw new Error(`${plan.name.arabic}/${plan.name.english} already exists!`);
        plan = await planRepo.create({name:{arabic:req.body.arabicName, english:req.body.englishName}, price:req.body.price, duration:req.body.duration});
        
        res.status(200).send({
            stauts:"Success!",
            data:plan
        });

    } catch (error) {
        res.status(400).send({
            status:"Error",
            message: error.message
        });
    }
}

export const getPlans = async (req: Request, res: Response) =>{
    try {
        const planRepo = new PlanRepository();
        const plans = await planRepo.findAll();
        res.status(200).send({
            status: "Success",
            data: plans
        });

    } catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
}

export const getPlan = async (req: Request, res: Response) => {
    try {
        const planRepo = new PlanRepository();
        const plan = await planRepo.findOneByQuery({ _id :new ObjectId(req.params.id) })
        if(!plan) throw new Error("plan not found!")
        res.status(200).send({
            status: "Success",
            data: plan
        });
    } catch (error) {
        res.status(404).send({
            status:"Error",
            message: error.message            
        });
    }
}

export const updatePlan = async (req: Request, res: Response) =>{
    try {
        const planRepo = new PlanRepository();
        const plan = await planRepo.findOneByQuery({
            $and:[
                { _id : { $ne : new ObjectId (req.params.id) } },
                { $or : [ {'name.arabic': req.body.arabicName} , {'name.english': req.body.englishName} ] }
            ]
        });
        if (plan) throw new Error(`plan's name: ${plan.name.arabic}/${plan.name.english} belongs to another plan`);
        const updatedPlan = await planRepo.update( req.params.id,
                               {  name: {arabic: req.body.arabicName, english: req.body.englishName }, price:req.body.price, duration:req.body.duration } );
        res.status(200).send({
            status:"Success",
            data: updatedPlan
        });
    } catch (error) {
        res.status(400).send({
            status:"Error",
            message: error.message
        });
    }
}

export const deletePlan = async (req: Request, res: Response) => {
    try {
        const planRepo = new PlanRepository();
        await planRepo.delete(req.params.id);
        res.status(200).send({
            status: "Success",
            message: "Plan deleted successfully!"
        });
    } catch (error) {
        res.status(400).send({
            status:"Error",
            error: error
        });
    }
}