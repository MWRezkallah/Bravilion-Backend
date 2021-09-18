"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideo = exports.getVideos = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const getVideos = async (req, res) => {
    var _a, _b;
    try {
        const query = (res.locals.manufacturer._id) ? { "_id": new bson_1.ObjectId(res.locals.manufacturer._id) } : {};
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const videos = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.find(query, { projection: { "_id": 0, "videos": 1 } }).toArray());
        res.status(200).send({
            status: "success",
            data: ((_b = videos[0]) === null || _b === void 0 ? void 0 : _b.videos) || []
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
    var _a, _b;
    try {
        if (!req.params.videoId)
            throw new Error("please provide a video ID");
        const query = (res.locals.manufacturer._id) ? { "_id": new bson_1.ObjectId(res.locals.manufacturer._id) } : {};
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const videoID = new bson_1.ObjectId(req.params.videoId);
        const videos = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.find(Object.assign(Object.assign({}, query), { "videos.videoId": videoID }), { projection: { "_id": 0, "videos": { $elemMatch: { "videoId": videoID } } } }).toArray());
        res.status(200).send({
            status: "success",
            data: ((_b = videos[0]) === null || _b === void 0 ? void 0 : _b.videos) || []
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