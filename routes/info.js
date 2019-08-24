const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load the schema for MongoDB records
require('../models/Schemas');
const Model = mongoose.model('record');

// Express.js Middlewares
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

///////////////////////////////////// MongoDB routes  //////////////////////////////////////////////
router.post('/mongo/post', (req, res) => {
    new Model(req.body).save()
        .then(() => {
            res.json({ msg: "Record added successfully" });
        })
        .catch((err) => {
            res.json({ msg: err });
        });
});

router.put('/mongo/update', (req, res) => {
    Model.updateOne({ "location": req.body.location }, { $push: { "info": req.body.info } }, (err) => {
        if (err)
            res.json({ msg: err });
        else
            res.json({ msg: "Record updated successfully" });
    });
});

router.get('/mongo/search', (req, res) => {
    res.set({ 'Access-Control-Allow-Origin': '*/*' });
        
    Model.find({ 'location': { $regex: req.query.words, $options: 'gi' } },
        (err, result) => {
            if (err)
                res.json({ msg: err });
            else
                res.json(result);
        });
});

///////////////////////////////////// MongoDB routes end //////////////////////////////////////////////



module.exports = router;