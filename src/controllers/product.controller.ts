import {Request, Response} from 'express';
import { ProductDetailsRepository,ProductRepository } from '../repositories';
import { IProductDetails, IProduct } from '../models';
import { extractImageModel } from '../lib';
import { ObjectId } from 'mongodb';
import * as Storage from '@google-cloud/storage';

export const createProduct = async(req: Request, res: Response) => {
    try {

        const values = Object.values(req.files !== undefined ? req.files: {});
        const productDetailsRepo = new ProductDetailsRepository();
        const productDetailsItem:  IProductDetails = {
            name:{arabic: req.body.arabicName, english: req.body.englishName},
            description:{arabic: req.body.arabicDescription, english: req.body.englishDescription},
            logo: extractImageModel(values[0][0]),
            price: req.body.price,
            afterSalePrice:req.body.afterSalePrice || req.body.price,
            images: Array.from(values[1]).map(image => extractImageModel(image)),
            properties: req.body.properties || [] ,
            detailedProperties: req.body.detailedProperties || [],
            suppliers:[].concat(req.body.supplier).map( supplierId  => new ObjectId(supplierId)),
            categories:[].concat(req.body.categories).map(categoryId => new ObjectId(categoryId)),
            badges:[].concat(req.body.badges).map(badgeId => new ObjectId(badgeId) )
        }
        const productDetails = await productDetailsRepo.create(productDetailsItem);
       
        const productRepo = new ProductRepository();
        const productItem:IProduct ={
            name:{arabic: req.body.arabicName, english: req.body.englishName},
            description:{arabic: req.body.arabicDescription, english: req.body.englishDescription},
            logo: extractImageModel(values[0][0]),
            price: req.body.price,
            afterSalePrice:req.body.afterSalePrice || req.body.price,
            categories:[].concat(req.body.categories).map(categoryId => new ObjectId(categoryId)),
            badges:[].concat(req.body.badges).map(badgeId => new ObjectId(badgeId) ),
            productDetailsId: productDetails._id
        }
        const product = await productRepo.create(productItem);

        res.status(200).send({
            status:"Success",
            data: productDetails
        });

    } catch (error) {
        res.status(400).send({
            status:"Error",
            message:error.message
        });
    }
}


export const getProductsDetails = async (req: Request, res: Response) => {
    try {
        const productDetailsRepo = new ProductDetailsRepository();
        const products = await productDetailsRepo.getProducts();
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

export const getProducts = async (req: Request, res: Response) => {
    try {
        const productRepo = new ProductRepository();
        const products = await productRepo.getProducts();
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

export const getProductDetails = async (req: Request, res: Response) => {
    try {
        const productDetailsRepo = new ProductDetailsRepository();
        const product = await productDetailsRepo.findOne(req.params.id)
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



export const updateProduct = async (req: Request, res: Response) => {
    try {

        const values = Object.values(req.files !== undefined ? req.files: {});
        const productDetailsRepo = new ProductDetailsRepository();
        const productDetails:IProductDetails = await productDetailsRepo.findOne(req.params.id);
        if(!productDetails) throw new Error("Product not found!");

        const productDetailsItem:  IProductDetails = {
            name:{arabic: req.body.arabicName, english: req.body.englishName},
            description:{arabic: req.body.arabicDescription, english: req.body.englishDescription},
            logo: extractImageModel(values[0][0], productDetails.logo.createdAt),
            price: req.body.price,
            afterSalePrice:req.body.afterSalePrice || req.body.price,
            images: Array.from(values[1]).map((image, index) => extractImageModel(image, productDetails.images[index].createdAt)),
            properties: req.body.properties || [] ,
            detailedProperties: req.body.detailedProperties || [],
            suppliers:[].concat(req.body.supplier).map( supplierId  => new ObjectId(supplierId)),
            categories:[].concat(req.body.categories).map(categoryId => new ObjectId(categoryId)),
            badges:[].concat(req.body.badges).map(badgeId => new ObjectId(badgeId) )
        }

        const updatedProductDetails = await productDetailsRepo.update(req.params.id, productDetailsItem);

        const productRepo = new ProductRepository();
        const productItem:IProduct ={ 
            name: productDetailsItem.name,
            description: productDetailsItem.description,
            logo: productDetailsItem.logo,
            price: productDetailsItem.price,
            afterSalePrice: productDetailsItem.afterSalePrice,
            categories: productDetailsItem.categories,
            badges: productDetailsItem.badges,
            productDetailsId: new ObjectId(productDetails._id)
        } 
        
        const product = await productRepo.findOneByQuery({productDetailsId: productItem.productDetailsId})
        await productRepo.update(product._id, productItem);


        //if updated delete old images
        const storage = new Storage();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(productDetails.logo.name).delete();

        Array.from(productDetails.images).forEach( async image  =>  await storage.bucket(`${process.env.GCS_BUCKET}`).file(image.name).delete() );

        


        res.status(200).send({
            status: "Success",
            data: updatedProductDetails,
        });

    } catch (error) {
        const values = Object.values(req.files !== undefined ? req.files: {});
        const storage = new Storage();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(extractImageModel(values[0][0]).name).delete();
        Array.from(values[1]).forEach(async image => await storage.bucket(`${process.env.GCS_BUCKET}`).file(extractImageModel(image).name).delete());
        res.status(400).send({
            status:"Error",
            message:error.message
        });
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const productDetailsRepo = new ProductDetailsRepository();
        const productDetails:IProductDetails = await productDetailsRepo.findOne(req.params.id);
        await productDetailsRepo.delete(req.params.id);
        
        const productRepo = new ProductRepository();
        await productRepo.deleteByQuery({productDetailsId: productDetails._id})

        //if product is deleted, so we will delete its images
        const storage = new Storage();
        await storage.bucket(`${process.env.GCS_BUCKET}`).file(productDetails.logo.name).delete();
        Array.from(productDetails.images).forEach( async image  => await storage.bucket(`${process.env.GCS_BUCKET}`).file(image.name).delete());

        res.status(200).send({
            status:"success",
            message:`${productDetails.name.english} deleted successfully!`
        });

    } catch (err) {
        
        res.status(400).send({
            status:"Error",
            Error: err
        });

    }
}