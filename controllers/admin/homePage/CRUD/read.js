"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHomePageSections = exports.getHomePageSection = void 0;
const repositories_1 = require("../../../../repositories");
const bson_1 = require("bson");
const getHomePageSection = async (req, res) => {
    var _a;
    try {
        if (!req.params.sectionId)
            throw new Error("please provide a sectionId");
        const sectionID = new bson_1.ObjectId(req.params.sectionId);
        const homePageRepo = new repositories_1.HomePageRepository();
        if (!homePageRepo.collection)
            await homePageRepo.initCollection();
        const homePage = await ((_a = homePageRepo.collection) === null || _a === void 0 ? void 0 : _a.findOne({ "_id": sectionID }));
        res.status(200).send({
            status: "Success",
            data: homePage
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getHomePageSection = getHomePageSection;
const getHomePageSections = async (req, res) => {
    var _a;
    try {
        const sectionID = new bson_1.ObjectId(req.params.sectionId);
        const homePageRepo = new repositories_1.HomePageRepository();
        if (!homePageRepo.collection)
            await homePageRepo.initCollection();
        const homePage = await ((_a = homePageRepo.collection) === null || _a === void 0 ? void 0 : _a.find().sort({ "order": 1 }).toArray());
        res.status(200).send({
            status: "Success",
            data: homePage
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getHomePageSections = getHomePageSections;
//# sourceMappingURL=read.js.map