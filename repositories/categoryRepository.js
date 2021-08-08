"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
/* eslint-disable space-before-blocks */
const repository_1 = require("./base/repository");
class CategoryRepository extends repository_1.Repository {
    constructor() {
        super();
        this.collectionName = 'Category';
    }
}
exports.CategoryRepository = CategoryRepository;
//# sourceMappingURL=categoryRepository.js.map