const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Class = require('../models/Class');

const attendanceController = {
  // Mark attendance
  markAttendance: async (req, res, next) => {
    try {
      const { studentId, classId, status, markedBy, templateId } = req.body;

      let student;

      // If templateId provided (from fingerprint scan)
      if (templateId) {
        student = await Student.findOne({ fingerprintId: templateId });
        if (!student) {
          return res.status(404).json({
            success: false,
            message: 'Student not found for this fingerprint'
          });
        }
      } else if (studentId) {
        student = await Student.findById(studentId);
        if (!student) {
          return res.status(404).json({
            success: false,
            message: 'Student not found'
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: 'Student ID or template ID is required'
        });
      }

      // Check if class exists
      const classExists = await Class.findById(classId);
      if (!classExists) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }

      // Check if attendance already marked today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const existingAttendance = await Attendance.findOne({
        student: student._id,
        class: classId,
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      if (existingAttendance) {
        return res.status(400).json({
          success: false,
          message: 'Attendance already marked for today',
          attendance: existingAttendance
        });
      }

      // Create attendance record
      const attendance = await Attendance.create({
        student: student._id,
        class: classId,
        status: status || 'present',
        markedBy: markedBy || 'fingerprint'
      });

      await attendance.populate('student', 'name rollNumber email');
      await attendance.populate('class', 'name code');

      res.status(201).json({
        success: true,
        message: 'Attendance marked successfully',
        attendance,
        student: {
          id: student._id,
          name: student.name,
          rollNumber: student.rollNumber
        }
      });

    } catch (error) {
      next(error);
    }
  },

  // Auto-mark attendance from fingerprint verification (simplified endpoint)
  markAttendanceByFingerprint: async (req, res, next) => {
    try {
      const { fingerprintId, classId } = req.body;

      if (!fingerprintId || !classId) {
        return res.status(400).json({
          success: false,
          message: 'Fingerprint ID and Class ID are required'
        });
      }

      // Find student by fingerprint ID
      const student = await Student.findOne({ fingerprintId });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'No student found with this fingerprint. Please enroll first.',
          needsEnrollment: true
        });
      }

      if (!student.isFingerprintRegistered) {
        return res.status(400).json({
          success: false,
          message: 'Fingerprint not properly registered. Please re-enroll.',
          needsEnrollment: true
        });
      }

      // Check if class exists
      const classData = await Class.findById(classId);
      if (!classData) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }

      // Check if student is enrolled in this class
      if (!student.classes.includes(classId)) {
        return res.status(400).json({
          success: false,
          message: `${student.name} is not enrolled in ${classData.name}`,
          student: {
            id: student._id,
            name: student.name,
            rollNumber: student.rollNumber
          }
        });
      }

      // Check if already marked today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const existingAttendance = await Attendance.findOne({
        student: student._id,
        class: classId,
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      if (existingAttendance) {
        return res.status(200).json({
          success: true,
          alreadyMarked: true,
          message: `Attendance already marked for ${student.name}`,
          student: {
            id: student._id,
            name: student.name,
            rollNumber: student.rollNumber,
            photo: student.profileImage
          },
          attendance: existingAttendance
        });
      }

      // Mark attendance
      const attendance = await Attendance.create({
        student: student._id,
        class: classId,
        status: 'present',
        markedBy: 'fingerprint',
        date: new Date()
      });

      await attendance.populate('class', 'name code');

      res.status(201).json({
        success: true,
        alreadyMarked: false,
        message: `Attendance marked for ${student.name}`,
        student: {
          id: student._id,
          name: student.name,
          rollNumber: student.rollNumber,
          email: student.email,
          photo: student.profileImage
        },
        attendance: {
          id: attendance._id,
          class: attendance.class,
          date: attendance.date,
          status: attendance.status
        }
      });

    } catch (error) {
      next(error);
    }
  },

  // Get attendance records
  getAttendance: async (req, res, next) => {
    try {
      const { classId, studentId, startDate, endDate, status } = req.query;

      const query = {};

      if (classId) query.class = classId;
      if (studentId) query.student = studentId;
      if (status) query.status = status;

      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      } else if (startDate) {
        query.date = { $gte: new Date(startDate) };
      } else if (endDate) {
        query.date = { $lte: new Date(endDate) };
      }

      const attendance = await Attendance.find(query)
        .populate('student', 'name rollNumber email')
        .populate('class', 'name code subject')
        .sort({ date: -1, markedAt: -1 });

      res.json({
        success: true,
        count: attendance.length,
        attendance
      });

    } catch (error) {
      next(error);
    }
  },

  // Get attendance by date
  getByDate: async (req, res, next) => {
    try {
      const { date, classId } = req.query;

      if (!date) {
        return res.status(400).json({
          success: false,
          message: 'Date is required'
        });
      }

      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);

      const query = {
        date: {
          $gte: targetDate,
          $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
        }
      };

      if (classId) query.class = classId;

      const attendance = await Attendance.find(query)
        .populate('student', 'name rollNumber email')
        .populate('class', 'name code')
        .sort({ markedAt: -1 });

      res.json({
        success: true,
        date: targetDate,
        count: attendance.length,
        attendance
      });

    } catch (error) {
      next(error);
    }
  },

  // Get attendance statistics
  getStats: async (req, res, next) => {
    try {
      const { classId, studentId, startDate, endDate } = req.query;

      const matchQuery = {};
      if (classId) matchQuery.class = classId;
      if (studentId) matchQuery.student = studentId;

      if (startDate && endDate) {
        matchQuery.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const stats = await Attendance.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const totalAttendance = stats.reduce((sum, stat) => sum + stat.count, 0);
      const presentCount = stats.find(s => s._id === 'present')?.count || 0;
      const absentCount = stats.find(s => s._id === 'absent')?.count || 0;
      const lateCount = stats.find(s => s._id === 'late')?.count || 0;

      const percentage = totalAttendance > 0 
        ? ((presentCount + lateCount) / totalAttendance * 100).toFixed(2)
        : 0;

      res.json({
        success: true,
        stats: {
          total: totalAttendance,
          present: presentCount,
          absent: absentCount,
          late: lateCount,
          percentage: parseFloat(percentage)
        }
      });

    } catch (error) {
      next(error);
    }
  },

  // Update attendance
  updateAttendance: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const attendance = await Attendance.findByIdAndUpdate(
        id,
        { status, notes },
        { new: true, runValidators: true }
      );

      if (!attendance) {
        return res.status(404).json({
          success: false,
          message: 'Attendance record not found'
        });
      }

      res.json({
        success: true,
        message: 'Attendance updated successfully',
        attendance
      });

    } catch (error) {
      next(error);
    }
  },

  // Delete attendance record
  deleteAttendance: async (req, res, next) => {
    try {
      const { id } = req.params;

      const attendance = await Attendance.findByIdAndDelete(id);

      if (!attendance) {
        return res.status(404).json({
          success: false,
          message: 'Attendance record not found'
        });
      }

      res.json({
        success: true,
        message: 'Attendance record deleted successfully'
      });

    } catch (error) {
      next(error);
    }
  }
};

module.exports = attendanceController;
