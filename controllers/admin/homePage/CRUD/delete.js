"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHomePageSection = void 0;
const repositories_1 = require("../../../../repositories");
const bson_1 = require("bson");
const deleteHomePageSection = async (req, res) => {
    var _a;
    try {
        if (!req.params.sectionId)
            throw new Error("please provide a section Id");
        const sectionID = new bson_1.ObjectId(req.params.sectionId);
        const homePageRepo = new repositories_1.HomePageRepository();
        if (!homePageRepo.collection)
            await homePageRepo.initCollection();
        const homePage = await ((_a = homePageRepo.collection) === null || _a === void 0 ? void 0 : _a.deleteOne({ "_id": sectionID }));
        if (!((homePage === null || homePage === void 0 ? void 0 : homePage.result.ok) == 1))
            throw new Error(`couldn't delete section with id: ${sectionID}`);
        res.status(200).send({
            status: "Success",
            message: `home-page section with id: ${sectionID} deleted successfully!`
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.deleteHomePageSection = deleteHomePageSection;
//# sourceMappingURL=delete.js.map