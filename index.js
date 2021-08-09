"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
// import * as dotenv from 'dotenv';
// const evParsed = dotenv.config({path:"./src/.env"}); // run npm run start from parent directory
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
app.use(helmet());
app.use(compression());
app.use(express.static('browser'));
app.get(/.*/, (req, res) => {
    res.sendFile('browser/index.html',{root:__dirname});
});
//# sourceMappingURL=index.js.map
