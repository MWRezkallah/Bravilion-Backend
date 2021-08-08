"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = exports.logout = exports.login = void 0;
const connect_controller_1 = require("./connect.controller");
const user_model_1 = require("../models/base/user.model");
const login = async (req, res) => {
    try {
        await connect_controller_1.connect();
        const user = await user_model_1.default.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] });
        if (!user) {
            throw new Error("The user doesn't exists");
        }
        const isAuth = await user.validatePassword(req.body.password);
        if (!isAuth) {
            throw new Error('invalid password try again!');
        }
        const token = await user.generateToken();
        res.status(200).send({
            status: 'Success',
            data: {
                user: { username: user.username, email: user.email, name: user.name },
                token: token
            }
        });
    }
    catch (e) {
        res.status(400).send({
            status: 'Error',
            Error: e.message
        });
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        req.body.user.tokens = req.body.user.tokens.filter((token) => {
            return token.token != req.body.token;
        });
        req.body.user.save();
        res.status(200).send({
            status: 'Success',
            data: {
                message: `${req.body.user.username} logged out successfully!`
            }
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.logout = logout;
const signUp = async (req, res) => {
    try {
        await connect_controller_1.connect();
        const newUser = new user_model_1.default({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
        });
        newUser.password = await newUser.encrypPassword(newUser.password);
        const user = await newUser.save();
        const token = await user.generateToken();
        res.status(200).send({
            status: 'success',
            data: { username: user.username, email: user.email, name: user.name, phone: user.phone },
            token: token
        });
    }
    catch (e) {
        res.status(400).json(e);
    }
};
exports.signUp = signUp;
//# sourceMappingURL=auth.controller.js.map