const mongoose = require('mongoose');
const jwtHelper = require('./jwtController');

// Load the schema for MongoDB records
require('../models/Schemas');
const Pdsd = mongoose.model('pdsd');
const Agency = mongoose.model('agency');

let newPost = (info, token) => {
  return new Promise((resolve, reject) => {
    jwtHelper.JWTcheck(token)
      .then((licence) => {
        Agency.findOne({ licence: licence }, (err, result) => {
          if (err)
            resolve({ err: err.name });
          else if (!result)
            reject({ err: "Authentication error" });
          else {
            info.agencyID = result.licence;
            new Pdsd(info).save()
              .then(() => {
                resolve({ msg: "Record added successfully" });
              })
              .catch((err) => {
                reject({ err: err });
              });
          }
        });
      }).catch((err) => {
        reject(err);
      });
  })
}


let myPosts = (token) => {
  return new Promise((resolve, reject) => {
    jwtHelper.JWTcheck(token)
      .then((licence) => {
        Pdsd.find({ 'agencyID': licence },
          (err, result) => {
            if (err)
              reject({ err: err });
            else
              resolve(result);
          });
      }).catch((err) => {
        reject(err);
      });
  });
}

let search = (keyword) => {
  return new Promise((resolve, reject) => {
    Pdsd.find({ 'location': { $regex: keyword, $options: 'gi' } },
      (err, result) => {
        if (err)
          reject({ err: err });
        else
          resolve(result);
      });
  })
}

let getAllRecords = () => {
  return new Promise((resolve, reject) => {
    Pdsd.find({}, (err, result) => {
      if (err)
        reject({ msg: err });
      else
        resolve(result);
    })
  })
}

//Exports//
module.exports = {
  newPost: newPost,
  myPosts: myPosts,
  search: search,
  getAllRecords: getAllRecords
}