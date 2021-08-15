"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
// const dotenv = require('dotenv');
// const evParsed = dotenv.config({path:"./.env"}); // run npm run start from parent directory
// console.log(evParsed);
const helmet = require("helmet");
const compression = require("compression");
const routes_1 = require("./routes");
const app = express();
const port = process.env.PORT || 8080;
// parse application/json
app.use(express.json());
app.use(cors());
app.listen(port, () => console.log(`Example app listening at ${process.env.baseUrl}:${port}`));
app.use('/api/auth', routes_1.AuthRouter);
app.use('/api/home-slider', routes_1.HomeSliderRouter);
app.use('/api/categories', routes_1.CategoriesRouter);
app.use('/api/suppliers', routes_1.SupplierRouter);
app.use('/api/badges', routes_1.BadgeRouter);
app.use('/api/products', routes_1.ProductRouter);
app.use('/api/topCategory', routes_1.TopCategoryRouter);
app.use('/api/service', routes_1.ServiceRouter);
// app.use(helmet({contentSecurityPolicy: false}));
app.use(compression());
// app.use(express.static(`${process.env.multerStoragcloge}`));
app.use(express.static('browser'));
app.get(/.*/, (req, res) => {
    res.sendFile('browser/index.html', { root: __dirname });
});
//# sourceMappingURL=index.js.map