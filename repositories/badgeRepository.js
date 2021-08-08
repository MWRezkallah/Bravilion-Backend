"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeRepository = void 0;
/* eslint-disable space-before-blocks */
const repository_1 = require("./base/repository");
class BadgeRepository extends repository_1.Repository {
    constructor() {
        super();
        this.collectionName = 'Badge';
    }
}
exports.BadgeRepository = BadgeRepository;
//# sourceMappingURL=badgeRepository.js.map