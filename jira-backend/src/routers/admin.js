const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { 
    verifyToken
} = require('../utils/utils');
const ROLE = require('../constants/ROLE');

// Importing models
const userModel = require('../models/user.model');

router.post('/add-user', verifyToken, async (req, res) => {
    const auth = req.auth;
    const { username, password, role } = req.body;

    if(auth?.role != ROLE.ADMIN) {
        return res.status(401).send({
            message: 'Unauthorized!'
        });
    }

    const foundUser = await userModel
        .findOne({username});
    if(foundUser) {
        return res.status(400).send({
            message: 'User already exists!'
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({username, password: hashedPassword, role});
    await newUser.save();

    return res.status(200).send({
        user_id: newUser._id,
        message: 'User added!'
    });
});

module.exports = router;