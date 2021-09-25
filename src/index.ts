
import * as express from 'express';
import * as cors from 'cors';
// import * as dotenv from 'dotenv';
// const evParsed = dotenv.config({path:"./src/.env"}); // run npm run start from parent directory
// console.log(evParsed);
// import * as helmet from 'helmet';
import * as compression from 'compression';

import {AuthRouter, HomeSliderRouter, CategoriesRouter, SupplierRouter, BadgeRouter,
     ProductRouter, TopCategoryRouter, ServiceRouter, HomePageRouter, PlanRouter, ManufacturerRouter,
    HomeTopCatRouter, ClientRouter, AdminRouter, WebsiteRouter} from './routes';


const app = express()
const port = process.env.PORT || 8080



// parse application/json
app.use(cors());
app.use(express.json());

    
app.listen(port, () => console.log(`Example app listening at ${process.env.baseUrl}:${port}`))



app.use('/api/auth', AuthRouter);
// app.use('/api/home-slider', HomeSliderRouter);
app.use('/api/categories', CategoriesRouter);
// app.use('/api/suppliers', SupplierRouter);
// app.use('/api/badges', BadgeRouter);
app.use('/api/products', ProductRouter);
app.use('/api/topCategory', TopCategoryRouter);
app.use('/api/homeTopCategory', HomeTopCatRouter)
app.use('/api/service', ServiceRouter);
app.use('/api/homePage', HomePageRouter)
app.use('/api/plan', PlanRouter)
app.use('/api/manufacturer', ManufacturerRouter)
app.use('/api/client', ClientRouter)
app.use('/api/admin', AdminRouter)
app.use('/website/api', WebsiteRouter)
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