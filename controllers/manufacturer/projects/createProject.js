"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const lib_1 = require("../../../lib");
const createProject = async (req, res) => {
    var _a;
    try {
        console.log(req.body);
        const files = Object.values(req.files ? req.files : {});
        const manuRepo = new repositories_1.ManufacturerRepository();
        const projectID = new bson_1.ObjectId();
        const project = { "projectId": projectID };
        if (req.body.name) {
            project["name"] = req.body.name;
        }
        if (req.body.smallDescription) {
            project["smallDescription"] = req.body.smallDescription;
        }
        if (req.body.longDescription) {
            project["longDescription"] = req.body.longDescription;
        }
        if (req.body.productsId) {
            project["productsId"] = req.body.productsId.map(product => new bson_1.ObjectId(product));
        }
        if (files[0][0]) {
            project["coverImage"] = lib_1.extractImageModel(files[0][0]);
        }
        if (files[1]) {
            project["images"] = files[1].map((file, i) => {
                var _a;
                return { coverImage: lib_1.extractImageModel(file),
                    description: ((_a = req.body.descriptions[i]) === null || _a === void 0 ? void 0 : _a.description) || "" };
            });
        }
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const updatedData = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.findOneAndUpdate({ "_id": new bson_1.ObjectId(res.locals.manufacturer._id) }, { $push: { "projects": project } }, { projection: { "_id": 1 } }));
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