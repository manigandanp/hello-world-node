const express = require('express');
const os = require('os');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';

app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Hello world endpoint
app.get('/', (_req, res) => {
  res.json({
    message: 'Hello, World!',
    environment: ENV,
    hostname: os.hostname(),
    timestamp: new Date().toISOString(),
    version: require(path.join(__dirname, '..', 'package.json')).version,
  });
});

// Greeting endpoint
app.get('/greet/:name', (req, res) => {
  const name = req.params.name;
  res.json({ message: `Hello, ${name}!` });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Hello World Node.js app running in ${ENV} mode on port ${PORT}`);
});

module.exports = { app, server };