import { ObjectId } from "bson";
import { ILang } from "."
export interface IPlan {
    _id?:ObjectId,
    name:ILang,
    price:Number,
    duration:Number
}