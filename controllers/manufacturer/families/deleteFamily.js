"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFamily = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const Storage = require("@google-cloud/storage");
const repositories_2 = require("../../../repositories");
const deleteFamily = async (req, res) => {
    var _a, _b;
    try {
        if (!req.params.familyId)
            throw new Error("please provide a family ID");
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const familyID = new bson_1.ObjectId(req.params.familyId);
        const family = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.findOneAndUpdate({ $and: [{ "_id": new bson_1.ObjectId(res.locals.manufacturer._id) }, { "families.familyId": familyID }] }, { $pull: { "families": { "familyId": familyID } } }, { projection: { "manufacturerId": "$_id", "_id": 0, "families": { $elemMatch: { "familyId": familyID } } } }));
        const prodRepo = new repositories_2.ProductRepository();
        if (!prodRepo.collection)
            await prodRepo.initCollection();
        await ((_b = prodRepo.collection) === null || _b === void 0 ? void 0 : _b.updateMany({ $and: [{ "ownerId": new bson_1.ObjectId(res.locals.manufacturer._id) }, { "familyId": familyID }] }, { $pull: { "familyId": familyID } }));
        const storage = new Storage();
        if (family === null || family === void 0 ? void 0 : family.value.families[0].coverImage.name)
            await storage.bucket(`${process.env.GCS_BUCKET}`).file(family === null || family === void 0 ? void 0 : family.value.families[0].coverImage.name).delete();
        res.status(200).send({
            status: "success",
            data: family === null || family === void 0 ? void 0 : family.value
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.deleteFamily = deleteFamily;
//# sourceMappingURL=deleteFamily.js.map