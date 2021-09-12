"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEnquiry = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const updateEnquiry = async (req, res) => {
    var _a;
    try {
        if (!req.params.enquiryId)
            throw new Error("please provide a enquiry ID");
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const enquiryID = new bson_1.ObjectId(req.params.enquiryId);
        const enquiry = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.findOneAndUpdate({ $and: [{ "_id": new bson_1.ObjectId(res.locals.manufacturer._id) }, { "enquiries.enquiryId": enquiryID }] }, { $set: { "enquiries.$": Object.assign({ enquiryId: enquiryID }, req.body) } }, { projection: { "manufacturerId": "$_id", "_id": 0, "enquiries": { $elemMatch: { "enquiryId": enquiryID } } } }));
        res.status(200).send({
            status: "success",
            data: enquiry === null || enquiry === void 0 ? void 0 : enquiry.value
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.updateEnquiry = updateEnquiry;
//# sourceMappingURL=updateEnquiry.js.map