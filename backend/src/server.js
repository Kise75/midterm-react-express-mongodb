require('dotenv').config();

const app = require('./app');
const { connectDB, DEFAULT_MONGO_URI } = require('./config/db');
const { seedProducts } = require('./seed/products');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_MONGO_URI;

const startServer = async () => {
  try {
    await connectDB(MONGODB_URI);
    console.log(`Connected to MongoDB at ${MONGODB_URI}`);

    const seedResult = await seedProducts();
    if (seedResult.seeded) {
      console.log(`Seeded ${seedResult.count} initial products`);
    } else {
      console.log(`Products collection already has ${seedResult.count} documents`);
    }

    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start backend:', error.message);
    process.exit(1);
  }
};

startServer();

