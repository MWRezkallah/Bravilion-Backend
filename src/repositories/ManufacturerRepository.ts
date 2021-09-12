import * as bcrypt  from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import {IManufacturer} from '../models';
import { IRepository, Repository } from '.';


export class ManufacturerRepository extends Repository<IManufacturer> implements IRepository<IManufacturer>{


    constructor() {
        super();
    }

    collectionName = 'Manufacturer';


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
        let manufacturer =  await this.findOneByQuery({_id:id});
        const token = jwt.sign({_id: manufacturer._id, name: manufacturer.name, email:manufacturer.email, role:"Manufacturer"} , `${process.env.apiSecretKey}`, {expiresIn : `${ exp.getDate()} days`});
        if(manufacturer.tokens === undefined) manufacturer.tokens=[];
        manufacturer.tokens.push({token});
        const data = await this.update(manufacturer._id, manufacturer);
        return token;
    }


}