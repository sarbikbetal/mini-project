const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');

// Express.js Middlewares
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

///////////////////////////////////// MongoDB routes  //////////////////////////////////////////////

router.post('/newPost', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const bearer = authHeader.split(' ');
        const token = bearer[1];

        recordController.newPost(req.body, token).then((result) => {
            res.json(result);
        }).catch((err) => {
            res.status(400).json(err);
        });
    } else {
        res.sendStatus(400).json({ "err": "Invalid request" });
    }
});

router.get('/my', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const bearer = authHeader.split(' ');
        const token = bearer[1];

        recordController.myPosts(token).then((result) => {
            res.json(result);
        }).catch((err) => {
            res.status(400).json(err);
        });
    } else {
        res.sendStatus(400).json({ "msg": "Invalid request" });
    }
});

router.get('/search', (req, res) => {
    if (req.query.words) {
        recordController.search(req.query.words).then((result) => {
            res.json(result);
        }).catch((err) => {
            res.status(500).json(err);
        })
    } else res.status(400);
});

router.get('/all', (req, res) => {
    recordController.getAllRecords().then((result) => {
        res.json(result);
    }).catch(() => {
        res.json(result);
    });
});
///////////////////////////////////// MongoDB routes end //////////////////////////////////////////////


module.exports = router;