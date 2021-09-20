"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRepository = void 0;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _1 = require(".");
class ClientRepository extends _1.Repository {
    constructor() {
        super();
        this.collectionName = 'Client';
    }
    async encrypPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
    async validatePassword(password, query) {
        const result = await this.findOneByQuery(query);
        return await bcrypt.compare(password, result.password);
    }
    async generateToken(id) {
        const prefix = 6;
        const exp = new Date(new Date().getTime() + (prefix * 24 * 60 * 60 * 1000));
        let manufacturer = await this.findOneByQuery({ _id: id });
        const token = jwt.sign({ _id: manufacturer._id, name: manufacturer.name, email: manufacturer.email, role: "Client" }, `${process.env.apiSecretKey}`, { expiresIn: `${exp.getDate()} days` });
        if (manufacturer.tokens === undefined)
            manufacturer.tokens = [];
        manufacturer.tokens.push({ token });
        const data = await this.update(manufacturer._id, manufacturer);
        return token;
    }
}
exports.ClientRepository = ClientRepository;
//# sourceMappingURL=ClientRepository.js.map