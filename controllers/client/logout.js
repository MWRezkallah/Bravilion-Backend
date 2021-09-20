"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
const repositories_1 = require("../../repositories");
const logout = async (req, res) => {
    try {
        res.locals.client.tokens = res.locals.client.tokens.filter((token) => {
            return token.token != res.locals.token;
        });
        const clientRepo = new repositories_1.ClientRepository();
        await clientRepo.update(res.locals.client._id, res.locals.client);
        res.status(200).send({
            status: 'Success',
            data: {
                message: `${res.locals.client.name.arabic} / ${res.locals.client.name.english} logged out successfully!`
            }
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.logout = logout;
//# sourceMappingURL=logout.js.map