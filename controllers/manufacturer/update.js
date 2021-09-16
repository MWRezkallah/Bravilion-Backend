"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
const bson_1 = require("bson");
const lib_1 = require("../../lib");
const repositories_1 = require("../../repositories");
const update = async (req, res) => {
    var _a;
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
        const updateManu = {};
        if (req.body.email) {
            updateManu["email"] = req.body.email;
        }
        if (req.body.password) {
            updateManu["password"] = await manuRepo.encrypPassword(req.body.password);
        }
        if (req.body.name) {
            updateManu["name"] = req.body.name;
        }
        if (values[0][0]) {
            updateManu["logo"] = lib_1.extractImageModel(values[0][0]);
        }
        if (values[1][0]) {
            updateManu["header"] = lib_1.extractImageModel(values[1][0]);
        }
        if (req.body.about) {
            updateManu["about"] = req.body.about;
        }
        if (req.body.contactInfo) {
            updateManu["contactInfo"] = req.body.contactInfo;
        }
        const manuId = new bson_1.ObjectId(res.locals.manufacturer._id);
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const result = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.updateOne({ "_id": manuId }, { $set: updateManu }));
        res.status(200).send({
            status: 'success',
            message: result
        });
    }
    catch (e) {
        res.status(400).send({
            status: "Error",
            message: e.message
        });
    }
};
exports.update = update;
//# sourceMappingURL=update.js.map