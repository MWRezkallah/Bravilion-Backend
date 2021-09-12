"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProject = exports.getProjects = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const getProjects = async (req, res) => {
    var _a;
    try {
        const query = (req.params.manufacturerId) ? { "_id": new bson_1.ObjectId(req.params.manufacturerId) } : {};
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const projects = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.find(query, { projection: { "manufacturerId": "$_id", "_id": 0, "projects": 1 } }).toArray());
        res.status(200).send({
            status: "success",
            data: projects
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getProjects = getProjects;
const getProject = async (req, res) => {
    var _a;
    try {
        if (!req.params.projectId)
            throw new Error("please provide a project ID");
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const projectID = new bson_1.ObjectId(req.params.projectId);
        const projects = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.find({ "projects.projectId": projectID }, { projection: { "manufacturerId": "$_id", "_id": 0, "projects": { $elemMatch: { "projectId": projectID } } } }).toArray());
        res.status(200).send({
            status: "success",
            data: projects
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getProject = getProject;
//# sourceMappingURL=getProjects.js.map