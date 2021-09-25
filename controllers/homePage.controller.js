"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHomePage = exports.updateHomePage = exports.getHomePage = exports.getHomePages = exports.createHomePage = void 0;
const repositories_1 = require("../repositories");
const Storage = require("@google-cloud/storage");
const index_1 = require("../lib/index");
const bson_1 = require("bson");
const createHomePage = async (req, res) => {
    var _a, _b, _c;
    try {
        const homePageRepo = new repositories_1.HomePageAssetsRepository();
        const values = Object.values(req.files !== undefined ? req.files : {});
        let homePage = Object.assign({}, req.body);
        values.forEach(file => {
            //  Object.fromEntries([[`${file.fieldname}`, extractImageModel(file)]])
            homePage[`${file.fieldname}`] = index_1.extractImageModel(file);
        });
        if (!homePageRepo.collection)
            await homePageRepo.initCollection();
        const homep = await ((_a = homePageRepo.collection) === null || _a === void 0 ? void 0 : _a.findOne({}));
        let result;
        if (homep) {
            result = await ((_b = homePageRepo.collection) === null || _b === void 0 ? void 0 : _b.replaceOne({}, Object.assign({}, homePage)));
            const storage = new Storage();
            for (let i in homep) {
                if (homep[i].name && homep[i].path && homep[i].type && homep[i].createdAt) {
                    await storage.bucket(`${process.env.GCS_BUCKET}`).file(homep[i].name).delete();
                }
            }
        }
        else {
            result = await ((_c = homePageRepo.collection) === null || _c === void 0 ? void 0 : _c.insertOne(Object.assign({}, homePage)));
        }
        res.status(200).send({
            status: 'success',
            data: result
        });
    }
    catch (e) {
        res.status(400).send({
            err: e
        });
    }
};
exports.createHomePage = createHomePage;
const getHomePages = async (req, res) => {
    try {
        const homePageRepo = new repositories_1.HomePageAssetsRepository();
        const homePages = await homePageRepo.findAll();
        res.status(200).send({
            status: 'success',
            data: homePages
        });
    }
    catch (e) {
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
};
exports.getHomePages = getHomePages;
const getHomePage = async (req, res) => {
    try {
        const homePageRepo = new repositories_1.HomePageAssetsRepository();
        const _id = req.params.id;
        const homePage = await homePageRepo.findOne(_id);
        res.status(200).send({
            status: 'success',
            data: homePage
        });
    }
    catch (e) {
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
};
exports.getHomePage = getHomePage;
const updateHomePage = async (req, res) => {
    var _a;
    try {
        const homePageRepo = new repositories_1.HomePageAssetsRepository();
        const _id = req.params.id;
        const homePage = await homePageRepo.findOne(_id);
        // const prevDesktopImage = slider.desktopImage.path;
        // const prevMobileImage  = slider.mobileImage.path;
        // unlinkSync(prevDesktopImage);
        // unlinkSync(prevMobileImage);
        const values = Object.values(req.files !== undefined ? req.files : {});
        let updatedHomePage = Object.assign({}, req.body);
        values.forEach(file => {
            //  Object.fromEntries([[`${file.fieldname}`, extractImageModel(file)]])
            updatedHomePage[`${file.fieldname}`] = index_1.extractImageModel(file);
        });
        const re = await ((_a = homePageRepo.collection) === null || _a === void 0 ? void 0 : _a.replaceOne({ "_id": new bson_1.ObjectId(_id) }, updatedHomePage));
        const storage = new Storage();
        for (let i in homePage) {
            if (homePage[i].name && homePage[i].path && homePage[i].type && homePage[i].createdAt) {
                await storage.bucket(`${process.env.GCS_BUCKET}`).file(homePage[i].name).delete();
            }
        }
        res.status(200).send({
            status: 'success',
            data: re
        });
    }
    catch (e) {
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
};
exports.updateHomePage = updateHomePage;
const deleteHomePage = async (req, res) => {
    try {
        const homePageRepo = new repositories_1.HomePageAssetsRepository();
        const _id = req.params.id;
        const homePage = await homePageRepo.findOne(_id);
        await homePageRepo.delete(_id);
        const storage = new Storage();
        for (let i in homePage) {
            if (homePage[i].name && homePage[i].path && homePage[i].type && homePage[i].createdAt) {
                await storage.bucket(`${process.env.GCS_BUCKET}`).file(homePage[i].name).delete();
            }
        }
        res.status(200).send({
            status: 'successfully delete',
        });
    }
    catch (e) {
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
};
exports.deleteHomePage = deleteHomePage;
//# sourceMappingURL=homePage.controller.js.map