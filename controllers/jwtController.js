const jwt = require('jsonwebtoken');

// JWT Secret
const jwtKey = process.env.SECRET;
const jwtExpiry = "5d";

///////////////////////////// JWT Generation and Validation //////////////////////////////////////

let JWTgen = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ licence: user.licence }, jwtKey, {
      algorithm: 'HS256',
      expiresIn: jwtExpiry
    }, (err, token) => {
      if (err)
        reject(err)
      else
        resolve(token);
    });
  });
}

let JWTcheck = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtKey,(err, payload) => {
      if (err)
        reject(err);
      else
        resolve(payload.licence);
    });
  });
}

//////////////////////////////////////////////////////////////////////////////////////////////////


// Exports //
module.exports = {
  JWTgen: JWTgen,
  JWTcheck: JWTcheck
}