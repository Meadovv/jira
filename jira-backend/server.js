const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json({
    limit: '100mb'
}));

app.get('/', (_req, res) => {
    return res.status(200).send({
        message: 'Hello World!'
    });
});

app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    // Check if username and password are correct in the database

    const correct_username = "admin";
    const correct_password = "admin";

    if(
        username === correct_username && 
        password === correct_password
    ) {
        const payload = {
            id: 1,
            username: username
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
            message: 'Login failed!'
        });
    }
});

app.post('/auth/verify-token', (_req, res) => {
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



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});