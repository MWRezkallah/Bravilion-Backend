import { Db, MongoClient, Collection, ObjectID } from "mongodb";
import { Permissions } from "../../models";
import { IRepository } from "./iRepository";
import {mongoClient} from '../../lib/connectToDB'

export class Repository<T> implements IRepository<T> {


    dbUrl = `${process.env.connectionString}`;
    dbName = `${process.env.dbName}`;

    dbClient: MongoClient;
    collection: Collection | undefined;
    collectionName = '';
    permissions!: Permissions;

    constructor() {
        this.dbClient = mongoClient
    }

    async initCollection(): Promise<void> {
        try {
            let db: Db;
            if (this.collectionName) {

                if (!this.dbClient.isConnected()) {
                    db = await (await this.dbClient.connect()).db(this.dbName);
                }
                else {
                    db = this.dbClient.db(this.dbName);
                }

                const collection = (await db.collections()).find(c => c.collectionName == this.collectionName);
                this.collection = collection;

                if (!collection) {
                    // console.log('collection name is ', this.collectionName);
                    this.collection = await db.createCollection(this.collectionName);
                    // console.log("Collection is created!");
                }

            } else {
                throw new Error('Collection does not exists')
            }
        } catch (error) {
            throw new Error('something went wrong')
        }
    }


    async cleanUp(): Promise<void> {
        this.dbClient.close();
    }

    async createMany(item: T[], cleanUp?: boolean) {

        this.isAllowed(this.permissions, "");

        if (!this.collection) {
            await this.initCollection();
        }

        const result = await this.collection?.insertMany(item);


        if (cleanUp) {
            this.cleanUp();
        }

        return result?.insertedIds;
    }

    async create(item: T, cleanUp?: boolean) {


        if (!this.collection) {
            await this.initCollection();
        }
        const result = await this.collection?.insertOne(item);

        if (cleanUp) {
            this.cleanUp();
        }

        return result?.insertedId;
    }

    async update(id: string, item: T, cleanUp?: boolean) {

        if (!this.collection) {
            await this.initCollection();
        }
        const convertedId = new ObjectID(id);
        const filter = { "_id": convertedId };
        const data = await this.collection?.updateOne(
            filter,
            { $set: item },
            { upsert: false }
        );

        if (cleanUp) {
            this.cleanUp();
        }

        return data;
    }

    async delete(id: string, cleanUp?: boolean): Promise<boolean> {
        if (!this.collection) {
            await this.initCollection();
        }

        const convertedId = new ObjectID(id);
        const filter = { "_id": convertedId };
        const data = await this.collection?.deleteOne(filter);
        if (cleanUp) {
            this.cleanUp();
        }
        return !!data?.result.ok;
    }

    async findAll(cleanUp?: boolean) {
        //console.log('invoked');
        if (!this.collection) {
            await this.initCollection();
        }

        const results: any[] = await this.collection!.find({}).toArray();
       // results = JSON.parse(JSON.stringify(results));
        // console.log(results);
        if (cleanUp) {
            this.cleanUp();
        }
        return results;
    }

    async findOne(id: string, cleanUp?: boolean) {
        if (!this.collection) {
            await this.initCollection();
        }
        const convertedId = new ObjectID(id);
        const filter = { "_id": convertedId };
        const result = await this.collection!.findOne(filter);
        
        return result;
    }
    async findAllPaging(limit: number, skip: number, cleanUp?: boolean): Promise<any> {
        if (!this.collection) {
            await this.initCollection();
        }

        const results = await this.collection!.find({}).limit(limit).skip(skip).toArray();


        if (cleanUp) {
            this.cleanUp();
        }
        return results;

    }
    async findByQuery(query: any, limit: number, skip: number, cleanUp?: boolean): Promise<any> {
        if (!this.collection) {
            await this.initCollection();
        }

        let result: any = null;

        if (limit === -1 || skip === -1) {
            result = await this.collection!.find(query).toArray();
        } else {
            result = await this.collection!.find(query).limit(limit).skip(skip).toArray();
        }



        if (cleanUp) {
            this.cleanUp();
        }

        return result;
    }


    async findAllByQuery(query: any, cleanUp?: boolean): Promise<any> {
        if (!this.collection) {
            await this.initCollection();
        }


        //console.log(query);

        const result = await this.collection!.find(query).toArray();



        if (cleanUp) {
            this.cleanUp();
        }

        return result;
    }

    async findOneByQuery(query: any, cleanUp?: boolean): Promise<any> {
        if (!this.collection) {
            await this.initCollection();
        }


        const results = await this.collection!.findOne(query);

        if (cleanUp) {
            this.cleanUp();
        }
        return results;
    }
    async updateByQuery(filter: any, updatedObject: any, cleanUp?: boolean): Promise<any> {
        if (!this.collection) {
            await this.initCollection();
        }

        const update = { "$mul": updatedObject };
        //const options = { "upsert": false }
        const results = await this.collection!.updateMany(filter, update, { "upsert": false });

        if (cleanUp) {
            this.cleanUp();
        }
        return results;

    }
    async deleteByQuery(query: any, cleanUp?: boolean): Promise<any> {


        if (!this.collection) {
            await this.initCollection();
        }


        const results = await this.collection!.deleteMany(query);

        if (cleanUp) {
            this.cleanUp();
        }
        return results;
    }



    isAllowed(permissions: Permissions, method: string, auth?: boolean, roles?: any[]): boolean {
        let allowed = true;
        Object.entries(permissions).forEach(([repoMethods, rules]) => {
            if (method === repoMethods) {
                rules.forEach(value => {
                    if (value.auth && !auth) {
                        allowed = false;
                    }

                    if (allowed && value.role && !roles?.map(x => x.toLowerCase()).includes(value.role.toLowerCase())) {
                        allowed = false;
                    }
                });

            }

        })

        return allowed;
    }

}