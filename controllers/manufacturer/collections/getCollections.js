"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollection = exports.getCollections = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const getCollections = async (req, res) => {
    var _a, _b;
    try {
        const query = (req.params.manufacturerId) ? { "_id": new bson_1.ObjectId(req.params.manufacturerId) } : {};
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const collections = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.find(query, { projection: { "_id": 0, "collections": 1 } }).toArray());
        res.status(200).send({
            status: "success",
            data: ((_b = collections[0]) === null || _b === void 0 ? void 0 : _b.collections) || []
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getCollections = getCollections;
const getCollection = async (req, res) => {
    var _a;
    try {
        if (!req.params.collectionId)
            throw new Error("please provide a collection ID");
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const collectionID = new bson_1.ObjectId(req.params.collectionId);
        const collections = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.aggregate([{ $match: { "collections.collectionId": collectionID } },
            { $project: { "_id": 0,
                    "collections": { $filter: {
                            input: "$collections",
                            as: "collection",
                            cond: { $eq: ["$$collection.collectionId", collectionID] }
                        } } }
            },
            { $unwind: "$collections" },
            { $lookup: {
                    from: "Product",
                    localField: "collections.collectionId",
                    foreignField: "collectionId",
                    as: "collections.products"
                } },
            { $replaceRoot: { newRoot: "$collections" } }
        ]).toArray());
        res.status(200).send({
            status: "success",
            data: collections
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getCollection = getCollection;
//# sourceMappingURL=getCollections.js.map