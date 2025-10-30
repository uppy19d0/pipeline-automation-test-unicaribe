const request = require('supertest');
const app = require('../src/server');

describe('Server API', () => {
  describe('Health and Info endpoints', () => {
    test('GET /health should return health status', async() => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });

    test('GET / should return API info', async() => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('endpoints');
    });

    test('GET /nonexistent should return 404', async() => {
      const response = await request(app).get('/nonexistent');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });

  describe('Calculator endpoints', () => {
    test('POST /api/calculator/add should add two numbers', async() => {
      const response = await request(app)
        .post('/api/calculator/add')
        .send({ a: 5, b: 3 });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(8);
      expect(response.body.operation).toBe('addition');
    });

    test('POST /api/calculator/add should handle invalid input', async() => {
      const response = await request(app)
        .post('/api/calculator/add')
        .send({ a: 'invalid', b: 3 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('POST /api/calculator/divide should handle division by zero', async() => {
      const response = await request(app)
        .post('/api/calculator/divide')
        .send({ a: 5, b: 0 });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Division by zero');
    });

    test('POST /api/calculator/factorial should calculate factorial', async() => {
      const response = await request(app)
        .post('/api/calculator/factorial')
        .send({ n: 5 });
      
      expect(response.status).toBe(200);
      expect(response.body.result).toBe(120);
    });
  });

  describe('Utils endpoints', () => {
    test('POST /api/utils/array-sum should sum array', async () => {
      const response = await request(app)
        .post('/api/utils/array-sum')
        .send({ array: [1, 2, 3, 4] });
      
      expect(response.status).toBe(200);
      expect(response.body.result).toBe(10);
    });

    test('POST /api/utils/capitalize should capitalize string', async () => {
      const response = await request(app)
        .post('/api/utils/capitalize')
        .send({ text: 'hello world' });
      
      expect(response.status).toBe(200);
      expect(response.body.result).toBe('Hello world');
    });

    test('POST /api/utils/is-palindrome should check palindrome', async () => {
      const response = await request(app)
        .post('/api/utils/is-palindrome')
        .send({ text: 'racecar' });
      
      expect(response.status).toBe(200);
      expect(response.body.result).toBe(true);
    });

    test('POST /api/utils/is-prime should check prime number', async () => {
      const response = await request(app)
        .post('/api/utils/is-prime')
        .send({ number: 17 });
      
      expect(response.status).toBe(200);
      expect(response.body.result).toBe(true);
    });
  });

  describe('Legacy endpoint', () => {
    test('POST /api/sum should work for backward compatibility', async () => {
      const response = await request(app)
        .post('/api/sum')
        .send({ a: 2, b: 3 });
      
      expect(response.status).toBe(200);
      expect(response.body.result).toBe(5);
      expect(response.body.operation).toBe('legacy_sum');
    });
  });
});
