"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
const bson_1 = require("bson");
const lib_1 = require("../../lib");
const repositories_1 = require("../../repositories");
const Storage = require("@google-cloud/storage");
const update = async (req, res) => {
    var _a;
    try {
        const values = Object.values(req.files !== undefined ? req.files : {});
        const clientRepo = new repositories_1.ClientRepository();
        const updatedClient = {};
        if (req.body.email) {
            updatedClient["email"] = req.body.email;
        }
        if (req.body.phone) {
            updatedClient["phone"] = req.body.phone;
        }
        if (req.body.password) {
            updatedClient["password"] = await clientRepo.encrypPassword(req.body.password);
        }
        if (req.body.arabicName && req.body.englishName) {
            updatedClient["name"] = { arabic: req.body.arabicName, english: req.body.englishName };
        }
        if (values[0][0]) {
            updatedClient["avatar"] = lib_1.extractImageModel(values[0][0]);
        }
        if (values[1][0]) {
            updatedClient["coverImage"] = lib_1.extractImageModel(values[1][0]);
        }
        if (req.body.contactInfo) {
            updatedClient["contactInfo"] = req.body.contactInfo;
        }
        const clientId = new bson_1.ObjectId(res.locals.client._id);
        if (!clientRepo.collection)
            await clientRepo.initCollection();
        const result = await ((_a = clientRepo.collection) === null || _a === void 0 ? void 0 : _a.findOneAndUpdate({ "_id": clientId }, { $set: updatedClient }));
        if ((result === null || result === void 0 ? void 0 : result.ok) == 1) {
            const storage = new Storage();
            if (values[0][0] && (result === null || result === void 0 ? void 0 : result.value.avatar.name)) {
                await storage.bucket(`${process.env.GCS_BUCKET}`).file(result.value.avatar.name).delete();
            }
            if (values[1][0] && (result === null || result === void 0 ? void 0 : result.value.coverImage.name)) {
                await storage.bucket(`${process.env.GCS_BUCKET}`).file(result.value.coverImage.name).delete();
            }
        }
        res.status(200).send({
            status: 'success',
            message: result
        });
    }
    catch (e) {
        res.status(400).send({
            status: "Error",
            message: e.message
        });
    }
};
exports.update = update;
//# sourceMappingURL=update.js.map