"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAndOwnerOnly = exports.AnonymousRule = exports.OwnerRule = exports.AdminRule = void 0;
exports.AdminRule = {
    auth: true,
    owner: undefined,
    role: "Admin"
};
exports.OwnerRule = {
    auth: true,
    owner: true,
    role: undefined
};
exports.AnonymousRule = {
    auth: false,
    owner: undefined,
    role: undefined
};
exports.AdminAndOwnerOnly = [exports.AdminRule, exports.OwnerRule];
//# sourceMappingURL=templates.js.map