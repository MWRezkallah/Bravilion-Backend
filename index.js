"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
// const   dotenv = require('dotenv');
// const evParsed = dotenv.config({path:"./.env"}); // run npm run start from parent directory
// console.log(evParsed);
// import * as helmet from 'helmet';
const compression = require("compression");
const routes_1 = require("./routes");
const app = express();
const port = process.env.PORT || 8080;
// parse application/json
app.use(cors());
app.use(express.json());
app.listen(port, () => console.log(`Example app listening at ${process.env.baseUrl}:${port}`));
app.use('/api/auth', routes_1.AuthRouter);
// app.use('/api/home-slider', HomeSliderRouter);
app.use('/api/categories', routes_1.CategoriesRouter);
// app.use('/api/suppliers', SupplierRouter);
// app.use('/api/badges', BadgeRouter);
app.use('/api/products', routes_1.ProductRouter);
app.use('/api/topCategory', routes_1.TopCategoryRouter);
app.use('/api/homeTopCategory', routes_1.HomeTopCatRouter);
app.use('/api/service', routes_1.ServiceRouter);
// app.use('/api/homePage', HomePageRouter)
app.use('/api/plan', routes_1.PlanRouter);
app.use('/api/manufacturer', routes_1.ManufacturerRouter);
app.use('/api/client', routes_1.ClientRouter);
app.use('/api/admin', routes_1.AdminRouter);
// app.use(helmet());
app.use(compression());
// app.get('/testDocker', (req, res)=>{
//     console.log("docker connected");
//     console.log(process.env)
//     res.send({
//         status:"success",
//         message:"docker work just fine!"
//     })
// });
app.use('/bravilion-dashboard',express.static( 'bravilion-dashboard'));
app.get(/bravilion-dashboard\/.*/, (req, res) => {
    res.sendFile('bravilion-dashboard/index.html', { root: __dirname });
});
app.use(express.static( 'browser'));
app.get(/.*/, (req, res) => {
    res.sendFile('browser/index.html', { root: __dirname });
});
//# sourceMappingURL=index.js.map