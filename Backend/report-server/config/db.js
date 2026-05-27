const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/finelife_db');
        console.log('☘️ 🟢 Connecting to database successfully');
    } catch(err){
        console.error("☘️ 🟥 Can't connect to database", err);
        process.exit(1);
    }
}

module.exports = connectDB;