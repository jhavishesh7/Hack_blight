const express = require('express');
const cors = require('cors');
const { handleUserDataLog } = require('./userDataHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'User Data Logger API is running' });
});

// User data logging endpoint
app.post('/api/user-data-log', handleUserDataLog);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 User Data Logger API running on port ${PORT}`);
  console.log(`📊 Endpoint: http://localhost:${PORT}/api/user-data-log`);
});

module.exports = app; 