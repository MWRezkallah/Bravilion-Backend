"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopCategoryRepository = void 0;
const _1 = require(".");
const bson_1 = require("bson");
class TopCategoryRepository extends _1.Repository {
    constructor() {
        super();
        this.collectionName = 'TopCategory';
    }
    async getTopCategories() {
        var _a;
        if (!this.collection) {
            await this.initCollection();
        }
        return await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.aggregate([
            {
                '$lookup': {
                    'from': 'Category',
                    'localField': 'parent',
                    'foreignField': '_id',
                    'as': 'parent'
                }
            }, {
                '$unwind': {
                    'path': '$parent'
                }
            }, {
                '$lookup': {
                    'from': 'Category',
                    'localField': 'childern',
                    'foreignField': '_id',
                    'as': 'childern'
                }
            }, {
                '$unwind': {
                    'path': '$childern'
                }
            }, {
                '$lookup': {
                    'from': 'Category',
                    'localField': 'childern._id',
                    'foreignField': 'parentCategoryId',
                    'as': 'childern.subCatgories'
                }
            }, {
                '$group': {
                    '_id': {
                        '_id': '$_id',
                        'parent': '$parent',
                        'name': '$name'
                    },
                    'childern': {
                        '$push': '$childern'
                    }
                }
            }, {
                '$project': {
                    '_id': '$_id._id',
                    'parent': '$_id.parent',
                    'name': '$_id.name',
                    'childern': '$childern'
                }
            }
        ]).toArray());
    }
    async getTopCategory(id) {
        var _a;
        if (!this.collection) {
            await this.initCollection();
        }
        return await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.aggregate([
            {
                '$match': {
                    '_id': new bson_1.ObjectId(id)
                }
            }, {
                '$lookup': {
                    'from': 'Category',
                    'localField': 'parent',
                    'foreignField': '_id',
                    'as': 'parent'
                }
            }, {
                '$unwind': {
                    'path': '$parent'
                }
            }, {
                '$lookup': {
                    'from': 'Category',
                    'localField': 'childern',
                    'foreignField': '_id',
                    'as': 'childern'
                }
            }, {
                '$unwind': {
                    'path': '$childern'
                }
            }, {
                '$lookup': {
                    'from': 'Category',
                    'localField': 'childern._id',
                    'foreignField': 'parentCategoryId',
                    'as': 'childern.subCatgories'
                }
            }, {
                '$group': {
                    '_id': {
                        '_id': '$_id',
                        'parent': '$parent',
                        'name': '$name'
                    },
                    'childern': {
                        '$push': '$childern'
                    }
                }
            }, {
                '$project': {
                    '_id': '$_id._id',
                    'parent': '$_id.parent',
                    'name': '$_id.name',
                    'childern': '$childern'
                }
            }
        ]).toArray());
    }
}
exports.TopCategoryRepository = TopCategoryRepository;
//# sourceMappingURL=topCategoryRepository.js.map