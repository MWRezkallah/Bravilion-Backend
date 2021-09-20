"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequest = exports.getRequests = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const getRequests = async (req, res) => {
    var _a;
    try {
        const manufacturerId = new bson_1.ObjectId(res.locals.manufacturer._id);
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
                                '$eq': [
                                    '$$this.manufacturerId', '$_id'
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
exports.getRequests = getRequests;
const getRequest = async (req, res) => {
    var _a;
    try {
        if (!req.params.requestId)
            throw new Error("please provide a request ID!");
        const requestID = new bson_1.ObjectId(req.params.requestId);
        const manufacturerId = new bson_1.ObjectId(res.locals.manufacturer._id);
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
                                '$eq': [
                                    '$$this.manufacturerId', '$_id'
                                ]
                            }
                        }
                    }
                }
            }, {
                '$match': {
                    'requestId': requestID
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
                $unwind: "$orders"
            }, {
                '$replaceRoot': {
                    'newRoot': '$orders'
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
exports.getRequest = getRequest;
//# sourceMappingURL=read.js.map