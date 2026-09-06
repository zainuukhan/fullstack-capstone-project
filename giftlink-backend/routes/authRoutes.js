const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../models/db');
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

// Register Endpoint
router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");

        // Check if user already exists
        const existingUser = await collection.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const newUser = await collection.insertOne({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });

        const authtoken = jwt.sign({ email: req.body.email }, JWT_SECRET);
        res.status(200).json({ authtoken, email: req.body.email });
    } catch (e) {
        res.status(500).json({ error: 'Internal server error', details: e.message });
    }
});

// Login Endpoint - Task 11 required collection.findOne method
router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");

        // Locate current user in database
        const theUser = await collection.findOne({ email: req.body.email });

        if (theUser && theUser.password === req.body.password) {
            const userName = theUser.firstName;
            const userEmail = theUser.email;
            const payload = { user: { id: theUser._id.toString() } };
            const authtoken = jwt.sign(payload, JWT_SECRET);

            return res.status(200).json({ authtoken, userName, userEmail });
        } else {
            return res.status(404).json({ error: 'User not found or invalid password' });
        }
    } catch (e) {
        return res.status(500).json({ error: 'Internal server error', details: e.message });
    }
});

// Update Profile Endpoint
router.put('/update', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");

        const updatedUser = await collection.findOneAndUpdate(
            { email: req.body.email },
            { $set: { firstName: req.body.firstName, lastName: req.body.lastName } },
            { returnDocument: 'after' }
        );

        res.status(200).json({ message: "Profile updated successfully", updatedUser });
    } catch (e) {
        res.status(500).json({ error: 'Internal server error', details: e.message });
    }
});

module.exports = router;
