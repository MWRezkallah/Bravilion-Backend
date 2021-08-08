"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authCheck_1 = require("../middleware/authCheck");
// eslint-disable-next-line new-cap
const router = express_1.Router();
router.post('/login', auth_controller_1.login);
router.post('/sign-up', auth_controller_1.signUp);
router.post('/logout', [authCheck_1.authCheck], auth_controller_1.logout);
exports.default = router;
//# sourceMappingURL=auth.route.js.map