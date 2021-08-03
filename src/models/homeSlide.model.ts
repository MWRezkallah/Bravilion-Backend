import { IFile } from ".";

export interface IHomeSlider{
    _id?: string;
    header:string;
    subHeader:string;
    desktopImage:IFile;
    mobileImage:IFile;
}