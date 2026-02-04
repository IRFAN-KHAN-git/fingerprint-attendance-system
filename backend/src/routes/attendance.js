const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authenticateToken, isTeacherOrAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Mark attendance
router.post('/mark', attendanceController.markAttendance);

// Auto-mark attendance by fingerprint (used by Arduino/scanner)
router.post('/mark-by-fingerprint', attendanceController.markAttendanceByFingerprint);

// Get attendance records
router.get('/', attendanceController.getAttendance);

// Get attendance by date
router.get('/date', attendanceController.getByDate);

// Get attendance statistics
router.get('/stats', attendanceController.getStats);

// Update attendance (admin/teacher only)
router.put('/:id', isTeacherOrAdmin, attendanceController.updateAttendance);

// Delete attendance (admin/teacher only)
router.delete('/:id', isTeacherOrAdmin, attendanceController.deleteAttendance);

module.exports = router;
