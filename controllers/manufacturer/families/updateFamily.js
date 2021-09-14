"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFamily = void 0;
const bson_1 = require("bson");
const lib_1 = require("../../../lib");
const repositories_1 = require("../../../repositories");
const Storage = require("@google-cloud/storage");
const repositories_2 = require("../../../repositories");
const updateFamily = async (req, res) => {
    var _a, _b, _c, _d, _e, _f;
    try {
        if (!req.params.familyId)
            throw new Error("please provide a family ID");
        const values = Object.values(req.files !== undefined ? req.files : {});
        const familyID = new bson_1.ObjectId(req.params.familyId);
        let update = { $set: { "families.$": Object.assign({ "familyId": familyID }, req.body) } };
        let hasImageChanged = false;
        if (values[0][0].filename) {
            const coverImage = lib_1.extractImageModel(values[0][0]);
            update = { $set: { "families.$": { familyId: familyID, coverImage, name: req.body.name } } };
            hasImageChanged = true;
        }
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const family = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.findOneAndUpdate({ $and: [{ "_id": new bson_1.ObjectId(res.locals.manufacturer._id) }, { "families.familyId": familyID }] }, update, { projection: { "manufacturerId": "$_id", "_id": 0, "families": { $elemMatch: { "familyId": familyID } } } }));
        if (req.body.products) {
            const products = req.body.products.map(product => new bson_1.ObjectId(product));
            const prodRepo = new repositories_2.ProductRepository();
            if (!prodRepo.collection)
                await prodRepo.initCollection();
            await ((_b = prodRepo.collection) === null || _b === void 0 ? void 0 : _b.updateMany({ $and: [{ "_id": { $in: products } }, { "ownerId": new bson_1.ObjectId(res.locals.manufacturer._id) }] }, { $push: { "familyId": familyID } }));
            await ((_c = prodRepo.collection) === null || _c === void 0 ? void 0 : _c.updateMany({ $and: [{ "_id": { $nin: products } }, { "familyId": familyID }, { "ownerId": new bson_1.ObjectId(res.locals.manufacturer._id) }] }, { $pull: { "familyId": familyID } }));
        }
        if (hasImageChanged) {
            const storage = new Storage();
            if ((_f = (_e = (_d = family === null || family === void 0 ? void 0 : family.value) === null || _d === void 0 ? void 0 : _d.collections[0]) === null || _e === void 0 ? void 0 : _e.coverImage) === null || _f === void 0 ? void 0 : _f.name)
                await storage.bucket(`${process.env.GCS_BUCKET}`).file(family === null || family === void 0 ? void 0 : family.value.families[0].coverImage.name).delete();
        }
        res.status(200).send({
            status: "success",
            data: family === null || family === void 0 ? void 0 : family.value
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
exports.updateFamily = updateFamily;
//# sourceMappingURL=updateFamily.js.map