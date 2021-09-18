"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const lib_1 = require("../../../lib");
const Storage = require("@google-cloud/storage");
const updateProduct = async (req, res) => {
    var _a;
    try {
        const productId = new bson_1.ObjectId(req.params.productId);
        const ownerId = new bson_1.ObjectId(res.locals.manufacturer._id);
        const files = Object.values(req.files ? req.files : {});
        const product = {
            ownerId: ownerId,
            name: { arabic: req.body.arabicName, english: req.body.englishName },
            coverImage: lib_1.extractImageModel(files[0][0]),
            views: 0,
        };
        req.body.properties ? product["properties"] = req.body.properties : {};
        req.body.families ? product["familyId"] = (req.body.families.map(family => new bson_1.ObjectId(family))) : [];
        req.body.collectionId ? product["collectionId"] = req.body.collections.map(collection => new bson_1.ObjectId(collection)) : [];
        req.body.projectsId ? product["projectsId"] = req.body.projects.map(project => new bson_1.ObjectId(project)) : [];
        req.body.categories ? product["categories"] = req.body.categories.map(category => new bson_1.ObjectId(category)) : [];
        if (files[1]) {
            product["gallery"] = files[1].map(file => lib_1.extractImageModel(file));
        }
        const prodRepo = new repositories_1.ProductRepository();
        if (!prodRepo.collection)
            await prodRepo.initCollection();
        const result = await ((_a = prodRepo.collection) === null || _a === void 0 ? void 0 : _a.findOneAndUpdate({ $and: [{ "_id": productId }, { ownerId: ownerId }] }, { $set: Object.assign({}, product) }));
        if ((result === null || result === void 0 ? void 0 : result.ok) == 1) {
            const storage = new Storage();
            if (result.value.coverImage) {
                await storage.bucket(`${process.env.GCS_BUCKET}`).file(result.value.coverImage.name).delete();
            }
            if (files[1] && result.value.gallery && result.value.gallery.length > 0) {
                result.value.gallery.map(async (image) => await storage.bucket(`${process.env.GCS_BUCKET}`).file(image.name).delete());
            }
        }
        res.status(200).send({
            status: ((result === null || result === void 0 ? void 0 : result.ok) == 1) ? "Success" : "Failed to update",
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
exports.updateProduct = updateProduct;
//# sourceMappingURL=update.js.map