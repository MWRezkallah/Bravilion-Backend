import {Request, Response} from 'express';
import { ProductRepository } from '../repositories/productRepository';
import { IProduct } from '../models/IProduct';
import { extractImageModel } from '../lib';
import { ObjectId } from 'mongodb';
import { unlinkSync } from 'fs';

export const createProduct = async(req: Request, res: Response) => {
    try {

        const values = Object.values(req.files !== undefined ? req.files: {});
        const productRepo = new ProductRepository();
        const productItem:  IProduct = {
            name:{arabic: req.body.arabicName, english: req.body.englishName},
            description:{arabic: req.body.arabicDescription, english: req.body.englishDescription},
            logo: extractImageModel(values[0][0]),
            price: req.body.price,
            afterSalePrice:req.body.afterSalePrice || req.body.price,
            images: Array.from(values[1]).map(image => extractImageModel(image)),
            properties: req.body.properties || [] ,
            detailedProperties: req.body.detailedProperties || [],
            supplier:[].concat(req.body.supplier).map( supplierId  => new ObjectId(supplierId)),
            categories:[].concat(req.body.categories).map(categoryId => new ObjectId(categoryId)),
            badges:[].concat(req.body.badges).map(badgeId => new ObjectId(badgeId) )
        }

        const product = await productRepo.create(productItem);
        res.status(200).send({
            status:"Success",
            data: product
        });

    } catch (error) {
        const values = Object.values(req.files !== undefined ? req.files: {});
        unlinkSync(extractImageModel(values[0][0]).path)
        Array.from(values[1]).forEach(image => unlinkSync(extractImageModel(image).path) )
        res.status(400).send({
            status:"Error",
            message:error.message
        });
    }
}

export const getProducts = async (req: Request, res: Response) => {
    try {
        const productRepo = new ProductRepository();
        const products = await productRepo.findAll();
        res.status(200).send({
            status:"Success",
            data:products
        });

    } catch (error) {
        res.status(500).send({
            status:"Error",
            message:error.message
        });
    }
}


export const getSimpProducts = async (req: Request, res: Response) => {
    try {
        const productRepo = new ProductRepository();
        const products = await productRepo.simplifiedProducts();
        res.status(200).send({
            status:"Success",
            data:products
        });

    } catch (error) {
        res.status(500).send({
            status:"Error",
            message:error.message
        });
    }
}

export const getProduct = async (req: Request, res: Response) => {
    try {
        const productRepo = new ProductRepository();
        const product = await productRepo.findOne(req.params.id)
        res.status(200).send({
            status:"Success",
            data: product
        });
    } catch (error) {
        res.status(400).send({
            status:"Error",
            message:error.message
        });
    }
}


export const getSimpProduct = async (req: Request, res: Response) => {
    try {
        const productRepo = new ProductRepository();
        const product = await productRepo.simplifiedProduct(req.params.id)
        res.status(200).send({
            status:"Success",
            data: product
        });
    } catch (error) {
        res.status(400).send({
            status:"Error",
            message:error.message
        });
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {

        const values = Object.values(req.files !== undefined ? req.files: {});
        const productRepo = new ProductRepository();
        const product:IProduct = await productRepo.findOne(req.params.id);

        const productItem:  IProduct = {
            name:{arabic: req.body.arabicName, english: req.body.englishName},
            description:{arabic: req.body.arabicDescription, english: req.body.englishDescription},
            logo: extractImageModel(values[0][0], product.logo.createdAt),
            price: req.body.price,
            afterSalePrice:req.body.afterSalePrice || req.body.price,
            images: Array.from(values[1]).map((image, index) => extractImageModel(image, product.images[index].createdAt)),
            properties: req.body.properties || [] ,
            detailedProperties: req.body.detailedProperties || [],
            supplier:[].concat(req.body.supplier).map( supplierId  => new ObjectId(supplierId)),
            categories:[].concat(req.body.categories).map(categoryId => new ObjectId(categoryId)),
            badges:[].concat(req.body.badges).map(badgeId => new ObjectId(badgeId) )
        }

        const updatedProduct = await productRepo.update(req.params.id, productItem);

        //if updated delete old images
        unlinkSync(product.logo.path);
        Array.from(product.images).forEach( image  =>  unlinkSync(image.path));

        res.status(200).send({
            status: "Success",
            data: updatedProduct,
        });

    } catch (error) {
        const values = Object.values(req.files !== undefined ? req.files: {});
        unlinkSync(extractImageModel(values[0][0]).path)
        Array.from(values[1]).forEach(image => unlinkSync(extractImageModel(image).path))
        res.status(400).send({
            status:"Error",
            message:error.message
        });
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const productRepo = new ProductRepository();
        const product:IProduct = await productRepo.findOne(req.params.id);
        await productRepo.delete(req.params.id);

        //if product is deleted, so we will delete its images
        unlinkSync(product.logo.path);
        Array.from(product.images).forEach( image  =>  unlinkSync(image.path));

        res.status(200).send({
            status:"success",
            message:`${product.name.english} deleted successfully!`
        });

    } catch (err) {
        
        res.status(400).send({
            status:"Error",
            Error: err
        });

    }
}