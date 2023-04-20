const mongoose = require('mongoose');

require('dotenv').config()
const mongoURI = process.env.MONGOURI;

const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log('Connected to Mongo succesfully');
    })
};

module.exports = connectToMongo;
