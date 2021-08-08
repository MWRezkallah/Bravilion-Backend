"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierRepository = void 0;
const repository_1 = require("./base/repository");
class SupplierRepository extends repository_1.Repository {
    constructor() {
        super();
        this.collectionName = "Supplier";
    }
}
exports.SupplierRepository = SupplierRepository;
//# sourceMappingURL=SupplierRepository.js.map