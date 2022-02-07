const mongoose = require('mongoose');
<<<<<<< HEAD
import dotenv from 'dotenv';
const mongoURI = process.env.MONGOURI;
=======
const mongoURI = "mongodb+srv://jayu23:Jaivik2304@enotebook.hhrgb.mongodb.net/test"
>>>>>>> 988538aafb2fc68d2ad099d40870228a55dbc3a7

dotenv.config();
const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log('Connected to Mongo succesfully');
    })
};

module.exports = connectToMongo;
