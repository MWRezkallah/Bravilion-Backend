
import * as express from 'express';
import * as cors from 'cors';

import * as dotenv from 'dotenv';
const evParsed = dotenv.config({path:"./src/.env"}); // run npm run start from parent directory
console.log(evParsed);

import AuthRouter from './routes/auth.route';
import HomeSliderRouter from './routes/homeSlider.route';

const app = express()
const port = process.env.PORT || 8080



// parse application/json
app.use(express.json());
app.use(cors())

app.get('/', (req:any, res:any) => {
    const date = new Date();
    const hours = (date.getHours() % 12) + 1; // London is UTC + 1hr;
    console.log("===========> Hello")
    res.json({
        bongs: 'BONG '.repeat(hours)
    });
})

    
app.listen(port, () => console.log(`Example app listening at ${process.env.baseUrl}:${port}`))



app.use('/api/auth', AuthRouter);
app.use('/api/home-slider', HomeSliderRouter)