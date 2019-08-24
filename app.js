require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

require('./models/Schemas');
const Model = mongoose.model('record');

mongoose.connect(process.env.MONGO_URI,
    { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/post', (req, res) => {
    new Model(req.body).save()
        .then(() => {
            res.json({ msg: "Record added successfully" });
        })
        .catch((err) => {
            res.json({ msg: err });
        });
    // res.json(req.body);
});

app.put('/update', (req, res) => {
    Model.updateOne({ "location": req.body.location }, { $push: { "info": req.body.info } }, (err) => {
        if (err)
            res.json({ msg: err });
        else
            res.json({ msg: "Record updated successfully" });
    });
});

app.get('/search', (req, res) => {
    res.set({ 'Access-Control-Allow-Origin': '*/*' });
        
    Model.find({ 'location': { $regex: req.query.words, $options: 'gi' } },
        (err, result) => {
            if (err)
                res.json({ msg: err });
            else
                res.json(result);
        });
});


//Server Init
const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
    console.log(`Server started on port ${server.address().port}`);
});