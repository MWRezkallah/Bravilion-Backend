"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const repositories_1 = require("../../repositories");
const login = async (req, res) => {
    try {
        const clientRepo = new repositories_1.ClientRepository();
        const client = await clientRepo.findOneByQuery({ $or: [{ email: req.body.email }, { phone: req.body.phone }] });
        if (!client) {
            throw new Error("The user doesn't exists");
        }
        const isAuth = await clientRepo.validatePassword(req.body.password, { $or: [{ email: req.body.email }, { phone: req.body.phone }] });
        if (!isAuth) {
            throw new Error('invalid password try again!');
        }
        delete client.password;
        delete client.tokens;
        delete client.role;
        const token = await clientRepo.generateToken(client._id);
        res.status(200).send({
            status: 'Success',
            data: {
                client: Object.assign({}, client),
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