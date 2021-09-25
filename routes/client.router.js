"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("../middleware/client");
const client_2 = require("../controllers/client");
const multer = require("multer");
const multer_1 = require("../lib/multer");
const uploadImage = multer({ storage: multer_1.storage(`${process.env.clientImages}`), fileFilter: multer_1.imageFilter });
const formDataParser = multer();
const router = express_1.Router();
//Register & authenticate
router.post('/login', formDataParser.none(), client_2.login);
router.post('/signup', [formDataParser.none(), client_1.clientRegister], client_2.signUp);
router.put('/update', [uploadImage.fields([{ name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), client_1.clientUpdate], client_2.update);
router.post('/logout', [client_1.authenticateClient], client_2.logout);
// router.get('/get-client/:clientId?', getClient) //todo
//requests 
router.post('/create-request', client_1.authorizeClient, client_2.createRequest);
router.get('/get-requests/:clientId?', client_1.authenticateClient, client_2.getRequests); //todo
router.get('/get-requests-by-status/:clientId?', client_1.authenticateClient, client_2.getRequestsByStatus); //todo
router.get('/get-request/:requestId', client_1.authenticateClient, client_2.getRequest);
router.put('/update-request/:requestId', client_1.authorizeClient, client_2.updateRequest);
router.delete('/delete-request/:requestId', client_1.authorizeClient, client_2.deleteRequest);
exports.default = router;
//# sourceMappingURL=client.router.js.map