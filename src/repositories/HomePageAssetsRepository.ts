import { Repository } from "./base/repository";
import { IRepository } from "./base/iRepository";
import { IHomePage } from "../models";


export class HomePageAssetsRepository extends Repository<IHomePage> implements IRepository<IHomePage>{


    collectionName = 'HomePageAssets';

    constructor() {
        super();
    } 

}