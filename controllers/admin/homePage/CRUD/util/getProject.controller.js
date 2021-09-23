"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjects = void 0;
const repositories_1 = require("../../../../../repositories");
const getProjects = async (req, res) => {
    var _a;
    try {
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const projects = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.aggregate([
            { $project: { "manufacturerId": "$_id", "_id": 0, "projects": 1 } },
            { $unwind: "$projects" },
            {
                $lookup: {
                    from: "Product",
                    localField: "projects.projectId",
                    foreignField: "projectsId",
                    as: "projects.products"
                }
            },
            { $replaceRoot: { newRoot: "$projects" } }
        ]).toArray());
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
//# sourceMappingURL=getProject.controller.js.map