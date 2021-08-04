import { Request, Response } from "express";
import { SupplierRepository } from "../repositories/SupplierRepository";
import { extractImageModel } from '../lib';
import { ISupplier } from "../models/supplier.model";
import { unlinkSync } from "fs";

export const createSupplier = async (req: Request, res: Response) => {

    try{

        const values = Object.values(req.files !== undefined ? req.files: {});
        const logoImage = extractImageModel(values[0][0]);
        const data :ISupplier = {
            name:{
                arabic : req.body.arabicName,
                english : req.body.englishName
            },
            code: `${req.body.englishName} - ${Date.now()}`,
            logo: logoImage,
            headQuarter:{
                address:{
                    arabic: req.body.hqArabicAdd,
                    english: req.body.hqEnglishAdd 
                },
                email: req.body.hqEmail,
                phone: req.body.hqPhone
            }
        }
        
        const supplierRepo = new SupplierRepository();
        const supplier = await supplierRepo.create(data);

        res.status(200).send({
            status: "success!",
            data: supplier
        });

    }catch(error){
        res.status(400).send({
            status:"Error",
            message:error.message
            
        });
    }

}

export const getAllSuppliers = async (req: Request, res: Response) => {
 
    try{
        
        const supplierRepo = new SupplierRepository();
        const suppliers = await supplierRepo.findAll();
        
        res.status(200).send({

            status:"success",
            data:suppliers
            
        });

    }catch(err){
        res.status(400).send({
            status: 'Error',
            Error: err
        });
    }
}

export const getSupplier = async (req: Request, res: Response) => {

    try{

        const _id = req.params.id;
        const supplierRepo = new SupplierRepository();
        const supplier = await supplierRepo.findOne(_id);

        res.status(200).send({
            status:"success",
            data: supplier
        });

    }catch(err){
        res.status(400).send({
            status:"Error",
            Error : err
        });
    }
}


export const updateSupplier = async (req: Request, res: Response) => {

    try{

        const supplierId = req.params.id;
        const supplierRepo = new SupplierRepository();
        const supplier = await supplierRepo.findOne(supplierId);

        
        const values = Object.values(req.files !== undefined ? req.files: {});
        const logoImage = extractImageModel(values[0][0], supplier.logo.createdAt);
        const data :ISupplier = {
            name:{
                arabic : req.body.arabicName,
                english : req.body.englishName
            },
            code: supplier.code,
            logo: logoImage,
            headQuarter:{
                address:{
                    arabic: req.body.hqArabicAdd,
                    english: req.body.hqEnglishAdd 
                },
                email: req.body.hqEmail,
                phone: req.body.hqPhone
            }
        }
        
        const updatedSupplier = await supplierRepo.update(supplierId, data);

        // if updated without error the old logo will be deleted
        const prevLogo = supplier.logo;
        unlinkSync(prevLogo.path);
        
        res.status(200).send({
            status: "success!",
            data: updatedSupplier
        });
  
    }catch(err){

        res.status(400).send({
            status: "Error",
            Error: err            
        });

    }
}

export const deleteSupplier = async (req: Request, res: Response) => {

    try {
        
        const supplierId = req.params.id;
        const supplierRepo = new SupplierRepository();
        const supplier = await supplierRepo.findOne(supplierId);
        await supplierRepo.delete(supplierId);
        unlinkSync(supplier.logo.path);

        res.status(200).send({
            status:"success",
            message:`${supplier.name.english} deleted successfully!`
        });

    } catch (err) {
        
        res.status(400).send({
            status:"Error",
            Error: err
        });

    }
}