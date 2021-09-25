"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFamilies = exports.getFamily = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const getFamily = async (req, res) => {
    var _a;
    try {
        if (!req.params.familyId)
            throw new Error("please provide a family ID");
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const familyID = new bson_1.ObjectId(req.params.familyId);
        const family = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.aggregate([{ $match: { "families.familyId": familyID } },
            { $project: {
                    "families": { $filter: {
                            input: "$families",
                            as: "family",
                            cond: { $eq: ["$$family.familyId", familyID] }
                        } }
                }
            },
            { $unwind: "$families" },
            { $lookup: {
                    from: "Product",
                    localField: "families.familyId",
                    foreignField: "familyId",
                    as: "families.products"
                } },
            {
                $replaceRoot: { newRoot: "$families" }
            }]).toArray());
        res.status(200).send({
            status: "success",
            data: family
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getFamily = getFamily;
const getFamilies = async (req, res) => {
    var _a;
    try {
        const manufacturerID = (req.params.manufacturerId) ? { "_id": new bson_1.ObjectId(req.params.manufacturerId) } : {};
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const families = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.aggregate([
            { $match: manufacturerID }, { $unwind: "$families" },
            { $replaceRoot: { "newRoot": "$families" } }
        ]).toArray());
        res.status(200).send({
            status: "success",
            data: families
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getFamilies = getFamilies;
//# sourceMappingURL=getFamily.js.map