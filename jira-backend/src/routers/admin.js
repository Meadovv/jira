const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const {
    verifyToken,
    newMongoId
} = require('../utils/utils');
const ROLE = require('../constants/ROLE');

// Importing models
const userModel = require('../models/user.model');
const projectModel = require('../models/project.model');

router.post('/add-user', verifyToken, async (req, res) => {
    const auth = req.auth;
    if (auth?.role != ROLE.ADMIN) {
        return res.status(401).send({
            message: 'Unauthorized!'
        });
    }

    const { username, password } = req.body;
    const foundUser = await userModel
        .findOne({ username });
    if (foundUser) {
        return res.status(400).send({
            message: 'User already exists!'
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ username, password: hashedPassword });
    await newUser.save();

    return res.status(200).send({
        username: newUser.username,
        message: 'User added!'
    });
});

router.post('/add-role', verifyToken, async (req, res) => {
    try {
        const auth = req.auth;
        if (auth?.role != ROLE.ADMIN) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }

        const { username, role } = req.body;
        const foundUser = await userModel
            .findOne({ username });
        if (!foundUser) {
            return res.status(400).send({
                message: 'User not found!'
            });
        }

        foundUser.role = role;
        await foundUser.save();

        return res.status(200).send({
            message: 'Role added!',
            user: {
                username: foundUser.username,
                role: foundUser.role
            }
        });
    } catch (err) {
        return res.status(500).send({
            message: 'Internal server error!'
        });
    }
});

router.post('/create-project', verifyToken, async (req, res) => {
    try {
        const auth = req.auth;
        if (auth?.role != ROLE.ADMIN) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }

        const {
            leader_username,
            project_code,
            roles
        } = req.body;
        const foundLeader = await userModel
            .findOne({ username: leader_username });
        if (!foundLeader) {
            return res.status(400).send({
                message: 'Leader not found!'
            });
        }

        if (foundLeader.role != ROLE.PM) {
            return res.status(400).send({
                message: 'This is not a PM!'
            });
        }

        const foundProject = await projectModel
            .findOne({ code: project_code });
        if (foundProject) {
            return res.status(400).send({
                message: 'Project already exists!'
            });
        }

        const newProject = new projectModel({
            creator: newMongoId(auth.id),
            code: project_code,
            leader: foundLeader._id
        });
        await newProject.save();

        return res.status(200).send({
            message: 'Project created!',
            project: {
                creator: auth.username,
                code: newProject.code,
                leader: foundLeader.username
            }
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: 'Internal server error!'
        });
    }
});

router.get('/get-projects', verifyToken, async (req, res) => {
    try {
        const auth = req.auth;
        if (auth?.role != ROLE.ADMIN) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }

        const projects = await projectModel
            .find()
            .populate('creator', 'username')
            .populate('leader', 'username');
        return res.status(200).send({
            projects
        });
    } catch (err) {
        return res.status(500).send({
            message: 'Internal server error!'
        });
    }
});

router.get('/get-users', verifyToken, async (req, res) => {
    try {
        const auth = req.auth;
        if (auth?.role != ROLE.ADMIN) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }

        const role = req.query.role || null;

        let users;
        if (role === null) {
            users = await userModel.find().select('-password');
        } else {
            users = await userModel.find({ role }).select('-password');
        }
        return res.status(200).send({
            users
        });
    } catch (err) {
        return res.status(500).send({
            message: 'Internal server error!'
        });
    }
});

module.exports = router;