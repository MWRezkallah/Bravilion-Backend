/* eslint-disable space-before-blocks */
import { Repository } from "./base/repository";
import { IRepository } from "./base/iRepository";
import { AdminModel } from "../models";


export class UserRepository extends Repository<AdminModel> implements IRepository<AdminModel>{


    collectionName = 'User';

    constructor() {
        super();
    } 

}