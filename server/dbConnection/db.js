const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();

const db = mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connection established on MONGO_URL');
}).catch((error) => {
    console.log("Connection error: " + error);
})

module.exports = db;