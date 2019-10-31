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
        const bearer = header.split(' ');
        const token = bearer[1];

        userController.userInfo(token).then((result) => {
            res.json(result);
        }).catch(() => {
            res.sendStatus(404);
        });
    } else {
        res.sendStatus(401);
    }
});

router.put('/update', (req, res) => { // Invalid route
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
    userController.getAllUser().then((result) => {
        res.json(result);
    }).catch(() => {
        res.json(result);
    });
});



// Module Export
module.exports = router;