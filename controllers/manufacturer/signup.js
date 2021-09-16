"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = void 0;
const repositories_1 = require("../../repositories");
const signUp = async (req, res) => {
    try {
        // email:string,
        // password:string,
        // name:string,
        // logo:IFile,
        // header:IFile,
        // about:string,
        // contactInfo:IGeneric[],
        // videos:{name:string, url:string, description:string}
        // enquiries:IGeneric[],
        // projects:IGeneric[],
        // catalogues:{name:string, pdf:IFile, description:string},
        //collection
        //family
        // articlesId:string[],
        // tradeFairsId:string[],
        // productsId:string[],
        // ordersId:string[],
        const values = Object.values(req.files !== undefined ? req.files : {});
        const manuRepo = new repositories_1.ManufacturerRepository();
        const newManu = {
            email: req.body.email,
            password: await manuRepo.encrypPassword(req.body.password),
            name: req.body.name,
            // logo: extractImageModel(values[0][0]),
            // header: extractImageModel(values[1][0]),
            // about: req.body.about,
            // contactInfo:req.body.contactInfo
        };
        const manuId = await manuRepo.create(newManu);
        const token = await manuRepo.generateToken(manuId);
        res.status(200).send({
            status: 'success',
            data: { name: newManu.name, email: newManu.email, id: manuId },
            token: token
        });
    }
    catch (e) {
        res.status(400).json(e);
    }
};
exports.signUp = signUp;
//# sourceMappingURL=signup.js.map