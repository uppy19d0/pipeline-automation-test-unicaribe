const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const Calculator = require('./calculator');
const utils = require('./utils');
const sum = require('./sum');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the CI Simple Node Project API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      calculator: '/api/calculator/*',
      utils: '/api/utils/*',
      legacy: '/api/sum'
    }
  });
});

// Calculator endpoints
app.post('/api/calculator/add', (req, res) => {
  try {
    const { a, b } = req.body;
    const result = Calculator.add(a, b);
    res.json({ result, operation: 'addition', operands: [a, b] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/calculator/subtract', (req, res) => {
  try {
    const { a, b } = req.body;
    const result = Calculator.subtract(a, b);
    res.json({ result, operation: 'subtraction', operands: [a, b] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/calculator/multiply', (req, res) => {
  try {
    const { a, b } = req.body;
    const result = Calculator.multiply(a, b);
    res.json({ result, operation: 'multiplication', operands: [a, b] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/calculator/divide', (req, res) => {
  try {
    const { a, b } = req.body;
    const result = Calculator.divide(a, b);
    res.json({ result, operation: 'division', operands: [a, b] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/calculator/power', (req, res) => {
  try {
    const { base, exponent } = req.body;
    const result = Calculator.power(base, exponent);
    res.json({ result, operation: 'power', base, exponent });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/calculator/sqrt', (req, res) => {
  try {
    const { number } = req.body;
    const result = Calculator.sqrt(number);
    res.json({ result, operation: 'square_root', number });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/calculator/factorial', (req, res) => {
  try {
    const { n } = req.body;
    const result = Calculator.factorial(n);
    res.json({ result, operation: 'factorial', number: n });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Utils endpoints
app.post('/api/utils/array-sum', (req, res) => {
  try {
    const { array } = req.body;
    const result = utils.arraySum(array);
    res.json({ result, operation: 'array_sum', array });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/utils/array-average', (req, res) => {
  try {
    const { array } = req.body;
    const result = utils.arrayAverage(array);
    res.json({ result, operation: 'array_average', array });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/utils/capitalize', (req, res) => {
  try {
    const { text } = req.body;
    const result = utils.capitalize(text);
    res.json({ result, operation: 'capitalize', original: text });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/utils/reverse-string', (req, res) => {
  try {
    const { text } = req.body;
    const result = utils.reverseString(text);
    res.json({ result, operation: 'reverse_string', original: text });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/utils/is-palindrome', (req, res) => {
  try {
    const { text } = req.body;
    const result = utils.isPalindrome(text);
    res.json({ result, operation: 'is_palindrome', text });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/utils/is-prime', (req, res) => {
  try {
    const { number } = req.body;
    const result = utils.isPrime(number);
    res.json({ result, operation: 'is_prime', number });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/utils/fibonacci', (req, res) => {
  try {
    const { n } = req.body;
    const result = utils.fibonacci(n);
    res.json({ result, operation: 'fibonacci', position: n });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Legacy sum endpoint for backward compatibility
app.post('/api/sum', (req, res) => {
  try {
    const { a, b } = req.body;
    if (typeof a !== 'number' || typeof b !== 'number') {
      return res.status(400).json({ error: 'Both a and b must be numbers' });
    }
    const result = sum(a, b);
    res.json({ result, operation: 'legacy_sum', operands: [a, b] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
}

module.exports = app;
