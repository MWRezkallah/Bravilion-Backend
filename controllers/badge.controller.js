"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBadge = exports.updateBadge = exports.getBadge = exports.getBadges = exports.createBadge = void 0;
const repositories_1 = require("../repositories");
const mongodb_1 = require("mongodb");
const createBadge = async (req, res) => {
    try {
        const badgeRepo = new repositories_1.BadgeRepository();
        let badge = await badgeRepo.findOneByQuery({
            $or: [
                { 'name.english': req.body.englishName },
                { 'name.arabic': req.body.arabicName }
            ]
        });
        if (badge)
            throw new Error(`${badge.name.arabic}/${badge.name.english} already exists!`);
        badge = await badgeRepo.create({ name: { arabic: req.body.arabicName, english: req.body.englishName } });
        res.status(200).send({
            stauts: "Success!",
            data: badge
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.createBadge = createBadge;
const getBadges = async (req, res) => {
    try {
        const badgeRepo = new repositories_1.BadgeRepository();
        const badges = await badgeRepo.findAll();
        res.status(200).send({
            status: "Success",
            data: badges
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getBadges = getBadges;
const getBadge = async (req, res) => {
    try {
        const badgeRepo = new repositories_1.BadgeRepository();
        const badge = await badgeRepo.findOneByQuery({ _id: new mongodb_1.ObjectId(req.params.id) });
        if (!badge)
            throw new Error("badge not found!");
        res.status(200).send({
            status: "Success",
            data: badge
        });
    }
    catch (error) {
        res.status(404).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getBadge = getBadge;
const updateBadge = async (req, res) => {
    try {
        const badgeRepo = new repositories_1.BadgeRepository();
        const badge = await badgeRepo.findOneByQuery({
            $and: [
                { _id: { $ne: new mongodb_1.ObjectId(req.params.id) } },
                { $or: [{ 'name.arabic': req.body.arabicName }, { 'name.english': req.body.englishName }] }
            ]
        });
        if (badge)
            throw new Error(`badge's name: ${badge.name.arabic}/${badge.name.english} belongs to another badge`);
        const updatedBadge = await badgeRepo.update(req.params.id, { name: { arabic: req.body.arabicName, english: req.body.englishName } });
        res.status(200).send({
            status: "Success",
            data: updatedBadge
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.updateBadge = updateBadge;
const deleteBadge = async (req, res) => {
    try {
        const badgeRepo = new repositories_1.BadgeRepository();
        await badgeRepo.delete(req.params.id);
        res.status(200).send({
            status: "Success",
            message: "Badge deleted successfully!"
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            error: error
        });
    }
};
exports.deleteBadge = deleteBadge;
//# sourceMappingURL=badge.controller.js.map