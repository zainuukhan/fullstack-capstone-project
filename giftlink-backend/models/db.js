// giftlink-backend/models/db.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

let dbInstance = null;
const url = process.env.MONGO_URL || "mongodb://localhost:27017";
const dbName = "giftdb";

async function connectToDatabase() {
    if (dbInstance) return dbInstance;

    const client = new MongoClient(url);
    // Task 4 required line:
    await client.connect();
    dbInstance = client.db(dbName);
    return dbInstance;
}

module.exports = connectToDatabase;