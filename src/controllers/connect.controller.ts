import * as mongoose from 'mongoose';
const url = `${process.env.connectionString}`;

export const connect = async ()=>{
    await mongoose.connect(url,
        {
            dbName:process.env.dbName,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    console.log('DB Successfully Connected');
}

