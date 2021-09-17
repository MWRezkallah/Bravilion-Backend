"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
const mongodb_1 = require("mongodb");
const connectToDB_1 = require("../../lib/connectToDB");
class Repository {
    constructor() {
        this.dbUrl = `${process.env.connectionString}`;
        this.dbName = `${process.env.dbName}`;
        this.collectionName = '';
        this.dbClient = connectToDB_1.mongoClient;
    }
    async initCollection() {
        try {
            let db;
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
            }
            else {
                throw new Error('Collection does not exists');
            }
        }
        catch (error) {
            throw new Error('something went wrong');
        }
    }
    async cleanUp() {
        this.dbClient.close();
    }
    async createMany(item, cleanUp) {
        var _a;
        this.isAllowed(this.permissions, "");
        if (!this.collection) {
            await this.initCollection();
        }
        const result = await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.insertMany(item));
        if (cleanUp) {
            this.cleanUp();
        }
        return result === null || result === void 0 ? void 0 : result.insertedIds;
    }
    async create(item, cleanUp) {
        var _a;
        if (!this.collection) {
            await this.initCollection();
        }
        const result = await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.insertOne(item));
        if (cleanUp) {
            this.cleanUp();
        }
        return result === null || result === void 0 ? void 0 : result.insertedId;
    }
    async update(id, item, cleanUp) {
        var _a;
        if (!this.collection) {
            await this.initCollection();
        }
        const convertedId = new mongodb_1.ObjectID(id);
        const filter = { "_id": convertedId };
        const data = await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.updateOne(filter, { $set: item }, { upsert: false }));
        if (cleanUp) {
            this.cleanUp();
        }
        return data;
    }
    async delete(id, cleanUp) {
        var _a;
        if (!this.collection) {
            await this.initCollection();
        }
        const convertedId = new mongodb_1.ObjectID(id);
        const filter = { "_id": convertedId };
        const data = await ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.deleteOne(filter));
        if (cleanUp) {
            this.cleanUp();
        }
        return !!(data === null || data === void 0 ? void 0 : data.result.ok);
    }
    async findAll(cleanUp) {
        //console.log('invoked');
        if (!this.collection) {
            await this.initCollection();
        }
        const results = await this.collection.find({}).toArray();
        // results = JSON.parse(JSON.stringify(results));
        // console.log(results);
        if (cleanUp) {
            this.cleanUp();
        }
        return results;
    }
    async findOne(id, cleanUp) {
        if (!this.collection) {
            await this.initCollection();
        }
        const convertedId = new mongodb_1.ObjectID(id);
        const filter = { "_id": convertedId };
        const result = await this.collection.findOne(filter);
        return result;
    }
    async findAllPaging(limit, skip, cleanUp) {
        if (!this.collection) {
            await this.initCollection();
        }
        const results = await this.collection.find({}).limit(limit).skip(skip).toArray();
        if (cleanUp) {
            this.cleanUp();
        }
        return results;
    }
    async findByQuery(query, limit, skip, cleanUp) {
        if (!this.collection) {
            await this.initCollection();
        }
        let result = null;
        if (limit === -1 || skip === -1) {
            result = await this.collection.find(query).toArray();
        }
        else {
            result = await this.collection.find(query).limit(limit).skip(skip).toArray();
        }
        if (cleanUp) {
            this.cleanUp();
        }
        return result;
    }
    async findAllByQuery(query, cleanUp) {
        if (!this.collection) {
            await this.initCollection();
        }
        //console.log(query);
        const result = await this.collection.find(query).toArray();
        if (cleanUp) {
            this.cleanUp();
        }
        return result;
    }
    async findOneByQuery(query, cleanUp) {
        if (!this.collection) {
            await this.initCollection();
        }
        const results = await this.collection.findOne(query);
        if (cleanUp) {
            this.cleanUp();
        }
        return results;
    }
    async updateByQuery(filter, updatedObject, cleanUp) {
        if (!this.collection) {
            await this.initCollection();
        }
        const update = { "$mul": updatedObject };
        //const options = { "upsert": false }
        const results = await this.collection.updateMany(filter, update, { "upsert": false });
        if (cleanUp) {
            this.cleanUp();
        }
        return results;
    }
    async deleteByQuery(query, cleanUp) {
        if (!this.collection) {
            await this.initCollection();
        }
        const results = await this.collection.deleteMany(query);
        if (cleanUp) {
            this.cleanUp();
        }
        return results;
    }
    isAllowed(permissions, method, auth, roles) {
        let allowed = true;
        Object.entries(permissions).forEach(([repoMethods, rules]) => {
            if (method === repoMethods) {
                rules.forEach(value => {
                    if (value.auth && !auth) {
                        allowed = false;
                    }
                    if (allowed && value.role && !(roles === null || roles === void 0 ? void 0 : roles.map(x => x.toLowerCase()).includes(value.role.toLowerCase()))) {
                        allowed = false;
                    }
                });
            }
        });
        return allowed;
    }
}
exports.Repository = Repository;
//# sourceMappingURL=repository.js.map