"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHomeSlider = exports.updateHomeSlider = exports.getHomeSlider = exports.getAllHomeSliders = exports.createHomeSlider = void 0;
const fs_1 = require("fs");
const HomeSliderRepository_1 = require("../repositories/HomeSliderRepository");
const index_1 = require("../lib/index");
const createHomeSlider = async (req, res) => {
    try {
        const homeSliderRepo = new HomeSliderRepository_1.HomeSliderRepository();
        const values = Object.values(req.files !== undefined ? req.files : {});
        const desktopImageData = index_1.extractImageModel(values[0][0]);
        const mobileImageData = index_1.extractImageModel(values[1][0]);
        const data = {
            header: req.body.header,
            subHeader: req.body.subHeader,
            desktopImage: desktopImageData,
            mobileImage: mobileImageData
        };
        const re = await homeSliderRepo.create(data);
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
exports.createHomeSlider = createHomeSlider;
const getAllHomeSliders = async (req, res) => {
    try {
        const homeSliderRepo = new HomeSliderRepository_1.HomeSliderRepository();
        const sliders = await homeSliderRepo.findAll();
        res.status(200).send({
            status: 'success',
            data: sliders
        });
    }
    catch (e) {
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
};
exports.getAllHomeSliders = getAllHomeSliders;
const getHomeSlider = async (req, res) => {
    try {
        const homeSliderRepo = new HomeSliderRepository_1.HomeSliderRepository();
        const _id = req.params.id;
        const slider = await homeSliderRepo.findOne(_id);
        res.status(200).send({
            status: 'success',
            data: slider
        });
    }
    catch (e) {
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
};
exports.getHomeSlider = getHomeSlider;
const updateHomeSlider = async (req, res) => {
    try {
        const homeSliderRepo = new HomeSliderRepository_1.HomeSliderRepository();
        const _id = req.params.id;
        const slider = await homeSliderRepo.findOne(_id);
        // const prevDesktopImage = slider.desktopImage.path;
        // const prevMobileImage  = slider.mobileImage.path;
        // unlinkSync(prevDesktopImage);
        // unlinkSync(prevMobileImage);
        const prevDesktopImage = slider.desktopImage;
        const prevMobileImage = slider.mobileImage;
        fs_1.unlinkSync(prevDesktopImage.path);
        fs_1.unlinkSync(prevMobileImage.path);
        const values = Object.values(req.files !== undefined ? req.files : {});
        // const desktopImageData = extractImageModel(values[0][0]);
        // const mobileImageData  = extractImageModel(values[1][0]);
        const desktopImageData = index_1.extractImageModel(values[0][0], prevDesktopImage.createdAt);
        const mobileImageData = index_1.extractImageModel(values[1][0], prevMobileImage.createdAt);
        const data = {
            header: req.body.header,
            subHeader: req.body.subHeader,
            desktopImage: desktopImageData,
            mobileImage: mobileImageData
        };
        const re = await homeSliderRepo.update(_id, data);
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
exports.updateHomeSlider = updateHomeSlider;
const deleteHomeSlider = async (req, res) => {
    try {
        const homeSliderRepo = new HomeSliderRepository_1.HomeSliderRepository();
        const _id = req.params.id;
        const slider = await homeSliderRepo.findOne(_id);
        const prevDesktopImage = slider.desktopImage.path;
        const prevMobileImage = slider.mobileImage.path;
        fs_1.unlinkSync(prevDesktopImage);
        fs_1.unlinkSync(prevMobileImage);
        await homeSliderRepo.delete(_id);
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
exports.deleteHomeSlider = deleteHomeSlider;
//# sourceMappingURL=homeSlider.controller.js.map