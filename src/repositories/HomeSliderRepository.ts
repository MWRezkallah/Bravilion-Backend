/* eslint-disable space-before-blocks */
import { Repository } from "./base/repository";
import { IRepository } from "./base/iRepository";
import { IHomeSlider } from "../models";


export class HomeSliderRepository extends Repository<IHomeSlider> implements IRepository<IHomeSlider>{


    collectionName = 'HomeSlider';

    constructor() {
        super();
    } 

}