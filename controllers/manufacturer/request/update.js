"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRequest = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const updateRequest = async (req, res) => {
    var _a;
    try {
        const manufacturerID = new bson_1.ObjectId(res.locals.manufacturer._id);
        if (!req.body.status)
            throw new Error("please provide a status for the order!");
        const status = req.body.status;
        if (!req.params.requestId)
            throw new Error("please provide a request ID!");
        if (!req.params.orderId)
            throw new Error("please provide an order ID!");
        const requestID = new bson_1.ObjectId(req.params.requestId);
        const orderID = new bson_1.ObjectId(req.params.orderId);
        const clientRepo = new repositories_1.ClientRepository();
        if (!clientRepo.collection)
            await clientRepo.initCollection();
        const request = await ((_a = clientRepo.collection) === null || _a === void 0 ? void 0 : _a.findOneAndUpdate({
            "requests.requestId": requestID,
            "requests.orders.manufacturerId": manufacturerID,
            "requests.orders.orderId": orderID
        }, { $set: {
                "requests.$[request].orders.$[order].status": status
            } }, { projection: { "requests": { $filter: { input: "$requests", cond: { $eq: ["$$this.requestId", requestID] } } } },
            arrayFilters: [
                { "request.requestId": requestID },
                { "order.orderId": orderID }
            ] }));
        if ((request === null || request === void 0 ? void 0 : request.ok) == 1) {
            res.status(200).send({
                status: "Success",
                data: request.value.requests
            });
        }
        else {
            res.status(500).send({
                status: "Error",
                message: `failed to update the order status to: ${status}`
            });
        }
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.updateRequest = updateRequest;
//# sourceMappingURL=update.js.map