const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://gaurav:gaurav@cluster0.pnzbxi3.mongodb.net/');
    console.log(`MongoDB connected`);
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1); 
  }
};

module.exports = connectDB;
