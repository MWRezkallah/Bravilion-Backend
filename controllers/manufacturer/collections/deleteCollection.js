"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCollection = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const Storage = require("@google-cloud/storage");
const repositories_2 = require("../../../repositories");
const deleteCollection = async (req, res) => {
    var _a, _b;
    try {
        if (!req.params.collectionId)
            throw new Error("please provide a collection ID");
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const collectionID = new bson_1.ObjectId(req.params.collectionId);
        const collection = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.findOneAndUpdate({ $and: [{ "_id": new bson_1.ObjectId(res.locals.manufacturer._id) }, { "collections.collectionId": collectionID }] }, { $pull: { "collections": { "collectionId": collectionID } } }, { projection: { "manufacturerId": "$_id", "_id": 0, "collections": { $elemMatch: { "collectionId": collectionID } } } }));
        const prodRepo = new repositories_2.ProductRepository();
        if (!prodRepo.collection)
            await prodRepo.initCollection();
        await ((_b = prodRepo.collection) === null || _b === void 0 ? void 0 : _b.updateMany({ $and: [{ "ownerId": new bson_1.ObjectId(res.locals.manufacturer._id) }, { "collectionId": collectionID }] }, { $pull: { "collectionId": collectionID } }));
        const storage = new Storage();
        if (collection === null || collection === void 0 ? void 0 : collection.value.collections[0].coverImage.name)
            await storage.bucket(`${process.env.GCS_BUCKET}`).file(collection === null || collection === void 0 ? void 0 : collection.value.collections[0].coverImage.name).delete();
        res.status(200).send({
            status: "success",
            data: collection === null || collection === void 0 ? void 0 : collection.value
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.deleteCollection = deleteCollection;
//# sourceMappingURL=deleteCollection.js.map