"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCatalogue = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const Storage = require("@google-cloud/storage");
const deleteCatalogue = async (req, res) => {
    var _a;
    try {
        if (!req.params.catalogueId)
            throw new Error("please provide a catalogue ID");
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const catalogueID = new bson_1.ObjectId(req.params.catalogueId);
        const catalogue = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.findOneAndUpdate({ $and: [{ "_id": new bson_1.ObjectId(res.locals.manufacturer._id) }, { "catalogues.catalogueId": catalogueID }] }, { $pull: { "catalogues": { "catalogueId": catalogueID } } }, { projection: { "manufacturerId": "$_id", "_id": 0, "catalogues": { $elemMatch: { "catalogueId": catalogueID } } } }));
        const storage = new Storage();
        if (catalogue === null || catalogue === void 0 ? void 0 : catalogue.value.catalogues[0].pdf.name)
            await storage.bucket(`${process.env.GCS_BUCKET}`).file(catalogue === null || catalogue === void 0 ? void 0 : catalogue.value.catalogues[0].pdf.name).delete();
        res.status(200).send({
            status: "success",
            data: catalogue === null || catalogue === void 0 ? void 0 : catalogue.value
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.deleteCatalogue = deleteCatalogue;
//# sourceMappingURL=deleteCatalogue.js.map