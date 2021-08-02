import { IRepository } from "./base";
import {IUser} from '../models/interfaces/user.interface';

export interface IUserRepository extends IRepository<IUser>{

    encrypPassword(password : string): Promise<string>;
    validatePassword(password : string, query:object): Promise<boolean>;
    generateToken(id : string):any;

}