const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

// Importing models
const userModel = require('../models/user.model');

router.post('/add-user', async (req, res) => {
    const { username, password, role } = req.body;
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