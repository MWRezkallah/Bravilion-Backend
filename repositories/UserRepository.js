"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const repository_1 = require("./base/repository");
class UserRepository extends repository_1.Repository {
    constructor() {
        super();
        this.collectionName = 'User';
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
        let user = await this.findOneByQuery({ _id: id });
        const token = jwt.sign({ _id: user._id, username: user.username, email: user.email }, `${process.env.apiSecretKey}`, { expiresIn: `${exp.getDate()} days` });
        if (user.tokens === undefined)
            user.tokens = [];
        user.tokens.push({ token });
        const data = await this.update(user._id, user);
        return token;
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map