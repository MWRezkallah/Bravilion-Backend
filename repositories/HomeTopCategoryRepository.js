"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeTopCategoryRepository = void 0;
/* eslint-disable space-before-blocks */
const repository_1 = require("./base/repository");
class HomeTopCategoryRepository extends repository_1.Repository {
    constructor() {
        super();
        this.collectionName = 'HomeTopCategory';
    }
    async getHomeTopCategories() {
        var _a;
        if (!this.collection) {
            await this.initCollection();
        }
        return await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.aggregate([
            {
                '$lookup': {
                    'from': 'Category',
                    'localField': 'category',
                    'foreignField': '_id',
                    'as': 'HomeTopCategory'
                }
            }, {
                '$unwind': {
                    'path': '$HomeTopCategory'
                }
            }, {
                '$lookup': {
                    'from': 'Category',
                    'localField': 'HomeTopCategory._id',
                    'foreignField': 'parentCategoryId',
                    'as': 'HomeTopCategory.subCategories'
                }
            }, {
                '$project': {
                    'HomeTopCategory.subCategories.parentCategoryId': 0,
                    'category': 0,
                    '_id': 0
                }
            }, {
                '$replaceRoot': {
                    'newRoot': '$HomeTopCategory'
                }
            }
        ]).toArray());
    }
}
exports.HomeTopCategoryRepository = HomeTopCategoryRepository;
//# sourceMappingURL=HomeTopCategoryRepository.js.map