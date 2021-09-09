"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlan = exports.updatePlan = exports.getPlan = exports.getPlans = exports.createPlan = void 0;
const repositories_1 = require("../repositories");
const mongodb_1 = require("mongodb");
const createPlan = async (req, res) => {
    try {
        const planRepo = new repositories_1.PlanRepository();
        let plan = await planRepo.findOneByQuery({
            $or: [
                { 'name.english': req.body.englishName },
                { 'name.arabic': req.body.arabicName }
            ]
        });
        if (plan)
            throw new Error(`${plan.name.arabic}/${plan.name.english} already exists!`);
        plan = await planRepo.create({ name: { arabic: req.body.arabicName, english: req.body.englishName }, price: req.body.price, duration: req.body.duration });
        res.status(200).send({
            stauts: "Success!",
            data: plan
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.createPlan = createPlan;
const getPlans = async (req, res) => {
    try {
        const planRepo = new repositories_1.PlanRepository();
        const plans = await planRepo.findAll();
        res.status(200).send({
            status: "Success",
            data: plans
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getPlans = getPlans;
const getPlan = async (req, res) => {
    try {
        const planRepo = new repositories_1.PlanRepository();
        const plan = await planRepo.findOneByQuery({ _id: new mongodb_1.ObjectId(req.params.id) });
        if (!plan)
            throw new Error("plan not found!");
        res.status(200).send({
            status: "Success",
            data: plan
        });
    }
    catch (error) {
        res.status(404).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getPlan = getPlan;
const updatePlan = async (req, res) => {
    try {
        const planRepo = new repositories_1.PlanRepository();
        const plan = await planRepo.findOneByQuery({
            $and: [
                { _id: { $ne: new mongodb_1.ObjectId(req.params.id) } },
                { $or: [{ 'name.arabic': req.body.arabicName }, { 'name.english': req.body.englishName }] }
            ]
        });
        if (plan)
            throw new Error(`plan's name: ${plan.name.arabic}/${plan.name.english} belongs to another plan`);
        const updatedPlan = await planRepo.update(req.params.id, { name: { arabic: req.body.arabicName, english: req.body.englishName }, price: req.body.price, duration: req.body.duration });
        res.status(200).send({
            status: "Success",
            data: updatedPlan
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.updatePlan = updatePlan;
const deletePlan = async (req, res) => {
    try {
        const planRepo = new repositories_1.PlanRepository();
        await planRepo.delete(req.params.id);
        res.status(200).send({
            status: "Success",
            message: "Plan deleted successfully!"
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            error: error
        });
    }
};
exports.deletePlan = deletePlan;
//# sourceMappingURL=plan.controller.js.map