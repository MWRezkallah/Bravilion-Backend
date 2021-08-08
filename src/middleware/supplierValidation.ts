import { Request, Response } from 'express'
import { SupplierRepository } from "../repositories/SupplierRepository";
import { extractImageModel } from '../lib';
import * as Storage from '@google-cloud/storage';
import { ObjectId } from 'mongodb';

export const supplierCreationValidator = async (req: Request, res: Response, next:any) => {
    

    try{
        const supplierRepo = new SupplierRepository();
        const supplier = await supplierRepo.findOneByQuery({$or : [ {"name.arabic": req.body.arabicName }, {"name.english": req.body.englishName}]});
        
        if( supplier ){
            throw new Error( `Supplier: ${supplier.name.english}/${supplier.name.arabic} is already existed! , try to update!`);
        }

        const isEmail = req.body.hqEmail.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        const isPhone = req.body.hqPhone.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
        
        if (! (isEmail && isPhone) ){
            
            throw new Error(`${isEmail?"":"invalid email!"} ${isPhone?"":"invalid phone!"}`);
            
        }
        
        next();

    }catch(error){
        
        const values = Object.values(req.files !== undefined ? req.files: {});
        const logoImage = extractImageModel(values[0][0]);
        const storage = new Storage();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(logoImage.name).delete();

        res.status(400).send({
            status : "Error",
            Error : error.message
        });
    }

}

export const supplierUpdateValidator = async (req: Request, res: Response, next:any) => {
    

    try{
        const supplierId = req.params.id;
        const supplierRepo = new SupplierRepository();
        const supplier = await supplierRepo.findOneByQuery( {$and:
                [
                    { _id: { $ne : new ObjectId (`${supplierId}`) }},
                    {$or : [ {"name.arabic": req.body.arabicName }, {"name.english": req.body.englishName}]}

                ]
        });
        
        if( supplier ){
            throw new Error( `Supplier Name: ${supplier.name.english}/${supplier.name.arabic} already belongs to another supplier! , try different name!`);
        }

        const isEmail = req.body.hqEmail.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        const isPhone = req.body.hqPhone.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
        
        if (! (isEmail && isPhone) ){
            
            throw new Error(`${isEmail?"":"invalid email!"} ${isPhone?"":"invalid phone!"}`);
            
        }
        
        next();

    }catch(error){
        
        const values = Object.values(req.files !== undefined ? req.files: {});
        const logoImage = extractImageModel(values[0][0]);

        const storage = new Storage();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(logoImage.name).delete();


        res.status(400).send({
            status : "Error",
            Error : error.message
        });
    }

}