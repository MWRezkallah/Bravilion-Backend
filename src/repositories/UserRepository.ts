/* eslint-disable space-before-blocks */
import { Repository } from "./base/repository";
import {IUserRepository} from './IUserRepository';
import {IUser} from '../models/interfaces/user.interface';

export class UserRepository extends Repository<IUser> implements IUserRepository{


    collectionName = 'User';

    async encrypPassword(password: string){return Promise.resolve("hashed password")}
    async validatePassword(password: string){ return Promise.resolve(true)}
    async generateToken(){return  "token"}

    constructor() {
        super();
    } 

}