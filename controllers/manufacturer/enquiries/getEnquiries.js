"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnquiry = exports.getEnquiryies = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const getEnquiryies = async (req, res) => {
    var _a;
    try {
        const query = (req.params.manufacturerId) ? { "_id": new bson_1.ObjectId(req.params.manufacturerId) } : {};
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const enquiries = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.find(query, { projection: { "manufacturerId": "$_id", "_id": 0, "enquiries": 1 } }).toArray());
        res.status(200).send({
            status: "success",
            data: enquiries
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getEnquiryies = getEnquiryies;
const getEnquiry = async (req, res) => {
    var _a;
    try {
        if (!req.params.enquiryId)
            throw new Error("please provide a enquiry ID");
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const enquiryID = new bson_1.ObjectId(req.params.enquiryId);
        const enquiries = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.find({ "enquiries.enquiryId": enquiryID }, { projection: { "manufacturerId": "$_id", "_id": 0, "enquiries": { $elemMatch: { "enquiryId": enquiryID } } } }).toArray());
        res.status(200).send({
            status: "success",
            data: enquiries
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getEnquiry = getEnquiry;
//# sourceMappingURL=getEnquiries.js.map