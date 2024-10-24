const express = require('express');
const router = express.Router();

// Importing routers
const auth_router = require('./auth');
const admin_router = require('./admin');

router.use('/auth', auth_router);
router.use('/admin', admin_router);

router.get('/', (_req, res) => {
    return res.status(200).send({
        message: 'Hello World!'
    });
});

router.get('*', (req, res) => {
    return res.status(404).send({
        message: 'Not found!'
    });
})

router.post('*', (req, res) => {
    return res.status(404).send({
        message: 'Not found!'
    });
})

module.exports = router;