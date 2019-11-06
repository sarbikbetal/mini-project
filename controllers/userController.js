const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwtHelper = require('./jwtController');

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
                resolve(user);
            }
        });
    });
};

let checkPwd = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, res) => {
            if (res) resolve();
            else reject("Licence and Password doesn't match");
        });
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////

let signUp = (info) => {
    return new Promise((resolve, reject) => {
        let newUser = new User(info);
        hashPwd(newUser)
            .then(() => {
                return new Agency(newUser).save();
            })
            .then((doc) => {
                return jwtHelper.JWTgen(doc);
            })
            .then((token) => {
                resolve({ auth_token: token });
            })
            .catch((err) => {
                reject({ msg: err });
            });
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
                checkPwd(pass, result.psswd)
                    .then(() => {
                        return jwtHelper.JWTgen(result);
                    })
                    .then((token) => {
                        resolve({ auth_token: token });
                    })
                    .catch((msg) => {
                        reject({ msg: msg });
                    })
            }
        });
    });
}

let userInfo = (token) => {
    return new Promise((resolve, reject) => {
        jwtHelper.JWTcheck(token)
            .then((licence) => {
                Agency.findOne({ licence: licence }, (err, result) => {
                    if (err)
                        resolve({ msg: err.name });
                    else if (!result)
                        reject({ msg: "Authentication error" });
                    else
                        resolve({
                            licence: result.licence,
                            name: result.name,
                            address: result.address,
                            contact: result.contact
                        });
                });
            }).catch((err) => {
                reject(err);
            });
    });
}

let updateUser = (token, data) => {
    return new Promise(async (resolve, reject) => {
        let user = new User(data);
        let rslt;
        try {
            await jwtHelper.JWTcheck(token)
            await Agency.findOne({ licence: user.licence }).then((result) => {
                if (!result)
                    reject({ msg: "Licence number doesn't exist" })
                else
                    rslt = result;
            }).catch((err) => {
                reject({ msg: err.name });
            })
            checkPwd(data.old, rslt.psswd).then(async () => {
                let newUser = await hashPwd(user);
                return Agency.findOneAndUpdate(
                    { licence: newUser.licence },
                    { name: newUser.name, psswd: newUser.psswd, contact: newUser.contact, address: newUser.address },
                    { new: true }, (err, doc) => {
                        if (doc)
                            resolve(doc);
                        else
                            reject(err);
                    });
            }).catch((err) => {
                reject({ err: err });
            })
        } catch (error) {
            reject({ err: error });
        }
    });
}

let getAllUser = () => {
    return new Promise((resolve, reject) => {
        Agency.find({}, (err, result) => {
            if (err)
                reject({ msg: err });
            else
                resolve(result);
        })
    })
}

// Exports //
module.exports = {
    signUp: signUp,
    signIn: signIn,
    userInfo: userInfo,
    updateUser: updateUser,
    getAllUser: getAllUser
}