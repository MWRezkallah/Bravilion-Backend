import { Repository } from "./base/repository";
import { IRepository } from "./base/iRepository";
import { ISupplier } from "../models/supplier.model";


export class SupplierRepository extends Repository<ISupplier> implements IRepository<ISupplier>{

    collectionName = "Supplier";

    constructor(){
        super();
    }
    
}