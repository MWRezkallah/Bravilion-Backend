import { MongoClient } from "mongodb";

export const mongoClient = new MongoClient(`${process.env.connectionString}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize:500,
    poolSize:10
});

