"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHomePageSections = exports.getHomePageAssets = void 0;
const repositories_1 = require("../../../repositories");
const getHomePageAssets = async (req, res) => {
    var _a;
    try {
        const homePageRepo = new repositories_1.HomePageAssetsRepository();
        if (!homePageRepo.collection)
            await homePageRepo.initCollection();
        const homePageAssets = await ((_a = homePageRepo.collection) === null || _a === void 0 ? void 0 : _a.findOne({}, { projection: { "_id": 0 } }));
        res.status(200).send({
            status: "Success",
            data: homePageAssets
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getHomePageAssets = getHomePageAssets;
const getHomePageSections = async (req, res) => {
    var _a;
    try {
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
//# sourceMappingURL=homePage.controller.js.map