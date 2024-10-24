const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();

// Importing models
const userModel = require('../models/user.model');
const { verifyToken } = require('../utils/utils');

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

router.post('/verify', verifyToken, (req, res) => {
    const auth = req.auth;

    if(!auth.verified) {
        return res.status(401).send({
            message: 'Unauthorized!'
        });
    }
    auth.verified = undefined;
    return res.status(200).send({
        message: 'Authorized!',
        auth: auth
    });
});

module.exports = router;