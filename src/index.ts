import * as express from 'express';
import * as cors from 'cors';


import AuthRouter from './routes/auth.route';


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

    
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))



app.use('/api/auth', AuthRouter);






// app.get('/', (req, res) => {

// });



//exports.app = functions.https.onRequest(exapp);

    // How to call 


    // const data: any = { function: 'orderRequest', userId: '', isCallBack: isCallBack, data: order };
    // var addMessage = this.functions.httpsCallable('sz');
    // addMessage(data).subscribe(result => {
    //   loader.dismiss().then(() => { });
    //   console.log('what is sent', data);
    //   console.log('result', result);
    //   if (result && result.data && result.code && result.code == 200) {
    //     this.navCtrl.navigateRoot(['/confirmation', { id: result.id }]);
    //   }

    //   if (result.isError) {
    //     this.allowOrder = true;
    //     this.showAlert(result.msg).then(() => { });
    //   }

    //   // ...
    // }, error => {
    //   // Getting the Error details.
    //   var code = error.code;
    //   var message = error.message;
    //   var details = error.details;
    //   loader.dismiss().then(() => { });
    //   console.log('Error', error);

    // });