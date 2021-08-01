import { IRepository } from "./base";
import {IUser} from '../models/interfaces/user.interface';

export interface IUserRepository extends IRepository<IUser>{

    encrypPassword(password: string): Promise<string>;
    validatePassword(password: string): Promise<boolean>;
    generateToken():any;

}