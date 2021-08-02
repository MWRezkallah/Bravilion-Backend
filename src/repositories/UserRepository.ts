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
        $jsonScehma:{
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
    }

    validationLevel = "strict";
    
    validationAction = "error" 


    async initCollection(): Promise<void> {
        try {
            let db: Db;
            if (this.collectionName) {

                if (!this.dbClient.isConnected()) {
                    db = await (await this.dbClient.connect()).db(this.dbName);
                }
                else {
                    db = await this.dbClient.db(this.dbName);
                }

                const collection = (await db.collections()).find(c => c.collectionName == this.collectionName);
                this.collection = collection;

                if (!collection) {
                    this.collection = await db.createCollection( this.collectionName);
                    await db.command({ collMod : `${this.collectionName}` , validator : this.validator, validationLevel : this.validationLevel , validationAction : this.validationAction })
                    console.log('collection name is ', this.collectionName);
                    await this.collection?.createIndex({email:1, phone:1}, {unique:true});
                    console.log("Collection is created!");
                }

            } else {
                throw new Error('Collection does not exists')
            }
        } catch (error) {
            throw new Error('something went wrong')
        }
    }



    async create(item: IUser, cleanUp?: boolean) {


        if (!this.collection) {
            await this.initCollection();
        }

        item.password = await this.encrypPassword(item.password); 

        const result = await this.collection?.insertOne(item);

        if (cleanUp) {
            this.cleanUp();
        }

        return result?.insertedId;
    }


    async createMany(item: IUser[], cleanUp?: boolean) {

        this.isAllowed(this.permissions, "");

        if (!this.collection) {
            await this.initCollection();
        }

        const users = await item.map(async (user)=>{
            user.password = await this.encrypPassword(user.password);
            return user;
        })

        const result = await this.collection?.insertMany(users);


        if (cleanUp) {
            this.cleanUp();
        }

        return result?.insertedIds;
    }

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
        const token = jwt.sign({_id: user.id, username: user.username, email:user.email, exp: exp.getMilliseconds()}, `${process.env.apiSecretKey}`);
        if (user.tokens == undefined) user.tokens = [];
        user.tokens = user.tokens?.concat({token});
        await this.update(user.id, user);
        return token;
    }


}