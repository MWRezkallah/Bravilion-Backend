"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteService = exports.updateService = exports.getService = exports.getServices = exports.createService = void 0;
const repositories_1 = require("../repositories");
const mongodb_1 = require("mongodb");
const createService = async (req, res) => {
    try {
        const serviceRepo = new repositories_1.ServiceRepository();
        let service = await serviceRepo.findOneByQuery({
            $or: [
                { 'name.english': req.body.englishName },
                { 'name.arabic': req.body.arabicName }
            ]
        });
        if (service)
            throw new Error(`${service.name.arabic}/${service.name.english} already exists!`);
        service = await serviceRepo.create({ name: { arabic: req.body.arabicName, english: req.body.englishName } });
        res.status(200).send({
            stauts: "Success!",
            data: service
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.createService = createService;
const getServices = async (req, res) => {
    try {
        const serviceRepo = new repositories_1.ServiceRepository();
        const services = await serviceRepo.findAll();
        res.status(200).send({
            status: "Success",
            data: services
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getServices = getServices;
const getService = async (req, res) => {
    try {
        const serviceRepo = new repositories_1.ServiceRepository();
        const service = await serviceRepo.findOneByQuery({ _id: new mongodb_1.ObjectId(req.params.id) });
        if (!service)
            throw new Error("service not found!");
        res.status(200).send({
            status: "Success",
            data: service
        });
    }
    catch (error) {
        res.status(404).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getService = getService;
const updateService = async (req, res) => {
    try {
        const serviceRepo = new repositories_1.ServiceRepository();
        const service = await serviceRepo.findOneByQuery({
            $and: [
                { _id: { $ne: new mongodb_1.ObjectId(req.params.id) } },
                { $or: [{ 'name.arabic': req.body.arabicName }, { 'name.english': req.body.englishName }] }
            ]
        });
        if (service)
            throw new Error(`service's name: ${service.name.arabic}/${service.name.english} belongs to another service`);
        const updatedService = await serviceRepo.update(req.params.id, { name: { arabic: req.body.arabicName, english: req.body.englishName } });
        res.status(200).send({
            status: "Success",
            data: updatedService
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.updateService = updateService;
const deleteService = async (req, res) => {
    try {
        const serviceRepo = new repositories_1.ServiceRepository();
        await serviceRepo.delete(req.params.id);
        res.status(200).send({
            status: "Success",
            message: "Service deleted successfully!"
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            error: error
        });
    }
};
exports.deleteService = deleteService;
//# sourceMappingURL=service.controller.js.map