const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema definition
const AgencySchema = new Schema({
    licence: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    psswd: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    }
});

// Post Disaster Scenario Development
const Pdsd = new Schema({
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
    weather: {
        type: String
    },
    situation: {
        type: String
    },
    worsen: {
        type: String
    },
    D_code: {
        type: String
    },
    agencyID: {
        type: String
    }
});

const HealthSchema = new Schema({
    disaster: {
        type: String
    },
    doctors: {
        type: Number
    },
    bloodBanks: {
        type: Number
    },
    casualty: {
        dead: {
            type: Number
        },
        injured: {
            type: Number
        }
    }
})

mongoose.model('pdsd', Pdsd);
mongoose.model('agency', AgencySchema);