/* eslint-disable space-before-blocks */
import { Repository } from "./base/repository";
import { IRepository } from "./base/iRepository";
import { IBadge } from "../models";


export class BadgeRepository extends Repository<IBadge> implements IRepository<IBadge>{


    collectionName = 'Badge';

    constructor() {
        super();
    } 

}