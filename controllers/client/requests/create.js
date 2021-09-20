"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequest = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const createRequest = async (req, res) => {
    var _a;
    try {
        const clientId = new bson_1.ObjectId(res.locals.client._id);
        const requestId = new bson_1.ObjectId();
        let request = {
            requestId: requestId
        };
        if (req.body.orders && req.body.orders.length > 0) {
            request["orders"] = req.body.orders.map(request => {
                return {
                    orderId: new bson_1.ObjectId(),
                    productId: new bson_1.ObjectId(request.productId),
                    quantity: Number.parseInt(`${request.quantity || 1}`),
                    status: "pending",
                    manufacturerId: new bson_1.ObjectId(request.manufacturerId)
                };
            });
        }
        const clientRepo = new repositories_1.ClientRepository();
        if (!clientRepo.collection)
            await clientRepo.initCollection();
        const result = await ((_a = clientRepo.collection) === null || _a === void 0 ? void 0 : _a.findOneAndUpdate({ "_id": clientId }, { $push: { "requests": Object.assign({}, request) } }, { projection: { "_id": 1 } }));
        res.status(200).send({
            status: "Success",
            message: `a request has been issued for ${res.locals.client.name.english} / ${res.locals.client.name.arabic}`,
            data: { "clientID": result === null || result === void 0 ? void 0 : result.value._id, "requestID": requestId }
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.createRequest = createRequest;
//# sourceMappingURL=create.js.map