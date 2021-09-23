"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHomePageSection = void 0;
const repositories_1 = require("../../../../repositories");
const createHomePageSection = async (req, res) => {
    var _a;
    try {
        const homePageSection = {
            header: req.body.header,
            isSlider: `${req.body.isSlider}`.toLowerCase() === 'true',
            order: Number(req.body.order),
            sectionType: req.body.sectionType,
            items: req.body.items,
            createdBy: { admin: res.locals.admin._id, at: new Date() }
        };
        const homePageRepo = new repositories_1.HomePageRepository();
        if (!homePageRepo.collection)
            await homePageRepo.initCollection();
        const homePage = await ((_a = homePageRepo.collection) === null || _a === void 0 ? void 0 : _a.insert(homePageSection));
        res.status(200).send({
            status: "Success",
            message: `home-page section created successfully with id: ${homePage === null || homePage === void 0 ? void 0 : homePage.insertedIds[0]} and order:${req.body.order}`
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
};
exports.createHomePageSection = createHomePageSection;
//# sourceMappingURL=create.js.map