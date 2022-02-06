const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://jayu23:Jaivik2304@enotebook.hhrgb.mongodb.net/test"

const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log('Connected to Mongo succesfully');
    })
};

module.exports = connectToMongo;
