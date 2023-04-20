const mongoose = require('mongoose');
require('dotenv').config({path: "config.env"});

const mongoURI = process.env.MONGO_URI;
const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log('Connected to Mongo succesfully');
    })
};

module.exports = connectToMongo;
