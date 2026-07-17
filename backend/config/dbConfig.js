const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI || `mongodb+srv://sunilguptait06:Sunil%40mern1@cluster0.stuqq5m.mongodb.net/ai-task-manager?retryWrites=true&w=majority&appName=Cluster0` ;
  if (!uri) {
    throw new Error('MONGO_URI is not set in environment variables');
  }

  try {
    await mongoose.connect(uri, {
      autoIndex: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;