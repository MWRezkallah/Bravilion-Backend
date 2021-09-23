"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getManufacturers = void 0;
const repositories_1 = require("../../../../../repositories");
const getManufacturers = async (req, res) => {
    var _a;
    try {
        const manuRepo = new repositories_1.ManufacturerRepository();
        if (!manuRepo.collection)
            await manuRepo.initCollection();
        const collections = await ((_a = manuRepo.collection) === null || _a === void 0 ? void 0 : _a.aggregate([
            {
                $lookup: {
                    from: "Product",
                    localField: "_id",
                    foreignField: "ownerId",
                    as: "Products"
                }
            },
            { $project: { "tokens": 0, "password": 0 } }
        ]).toArray());
        res.status(200).send({
            status: "success",
            data: collections
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.getManufacturers = getManufacturers;
//# sourceMappingURL=getManufacturer.controller.js.map