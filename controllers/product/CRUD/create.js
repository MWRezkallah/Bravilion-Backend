"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const lib_1 = require("../../../lib");
const createProduct = async (req, res) => {
    try {
        const files = Object.values(req.files ? req.files : {});
        const product = {
            ownerId: new bson_1.ObjectId(res.locals.manufacturer._id),
            name: req.body.name,
            coverImage: lib_1.extractImageModel(files[0][0]),
            views: 0,
        };
        req.body.properties ? product["properties"] = req.body.properties : {};
        req.body.families ? product["familyId"] = (req.body.families.map(family => new bson_1.ObjectId(family))) : [];
        req.body.collectionId ? product["collectionId"] = req.body.collections.map(collection => new bson_1.ObjectId(collection)) : [];
        req.body.projectsId ? product["projectsId"] = req.body.projects.map(project => new bson_1.ObjectId(project)) : [];
        req.body.categories ? product["categories"] = req.body.categories.map(category => new bson_1.ObjectId(category)) : [];
        req.body.gallery ? product["gallery"] = files[1].map(file => lib_1.extractImageModel(file)) : [];
        const prodRepo = new repositories_1.ProductRepository();
        const result = await prodRepo.create(product);
        res.status(200).send({
            status: "Success",
            data: { productId: result }
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error
        });
    }
};
exports.createProduct = createProduct;
//# sourceMappingURL=create.js.map