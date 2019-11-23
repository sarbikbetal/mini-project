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
        bcrypt.hash(user.psswd, 3).then((hash) => {
            user.psswd = hash;
            resolve(user);
        }).catch((err) => {
            reject(err);
        });
    });
};

let checkPwd = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash).then((res) => {
            if (res) resolve();
            else reject("Licence and Password doesn't match");
        }).catch((err) => {
            reject({ err: err });
        })
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
                if (err.code == 11000)
                    reject({ err: "User with licence " + newUser.licence + " exists" });
                reject({ err: err });
            });
    });
}

let signIn = (pass, licence) => {
    return new Promise((resolve, reject) => {
        Agency.findOne({ licence: licence })
            .then(async (result) => {
                if (result) {
                    await checkPwd(pass, result.psswd);
                    return result;
                }
                else
                    reject({ err: "Licence number doesn't exist" })
            })
            .then((result) => {
                return jwtHelper.JWTgen(result);
            })
            .then((token) => {
                resolve({ auth_token: token });
            })
            .catch((msg) => {
                reject({ err: msg });
            })
    });
}

let userInfo = (token) => {
    return new Promise((resolve, reject) => {
        jwtHelper.JWTcheck(token)
            .then((licence) => {
                Agency.findOne({ licence: licence }, (err, result) => {
                    if (err)
                        resolve({ err: err.name });
                    else if (!result)
                        reject({ err: "Authentication error" });
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
                    reject({ err: "Licence number doesn't exist" })
                else
                    rslt = result;
            }).catch((err) => {
                reject({ err: err.name });
            })
            checkPwd(data.old, rslt.psswd).then(async () => {
                let newUser = await hashPwd(user);
                return Agency.findOneAndUpdate(
                    { licence: newUser.licence },
                    { name: newUser.name, psswd: newUser.psswd, contact: newUser.contact, address: newUser.address },
                    { new: true }, (err, doc) => {
                        if (doc) {
                            jwtHelper.JWTgen(doc).then((token) => {
                                let updatedUser = new User(doc);
                                delete updatedUser.psswd;
                                updatedUser.auth_token = token;
                                resolve(updatedUser);
                            }).catch((err) => {
                                reject(err);
                            })
                        }
                        else
                            reject(err);
                    });
            }).catch((err) => {
                reject({ err: err });
            })
        } catch (err) {
            reject({ err: err });
        }
    });
}

let getAllUser = () => {
    return new Promise((resolve, reject) => {
        Agency.find({}, (err, result) => {
            if (err)
                reject({ err: err });
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