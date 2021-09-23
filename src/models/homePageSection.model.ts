import { ILang } from ".";

export interface IHomePageSection {
    header:ILang,
    isSlider:boolean,
    order:Number,
    sectionType:string,
    items:any,
    createdBy?:{admin:string, at:Date},
    modifiedBy?:{admin:string, at:Date}
}