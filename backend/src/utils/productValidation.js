const isFilledString = (value) => typeof value === 'string' && value.trim().length > 0;

const buildProductPayload = (body = {}) => {
  const errors = [];

  if (!isFilledString(body.name)) {
    errors.push('name is required');
  }

  if (!isFilledString(body.category)) {
    errors.push('category is required');
  }

  if (!isFilledString(body.image)) {
    errors.push('image is required');
  }

  if (body.price === undefined || body.price === null || body.price === '') {
    errors.push('price is required');
  }

  if (body.stock === undefined || body.stock === null || body.stock === '') {
    errors.push('stock is required');
  }

  const price = Number(body.price);
  if (body.price !== undefined && body.price !== null && body.price !== '' && Number.isFinite(price) === false) {
    errors.push('price must be a valid number');
  }

  if (Number.isFinite(price) && price <= 0) {
    errors.push('price must be greater than 0');
  }

  const stock = Number(body.stock);
  if (body.stock !== undefined && body.stock !== null && body.stock !== '' && Number.isFinite(stock) === false) {
    errors.push('stock must be a valid number');
  }

  if (Number.isFinite(stock) && stock < 0) {
    errors.push('stock must be greater than or equal to 0');
  }

  const payload = {
    name: isFilledString(body.name) ? body.name.trim() : '',
    category: isFilledString(body.category) ? body.category.trim() : '',
    price,
    image: isFilledString(body.image) ? body.image.trim() : '',
    stock,
  };

  return {
    payload,
    errors,
  };
};

const parseProductId = (value) => {
  const id = Number(value);
  if (!Number.isInteger(id)) {
    return null;
  }

  return id;
};

module.exports = {
  buildProductPayload,
  parseProductId,
};

