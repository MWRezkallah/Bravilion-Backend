"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideo = exports.getVideos = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const getVideos = async (req, res) => {
    var _a;
    try {
        const query = (req.params.manufacturerId) ? { "_id": new bson_1.ObjectId(req.params.manufacturerId) } : {};
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const videos = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.find(query, { projection: { "manufacturerId": "$_id", "_id": 0, "videos": 1 } }).toArray());
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
const getVideo = async (req, res) => {
    var _a;
    try {
        if (!req.params.videoId)
            throw new Error("please provide a video ID");
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const videoID = new bson_1.ObjectId(req.params.videoId);
        const videos = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.find({ "videos.videoId": videoID }, { projection: { "manufacturerId": "$_id", "_id": 0, "videos": { $elemMatch: { "videoId": videoID } } } }).toArray());
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
exports.getVideo = getVideo;
//# sourceMappingURL=getVideos.js.map