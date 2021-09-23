"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHomePageSection = void 0;
const repositories_1 = require("../../../../repositories");
const bson_1 = require("bson");
const updateHomePageSection = async (req, res) => {
    var _a;
    try {
        if (!req.params.sectionId)
            throw new Error("please provide a sectionId");
        const sectionID = new bson_1.ObjectId(req.params.sectionId);
        const homePageSection = {
            header: req.body.header,
            isSlider: `${req.body.isSlider}`.toLowerCase() === 'true',
            order: Number(req.body.order),
            sectionType: req.body.sectionType,
            items: req.body.items,
            modifiedBy: { admin: res.locals.admin._id, at: new Date() }
        };
        const homePageRepo = new repositories_1.HomePageRepository();
        if (!homePageRepo.collection)
            await homePageRepo.initCollection();
        const homePage = await ((_a = homePageRepo.collection) === null || _a === void 0 ? void 0 : _a.findOneAndUpdate({ "_id": sectionID }, { $set: Object.assign({}, homePageSection) }));
        if (!((homePage === null || homePage === void 0 ? void 0 : homePage.ok) == 1))
            throw new Error(`couldn't update section with id: ${sectionID}`);
        res.status(200).send({
            status: "Success",
            message: `section with id: ${sectionID} updated successfully!`,
            data: homePage === null || homePage === void 0 ? void 0 : homePage.value
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.updateHomePageSection = updateHomePageSection;
//# sourceMappingURL=update.js.map