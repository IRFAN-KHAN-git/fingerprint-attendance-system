const Class = require('../models/Class');
const Student = require('../models/Student');

const classController = {
  // Get all classes
  getAll: async (req, res, next) => {
    try {
      const classes = await Class.find({ isActive: true })
        .populate('students', 'name rollNumber email')
        .sort({ code: 1 });

      res.json({
        success: true,
        count: classes.length,
        classes
      });

    } catch (error) {
      next(error);
    }
  },

  // Get class by ID
  getById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const classData = await Class.findById(id)
        .populate('students', 'name rollNumber email isFingerprintRegistered');

      if (!classData) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }

      res.json({
        success: true,
        class: classData
      });

    } catch (error) {
      next(error);
    }
  },

  // Create class
  create: async (req, res, next) => {
    try {
      const { name, code, subject, teacher, schedule } = req.body;

      if (!name || !code) {
        return res.status(400).json({
          success: false,
          message: 'Name and code are required'
        });
      }

      const classData = await Class.create({
        name,
        code: code.toUpperCase(),
        subject,
        teacher,
        schedule
      });

      res.status(201).json({
        success: true,
        message: 'Class created successfully',
        class: classData
      });

    } catch (error) {
      next(error);
    }
  },

  // Update class
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, code, subject, teacher, schedule } = req.body;

      const classData = await Class.findByIdAndUpdate(
        id,
        { 
          name, 
          code: code ? code.toUpperCase() : undefined, 
          subject, 
          teacher, 
          schedule 
        },
        { new: true, runValidators: true }
      );

      if (!classData) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }

      res.json({
        success: true,
        message: 'Class updated successfully',
        class: classData
      });

    } catch (error) {
      next(error);
    }
  },

  // Delete class (soft delete)
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;

      const classData = await Class.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!classData) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }

      res.json({
        success: true,
        message: 'Class deleted successfully'
      });

    } catch (error) {
      next(error);
    }
  },

  // Add student to class
  addStudent: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { studentId } = req.body;

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: 'Student ID is required'
        });
      }

      const classData = await Class.findById(id);
      const student = await Student.findById(studentId);

      if (!classData) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Add to class if not already added
      if (!classData.students.includes(studentId)) {
        classData.students.push(studentId);
        await classData.save();
      }

      // Add to student if not already added
      if (!student.classes.includes(id)) {
        student.classes.push(id);
        await student.save();
      }

      res.json({
        success: true,
        message: 'Student added to class successfully'
      });

    } catch (error) {
      next(error);
    }
  },

  // Remove student from class
  removeStudent: async (req, res, next) => {
    try {
      const { id, studentId } = req.params;

      const classData = await Class.findById(id);
      const student = await Student.findById(studentId);

      if (!classData) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }

      // Remove from class
      classData.students = classData.students.filter(
        s => s.toString() !== studentId
      );
      await classData.save();

      // Remove from student
      if (student) {
        student.classes = student.classes.filter(
          c => c.toString() !== id
        );
        await student.save();
      }

      res.json({
        success: true,
        message: 'Student removed from class successfully'
      });

    } catch (error) {
      next(error);
    }
  },

  // Get class students
  getStudents: async (req, res, next) => {
    try {
      const { id } = req.params;

      const classData = await Class.findById(id)
        .populate('students', 'name rollNumber email isFingerprintRegistered');

      if (!classData) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }

      res.json({
        success: true,
        count: classData.students.length,
        students: classData.students
      });

    } catch (error) {
      next(error);
    }
  }
};

module.exports = classController;
