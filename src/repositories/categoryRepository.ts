/* eslint-disable space-before-blocks */
import { Repository } from "./base/repository";
import { IRepository } from "./base/iRepository";
import { ICategory } from "../models";


export class CategoryRepository extends Repository<ICategory> implements IRepository<ICategory>{


    collectionName = 'Category';

    constructor() {
        super();
    } 

}