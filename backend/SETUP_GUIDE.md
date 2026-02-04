# 🚀 BACKEND SETUP GUIDE - STEP BY STEP
# Fingerprint Attendance System with MongoDB

## 📋 PREREQUISITES

Before starting, make sure you have:
- ✅ Node.js installed (v18 or higher)
- ✅ MongoDB installed and running
- ✅ Arduino connected and working (from previous step)
- ✅ Code editor (VS Code recommended)

---

## STEP 1: INSTALL NODE.JS

### Windows:
1. Go to https://nodejs.org
2. Download LTS version
3. Run installer
4. Verify: Open CMD and type `node --version`

### Mac:
```bash
brew install node
node --version
```

### Linux:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
```

---

## STEP 2: INSTALL MONGODB

### Windows:
1. Download from: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. During installation, select "Install MongoDB as a Service"
4. MongoDB will auto-start

### Mac:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu):
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Verify MongoDB is running:
```bash
# Windows (in CMD)
mongo --version

# Mac/Linux
mongosh --version
```

---

## STEP 3: SETUP BACKEND PROJECT

### 3.1 Navigate to backend folder
```bash
cd backend
```

### 3.2 Install dependencies
```bash
npm install
```

This will install all required packages including:
- express (web framework)
- mongoose (MongoDB ODM)
- jsonwebtoken (authentication)
- bcryptjs (password hashing)
- serialport (Arduino communication)
- cors, dotenv, helmet, etc.

**Wait for installation to complete (may take 2-3 minutes)**

---

## STEP 4: CONFIGURE ENVIRONMENT VARIABLES

### 4.1 Copy example env file
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

### 4.2 Edit .env file
Open `.env` file and configure:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/fingerprint_attendance

# JWT Configuration (change the secret!)
JWT_SECRET=your-super-secret-key-change-this-to-something-random
JWT_EXPIRE=7d

# Arduino Configuration (IMPORTANT: Check your COM port!)
ARDUINO_PORT=COM3
ARDUINO_BAUD_RATE=9600

# CORS Configuration (your frontend URL)
CORS_ORIGIN=http://localhost:3000
```

**⚠️ IMPORTANT: Update ARDUINO_PORT**

To find your Arduino port:

**Windows:**
1. Open Device Manager
2. Look under "Ports (COM & LPT)"
3. Find "Arduino Uno (COMx)" - note the COM number
4. Update ARDUINO_PORT in .env (e.g., COM3, COM4, etc.)

**Mac:**
```bash
ls /dev/tty.*
# Look for /dev/tty.usbserial-* or /dev/tty.usbmodem*
# Use that path in ARDUINO_PORT
```

**Linux:**
```bash
ls /dev/ttyUSB* /dev/ttyACM*
# Usually /dev/ttyUSB0 or /dev/ttyACM0
```

---

## STEP 5: TEST THE SETUP

### 5.1 Start the backend server
```bash
npm run dev
```

You should see:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Fingerprint Attendance System Backend
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Server running on port 5000
🌍 Environment: development
📍 API: http://localhost:5000/api
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ MongoDB Connected: localhost
📊 Database: fingerprint_attendance
🔌 Connecting to Arduino on COM3...
✅ Arduino connected on COM3
📟 Arduino: Fingerprint Attendance System
📟 Arduino: Arduino Ready
📟 Arduino: Sensor found!
📟 Arduino: System initialized. Waiting for commands...
```

If you see all ✅ green checkmarks, **YOU'RE ALL SET!**

### 5.2 Test API in browser
Open browser and go to: http://localhost:5000

You should see:
```json
{
  "success": true,
  "message": "Fingerprint Attendance System API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/api/health",
    "auth": "/api/auth",
    "students": "/api/students",
    ...
  }
}
```

### 5.3 Test health endpoint
Go to: http://localhost:5000/api/health

Should return:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-..."
}
```

---

## STEP 6: CREATE ADMIN USER (IMPORTANT!)

### 6.1 Using Postman or Thunder Client

**Install Thunder Client (VS Code Extension):**
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search "Thunder Client"
4. Install it
5. Click Thunder Client icon in sidebar

### 6.2 Create Admin User Request

**Method:** POST
**URL:** http://localhost:5000/api/auth/register
**Headers:** Content-Type: application/json
**Body:**
```json
{
  "email": "admin@college.edu",
  "password": "admin123",
  "name": "Admin User",
  "role": "admin"
}
```

**Click Send**

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": "..."
}
```

### 6.3 Login as Admin

**Method:** POST
**URL:** http://localhost:5000/api/auth/login
**Body:**
```json
{
  "email": "admin@college.edu",
  "password": "admin123",
  "role": "admin"
}
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@college.edu",
    "role": "admin",
    "name": "Admin User"
  }
}
```

**⚠️ SAVE THE TOKEN! You'll need it for authenticated requests.**

---

## STEP 7: TEST ARDUINO CONNECTION

### 7.1 Check Arduino Status

**Method:** GET
**URL:** http://localhost:5000/api/fingerprint/status
**Headers:** 
- Authorization: Bearer YOUR_TOKEN_HERE

**Expected Response:**
```json
{
  "success": true,
  "connected": true,
  "message": "Arduino is connected"
}
```

If connected = false:
- Check Arduino is plugged in via USB
- Check ARDUINO_PORT in .env is correct
- Restart the backend server

---

## STEP 8: CREATE SAMPLE DATA

### 8.1 Create a Student

**Method:** POST
**URL:** http://localhost:5000/api/students
**Headers:** 
- Authorization: Bearer YOUR_TOKEN
- Content-Type: application/json
**Body:**
```json
{
  "name": "John Doe",
  "rollNumber": "2024CS001",
  "email": "john@student.edu",
  "phone": "1234567890"
}
```

**Save the student ID from response!**

### 8.2 Create a Class

**Method:** POST
**URL:** http://localhost:5000/api/classes
**Headers:** 
- Authorization: Bearer YOUR_TOKEN
- Content-Type: application/json
**Body:**
```json
{
  "name": "Computer Science 101",
  "code": "CS101",
  "subject": "Introduction to Programming",
  "teacher": "Prof. Smith"
}
```

**Save the class ID from response!**

### 8.3 Enroll Student in Class

**Method:** POST
**URL:** http://localhost:5000/api/classes/CLASS_ID/students
**Headers:** 
- Authorization: Bearer YOUR_TOKEN
- Content-Type: application/json
**Body:**
```json
{
  "studentId": "STUDENT_ID_FROM_STEP_8.1"
}
```

---

## STEP 9: TEST FINGERPRINT ENROLLMENT

### 9.1 Start Fingerprint Registration

**Method:** POST
**URL:** http://localhost:5000/api/fingerprint/register
**Headers:** 
- Authorization: Bearer YOUR_TOKEN
- Content-Type: application/json
**Body:**
```json
{
  "studentId": "YOUR_STUDENT_ID"
}
```

### 9.2 Follow Arduino Instructions
Watch your backend server console:
```
📟 Arduino: ENROLL_START:1
📟 Arduino: Place finger on sensor...
📟 Arduino: Image taken
📟 Arduino: Remove finger
📟 Arduino: Place same finger again...
📟 Arduino: Image taken
📟 Arduino: Prints matched!
📟 Arduino: SUCCESS:1
```

**Expected API Response:**
```json
{
  "success": true,
  "message": "Fingerprint registered successfully",
  "templateId": 1,
  "student": {
    "id": "...",
    "name": "John Doe",
    "rollNumber": "2024CS001"
  }
}
```

---

## STEP 10: TEST ATTENDANCE MARKING

### 10.1 Mark Attendance with Fingerprint

**Method:** POST
**URL:** http://localhost:5000/api/attendance/mark
**Headers:** 
- Authorization: Bearer YOUR_TOKEN
- Content-Type: application/json
**Body:**
```json
{
  "templateId": 1,
  "classId": "YOUR_CLASS_ID"
}
```

OR verify finger first:

**Method:** POST
**URL:** http://localhost:5000/api/fingerprint/verify
**Headers:** Authorization: Bearer YOUR_TOKEN

Then use the returned student ID to mark attendance:
```json
{
  "studentId": "STUDENT_ID",
  "classId": "CLASS_ID"
}
```

---

## 🎉 SUCCESS! YOUR BACKEND IS READY!

Now you have:
- ✅ Backend server running
- ✅ MongoDB connected
- ✅ Arduino connected
- ✅ Admin user created
- ✅ Sample student & class created
- ✅ Fingerprint enrollment working
- ✅ Attendance marking working

---

## 📝 API ENDPOINTS QUICK REFERENCE

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login
- GET /api/auth/me - Get current user

### Students
- GET /api/students - Get all students
- POST /api/students - Create student
- GET /api/students/:id - Get student by ID
- PUT /api/students/:id - Update student
- DELETE /api/students/:id - Delete student

### Classes
- GET /api/classes - Get all classes
- POST /api/classes - Create class
- GET /api/classes/:id - Get class by ID
- POST /api/classes/:id/students - Add student to class

### Fingerprint
- GET /api/fingerprint/status - Check Arduino status
- POST /api/fingerprint/register - Register fingerprint
- POST /api/fingerprint/verify - Verify fingerprint
- GET /api/fingerprint/registered - Get registered fingerprints

### Attendance
- POST /api/attendance/mark - Mark attendance
- GET /api/attendance - Get attendance records
- GET /api/attendance/stats - Get statistics

---

## 🔧 TROUBLESHOOTING

### MongoDB not connecting
```bash
# Check if MongoDB is running
mongosh

# If not running, start it:
# Windows: Start MongoDB service in Services
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Arduino not connecting
1. Check USB cable is connected
2. Check COM port in .env matches Device Manager
3. Close Arduino IDE if open
4. Restart backend server

### Port 5000 already in use
Change PORT in .env file to 5001 or any available port

### "Module not found" errors
```bash
npm install
```

### Permission errors (Mac/Linux)
```bash
sudo npm install
sudo npm run dev
```

---

## 🚀 NEXT STEPS

1. Keep backend running: `npm run dev`
2. Frontend team can now connect to your API
3. Test all endpoints with Thunder Client/Postman
4. When ready for ESP32, I'll tell you what to change

---

## 💡 USEFUL COMMANDS

```bash
# Start development server (auto-restart on changes)
npm run dev

# Start production server
npm start

# View MongoDB data
mongosh
use fingerprint_attendance
db.students.find()
db.users.find()
db.attendance.find()
```

Good luck! 🎉
