const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();

// Importing models
const userModel = require('../models/user.model');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // Check if username and password are correct in the database

    const foundUser = await userModel
        .findOne({username});
    if(!foundUser) {
        return res.status(400).send({
            message: 'User not found!'
        });
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if(passwordMatch) {
        const payload = {
            _id: foundUser._id,
            username: foundUser.username,
            role: foundUser.role
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        return res.status(200).send({
            message: 'Login successful!',
            token
        });
    } else {
        return res.status(400).send({
            message: 'Invalid password!'
        });
    }
});

router.post('/verify', (_req, res) => {
    const token = _req.headers.authorization;
    if(!token) {
        return res.status(401).send({
            message: 'Token not found!'
        });
    }
    try {
        const data_decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).send({
            username: data_decoded.username,
            id: data_decoded.id,
            message: 'Verified token!'
        })
    } catch (err) {
        return res.status(401).send({
            message: err.message
        });
    }
});

module.exports = router;