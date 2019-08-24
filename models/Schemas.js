const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema definition
const AgencySchema = new Schema({
    licence: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    contact: {
        email: {
            type: String
        },
        phone: {
            type: Number,
            required: true
        }
    }
});


const MasterSchema = new Schema({
    location: {
        type: String,
        required: true
    },
    co_ords: {
        type: [Number],
        required: true
    },
    date: {
        type: String,
        required: true
    },
    info: [AgencySchema]
});

mongoose.model('record', MasterSchema);