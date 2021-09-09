
import * as express from 'express';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
const evParsed = dotenv.config({path:"./src/.env"}); // run npm run start from parent directory
console.log(evParsed);
// import * as helmet from 'helmet';
import * as compression from 'compression';

import {AuthRouter, HomeSliderRouter, CategoriesRouter, SupplierRouter, BadgeRouter, ProductRouter, TopCategoryRouter, ServiceRouter, HomePageRouter} from './routes';


const app = express()
const port = process.env.PORT || 8080



// parse application/json
app.use(express.json());
app.use(cors());

    
app.listen(port, () => console.log(`Example app listening at ${process.env.baseUrl}:${port}`))



app.use('/api/auth', AuthRouter);
app.use('/api/home-slider', HomeSliderRouter);
app.use('/api/categories', CategoriesRouter);
app.use('/api/suppliers', SupplierRouter);
app.use('/api/badges', BadgeRouter);
app.use('/api/products', ProductRouter);
app.use('/api/topCategory', TopCategoryRouter);
app.use('/api/service', ServiceRouter);
app.use('/api/homePage', HomePageRouter)
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
app.use(express.static('browser'));
app.get(/.*/, (req, res) => {
    res.sendFile('browser/index.html', { root: __dirname });
});