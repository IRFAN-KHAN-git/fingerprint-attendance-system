const User = require('../models/User');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

// Get my profile (student only)
exports.getMyProfile = async (req, res) => {
  try {
    // Admin cannot access this
    if (req.user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admins do not have student profiles'
      });
    }

    // Find user
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find student by email or studentId
    let student = null;
    
    if (user.studentId) {
      student = await Student.findById(user.studentId).populate('classes', 'name code subject teacher');
    } else {
      student = await Student.findOne({ email: user.email }).populate('classes', 'name code subject teacher');
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        rollNumber: user.rollNumber
      },
      student: {
        id: student._id,
        name: student.name,
        rollNumber: student.rollNumber,
        email: student.email,
        phone: student.phone,
        isFingerprintRegistered: student.isFingerprintRegistered,
        fingerprintId: student.fingerprintId,
        classes: student.classes,
        createdAt: student.createdAt
      }
    });

  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get students grouped by fingerprint enrollment status (Admin view)
exports.getEnrollmentStatus = async (req, res) => {
  try {
    // Get all active students
    const allStudents = await Student.find({ isActive: true })
      .select('name rollNumber email isFingerprintRegistered fingerprintId')
      .sort({ rollNumber: 1 });

    // Separate into enrolled and not enrolled
    const enrolled = allStudents.filter(s => s.isFingerprintRegistered);
    const notEnrolled = allStudents.filter(s => !s.isFingerprintRegistered);

    res.json({
      success: true,
      summary: {
        total: allStudents.length,
        enrolled: enrolled.length,
        notEnrolled: notEnrolled.length,
        percentage: allStudents.length > 0 
          ? ((enrolled.length / allStudents.length) * 100).toFixed(1) 
          : 0
      },
      students: {
        enrolled,
        notEnrolled
      }
    });

  } catch (error) {
    console.error('Get enrollment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get all students
exports.getAll = async (req, res) => {
  try {
    const students = await Student.find({ isActive: true })
      .populate('classes', 'name code')
      .sort({ rollNumber: 1 });

    res.json({
      success: true,
      count: students.length,
      students
    });

  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get student by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id)
      .populate('classes', 'name code subject teacher');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      student
    });

  } catch (error) {
    console.error('Get student by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get student by roll number
exports.getByRollNumber = async (req, res) => {
  try {
    const { rollNumber } = req.params;

    const student = await Student.findOne({ rollNumber })
      .populate('classes', 'name code');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      student
    });

  } catch (error) {
    console.error('Get student by roll number error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get student attendance history
exports.getAttendanceHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, classId } = req.query;

    const query = { student: id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (classId) {
      query.class = classId;
    }

    const attendance = await Attendance.find(query)
      .populate('class', 'name code')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: attendance.length,
      attendance
    });

  } catch (error) {
    console.error('Get attendance history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create student
exports.create = async (req, res) => {
  try {
    const { name, rollNumber, email, phone } = req.body;

    if (!name || !rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Name and roll number are required'
      });
    }

    const student = await Student.create({
      name,
      rollNumber,
      email,
      phone
    });

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      student
    });

  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update student
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rollNumber, email, phone } = req.body;

    const student = await Student.findByIdAndUpdate(
      id,
      { name, rollNumber, email, phone },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      message: 'Student updated successfully',
      student
    });

  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete student (soft delete)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });

  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Enroll student in class
exports.enrollInClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { classId } = req.body;

    const student = await Student.findById(id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (!student.classes.includes(classId)) {
      student.classes.push(classId);
      await student.save();
    }

    res.json({
      success: true,
      message: 'Student enrolled in class successfully'
    });

  } catch (error) {
    console.error('Enroll in class error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};