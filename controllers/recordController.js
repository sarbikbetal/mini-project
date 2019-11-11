const mongoose = require('mongoose');
const jwtHelper = require('./jwtController');

// Load the schema for MongoDB records
require('../models/Schemas');
const Pdsd = mongoose.model('pdsd');
const Agency = mongoose.model('agency');

let newPost = (info, token) => {
  return new Promise((resolve, reject) => {
    var dateRE = /^\d{4}(\.)(((0)[0-9])|((1)[0-2]))(\.)([0-2][0-9]|(3)[0-1])$/;
    if (!dateRE.test(info.date))
      reject({ err: "Please format the date as YYYY.MM.DD" });
      
    jwtHelper.JWTcheck(token)
      .then((licence) => {
        return Agency.findOne({ licence: licence })
      }).catch((err) => {
        reject({ err: err.name });
      }).then((result) => {
        if (!result)
          reject({ err: "Authentication error" });
        else {
          info.agencyID = result.licence;
          return new Pdsd(info).save()
        }
      }).then(() => {
        resolve({ msg: "Record added successfully" });
      }).catch((err) => {
        reject({ err: err });
      })
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