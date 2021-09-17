"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProject = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const lib_1 = require("../../../lib");
const Storage = require("@google-cloud/storage");
const repositories_2 = require("../../../repositories");
const updateProject = async (req, res) => {
    var _a, _b, _c;
    try {
        if (!req.params.projectId)
            throw new Error("please provide a project ID");
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const projectID = new bson_1.ObjectId(req.params.projectId);
        const files = Object.values(req.files ? req.files : {});
        const updatedProject = { "projectId": projectID };
        if (req.body.name) {
            updatedProject["name"] = { arabic: req.body.arabicName, english: req.body.englishName };
        }
        if (req.body.smallDescription) {
            updatedProject["smallDescription"] = req.body.smallDescription;
        }
        if (req.body.longDescription) {
            updatedProject["longDescription"] = req.body.longDescription;
        }
        if (req.body.productsId) {
            const products = req.body.productsId.map(product => new bson_1.ObjectId(product));
            const prodRepo = new repositories_2.ProductRepository();
            if (!prodRepo.collection)
                await prodRepo.initCollection();
            await ((_a = prodRepo.collection) === null || _a === void 0 ? void 0 : _a.updateMany({ $and: [{ "_id": { $in: products } }, { "ownerId": new bson_1.ObjectId(res.locals.manufacturer._id) }] }, { $push: { "projectsId": projectID } }));
            await ((_b = prodRepo.collection) === null || _b === void 0 ? void 0 : _b.updateMany({ $and: [{ "_id": { $nin: products } }, { "projectsId": projectID }, { "ownerId": new bson_1.ObjectId(res.locals.manufacturer._id) }] }, { $pull: { "projectsId": projectID } }));
        }
        if (files[0][0]) {
            updatedProject["coverImage"] = lib_1.extractImageModel(files[0][0]);
        }
        if (files[1]) {
            updatedProject["images"] = files[1].map((file, i) => {
                var _a;
                return { image: lib_1.extractImageModel(file),
                    description: ((_a = req.body) === null || _a === void 0 ? void 0 : _a.descriptions[i]) || "" };
            });
        }
        const project = await ((_c = manuRepo.collection) === null || _c === void 0 ? void 0 : _c.findOneAndUpdate({ $and: [{ "_id": new bson_1.ObjectId(res.locals.manufacturer._id) }, { "projects.projectId": projectID }] }, { $set: { "projects.$": updatedProject } }, { projection: { "manufacturerId": "$_id", "_id": 0, "projects": { $elemMatch: { "projectId": projectID } } } }));
        if ((project === null || project === void 0 ? void 0 : project.ok) == 1) {
            const storage = new Storage();
            if (project.value.coverImage) {
                await storage.bucket(`${process.env.GCS_BUCKET}`).file(project.value.coverImage.name).delete();
            }
            if (project.value.images && project.value.images.length > 0) {
                project.value.images.map(async (image) => await storage.bucket(`${process.env.GCS_BUCKET}`).file(image.name).delete());
            }
        }
        res.status(200).send({
            status: "success",
            data: project === null || project === void 0 ? void 0 : project.value
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.updateProject = updateProject;
//# sourceMappingURL=updateProject.js.map