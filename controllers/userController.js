const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');
const mongoose = require('mongoose');

// MongoDB routes
require('../models/Schemas');
const Agency = mongoose.model('agency');

class User { // Custom User Class //
    constructor(o) {
        this.licence = o.licence;
        this.name = o.name;
        this.address = o.address;
        this.contact = o.contact;
        this.psswd = o.psswd;
        this.token = uuid();
    }
};

////////////////////////// Password Hashing and Checking Functions /////////////////////////////
let hashPwd = (user) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(user.psswd, 5, (err, hash) => {
            if (err)
                reject(err);
            else {
                user.psswd = hash;
                resolve();
            }
        });
    })
};

let checkPwd = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, res) => {
            if (res)
                resolve()
            else
                reject("Licence and Password doesn't match")
        });
    })
}
////////////////////////////////////////////////////////////////////////////////////////////////

let signUp = (info) => {
    return new Promise((resolve, reject) => {
        let newUser = new User(info);
        hashPwd(newUser).then(() => {
            new Agency(newUser).save()
                .then((doc) => {
                    resolve({ auth_token: doc.token });
                })
                .catch((err) => {
                    reject({ msg: err });
                });
        }).catch((err) => {
            reject({ msg: err });
        })
    });
}

let signIn = (pass, licence) => {
    return new Promise((resolve, reject) => {
        Agency.findOne({ licence: licence }, (err, result) => {
            if (err)
                reject({ msg: err.name });
            else if (!result)
                reject({ msg: "Licence number doesn't exist" })
            else {
                checkPwd(pass, result.psswd).then(() => {
                    resolve({ auth_token: result.token });
                }).catch((msg) => {
                    reject({ msg: msg });
                })
            }
        });
    });
}

let userInfo = (token) => {
    return new Promise((resolve, reject) => {
        Agency.findOne({ token: token }, (err, result) => {
            if (err)
                resolve({ msg: err.name });
            else if (!result)
                reject({ msg: "Invalid Auth token" });
            else
                resolve({
                    licence: result.licence,
                    name: result.name,
                    address: result.address,
                    contact: result.contact
                });
        });
    })
}

let updateUser = (token, data) => {
    return new Promise((resolve, reject) => {
        let pass = data.psswd;
        hashPwd(data).then(() => {
            Agency.findOneAndUpdate({ token: token }, { $set: { psswd: data.psswd } }, { new: true })
                .then((doc) => {
                    if (doc)
                        resolve();
                    else
                        reject({ msg: "no such user exist" });
                });
        }).catch((err) => {
            reject({ msg: err });
        })
    });
}

// Exports //
module.exports = {
    signUp: signUp,
    signIn: signIn,
    userInfo: userInfo,
    updateUser: updateUser
}