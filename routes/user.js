const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Express.js Middlewares
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// User SignUp Route
router.post('/signup', (req, res) => {
    let info = req.body;
    if (info) {
        userController.signUp(info)
            .then((msg) => {
                res.json(msg);
            }).catch((msg) => {
                res.json(msg);
            })
    } else
        res.sendStatus(400);

});


router.post('/signin', (req, res) => {
    if (req.body.licence && req.body.psswd) {
        userController.signIn(req.body.psswd, req.body.licence)
            .then((msg) => {
                res.json(msg);
            }).catch((msg) => {
                res.status(401).json(msg);
            })
    } else
        res.sendStatus(400);
});


router.get('/info', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const bearer = authHeader.split(' ');
        const token = bearer[1];

        userController.userInfo(token).then((result) => {
            res.json(result);
        }).catch((err) => {
            res.status(400).json(err);
        });
    } else {
        res.sendStatus(401);
    }
});

router.put('/update', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (authHeader && req.body.licence && req.body.psswd && req.body.old) {
        const bearer = authHeader.split(' ');
        const token = bearer[1];

        userController.updateUser(token, req.body).then((result) => {
            res.json(result);
        }).catch((err) => {
            res.status(404).json(err);
        });
    } else {
        res.sendStatus(400);
    }
})


router.get('/all', (req, res) => {
    userController.getAllUser().then((result) => {
        res.json(result);
    }).catch(() => {
        res.json(result);
    });
});



// Module Export
module.exports = router;