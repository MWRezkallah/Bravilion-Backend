import * as mongoose from 'mongoose';
const url = 'mongodb+srv://AhmedFathi96:271996Ahmed@cluster0.bg1zo.mongodb.net/beviloin?retryWrites=true&w=majority';

export const connect = async ()=>{
    await mongoose.connect(url,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    console.log('DB Successfully Connected');
}

