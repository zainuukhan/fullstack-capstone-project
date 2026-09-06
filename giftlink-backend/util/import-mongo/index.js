const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const path = require('path');

const url = process.env.MONGO_URL || "mongodb://localhost:27017";
const dbName = "giftdb";
const collectionName = "gifts";

async function loadData() {
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        
        await collection.deleteMany({});
        
        const giftsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'gifts.json'), 'utf8'));
        const result = await collection.insertMany(giftsData);
        
        console.log(`${result.insertedCount} documents inserted into the gifts collection`);
        console.log("Database populated successfully!");
    } catch (err) {
        console.error("Error populating database:", err);
    } finally {
        await client.close();
    }
}

loadData();
