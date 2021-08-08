"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRegister = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const userRegister = async (req, res, next) => {
    const userRepo = new UserRepository_1.UserRepository();
    const result = await userRepo.findOneByQuery({ $or: [{ email: req.body.email }, { phone: req.body.phone }] });
    if (result) {
        return res.status(400).send({
            status: "Error",
            Error: "This User is already registered, try to login!"
        });
    }
    else {
        next();
    }
};
exports.userRegister = userRegister;
//# sourceMappingURL=userRegisteration.js.map