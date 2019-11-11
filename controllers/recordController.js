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
        return Pdsd.find({ 'agencyID': licence }).sort('-date');
      }).then((results) => {
        resolve(results);
      })
      .catch((err) => {
        reject({ err: err });
      });
  });
}

let search = (keyword) => {
  return new Promise((resolve, reject) => {
    Pdsd.find({ 'location': { $regex: keyword, $options: 'gi' } }).sort('location')
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject({ err: err });
      });
  });
}

let getAllRecords = () => {
  return new Promise((resolve, reject) => {
    Pdsd.find({}).sort('-date').then((records) => {
      resolve(records);
    }).catch((err) => {
      reject({ err: err });
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