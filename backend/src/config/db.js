const mongoose = require('mongoose');

const DEFAULT_MONGO_URI = 'mongodb://127.0.0.1:27017/midterm_products';

const connectDB = async (uri = process.env.MONGODB_URI || DEFAULT_MONGO_URI) => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  return mongoose.connection;
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

module.exports = {
  connectDB,
  disconnectDB,
  DEFAULT_MONGO_URI,
};

