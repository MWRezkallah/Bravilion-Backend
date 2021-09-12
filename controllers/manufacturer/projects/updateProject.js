"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProject = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const updateProject = async (req, res) => {
    var _a;
    try {
        if (!req.params.projectId)
            throw new Error("please provide a project ID");
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const projectID = new bson_1.ObjectId(req.params.projectId);
        const project = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.findOneAndUpdate({ $and: [{ "_id": new bson_1.ObjectId(res.locals.manufacturer._id) }, { "projects.projectId": projectID }] }, { $set: { "projects.$": Object.assign({ projectId: projectID }, req.body) } }, { projection: { "manufacturerId": "$_id", "_id": 0, "projects": { $elemMatch: { "projectId": projectID } } } }));
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