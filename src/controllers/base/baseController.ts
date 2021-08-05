// import { Request, Response } from 'express'
// import { extractImageModel } from "../../lib";
// import { IRepository } from '../../repositories';
// import { ICategory } from "../../models";
// import { CategoryRepository } from "../../repositories/categoryRepository";
// import { IController } from "./IController";


// export class BaseController<T> implements IController{
//     repo:any;
    
//     constructor(Repo: new() => T){
//         this.repo = new Repo();
//     }

//     async create(req: Request, res: Response) {
//         try{

//             const values = Object.values(req.files !== undefined ? req.files: {});
//             const coverImageData = extractImageModel(values[0][0]);
//             const data:ICategory = {
//                 name: {
//                     arabic:req.body.arabicName,
//                     english: req.body.englishName
//                 },
//                 cover: coverImageData   
//             }

//             const re = await this.repo.create(data);
        

    
//             res.status(200).send({
//                 status: 'success',
//                 data: re
//             });
//         }catch(e){
//             res.status(400).send({
//                 err:e
//             });
//         }
//     }
//     async findAll(req: Request, res: Response) {
//         try{    
//             const categories = await CategoryRepo.findAll();
//             res.status(200).send({
//                 status: 'success',
//                 data: categories
//             });
//         }catch(e){
//             res.status(400).send({
//                 status: 'Error',
//                 Error: e
//             });
//         }
//     }
//     findOne(req: Request, res: Response) {
//         throw new Error("Method not implemented.");
//     }
//     update(req: Request, res: Response) {
//         throw new Error("Method not implemented.");
//     }
//     delete(req: Request, res: Response) {
//         throw new Error("Method not implemented.");
//     }

// }