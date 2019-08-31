require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI,
    { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Express.js Routes
const user = require("./routes/user");
const info = require("./routes/info");

app.use('/user', user);
app.use('/info', info);

//Server Init
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`Server started on port ${server.address().port}`);
});