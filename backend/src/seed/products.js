const Product = require('../models/Product');
const { connectDB, disconnectDB } = require('../config/db');

const sampleProducts = [
  {
    id: 1,
    name: 'Laptop Dell XPS 13',
    category: 'Laptop',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300',
    stock: 5,
  },
  {
    id: 2,
    name: 'iPhone 14',
    category: 'Phone',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300',
    stock: 10,
  },
  {
    id: 3,
    name: 'Samsung Galaxy S23',
    category: 'Phone',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300',
    stock: 8,
  },
  {
    id: 4,
    name: 'MacBook Pro',
    category: 'Laptop',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300',
    stock: 3,
  },
];

const seedProducts = async () => {
  const count = await Product.countDocuments();

  if (count > 0) {
    return {
      seeded: false,
      count,
    };
  }

  await Product.insertMany(sampleProducts);

  return {
    seeded: true,
    count: sampleProducts.length,
  };
};

const runStandalone = async () => {
  try {
    await connectDB();
    const result = await seedProducts();
    console.log(
      result.seeded
        ? `Seeded ${result.count} products into MongoDB`
        : `Skipped seed because products collection already has ${result.count} documents`
    );
  } catch (error) {
    console.error('Failed to seed products:', error.message);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
};

if (require.main === module) {
  runStandalone();
}

module.exports = {
  sampleProducts,
  seedProducts,
};
