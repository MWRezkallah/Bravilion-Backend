"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestsFilter = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const getRequestsFilter = async (req, res) => {
    var _a;
    try {
        const manufacturerId = new bson_1.ObjectId(res.locals.manufacturer._id);
        let filter = {};
        if (req.body.status) {
            filter =
                { '$regexMatch': {
                        input: '$$this.status', regex: new RegExp(req.body.status, "i")
                    }
                };
        }
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const requests = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.aggregate([
            {
                $match: {
                    "_id": manufacturerId
                }
            },
            {
                '$lookup': {
                    'from': 'Client',
                    'localField': '_id',
                    'foreignField': 'requests.orders.manufacturerId',
                    'as': 'clients'
                }
            }, {
                '$unwind': {
                    'path': '$clients'
                }
            }, {
                '$unwind': {
                    'path': '$clients.requests'
                }
            }, {
                '$project': {
                    'requestId': '$clients.requests.requestId',
                    'requests': {
                        '$filter': {
                            'input': '$clients.requests.orders',
                            'cond': {
                                "$and": [
                                    { '$eq': [
                                            '$$this.manufacturerId', '$_id'
                                        ]
                                    },
                                    filter
                                ]
                            }
                        }
                    }
                }
            }, {
                '$unwind': {
                    'path': '$requests'
                }
            }, {
                '$lookup': {
                    'from': 'Product',
                    'localField': 'requests.productId',
                    'foreignField': '_id',
                    'as': 'requests.product'
                }
            }, {
                '$unwind': {
                    'path': '$requests.product'
                }
            }, {
                '$group': {
                    '_id': {
                        'manufacturerId': '$_id',
                        'requestId': '$requestId'
                    },
                    'orders': {
                        '$push': '$requests'
                    }
                }
            }, {
                '$replaceRoot': {
                    'newRoot': {
                        'requestId': '$_id.requestId',
                        'orders': '$orders'
                    }
                }
            }
        ]).toArray());
        res.status(200).send({
            status: "Success",
            data: requests
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getRequestsFilter = getRequestsFilter;
//# sourceMappingURL=requestStatus.filter.js.map