"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestsByStatus = exports.getRequest = exports.getRequests = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const getRequests = async (req, res) => {
    var _a;
    try {
        const clientID = new bson_1.ObjectId(res.locals.client._id);
        const clientRepo = new repositories_1.ClientRepository();
        if (!clientRepo.collection)
            await clientRepo.initCollection();
        const requests = await ((_a = clientRepo.collection) === null || _a === void 0 ? void 0 : _a.aggregate([
            {
                $match: {
                    "_id": clientID
                }
            },
            {
                '$unwind': {
                    'path': '$requests'
                }
            }, {
                '$unwind': {
                    'path': '$requests.orders'
                }
            }, {
                '$lookup': {
                    'from': 'Product',
                    'localField': 'requests.orders.productId',
                    'foreignField': '_id',
                    'as': 'requests.orders.product'
                }
            }, {
                '$unwind': {
                    'path': '$requests.orders.product'
                }
            }, {
                '$group': {
                    '_id': '$requests.requestId',
                    'orders': {
                        '$push': '$requests.orders'
                    }
                }
            }, {
                '$project': {
                    'requestId': '$_id',
                    '_id': 0,
                    'orders': 1
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
        const clientID = new bson_1.ObjectId(res.locals.client._id);
        if (!req.params.requestId)
            throw new Error("please provide a request id!");
        const requestID = new bson_1.ObjectId(req.params.requestId);
        const clientRepo = new repositories_1.ClientRepository();
        if (!clientRepo.collection)
            await clientRepo.initCollection();
        const requests = await ((_a = clientRepo.collection) === null || _a === void 0 ? void 0 : _a.aggregate([
            {
                $match: {
                    "_id": clientID
                }
            },
            {
                '$unwind': {
                    'path': '$requests'
                }
            }, {
                '$unwind': {
                    'path': '$requests.orders'
                }
            }, {
                '$lookup': {
                    'from': 'Product',
                    'localField': 'requests.orders.productId',
                    'foreignField': '_id',
                    'as': 'requests.orders.product'
                }
            }, {
                '$unwind': {
                    'path': '$requests.orders.product'
                }
            }, {
                '$group': {
                    '_id': '$requests.requestId',
                    'orders': {
                        '$push': '$requests.orders'
                    }
                }
            }, {
                $match: {
                    "_id": requestID
                }
            }, {
                '$project': {
                    'requestId': '$_id',
                    '_id': 0,
                    'orders': 1
                }
            },
            {
                $unwind: "$orders"
            }, {
                $replaceRoot: { newRoot: "$orders" }
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
const getRequestsByStatus = async (req, res) => {
    var _a;
    try {
        let filter = {};
        if (req.body.status) {
            filter = { "$match": { "requests.orders.status": new RegExp(req.body.status, "i") } };
        }
        const clientID = new bson_1.ObjectId(res.locals.client._id);
        const clientRepo = new repositories_1.ClientRepository();
        if (!clientRepo.collection)
            await clientRepo.initCollection();
        const requests = await ((_a = clientRepo.collection) === null || _a === void 0 ? void 0 : _a.aggregate([
            {
                $match: {
                    "_id": clientID
                }
            },
            {
                '$unwind': {
                    'path': '$requests'
                }
            }, {
                '$unwind': {
                    'path': '$requests.orders'
                }
            }, filter,
            {
                '$lookup': {
                    'from': 'Product',
                    'localField': 'requests.orders.productId',
                    'foreignField': '_id',
                    'as': 'requests.orders.product'
                }
            }, {
                '$unwind': {
                    'path': '$requests.orders.product'
                }
            }, {
                '$group': {
                    '_id': '$requests.requestId',
                    'orders': {
                        '$push': '$requests.orders'
                    }
                }
            }, {
                '$project': {
                    'requestId': '$_id',
                    '_id': 0,
                    'orders': 1
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
exports.getRequestsByStatus = getRequestsByStatus;
//# sourceMappingURL=read.js.map