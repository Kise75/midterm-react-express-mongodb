const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running',
    availableRoutes: ['/', '/health', '/products'],
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is healthy',
  });
});

app.use('/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
