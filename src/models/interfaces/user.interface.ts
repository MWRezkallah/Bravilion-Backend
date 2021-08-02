import * as  mongoose from 'mongoose'
export interface IUser extends mongoose.Document {
    name:string;
    username: string;
    email: string;
    password: string;
    phone : string;
    tokens:{token:string}[]
    encrypPassword(password: string): Promise<string>;
    validatePassword(password: string): Promise<boolean>;
    generateToken():string;
}