"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHomePage = exports.updateHomePage = exports.getHomePage = exports.getHomePages = exports.createHomePage = void 0;
const repositories_1 = require("../repositories");
const Storage = require("@google-cloud/storage");
const index_1 = require("../lib/index");
const bson_1 = require("bson");
const createHomePage = async (req, res) => {
    try {
        const homePageRepo = new repositories_1.HomePageRepository();
        const values = Object.values(req.files !== undefined ? req.files : {});
        let homePage = Object.assign({}, req.body);
        values.forEach(file => {
            //  Object.fromEntries([[`${file.fieldname}`, extractImageModel(file)]])
            homePage[`${file.fieldname}`] = index_1.extractImageModel(file);
        });
        const re = await homePageRepo.create(homePage);
        res.status(200).send({
            status: 'success',
            data: re
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
        const homePageRepo = new repositories_1.HomePageRepository();
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
        const homePageRepo = new repositories_1.HomePageRepository();
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
        const homePageRepo = new repositories_1.HomePageRepository();
        const _id = req.params.id;
        const homePage = await homePageRepo.findOne(_id);
        // const prevDesktopImage = slider.desktopImage.path;
        // const prevMobileImage  = slider.mobileImage.path;
        // unlinkSync(prevDesktopImage);
        // unlinkSync(prevMobileImage);
        const storage = new Storage();
        for (let i in homePage) {
            if (homePage[i].name && homePage[i].path && homePage[i].type && homePage[i].createdAt) {
                await storage.bucket(`${process.env.GCS_BUCKET}`).file(homePage[i].name).delete();
            }
        }
        const values = Object.values(req.files !== undefined ? req.files : {});
        let updatedHomePage = Object.assign({}, req.body);
        values.forEach(file => {
            //  Object.fromEntries([[`${file.fieldname}`, extractImageModel(file)]])
            updatedHomePage[`${file.fieldname}`] = index_1.extractImageModel(file);
        });
        console.log(updatedHomePage);
        const re = await ((_a = homePageRepo.collection) === null || _a === void 0 ? void 0 : _a.replaceOne({ "_id": new bson_1.ObjectId(_id) }, updatedHomePage));
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
        const homePageRepo = new repositories_1.HomePageRepository();
        const _id = req.params.id;
        const homePage = await homePageRepo.findOne(_id);
        const storage = new Storage();
        for (let i in homePage) {
            if (homePage[i].name && homePage[i].path && homePage[i].type && homePage[i].createdAt) {
                await storage.bucket(`${process.env.GCS_BUCKET}`).file(homePage[i].name).delete();
            }
        }
        await homePageRepo.delete(_id);
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