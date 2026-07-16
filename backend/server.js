require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/dbConfig');

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

start();