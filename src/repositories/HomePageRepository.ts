import { Repository } from "./base/repository";
import { IRepository } from "./base/iRepository";
import { IHomePage } from "../models";


export class HomePageRepository extends Repository<IHomePage> implements IRepository<IHomePage>{


    collectionName = 'HomePage';

    constructor() {
        super();
    } 

}