"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const Storage = require("@google-cloud/storage");
const deleteProduct = async (req, res) => {
    var _a;
    try {
        const productId = new bson_1.ObjectId(req.params.productId);
        const ownerId = new bson_1.ObjectId(res.locals.manufacturer._id);
        const prodRepo = new repositories_1.ProductRepository();
        if (!prodRepo.collection)
            await prodRepo.initCollection();
        const result = await ((_a = prodRepo.collection) === null || _a === void 0 ? void 0 : _a.findOneAndDelete({ $and: [{ "_id": productId }, { ownerId: ownerId }] }));
        if ((result === null || result === void 0 ? void 0 : result.ok) == 1) {
            const storage = new Storage();
            if (result.value.coverImage) {
                await storage.bucket(`${process.env.GCS_BUCKET}`).file(result.value.coverImage.name).delete();
            }
            if (result.value.gallery && result.value.gallery.length > 0) {
                result.value.gallery.map(async (image) => await storage.bucket(`${process.env.GCS_BUCKET}`).file(image.name).delete());
            }
        }
        res.status(200).send({
            status: ((result === null || result === void 0 ? void 0 : result.ok) == 1) ? "Success" : "Failed to delete",
            data: result === null || result === void 0 ? void 0 : result.value
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error
        });
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=delete.js.map