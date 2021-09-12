"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVideo = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const createVideo = async (req, res) => {
    var _a;
    try {
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const videoID = new bson_1.ObjectId();
        const updatedData = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.findOneAndUpdate({ "_id": new bson_1.ObjectId(res.locals.manufacturer._id) }, { $push: { "videos": Object.assign({ "videoId": videoID }, req.body) } }, { projection: { "_id": 1 } }));
        res.status(200).send({
            status: "success",
            message: `video created for ${res.locals.manufacturer.name}`,
            data: { "manufacturerID": updatedData === null || updatedData === void 0 ? void 0 : updatedData.value._id, videoID }
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.createVideo = createVideo;
//# sourceMappingURL=createVideo.js.map