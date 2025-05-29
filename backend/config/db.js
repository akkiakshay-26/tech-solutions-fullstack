const mongoose = require('mongoose');

const connectDB = async () => {
    try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    // console.log(`MongoDB connected: ${conn.connection.host}`);
    const usersCount = await mongoose.connection.db.collection('users').countDocuments();
    // console.log(`Users in database: ${usersCount}`);

  } catch (err) {
    console.error( 'MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;