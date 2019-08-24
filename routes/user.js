const express = require('express');
const uuid = require('uuid/v4');
const router = express.Router();
const postgres = require('../database/postgres');

// Express.js Middlewares
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.post('/pg/add', (req, res) => {
    let info = req.body;
    let apikey = uuid();
    postgres.addUser([info.licence, info.name, info.address, info.contact, apikey], (err, result) => {
        if (err)
            res.json({ msg: "Error adding record", stack: err.stack });
        else
            res.json({ key: apikey });
    });
});

router.get('/pg/info', (req, res) => {
    let key = req.params.key
    postgres.query('SELECT * FROM agencies WHERE apikey=$1', [key], (err, result) => {
        if (err)
            res.json({ msg: "Error adding record", stack: err.stack });
        else
            res.json(result.rows);
    });
})


module.exports = router;