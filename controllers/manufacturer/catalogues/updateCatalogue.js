"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCatalogue = void 0;
const bson_1 = require("bson");
const lib_1 = require("../../../lib");
const repositories_1 = require("../../../repositories");
const Storage = require("@google-cloud/storage");
const updateCatalogue = async (req, res) => {
    var _a, _b, _c, _d;
    try {
        if (!req.params.catalogueId)
            throw new Error("please provide a catalogue ID");
        const values = Object.values(req.files !== undefined ? req.files : {});
        const catalogueID = new bson_1.ObjectId(req.params.catalogueId);
        let update = { $set: { "catalogues.$": { catalogueId: catalogueID,
                    description: { arabic: req.body.arabicDescription, english: req.body.englishDescription },
                    name: { arabic: req.body.arabicName, english: req.body.englishName } } } };
        let hasPdfChanged = false;
        if (values[0][0].filename) {
            const pdf = lib_1.extractPdfModel(values[0][0]);
            update = { $set: { "catalogues.$": { catalogueId: catalogueID, pdf, description: { arabic: req.body.arabicDescription, english: req.body.englishDescription },
                        name: { arabic: req.body.arabicName, english: req.body.englishName } } } };
            hasPdfChanged = true;
        }
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const catalogue = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.findOneAndUpdate({ $and: [{ "_id": new bson_1.ObjectId(res.locals.manufacturer._id) }, { "catalogues.catalogueId": catalogueID }] }, update, { projection: { "manufacturerId": "$_id", "_id": 0, "catalogues": { $elemMatch: { "catalogueId": catalogueID } } } }));
        if (hasPdfChanged) {
            const storage = new Storage();
            if ((_d = (_c = (_b = catalogue === null || catalogue === void 0 ? void 0 : catalogue.value) === null || _b === void 0 ? void 0 : _b.catalogues[0]) === null || _c === void 0 ? void 0 : _c.pdf) === null || _d === void 0 ? void 0 : _d.name)
                await storage.bucket(`${process.env.GCS_BUCKET}`).file(catalogue === null || catalogue === void 0 ? void 0 : catalogue.value.catalogues[0].pdf.name).delete();
        }
        res.status(200).send({
            status: "success",
            data: catalogue === null || catalogue === void 0 ? void 0 : catalogue.value
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
exports.updateCatalogue = updateCatalogue;
//# sourceMappingURL=updateCatalogue.js.map