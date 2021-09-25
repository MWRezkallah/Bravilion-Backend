"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideos = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const getVideos = async (req, res) => {
    var _a;
    try {
        const manufacturerID = (req.params.manufacturerId) ? { "_id": new bson_1.ObjectId(req.params.manufacturerId) } : {};
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const videos = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.aggregate([
            { $match: manufacturerID },
            { $unwind: "$videos" },
            { $replaceRoot: { "newRoot": "$videos" } }
        ]).toArray());
        res.status(200).send({
            status: "success",
            data: videos
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getVideos = getVideos;
//# sourceMappingURL=getVideos.js.map