"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
const repositories_1 = require("../../repositories");
const logout = async (req, res) => {
    try {
        res.locals.manufacturer.tokens = res.locals.manufacturer.tokens.filter((token) => {
            return token.token != res.locals.token;
        });
        const manuRepo = new repositories_1.ManufacturerRepository();
        await manuRepo.update(res.locals.manufacturer._id, res.locals.manufacturer);
        res.status(200).send({
            status: 'Success',
            data: {
                message: `${res.locals.manufacturer.name} logged out successfully!`
            }
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.logout = logout;
//# sourceMappingURL=logout.js.map