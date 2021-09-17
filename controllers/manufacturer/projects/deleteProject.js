"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const Storage = require("@google-cloud/storage");
const repositories_2 = require("../../../repositories");
const deleteProject = async (req, res) => {
    var _a, _b;
    try {
        if (!req.params.projectId)
            throw new Error("please provide a project ID");
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const projectID = new bson_1.ObjectId(req.params.projectId);
        const project = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.findOneAndUpdate({ $and: [{ "_id": new bson_1.ObjectId(res.locals.manufacturer._id) }, { "projects.projectId": projectID }] }, { $pull: { "projects": { "projectId": projectID } } }, { projection: { "manufacturerId": "$_id", "_id": 0, "projects": { $elemMatch: { "projectId": projectID } } } }));
        const prodRepo = new repositories_2.ProductRepository();
        if (!prodRepo.collection)
            await prodRepo.initCollection();
        await ((_b = prodRepo.collection) === null || _b === void 0 ? void 0 : _b.updateMany({ $and: [{ "ownerId": new bson_1.ObjectId(res.locals.manufacturer._id) }, { "projectsId": projectID }] }, { $pull: { "projectsId": projectID } }));
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
exports.deleteProject = deleteProject;
//# sourceMappingURL=deleteProject.js.map