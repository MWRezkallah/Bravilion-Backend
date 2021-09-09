import { Repository } from "./base/repository";
import { IRepository } from "./base/iRepository";
import { IPlan } from "../models";


export class PlanRepository extends Repository<IPlan> implements IRepository<IPlan>{


    collectionName = 'Plan';

    constructor() {
        super();
    } 

}