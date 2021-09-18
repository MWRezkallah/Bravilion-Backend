"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVideo = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const updateVideo = async (req, res) => {
    var _a;
    try {
        if (!req.params.videoId)
            throw new Error("please provide a video ID");
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const videoID = new bson_1.ObjectId(req.params.videoId);
        const video = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.findOneAndUpdate({ $and: [{ "_id": new bson_1.ObjectId(res.locals.manufacturer._id) }, { "videos.videoId": videoID }] }, { $set: { "videos.$": { videoId: videoID, name: req.body.name,
                    url: req.body.url, description: req.body.description } } }, { projection: { "manufacturerId": "$_id", "_id": 0, "videos": { $elemMatch: { "videoId": videoID } } } }));
        res.status(200).send({
            status: "success",
            data: video === null || video === void 0 ? void 0 : video.value
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.updateVideo = updateVideo;
//# sourceMappingURL=updateVideo.js.map