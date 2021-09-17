"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCollection = void 0;
const bson_1 = require("bson");
const lib_1 = require("../../../lib");
const repositories_1 = require("../../../repositories");
const Storage = require("@google-cloud/storage");
const repositories_2 = require("../../../repositories");
const createCollection = async (req, res) => {
    var _a, _b;
    try {
        const values = Object.values(req.files !== undefined ? req.files : {});
        const coverImage = lib_1.extractImageModel(values[0][0]);
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const collectionID = new bson_1.ObjectId();
        const collection = {
            "collectionId": collectionID,
            coverImage,
            name: { arabic: req.body.arabicName, english: req.body.englishName }
        };
        const updatedData = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.findOneAndUpdate({ "_id": new bson_1.ObjectId(res.locals.manufacturer._id) }, { $push: { "collections": collection } }, { projection: { "_id": 1 } }));
        if (req.body.products) {
            const products = req.body.products.map(product => new bson_1.ObjectId(product));
            const prodRepo = new repositories_2.ProductRepository();
            if (!prodRepo.collection)
                await prodRepo.initCollection();
            await ((_b = prodRepo.collection) === null || _b === void 0 ? void 0 : _b.updateMany({ $and: [{ "_id": { $in: products } }, { "ownerId": new bson_1.ObjectId(res.locals.manufacturer._id) }] }, { $push: { "collectionId": collectionID } }));
        }
        res.status(200).send({
            status: "success",
            message: `a collection has  been created successfully for ${res.locals.manufacturer.name}`,
            data: { "manufacturerID": updatedData === null || updatedData === void 0 ? void 0 : updatedData.value._id, collectionID }
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
exports.createCollection = createCollection;
//# sourceMappingURL=createCollection.js.map