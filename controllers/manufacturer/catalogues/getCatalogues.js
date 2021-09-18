"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCatalogue = exports.getCatalogues = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const getCatalogues = async (req, res) => {
    var _a, _b;
    try {
        const query = (req.params.manufacturerId) ? { "_id": new bson_1.ObjectId(req.params.manufacturerId) } : {};
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const catalogues = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.find(query, { projection: { "manufacturerId": "$_id", "_id": 0, "catalogues": 1 } }).toArray());
        res.status(200).send({
            status: "success",
            data: ((_b = catalogues[0]) === null || _b === void 0 ? void 0 : _b.catalogues) || []
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getCatalogues = getCatalogues;
const getCatalogue = async (req, res) => {
    var _a, _b;
    try {
        if (!req.params.catalogueId)
            throw new Error("please provide a catalogue ID");
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const catalogueID = new bson_1.ObjectId(req.params.catalogueId);
        const catalogues = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.find({ "catalogues.catalogueId": catalogueID }, { projection: { "manufacturerId": "$_id", "_id": 0, "catalogues": { $elemMatch: { "catalogueId": catalogueID } } } }).toArray());
        res.status(200).send({
            status: "success",
            data: (_b = catalogues[0]) === null || _b === void 0 ? void 0 : _b.catalogues
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getCatalogue = getCatalogue;
//# sourceMappingURL=getCatalogues.js.map