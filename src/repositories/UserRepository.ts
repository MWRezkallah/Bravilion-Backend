/* eslint-disable space-before-blocks */
import { Db, CollectionCreateOptions } from "mongodb";
import * as bcrypt  from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { Repository } from "./base/repository";
import {IUserRepository} from './IUserRepository';
import {IUser} from '../models/interfaces/user.interface';


export class UserRepository extends Repository<IUser> implements IUserRepository{


    constructor() {
        super();
    }

    collectionName = 'User';

    validator = {
            bsonType : "object",
            required : ["name", "username", "email", "password", "phone"],
            properties:{
                name: {
                    bsonType : "string"
                },
                username: {
                    bsonType : "string"
                },
                email: {
                    bsonType : "string"
                },
                password: {
                    bsonType : "string"
                },
                phone: {
                    bsonType : "string"
                },
                tokens:{
                    bsonType: "array",
                    items:{
                        bsonType : "object",
                        properties : {
                            token:{bsonType : "string"}
                        }
                    }
                }   
            }
        }

    validationLevel = "strict";
    
    validationAction = "error" 


    async encrypPassword(password: string):Promise<string> {
            const salt = await bcrypt.genSalt(10);
            return bcrypt.hash(password, salt);
        }

    async validatePassword(password: string, query:object): Promise<boolean>{
        const result = await this.findOneByQuery(query);
        return await bcrypt.compare(password, result.password);
    }

    async generateToken(id:string){
        const prefix = 6;
        const exp = new Date(new Date().getTime()+(prefix*24*60*60*1000));
        let user =  await this.findOneByQuery({_id:id});
        const token = jwt.sign({_id: user._id, username: user.username, email:user.email} , `${process.env.apiSecretKey}`, {expiresIn : `${ exp.getDate()} days`});
        if(user.tokens === undefined) user.tokens=[];
        user.tokens.push({token});
        const data = await this.update(user._id, user);
        return token;
    }


}