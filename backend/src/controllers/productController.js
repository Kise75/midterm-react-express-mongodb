const Product = require('../models/Product');
const { buildProductPayload, parseProductId } = require('../utils/productValidation');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const formatProduct = (product) => {
  if (!product) {
    return null;
  }

  const object = typeof product.toObject === 'function' ? product.toObject() : product;

  return {
    id: object.id,
    name: object.name,
    category: object.category,
    price: object.price,
    image: object.image,
    stock: object.stock,
  };
};

const buildFilters = (query) => {
  const filters = {};

  if (query.category && query.category.trim()) {
    filters.category = new RegExp(`^${escapeRegex(query.category.trim())}$`, 'i');
  }

  if (query.search && query.search.trim()) {
    filters.name = new RegExp(escapeRegex(query.search.trim()), 'i');
  }

  return filters;
};

const getAllProducts = async (req, res) => {
  const filters = buildFilters(req.query);
  const products = await Product.find(filters).sort({ id: 1 }).lean();

  res.status(200).json({
    success: true,
    count: products.length,
    data: products.map(formatProduct),
  });
};

const getProductById = async (req, res) => {
  const productId = parseProductId(req.params.id);
  if (productId === null) {
    return res.status(400).json({
      success: false,
      message: 'Product id must be a whole number',
    });
  }

  const product = await Product.findOne({ id: productId }).lean();

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  return res.status(200).json({
    success: true,
    data: formatProduct(product),
  });
};

const createProduct = async (req, res) => {
  const { payload, errors } = buildProductPayload(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  const lastProduct = await Product.findOne().sort({ id: -1 }).select('id').lean();
  const nextId = lastProduct ? lastProduct.id + 1 : 1;

  const product = await Product.create({
    id: nextId,
    ...payload,
  });

  return res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: formatProduct(product),
  });
};

const updateProduct = async (req, res) => {
  const productId = parseProductId(req.params.id);
  if (productId === null) {
    return res.status(400).json({
      success: false,
      message: 'Product id must be a whole number',
    });
  }

  const { payload, errors } = buildProductPayload(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  const updatedProduct = await Product.findOneAndUpdate({ id: productId }, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedProduct) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: formatProduct(updatedProduct),
  });
};

const deleteProduct = async (req, res) => {
  const productId = parseProductId(req.params.id);
  if (productId === null) {
    return res.status(400).json({
      success: false,
      message: 'Product id must be a whole number',
    });
  }

  const deletedProduct = await Product.findOneAndDelete({ id: productId });

  if (!deletedProduct) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
    data: formatProduct(deletedProduct),
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
