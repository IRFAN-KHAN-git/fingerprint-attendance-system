const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { authenticateToken, isTeacherOrAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all classes
router.get('/', classController.getAll);

// Get class by ID
router.get('/:id', classController.getById);

// Get class students
router.get('/:id/students', classController.getStudents);

// Create class (admin/teacher only)
router.post('/', isTeacherOrAdmin, classController.create);

// Update class (admin/teacher only)
router.put('/:id', isTeacherOrAdmin, classController.update);

// Delete class (admin/teacher only)
router.delete('/:id', isTeacherOrAdmin, classController.delete);

// Add student to class (admin/teacher only)
router.post('/:id/students', isTeacherOrAdmin, classController.addStudent);

// Remove student from class (admin/teacher only)
router.delete('/:id/students/:studentId', isTeacherOrAdmin, classController.removeStudent);

module.exports = router;
