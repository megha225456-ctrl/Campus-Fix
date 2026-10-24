const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    // Do not crash server in dev if local DB isn't running yet; provide helpful guide
    console.warn('[Database Notice] If you are using MongoDB Atlas, make sure your MONGODB_URI in .env is correct and your IP is whitelisted.');
  }
};

module.exports = connectDB;
