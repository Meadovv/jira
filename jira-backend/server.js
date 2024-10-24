// Importing modules
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Importing routers
const routers = require('./src/routers/routers');

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(database => {
        console.log(`Database ${database.connection.name} connected on ${database.connection.host}:${database.connection.port}`);
    })
    .catch(err => {
        console.error(err);
    })

app.use(express.json({
    limit: '100mb'
}));

app.use('/api', routers);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});