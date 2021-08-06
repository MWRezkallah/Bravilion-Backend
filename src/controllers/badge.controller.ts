import {Request, Response} from 'express';
import { BadgeRepository } from '../repositories';
import { IBadge } from '../models';
import { ObjectId } from 'mongodb';


export const createBadge = async (req: Request, res: Response) =>{

    try {
        const badgeRepo = new BadgeRepository();
        let badge = await badgeRepo.findOneByQuery({
            $or:[
                {'name.english': req.body.englishName},
                {'name.arabic': req.body.arabicName}
             ]});
        if (badge) throw new Error(`${badge.name.arabic}/${badge.name.english} already exists!`);
        badge = await badgeRepo.create({name:{arabic:req.body.arabicName, english:req.body.englishName}});
        
        res.status(200).send({
            stauts:"Success!",
            data:badge
        });

    } catch (error) {
        res.status(400).send({
            status:"Error",
            message: error.message
        });
    }
}

export const getBadges = async (req: Request, res: Response) =>{
    try {
        const badgeRepo = new BadgeRepository();
        const badges = await badgeRepo.findAll();
        res.status(200).send({
            status: "Success",
            data: badges
        });

    } catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
}

export const getBadge = async (req: Request, res: Response) => {
    try {
        const badgeRepo = new BadgeRepository();
        const badge = await badgeRepo.findOneByQuery({ _id :new ObjectId(req.params.id) })
        if(!badge) throw new Error("badge not found!")
        res.status(200).send({
            status: "Success",
            data: badge
        });
    } catch (error) {
        res.status(404).send({
            status:"Error",
            message: error.message            
        });
    }
}

export const updateBadge = async (req: Request, res: Response) =>{
    try {
        const badgeRepo = new BadgeRepository();
        const badge = await badgeRepo.findOneByQuery({
            $and:[
                { _id : { $ne : new ObjectId (req.params.id) } },
                { $or : [ {'name.arabic': req.body.arabicName} , {'name.english': req.body.englishName} ] }
            ]
        });
        if (badge) throw new Error(`badge's name: ${badge.name.arabic}/${badge.name.english} belongs to another badge`);
        const updatedBadge = await badgeRepo.update( req.params.id,
                               {  name: {arabic: req.body.arabicName, english: req.body.englishName } } );
        res.status(200).send({
            status:"Success",
            data: updatedBadge
        });
    } catch (error) {
        res.status(400).send({
            status:"Error",
            message: error.message
        });
    }
}

export const deleteBadge = async (req: Request, res: Response) => {
    try {
        const badgeRepo = new BadgeRepository();
        await badgeRepo.delete(req.params.id);
        res.status(200).send({
            status: "Success",
            message: "Badge deleted successfully!"
        });
    } catch (error) {
        res.status(400).send({
            status:"Error",
            error: error
        });
    }
}