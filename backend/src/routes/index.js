const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const studentRoutes = require('./students');
const classRoutes = require('./classes');
const attendanceRoutes = require('./attendance');
const fingerprintRoutes = require('./fingerprint');

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/classes', classRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/fingerprint', fingerprintRoutes);

module.exports = router;
