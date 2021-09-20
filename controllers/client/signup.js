"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = void 0;
const repositories_1 = require("../../repositories");
const signUp = async (req, res) => {
    try {
        const values = Object.values(req.files !== undefined ? req.files : {});
        const clientRepo = new repositories_1.ClientRepository();
        const newClient = {
            email: req.body.email,
            password: await clientRepo.encrypPassword(req.body.password),
            name: { arabic: req.body.arabicName, english: req.body.englishName },
            phone: req.body.phone
        };
        const clientId = await clientRepo.create(newClient);
        const token = await clientRepo.generateToken(clientId);
        res.status(200).send({
            status: 'success',
            data: { name: newClient.name, email: newClient.email, id: clientId },
            token: token
        });
    }
    catch (e) {
        res.status(400).json(e);
    }
};
exports.signUp = signUp;
//# sourceMappingURL=signup.js.map