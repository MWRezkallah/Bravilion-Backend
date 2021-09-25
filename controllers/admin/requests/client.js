"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestsByStatusForClient = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const getRequestsByStatusForClient = async (req, res) => {
    var _a;
    try {
        let filter = {};
        if (req.body.status) {
            filter = { "requests.orders.status": new RegExp(req.body.status, "i") };
        }
        let clientFilter = {};
        if (req.params.clientId) {
            clientFilter = {
                "_id": new bson_1.ObjectId(req.params.clientId)
            };
        }
        const clientRepo = new repositories_1.ClientRepository();
        if (!clientRepo.collection)
            await clientRepo.initCollection();
        const requests = await ((_a = clientRepo.collection) === null || _a === void 0 ? void 0 : _a.aggregate([
            { "$match": clientFilter },
            {
                '$unwind': {
                    'path': '$requests'
                }
            }, {
                '$unwind': {
                    'path': '$requests.orders'
                }
            }, { "$match": filter },
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
                    '_id': { "reqId": '$requests.requestId', "clientId": "_id" },
                    'orders': {
                        '$push': '$requests.orders'
                    }
                }
            }, {
                '$project': {
                    'requestId': '$_id.reqId',
                    "clientId": "$_id.clientId",
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
exports.getRequestsByStatusForClient = getRequestsByStatusForClient;
//# sourceMappingURL=client.js.map