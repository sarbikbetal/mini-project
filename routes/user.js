const express = require('express');
const uuid = require('uuid/v4');
const router = express.Router();
const postgres = require('../database/postgres');
const mongoose = require('mongoose');


// Express.js Middlewares
router.use(express.json());
router.use(express.urlencoded({ extended: false }));


// PostgreSQL routes
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
    let key = req.query.key
    postgres.query('SELECT * FROM agencies WHERE apikey = $1', [key], (err, result) => {
        if (err)
            res.json({ msg: "Error adding record", stack: err.stack });
        else
            res.json(result.rows);
    });
})

router.get('/pg/all', (req, res) => {
    postgres.query('SELECT * FROM agencies', [], (err, result) => {
        if (err)
            res.json({ msg: "Error adding record", stack: err.stack });
        else
            res.json(result.rows);
    });
})

// MongoDB routes

require('../models/Schemas');
const Agency = mongoose.model('agency');

router.post('/mongo/add', (req, res) => {
    let info = req.body;
    let agent = new Agency(info).save()
        .then(() => {
            res.json({ key: agent._id });
        })
        .catch((err) => {
            res.json({ msg: err });
        });
});

router.get('/mongo/info', (req, res) => {
    let key = req.query.key
    Agency.findById({ _id: key }, (err, result) => {
        if (err)
            res.json({ msg: err });
        else
            res.json(result);
    });
})

router.get('/mongo/all', (req, res) => {
    Agency.find({}, (err, result) => {
        if (err)
            res.json({ msg: err });
        else
            res.json(result);
    })
})



// Module Export
module.exports = router;