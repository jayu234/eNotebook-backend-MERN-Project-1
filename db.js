const mongoose = require('mongoose');

import dotenv from 'dotenv';
const mongoURI = process.env.MONGOURI;


dotenv.config();
const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log('Connected to Mongo succesfully');
    })
};

module.exports = connectToMongo;
