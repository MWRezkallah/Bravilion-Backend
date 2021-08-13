import { IService } from "../models";
import { IRepository, Repository } from ".";

export class ServiceRepository extends Repository<IService> implements IRepository<IService> {

    collectionName = "Service"
    constructor(){
        super()
    }
}