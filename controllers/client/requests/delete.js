"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRequest = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const deleteRequest = async (req, res) => {
    var _a;
    try {
        if (!req.params.requestId)
            throw new Error("please provide a request ID");
        const clientRepo = new repositories_1.ClientRepository();
        if (!clientRepo.collection)
            await clientRepo.initCollection();
        const requestID = new bson_1.ObjectId(req.params.requestId);
        const request = await ((_a = clientRepo.collection) === null || _a === void 0 ? void 0 : _a.findOneAndUpdate({ $and: [{ "_id": new bson_1.ObjectId(res.locals.client._id) }, { "requests.requestId": requestID }] }, { $pull: { "requests": { "requestId": requestID } } }, { projection: { "clientId": "$_id", "_id": 0, "requests": { $elemMatch: { "requestId": requestID } } } }));
        res.status(200).send({
            status: "success",
            data: request === null || request === void 0 ? void 0 : request.value
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.deleteRequest = deleteRequest;
//# sourceMappingURL=delete.js.map