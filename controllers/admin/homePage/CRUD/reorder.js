"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderSections = void 0;
const bson_1 = require("bson");
const repositories_1 = require("../../../../repositories");
const reorderSections = async (req, res) => {
    var _a;
    try {
        if (!req.body.sections)
            throw new Error("please provide the sections");
        const updates = req.body.sections.map(section => {
            return {
                updateOne: {
                    "filter": { "_id": new bson_1.ObjectId(section.id) },
                    "update": { $set: { "order": Number(section.order), "modifiedBy": { admin: res.locals.admin._id, at: new Date() } } }
                }
            };
        });
        const homePageRepo = new repositories_1.HomePageRepository();
        if (!homePageRepo.collection)
            await homePageRepo.initCollection();
        const results = await ((_a = homePageRepo.collection) === null || _a === void 0 ? void 0 : _a.bulkWrite(updates, { ordered: false }));
        res.status(200).send({
            status: "Success",
            message: `${results === null || results === void 0 ? void 0 : results.modifiedCount} documents modified succussfully!`
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            Message: error.message
        });
    }
};
exports.reorderSections = reorderSections;
//# sourceMappingURL=reorder.js.map