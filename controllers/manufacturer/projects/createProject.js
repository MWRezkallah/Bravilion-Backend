"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const lib_1 = require("../../../lib");
const repositories_2 = require("../../../repositories");
const createProject = async (req, res) => {
    var _a, _b;
    try {
        const files = Object.values(req.files ? req.files : {});
        const manuRepo = new repositories_1.ManufacturerRepository();
        const projectID = new bson_1.ObjectId();
        const project = { "projectId": projectID };
        if (req.body.arabicName && req.body.englishName) {
            project["name"] = { arabic: req.body.arabicName, english: req.body.englishName };
        }
        if (req.body.arabicSmallDescription && req.body.englishSmallDescription) {
            project["smallDescription"] = { arabic: req.body.arabicSmallDescription, english: req.body.englishSmallDescription };
        }
        if (req.body.arabicLongDescription && req.body.englishLongDescription) {
            project["longDescription"] = { arabic: req.body.arabicLongDescription, english: req.body.englishLongDescription };
        }
        if (req.body.productsId) {
            const products = req.body.productsId.map(product => new bson_1.ObjectId(product));
            const prodRepo = new repositories_2.ProductRepository();
            if (!prodRepo.collection)
                await prodRepo.initCollection();
            await ((_a = prodRepo.collection) === null || _a === void 0 ? void 0 : _a.updateMany({ $and: [{ "_id": { $in: products } }, { "ownerId": new bson_1.ObjectId(res.locals.manufacturer._id) }] }, { $push: { "projectsId": projectID } }));
        }
        if (files[0][0]) {
            project["coverImage"] = lib_1.extractImageModel(files[0][0]);
        }
        if (files[1]) {
            project["images"] = files[1].map((file, i) => {
                return lib_1.extractImageModel(file);
            });
        }
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const updatedData = await ((_b = manuRepo.collection) === null || _b === void 0 ? void 0 : _b.findOneAndUpdate({ "_id": new bson_1.ObjectId(res.locals.manufacturer._id) }, { $push: { "projects": project } }, { projection: { "_id": 1 } }));
        res.status(200).send({
            status: "success",
            message: `a project has  been created successfully for ${res.locals.manufacturer.name}`,
            data: { "manufacturerID": updatedData === null || updatedData === void 0 ? void 0 : updatedData.value._id, projectID }
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.createProject = createProject;
//# sourceMappingURL=createProject.js.map