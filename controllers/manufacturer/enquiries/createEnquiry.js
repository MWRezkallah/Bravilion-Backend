"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnquiry = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../repositories");
const createEnquiry = async (req, res) => {
    var _a;
    try {
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const enquiryID = new bson_1.ObjectId();
        const updatedData = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.findOneAndUpdate({ "_id": new bson_1.ObjectId(res.locals.manufacturer._id) }, { $push: { "enquiries": Object.assign({ "enquiryId": enquiryID }, req.body) } }, { projection: { "_id": 1 } }));
        res.status(200).send({
            status: "success",
            message: `a enquiry has  been created successfully for ${res.locals.manufacturer.name}`,
            data: { "manufacturerID": updatedData === null || updatedData === void 0 ? void 0 : updatedData.value._id, enquiryID }
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.createEnquiry = createEnquiry;
//# sourceMappingURL=createEnquiry.js.map