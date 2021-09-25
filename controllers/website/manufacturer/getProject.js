"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjects = exports.getProject = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const getProject = async (req, res) => {
    var _a;
    try {
        if (!req.params.projectId)
            throw new Error("please provide a project ID");
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const projectID = new bson_1.ObjectId(req.params.projectId);
        const project = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.aggregate([{ $match: { "projects.projectId": projectID } },
            { $project: {
                    "projects": { $filter: {
                            input: "$projects",
                            as: "project",
                            cond: { $eq: ["$$project.projectId", projectID] }
                        } }
                }
            },
            { $unwind: "$projects" },
            { $lookup: {
                    from: "Product",
                    localField: "projects.projectId",
                    foreignField: "projectsId",
                    as: "projects.products"
                } },
            {
                $replaceRoot: { newRoot: "$projects" }
            }]).toArray());
        res.status(200).send({
            status: "success",
            data: project
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
const getProjects = async (req, res) => {
    var _a;
    try {
        const manufacturerID = (req.params.manufacturerId) ? { "_id": new bson_1.ObjectId(req.params.manufacturerId) } : {};
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const catalogues = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.aggregate([
            { $match: manufacturerID }, { $unwind: "$projects" },
            { $replaceRoot: { "newRoot": "$projects" } }
        ]).toArray());
        res.status(200).send({
            status: "success",
            data: catalogues
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
//# sourceMappingURL=getProject.js.map