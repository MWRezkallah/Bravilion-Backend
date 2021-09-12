"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const repositories_1 = require("../../repositories");
const login = async (req, res) => {
    try {
        const manuRepo = new repositories_1.ManufacturerRepository();
        const manufacturer = await manuRepo.findOneByQuery({ email: req.body.email });
        if (!manufacturer) {
            throw new Error("The user doesn't exists");
        }
        const isAuth = await manuRepo.validatePassword(req.body.password, { email: req.body.email });
        if (!isAuth) {
            throw new Error('invalid password try again!');
        }
        delete manufacturer.password;
        delete manufacturer.tokens;
        delete manufacturer.role;
        const token = await manuRepo.generateToken(manufacturer._id);
        res.status(200).send({
            status: 'Success',
            data: {
                manufacturer: Object.assign({}, manufacturer),
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
//# sourceMappingURL=login.js.map