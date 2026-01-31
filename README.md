# 🔐 Fingerprint Attendance Management System

A modern, full-stack fingerprint-based attendance system with React frontend, Node.js backend, and Arduino integration.

## ✨ Features

### Admin Features
- ✅ Dashboard with statistics and analytics
- ✅ Create and manage classes
- ✅ Student management (add, edit, enroll)
- ✅ **Fingerprint registration station** (key feature!)
- ✅ Attendance reports with filters and export
- ✅ Real-time Arduino connection status

### Student Features
- ✅ View personal attendance records
- ✅ Check enrolled classes
- ✅ Attendance percentage tracking
- ✅ Fingerprint registration status

### System Features
- ✅ Role-based authentication (Admin/Student)
- ✅ Real-time fingerprint scanning
- ✅ Arduino integration for fingerprint sensor
- ✅ SQL Server database
- ✅ RESTful API architecture
- ✅ Modern, responsive UI with dark theme

---

## 🏗️ Tech Stack

### Frontend
- **React** (with Hooks)
- **Tailwind CSS** (for styling)
- **Lucide React** (for icons)
- **Modern gradient design**

### Backend
- **Node.js** + **Express.js**
- **SQL Server** (or PostgreSQL)
- **JWT** for authentication
- **SerialPort** for Arduino communication

### Hardware
- **Arduino Uno/Nano**
- **Fingerprint Sensor (R305/AS608)**
- **USB Cable**

---

## 📦 Installation

### Prerequisites
```bash
# Required software
- Node.js (v16+)
- npm or yarn
- SQL Server or PostgreSQL
- Arduino IDE
- Fingerprint sensor + Arduino board
```

### 1. Clone & Install Dependencies

```bash
# Frontend setup
npm install

# Install required packages
npm install react react-dom lucide-react
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p
```

### 2. Backend Setup

Create a new directory for backend:

```bash
mkdir backend
cd backend
npm init -y

# Install backend dependencies
npm install express cors dotenv bcryptjs jsonwebtoken
npm install tedious # SQL Server driver
npm install serialport # For Arduino communication
npm install nodemon --save-dev
```

### 3. Database Setup

Run the SQL scripts (see `database-schema.sql` in this project):

```sql
-- Create database
CREATE DATABASE AttendanceDB;

-- Run the schema file to create tables
-- See database-schema.sql for complete schema
```

### 4. Arduino Setup

1. Open Arduino IDE
2. Install Fingerprint Sensor Library:
   - Go to **Sketch > Include Library > Manage Libraries**
   - Search for "Adafruit Fingerprint Sensor"
   - Install the library

3. Upload the Arduino sketch (see `arduino-fingerprint.ino`)

4. Connect hardware:
   ```
   Fingerprint Sensor → Arduino
   VCC (Red)    → 5V
   GND (Black)  → GND
   TX (White)   → Pin 2 (Software Serial RX)
   RX (Green)   → Pin 3 (Software Serial TX)
   ```

---

## 🚀 Running the Application

### Terminal 1 - Backend Server
```bash
cd backend
npm run dev

# Server starts on http://localhost:5000
```

### Terminal 2 - Frontend
```bash
npm start

# App opens on http://localhost:3000
```

### Terminal 3 - Arduino Monitor (Optional)
```bash
# Open Arduino IDE Serial Monitor
# Set baud rate to 9600
# Monitor fingerprint sensor activity
```

---

## 📁 Project Structure

```
fingerprint-attendance-system/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ClassesPage.jsx
│   │   │   ├── StudentsPage.jsx
│   │   │   ├── FingerprintRegistrationPage.jsx  ⭐ KEY COMPONENT
│   │   │   └── ReportsPage.jsx
│   │   ├── App.jsx
│   │   └── index.js
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── classController.js
│   │   ├── studentController.js
│   │   ├── fingerprintController.js
│   │   └── attendanceController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── classes.js
│   │   ├── students.js
│   │   ├── fingerprint.js
│   │   └── attendance.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   └── arduinoSerial.js
│   ├── server.js
│   └── package.json
│
├── arduino/
│   └── fingerprint-sensor.ino
│
├── database/
│   └── schema.sql
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login          - Login (admin/student)
POST   /api/auth/register       - Register new user
GET    /api/auth/me             - Get current user
```

### Classes
```
GET    /api/classes             - Get all classes
POST   /api/classes             - Create new class
GET    /api/classes/:id         - Get class details
PUT    /api/classes/:id         - Update class
DELETE /api/classes/:id         - Delete class
```

### Students
```
GET    /api/students            - Get all students
POST   /api/students            - Add new student
GET    /api/students/:id        - Get student details
PUT    /api/students/:id        - Update student
DELETE /api/students/:id        - Delete student
POST   /api/students/bulk       - Bulk upload (CSV)
```

### Fingerprint Registration ⭐
```
POST   /api/fingerprint/start-registration    - Start fingerprint enrollment
GET    /api/fingerprint/status                - Check Arduino connection
POST   /api/fingerprint/verify                - Verify fingerprint
DELETE /api/fingerprint/:studentId            - Delete fingerprint
```

### Attendance
```
GET    /api/attendance          - Get all attendance records
POST   /api/attendance/mark     - Mark attendance (from Arduino)
GET    /api/attendance/student/:id  - Get student's attendance
GET    /api/attendance/class/:id    - Get class attendance
GET    /api/attendance/export   - Export to CSV
```

---

## 🎯 How Fingerprint Registration Works

### The Complete Workflow:

#### 1. **Preparation Phase**
```
Admin → Adds student to database
      → Student status: "Not Registered"
```

#### 2. **Registration Phase**
```
Admin → Opens "Fingerprint Registration" page
      → Selects student from list
      → Clicks "Start Registration"

Frontend → Sends POST /api/fingerprint/start-registration
         → { studentId: 123 }

Backend → Tells Arduino: "Ready to enroll for student 123"
        → Arduino enters enrollment mode
```

#### 3. **Scanning Phase**
```
Student → Places finger on sensor (Scan 1/3)
        → Arduino captures template
        → Progress: 33%

Student → Places finger again (Scan 2/3)
        → Arduino validates match
        → Progress: 66%

Student → Places finger again (Scan 3/3)
        → Arduino creates final template
        → Progress: 100%
```

#### 4. **Storage Phase**
```
Arduino → Stores template in local memory (ID: 1-127)
        → Sends template ID to backend
        → { studentId: 123, templateId: 45, status: "success" }

Backend → Saves to database:
        → students.fingerprint_id = 45
        → students.is_fingerprint_registered = true

Frontend → Shows success message
         → Updates student status to "Registered"
```

#### 5. **Daily Attendance Flow**
```
Student → Walks to attendance device
        → Places finger on sensor

Arduino → Matches fingerprint
        → Finds template ID: 45
        → Sends to backend: { templateId: 45 }

Backend → Looks up student by templateId
        → Finds student ID: 123
        → Marks attendance in active class

Database → INSERT INTO attendance
         → (student_id, class_id, time_in, status)
```

---

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY IDENTITY(1,1),
  role VARCHAR(20) NOT NULL,  -- 'admin' or 'student'
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT GETDATE()
);
```

### Students Table
```sql
CREATE TABLE students (
  id INT PRIMARY KEY IDENTITY(1,1),
  user_id INT FOREIGN KEY REFERENCES users(id),
  roll_number VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  fingerprint_id INT,  -- Arduino template ID (1-127)
  is_fingerprint_registered BIT DEFAULT 0,
  created_at DATETIME DEFAULT GETDATE()
);
```

### Classes Table
```sql
CREATE TABLE classes (
  id INT PRIMARY KEY IDENTITY(1,1),
  class_name VARCHAR(255) NOT NULL,
  class_code VARCHAR(50) UNIQUE NOT NULL,
  schedule VARCHAR(255),
  room VARCHAR(100),
  created_by INT FOREIGN KEY REFERENCES users(id),
  created_at DATETIME DEFAULT GETDATE()
);
```

### Attendance Table
```sql
CREATE TABLE attendance (
  id INT PRIMARY KEY IDENTITY(1,1),
  student_id INT FOREIGN KEY REFERENCES students(id),
  class_id INT FOREIGN KEY REFERENCES classes(id),
  attendance_date DATE NOT NULL,
  time_in TIME NOT NULL,
  status VARCHAR(20),  -- 'present', 'late', 'absent'
  marked_by VARCHAR(50) DEFAULT 'fingerprint_sensor',
  created_at DATETIME DEFAULT GETDATE()
);
```

---

## 🔧 Configuration

### Backend `.env` file:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_SERVER=localhost
DB_NAME=AttendanceDB
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Arduino
ARDUINO_PORT=COM3  # Change based on your system
ARDUINO_BAUD_RATE=9600
```

### Frontend - Update API base URL:
```javascript
// In your components, replace mockAPI with:
const API_BASE_URL = 'http://localhost:5000/api';

// Example:
const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};
```

---

## 🎨 UI Features

### Design Highlights:
- 🌑 **Dark theme** with purple/pink gradients
- 🎯 **Modern, clean interface**
- ⚡ **Smooth animations and transitions**
- 📱 **Fully responsive** (mobile, tablet, desktop)
- 🎨 **Custom fonts** (Poppins for headings, Space Mono for data)
- ✨ **Glassmorphism effects**
- 🌈 **Gradient accents throughout**

### Key Pages:
1. **Login** - Role selection (Admin/Student)
2. **Dashboard** - Stats cards and overview
3. **Classes** - Create/manage classes with cards
4. **Students** - Table view with search and filters
5. **Fingerprint Registration** ⭐ - Step-by-step enrollment
6. **Reports** - Filter, view, and export attendance

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ Secure Arduino communication

---

## 📊 Future Enhancements

### Phase 2:
- [ ] Real-time notifications (WebSockets)
- [ ] Email notifications for attendance
- [ ] Face recognition backup
- [ ] Mobile app (React Native)
- [ ] Attendance analytics dashboard
- [ ] Multiple fingerprint support per student
- [ ] Attendance geofencing
- [ ] Parent portal

### Phase 3:
- [ ] Machine learning for anomaly detection
- [ ] Integration with college ERP
- [ ] QR code backup system
- [ ] Biometric attendance reports
- [ ] Multi-language support

---

## 🐛 Troubleshooting

### Arduino Not Connecting
```bash
# Check COM port
# Windows: Device Manager → Ports (COM & LPT)
# Linux: ls /dev/tty*
# Mac: ls /dev/tty.*

# Update .env file with correct port
ARDUINO_PORT=COM3  # or /dev/ttyUSB0 on Linux
```

### Fingerprint Not Registering
```bash
# Check sensor connection
# Verify sensor power (red LED should be on)
# Clean sensor surface
# Try different finger
# Check Arduino Serial Monitor for errors
```

### Database Connection Issues
```bash
# Verify SQL Server is running
# Check connection string in .env
# Test with SQL Server Management Studio
# Ensure Windows Authentication or correct credentials
```

---

## 📝 Important Notes

### Fingerprint Sensor Considerations:
- ✅ Sensor stores **127 templates maximum**
- ✅ Each student needs **1 template slot**
- ✅ Templates are **stored in sensor memory** (not database)
- ✅ Database stores **template ID mapping**
- ✅ Clean sensor regularly for best accuracy
- ✅ Dry fingers work better than wet/oily

### Best Practices:
- ✅ Always supervise fingerprint registration
- ✅ Backup sensor templates regularly
- ✅ Keep Arduino USB connected and powered
- ✅ Use surge protector for hardware
- ✅ Regular database backups
- ✅ Monitor sensor accuracy over time

---

## 📚 Resources

### Documentation:
- [Adafruit Fingerprint Sensor Guide](https://learn.adafruit.com/adafruit-optical-fingerprint-sensor)
- [Node.js SerialPort Docs](https://serialport.io/docs/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)

### Libraries Used:
- `react` - UI framework
- `lucide-react` - Icon library
- `tailwindcss` - Styling
- `express` - Backend framework
- `serialport` - Arduino communication
- `tedious` - SQL Server driver

---

## 👨‍💻 Development Tips

### For Your Interview/Demo:
1. ✅ **Highlight the fingerprint registration workflow** - This is unique!
2. ✅ Show the Arduino integration
3. ✅ Demonstrate real-time attendance marking
4. ✅ Explain the template ID mapping system
5. ✅ Show the modern UI/UX design

### What Makes This Project Stand Out:
- ✅ **Hardware + Software integration**
- ✅ Real-world problem solving
- ✅ Professional UI design
- ✅ Complete CRUD operations
- ✅ Role-based authentication
- ✅ Scalable architecture
- ✅ **Shows understanding of full-stack development**

---

## 🎓 Learning Outcomes

By completing this project, you've demonstrated:
- ✅ Full-stack development (React + Node.js + SQL)
- ✅ Hardware integration (Arduino + Sensors)
- ✅ Database design and management
- ✅ RESTful API architecture
- ✅ Authentication and authorization
- ✅ Real-time system design
- ✅ Modern UI/UX implementation

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Arduino Serial Monitor logs
3. Check backend console logs
4. Verify database connections

---

## 📜 License

This project is open source and available for educational purposes.

---

**Built with ❤️ for your placement preparation and final year project**

Good luck with your interviews! 🚀
