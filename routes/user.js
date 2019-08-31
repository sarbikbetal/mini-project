const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Express.js Middlewares
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// User SignUp Route
router.post('/signup', (req, res) => {
    let info = req.body;
    userController.signUp(info).then((msg) => {
        res.json(msg);
    })

});


router.post('/signin', (req, res) => {
    if (req.body.licence && req.body.psswd) {
        userController.signIn(req.body.psswd, req.body.licence).then((msg) => {
            res.json(msg);
        })
    } else {
        res.sendStatus(403);
    }
});


router.get('/info', (req, res) => {
    if (req.body.token) {
        let token = req.body.token;
        userController.userInfo(token).then((result) => {
            res.json(result);
        }).catch(() => {
            res.sendStatus(404);
        });
    } else {
        res.sendStatus(401);
    }
});

router.put('/update', (req, res) => {
    if (req.body.token) {
        let token = req.body.token;
        userController.userInfo(token).then((result) => {
            res.json(result);
        }).catch(() => {
            res.sendStatus(404);
        });
    } else {
        res.sendStatus(401);
    }
})


router.get('/mongo/all', (req, res) => {
    Agency.find({}, (err, result) => {
        if (err)
            res.json({ msg: err });
        else
            res.json(result);
    })
});



// Module Export
module.exports = router;