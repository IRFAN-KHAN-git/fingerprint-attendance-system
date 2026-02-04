/*
 * ============================================
 * MOCK BACKEND API SERVER
 * For Frontend Development (No Database Needed!)
 * ============================================
 * 
 * This is a complete mock backend that simulates your real API.
 * Perfect for frontend developers to work without backend setup.
 * 
 * Setup:
 * 1. npm install -g json-server
 * 2. Save this as mock-server.js
 * 3. node mock-server.js
 * 4. Backend runs on http://localhost:5000
 * 
 * Features:
 * - Authentication with JWT
 * - All CRUD operations
 * - Realistic delays
 * - Error handling
 * - Data persistence in memory
 */

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // We'll create this
const middlewares = jsonServer.defaults();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const PORT = 5000;
const JWT_SECRET = 'your-secret-key-12345';

// Initial database state
const initialDb = {
  users: [
    {
      id: 1,
      email: 'admin@college.edu',
      password: '$2a$10$XQjZ5V0YX4h.dGKz7IJ3Ou6YqXQvYqY0gXxYqXQvYqY0gXxYqXQvY', // password: admin123
      role: 'admin',
      name: 'Admin User'
    },
    {
      id: 2,
      email: 'student@college.edu',
      password: '$2a$10$XQjZ5V0YX4h.dGKz7IJ3Ou6YqXQvYqY0gXxYqXQvYqY0gXxYqXQvY', // password: student123
      role: 'student',
      name: 'Student User'
    }
  ],
  students: [
    { id: 1, rollNumber: '2021CS001', name: 'Rahul Sharma', email: 'rahul@college.edu', phone: '9876543210', fingerprintId: 1, isFingerprintRegistered: true, createdAt: '2024-01-15T10:30:00Z' },
    { id: 2, rollNumber: '2021CS002', name: 'Priya Patel', email: 'priya@college.edu', phone: '9876543211', fingerprintId: 2, isFingerprintRegistered: true, createdAt: '2024-01-15T10:31:00Z' },
    { id: 3, rollNumber: '2021CS003', name: 'Amit Kumar', email: 'amit@college.edu', phone: '9876543212', fingerprintId: null, isFingerprintRegistered: false, createdAt: '2024-01-15T10:32:00Z' },
    { id: 4, rollNumber: '2021CS004', name: 'Sneha Singh', email: 'sneha@college.edu', phone: '9876543213', fingerprintId: null, isFingerprintRegistered: false, createdAt: '2024-01-15T10:33:00Z' },
    { id: 5, rollNumber: '2021CS005', name: 'Arjun Verma', email: 'arjun@college.edu', phone: '9876543214', fingerprintId: 3, isFingerprintRegistered: true, createdAt: '2024-01-15T10:34:00Z' },
    { id: 6, rollNumber: '2021CS006', name: 'Ananya Reddy', email: 'ananya@college.edu', phone: '9876543215', fingerprintId: null, isFingerprintRegistered: false, createdAt: '2024-01-15T10:35:00Z' },
    { id: 7, rollNumber: '2021CS007', name: 'Rohan Gupta', email: 'rohan@college.edu', phone: '9876543216', fingerprintId: 4, isFingerprintRegistered: true, createdAt: '2024-01-15T10:36:00Z' },
  ],
  classes: [
    { id: 1, className: 'Computer Science 101', classCode: 'CS101', schedule: 'Mon-Fri 10:00-11:00', room: 'Lab A-302', semester: 'Fall 2026', academicYear: '2026-2027', isActive: true, enrolled: 45, createdAt: '2024-01-10T09:00:00Z' },
    { id: 2, className: 'Data Structures', classCode: 'CS201', schedule: 'Tue-Thu 14:00-15:30', room: 'Room B-105', semester: 'Fall 2026', academicYear: '2026-2027', isActive: true, enrolled: 38, createdAt: '2024-01-10T09:15:00Z' },
    { id: 3, className: 'Web Development', classCode: 'CS301', schedule: 'Mon-Wed-Fri 09:00-10:30', room: 'Lab A-401', semester: 'Fall 2026', academicYear: '2026-2027', isActive: true, enrolled: 52, createdAt: '2024-01-10T09:30:00Z' },
    { id: 4, className: 'Database Management', classCode: 'CS202', schedule: 'Mon-Wed 13:00-14:30', room: 'Lab B-201', semester: 'Fall 2026', academicYear: '2026-2027', isActive: true, enrolled: 42, createdAt: '2024-01-10T09:45:00Z' },
  ],
  attendance: [
    { id: 1, studentId: 1, studentName: 'Rahul Sharma', rollNumber: '2021CS001', classId: 1, className: 'CS101', attendanceDate: '2026-01-27', timeIn: '10:05:00', status: 'present', markedBy: 'fingerprint_sensor' },
    { id: 2, studentId: 2, studentName: 'Priya Patel', rollNumber: '2021CS002', classId: 1, className: 'CS101', attendanceDate: '2026-01-27', timeIn: '10:03:00', status: 'present', markedBy: 'fingerprint_sensor' },
    { id: 3, studentId: 5, studentName: 'Arjun Verma', rollNumber: '2021CS005', classId: 1, className: 'CS101', attendanceDate: '2026-01-27', timeIn: '10:15:00', status: 'late', markedBy: 'fingerprint_sensor' },
    { id: 4, studentId: 3, studentName: 'Amit Kumar', rollNumber: '2021CS003', classId: 2, className: 'CS201', attendanceDate: '2026-01-26', timeIn: '14:10:00', status: 'late', markedBy: 'fingerprint_sensor' },
    { id: 5, studentId: 4, studentName: 'Sneha Singh', rollNumber: '2021CS004', classId: 1, className: 'CS101', attendanceDate: '2026-01-26', timeIn: '-', status: 'absent', markedBy: 'manual' },
    { id: 6, studentId: 1, studentName: 'Rahul Sharma', rollNumber: '2021CS001', classId: 1, className: 'CS101', attendanceDate: '2026-01-26', timeIn: '10:02:00', status: 'present', markedBy: 'fingerprint_sensor' },
    { id: 7, studentId: 2, studentName: 'Priya Patel', rollNumber: '2021CS002', classId: 2, className: 'CS201', attendanceDate: '2026-01-27', timeIn: '14:05:00', status: 'present', markedBy: 'fingerprint_sensor' },
    { id: 8, studentId: 7, studentName: 'Rohan Gupta', rollNumber: '2021CS007', classId: 3, className: 'CS301', attendanceDate: '2026-01-27', timeIn: '09:08:00', status: 'present', markedBy: 'fingerprint_sensor' },
  ],
  enrollments: [
    { id: 1, classId: 1, studentId: 1, status: 'active' },
    { id: 2, classId: 1, studentId: 2, status: 'active' },
    { id: 3, classId: 1, studentId: 3, status: 'active' },
    { id: 4, classId: 1, studentId: 4, status: 'active' },
    { id: 5, classId: 1, studentId: 5, status: 'active' },
    { id: 6, classId: 2, studentId: 1, status: 'active' },
    { id: 7, classId: 2, studentId: 2, status: 'active' },
    { id: 8, classId: 2, studentId: 3, status: 'active' },
    { id: 9, classId: 3, studentId: 2, status: 'active' },
    { id: 10, classId: 3, studentId: 4, status: 'active' },
    { id: 11, classId: 3, studentId: 5, status: 'active' },
  ]
};

// Write initial DB to file
const fs = require('fs');
fs.writeFileSync('db.json', JSON.stringify(initialDb, null, 2));

// Add delay to simulate network
server.use((req, res, next) => {
  setTimeout(next, 300); // 300ms delay
});

// CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

server.use(jsonServer.bodyParser);
server.use(middlewares);

// ============================================
// CUSTOM ROUTES (Before json-server routes)
// ============================================

// AUTH - Login
server.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  
  const db = router.db;
  const users = db.get('users').value();
  
  const user = users.find(u => u.email === email && u.role === role);
  
  if (!user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
  }
  
  // In real app, verify password with bcrypt
  // For mock, accept any password
  
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    }
  });
});

// AUTH - Register
server.post('/api/auth/register', (req, res) => {
  const { email, password, role, name, rollNumber } = req.body;
  
  const db = router.db;
  const users = db.get('users').value();
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({
      success: false,
      message: 'Email already registered'
    });
  }
  
  const newUser = {
    id: users.length + 1,
    email,
    password: bcrypt.hashSync(password, 10),
    role,
    name
  };
  
  db.get('users').push(newUser).write();
  
  if (role === 'student') {
    const students = db.get('students').value();
    const newStudent = {
      id: students.length + 1,
      rollNumber,
      name,
      email,
      fingerprintId: null,
      isFingerprintRegistered: false,
      createdAt: new Date().toISOString()
    };
    db.get('students').push(newStudent).write();
  }
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully'
  });
});

// AUTH - Get current user
server.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = router.db;
    const user = db.get('users').find({ id: decoded.id }).value();
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid token' });
  }
});

// STUDENTS - Get all
server.get('/api/students', (req, res) => {
  const db = router.db;
  const students = db.get('students').value();
  
  res.json({
    success: true,
    students: students.map(s => ({
      ...s,
      fingerprintRegistered: s.isFingerprintRegistered // Support both naming conventions
    }))
  });
});

// STUDENTS - Get by ID
server.get('/api/students/:id', (req, res) => {
  const db = router.db;
  const student = db.get('students').find({ id: parseInt(req.params.id) }).value();
  
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  
  res.json({
    success: true,
    student: {
      ...student,
      fingerprintRegistered: student.isFingerprintRegistered
    }
  });
});

// STUDENTS - Create
server.post('/api/students', (req, res) => {
  const { name, rollNumber, email, phone } = req.body;
  
  const db = router.db;
  const students = db.get('students').value();
  
  if (students.find(s => s.rollNumber === rollNumber)) {
    return res.status(400).json({
      success: false,
      message: 'Roll number already exists'
    });
  }
  
  const newStudent = {
    id: students.length + 1,
    rollNumber,
    name,
    email,
    phone: phone || '',
    fingerprintId: null,
    isFingerprintRegistered: false,
    createdAt: new Date().toISOString()
  };
  
  db.get('students').push(newStudent).write();
  
  res.status(201).json({
    success: true,
    message: 'Student added successfully',
    studentId: newStudent.id
  });
});

// STUDENTS - Update
server.put('/api/students/:id', (req, res) => {
  const { name, rollNumber, email, phone } = req.body;
  
  const db = router.db;
  const student = db.get('students').find({ id: parseInt(req.params.id) });
  
  if (!student.value()) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  
  student.assign({ name, rollNumber, email, phone }).write();
  
  res.json({
    success: true,
    message: 'Student updated successfully'
  });
});

// STUDENTS - Delete
server.delete('/api/students/:id', (req, res) => {
  const db = router.db;
  db.get('students').remove({ id: parseInt(req.params.id) }).write();
  
  res.json({
    success: true,
    message: 'Student deleted successfully'
  });
});

// CLASSES - Get all
server.get('/api/classes', (req, res) => {
  const db = router.db;
  const classes = db.get('classes').value();
  
  res.json({
    success: true,
    classes
  });
});

// CLASSES - Create
server.post('/api/classes', (req, res) => {
  const { className, classCode, schedule, room, semester, academicYear } = req.body;
  
  const db = router.db;
  const classes = db.get('classes').value();
  
  if (classes.find(c => c.classCode === classCode)) {
    return res.status(400).json({
      success: false,
      message: 'Class code already exists'
    });
  }
  
  const newClass = {
    id: classes.length + 1,
    className,
    classCode,
    schedule,
    room,
    semester,
    academicYear,
    isActive: true,
    enrolled: 0,
    createdAt: new Date().toISOString()
  };
  
  db.get('classes').push(newClass).write();
  
  res.status(201).json({
    success: true,
    message: 'Class created successfully',
    classId: newClass.id
  });
});

// ATTENDANCE - Get all
server.get('/api/attendance', (req, res) => {
  const db = router.db;
  const attendance = db.get('attendance').value();
  
  res.json({
    success: true,
    attendance
  });
});

// ATTENDANCE - Mark
server.post('/api/attendance/mark', (req, res) => {
  const { studentId, classId, templateId } = req.body;
  
  const db = router.db;
  
  let student;
  if (templateId) {
    student = db.get('students').find({ fingerprintId: templateId }).value();
  } else {
    student = db.get('students').find({ id: studentId }).value();
  }
  
  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }
  
  const classData = db.get('classes').find({ id: classId }).value();
  const attendance = db.get('attendance').value();
  
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const timeIn = now.toTimeString().split(' ')[0];
  
  // Check if already marked
  const existing = attendance.find(a => 
    a.studentId === student.id && 
    a.classId === classId && 
    a.attendanceDate === today
  );
  
  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'Attendance already marked for today'
    });
  }
  
  const newAttendance = {
    id: attendance.length + 1,
    studentId: student.id,
    studentName: student.name,
    rollNumber: student.rollNumber,
    classId: classId,
    className: classData?.classCode || 'Unknown',
    attendanceDate: today,
    timeIn,
    status: 'present',
    markedBy: 'fingerprint_sensor'
  };
  
  db.get('attendance').push(newAttendance).write();
  
  res.json({
    success: true,
    message: 'Attendance marked successfully',
    student: {
      id: student.id,
      name: student.name,
      roll_number: student.rollNumber
    }
  });
});

// FINGERPRINT - Start Registration
server.post('/api/fingerprint/start-registration', (req, res) => {
  const { studentId } = req.body;
  
  const db = router.db;
  const student = db.get('students').find({ id: studentId });
  
  if (!student.value()) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }
  
  // Simulate fingerprint registration
  setTimeout(() => {
    const students = db.get('students').value();
    const maxFingerprintId = Math.max(...students.filter(s => s.fingerprintId).map(s => s.fingerprintId), 0);
    const newTemplateId = maxFingerprintId + 1;
    
    student.assign({
      fingerprintId: newTemplateId,
      isFingerprintRegistered: true
    }).write();
  }, 100);
  
  res.json({
    success: true,
    message: 'Fingerprint registration started',
    templateId: db.get('students').value().filter(s => s.fingerprintId).length + 1
  });
});

// FINGERPRINT - Check Status
server.get('/api/fingerprint/status', (req, res) => {
  res.json({
    success: true,
    connected: true,
    message: 'Arduino connected'
  });
});

// STATISTICS - Dashboard stats
server.get('/api/stats/dashboard', (req, res) => {
  const db = router.db;
  const students = db.get('students').value();
  const classes = db.get('classes').value();
  const attendance = db.get('attendance').value();
  
  const today = new Date().toISOString().split('T')[0];
  
  res.json({
    success: true,
    stats: {
      totalStudents: students.length,
      totalClasses: classes.length,
      registeredFingerprints: students.filter(s => s.isFingerprintRegistered).length,
      todayAttendance: attendance.filter(a => a.attendanceDate === today).length,
      totalAttendance: attendance.length
    }
  });
});

// Use default router for other routes
server.use('/api', router);

// Start server
server.listen(PORT, () => {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║       MOCK BACKEND API SERVER RUNNING            ║');
  console.log('╚═══════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Server:      http://localhost:${PORT}`);
  console.log(`📡 API Base:    http://localhost:${PORT}/api`);
  console.log('');
  console.log('📝 Test Credentials:');
  console.log('   Admin:   admin@college.edu / admin123');
  console.log('   Student: student@college.edu / student123');
  console.log('');
  console.log('🔗 Available Endpoints:');
  console.log('   POST   /api/auth/login');
  console.log('   POST   /api/auth/register');
  console.log('   GET    /api/auth/me');
  console.log('   GET    /api/students');
  console.log('   POST   /api/students');
  console.log('   GET    /api/classes');
  console.log('   POST   /api/classes');
  console.log('   GET    /api/attendance');
  console.log('   POST   /api/attendance/mark');
  console.log('   POST   /api/fingerprint/start-registration');
  console.log('   GET    /api/fingerprint/status');
  console.log('   GET    /api/stats/dashboard');
  console.log('');
  console.log('💡 Mock API accepts ANY password for testing!');
  console.log('═══════════════════════════════════════════════════');
});
