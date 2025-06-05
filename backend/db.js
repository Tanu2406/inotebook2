
const mongoose = require('mongoose');

const connectToMongo = async () => {
    console.log('MongoDB URI:', process.env.MONOGO_URI);
    await mongoose.connect(process.env.MONOGO_URI);
    console.log("Connected to MongoDB");
};

module.exports = connectToMongo;
