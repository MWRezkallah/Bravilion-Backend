import * as  mongoose from 'mongoose'
export interface IUser extends mongoose.Document {
    name:string;
    username: string;
    email: string;
    password: string;
    phone : string;
    tokens:{token:string}[]
}