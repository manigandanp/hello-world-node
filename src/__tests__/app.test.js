const request = require('supertest');
const { app } = require('../index');

describe('Hello World App', () => {
  describe('GET /', () => {
    it('should return hello world message', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Hello, World!');
      expect(res.body).toHaveProperty('environment');
      expect(res.body).toHaveProperty('version');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body).toHaveProperty('uptime');
    });
  });

  describe('GET /greet/:name', () => {
    it('should greet the user by name', async () => {
      const res = await request(app).get('/greet/Manny');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Hello, Manny!');
    });
  });

  describe('404 handling', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/unknown');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Not found');
    });
  });
});