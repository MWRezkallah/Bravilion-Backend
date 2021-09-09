"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanRepository = void 0;
const repository_1 = require("./base/repository");
class PlanRepository extends repository_1.Repository {
    constructor() {
        super();
        this.collectionName = 'Plan';
    }
}
exports.PlanRepository = PlanRepository;
//# sourceMappingURL=PlanRepository.js.map