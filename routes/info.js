const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Express.js Middlewares
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

///////////////////////////////////// MongoDB routes  //////////////////////////////////////////////

// Load the schema for MongoDB records
require('../models/Schemas');
const Pdsd = mongoose.model('pdsd');
const Agency = mongoose.model('agency');

router.post('/mongo/post', (req, res) => {
    if (req.query.key) {
        let key = req.query.key
        Agency.findById(key, (err, result) => {
            if (err)
                res.json({ msg: err });
            else if (!result)
                res.sendStatus(404);
            else {
                let info = req.body;
                info.agencyID = result.licence;
                new Pdsd(info).save()
                    .then(() => {
                        res.json({ msg: "Record added successfully" });
                    })
                    .catch((err) => {
                        res.json({ msg: err });
                    });
            }
        });
    } else {
        res.sendStatus(401);
    }
});

router.get('/mongo/my', (req, res) => {
    if (req.query.key) {
        let key = req.query.key
        Agency.findById(key, (err, result) => {
            if (err)
                res.json({ msg: err });
            else if (!result)
                res.sendStatus(404);
            else
                Pdsd.find({ 'agencyID': result.licence },
                    (err, result) => {
                        if (err)
                            res.json({ msg: err });
                        else
                            res.json(result);
                    });
        });
    } else {
        res.sendStatus(401);
    }
});

router.get('/mongo/search', (req, res) => {
    Pdsd.find({ 'location': { $regex: req.query.words, $options: 'gi' } },
        (err, result) => {
            if (err)
                res.json({ msg: err });
            else
                res.json(result);
        });
});

///////////////////////////////////// MongoDB routes end //////////////////////////////////////////////


module.exports = router;