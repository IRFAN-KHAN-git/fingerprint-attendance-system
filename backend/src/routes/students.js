const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken, isTeacherOrAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Student can view their own profile
router.get('/me', studentController.getMyProfile);

// Get enrollment status overview (admin/teacher only)
router.get('/enrollment-status', isTeacherOrAdmin, studentController.getEnrollmentStatus);

// Get all students
router.get('/', studentController.getAll);

// Get student by ID
router.get('/:id', studentController.getById);

// Get student by roll number
router.get('/roll/:rollNumber', studentController.getByRollNumber);

// Get student attendance history
router.get('/:id/attendance', studentController.getAttendanceHistory);

// Create student (admin/teacher only)
router.post('/', isTeacherOrAdmin, studentController.create);

// Update student (admin/teacher only)
router.put('/:id', isTeacherOrAdmin, studentController.update);

// Delete student (admin/teacher only)
router.delete('/:id', isTeacherOrAdmin, studentController.delete);

// Enroll student in class
router.post('/:id/enroll', isTeacherOrAdmin, studentController.enrollInClass);

module.exports = router;
