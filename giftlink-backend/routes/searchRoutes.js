// giftlink-backend/routes/searchRoutes.js
const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

// Route to search and filter gifts: GET /api/search
router.get('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        let query = {};

        // Filter by category if provided and not equal to 'all'
        if (req.query.category && req.query.category !== 'all') {
            query.category = req.query.category;
        }

        // Additional optional filters for name, condition, and age
        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: "i" };
        }
        if (req.query.condition) {
            query.condition = req.query.condition;
        }
        if (req.query.age_years) {
            query.age_years = { $lte: parseInt(req.query.age_years) };
        }

        const gifts = await collection.find(query).toArray();
        res.json(gifts);
    } catch (e) {
        next(e);
    }
});

module.exports = router;