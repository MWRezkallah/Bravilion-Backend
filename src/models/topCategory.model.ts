import { ObjectId } from "bson";
import { ILang } from ".";

export interface ITopCategory{
    name?:ILang,
    parent?:ObjectId,
    childern?:ObjectId[]

}