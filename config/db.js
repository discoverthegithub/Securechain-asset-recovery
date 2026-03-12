const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        return true;
    } catch (err) {
        console.error('❌ Failed to connect to MongoDB at', process.env.MONGO_URI);
        console.error('   Make sure MongoDB is running! Error:', err.message);
        return false;
    }
}

module.exports = connectDB;