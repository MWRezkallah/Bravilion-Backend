"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCatalogue = void 0;
const bson_1 = require("bson");
const lib_1 = require("../../../lib");
const repositories_1 = require("../../../repositories");
const Storage = require("@google-cloud/storage");
const createCatalogue = async (req, res) => {
    var _a;
    try {
        const values = Object.values(req.files !== undefined ? req.files : {});
        const pdf = lib_1.extractPdfModel(values[0][0]);
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const catalogueID = new bson_1.ObjectId();
        const updatedData = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.findOneAndUpdate({ "_id": new bson_1.ObjectId(res.locals.manufacturer._id) }, { $push: { "catalogues": Object.assign({ "catalogueId": catalogueID, pdf }, req.body) } }, { projection: { "_id": 1 } }));
        res.status(200).send({
            status: "success",
            message: `a catalogue has  been created successfully for ${res.locals.manufacturer.name}`,
            data: { "manufacturerID": updatedData === null || updatedData === void 0 ? void 0 : updatedData.value._id, catalogueID }
        });
    }
    catch (error) {
        const values = Object.values(req.files !== undefined ? req.files : {});
        if (values[0][0]) {
            const storage = new Storage();
            await storage.bucket(`${process.env.GCS_BUCKET}`).file(values[0][0].filename).delete();
        }
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.createCatalogue = createCatalogue;
//# sourceMappingURL=createCatalogue.js.map