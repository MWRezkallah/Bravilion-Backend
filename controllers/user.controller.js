"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdmin = exports.getAdmins = void 0;
const user_model_1 = require("../models/base/user.model");
const getAdmins = async (req, res) => {
    try {
        const data = await user_model_1.default.find({});
        res.status(200).send({
            status: 'success',
            data: data
        });
    }
    catch (e) {
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
};
exports.getAdmins = getAdmins;
const getAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await user_model_1.default.findById(id);
        res.status(200).send({
            status: 'success',
            data: data
        });
    }
    catch (e) {
        res.status(400).send({
            status: 'Error',
            Error: e
        });
    }
};
exports.getAdmin = getAdmin;
//# sourceMappingURL=user.controller.js.map