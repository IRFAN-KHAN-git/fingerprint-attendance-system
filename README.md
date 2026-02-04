# 🔐 Fingerprint Attendance Management System

An IoT-enabled biometric attendance tracking system using fingerprint authentication, built with React, Node.js, SQL Server, and Arduino.

![Project Banner](assets/images/banner.png)

## 🌟 Features

- ✅ **Biometric Authentication** - Fingerprint-based attendance marking
- ✅ **Real-time Tracking** - Instant attendance updates
- ✅ **Admin Dashboard** - Comprehensive management interface
- ✅ **Student Portal** - View personal attendance records
- ✅ **Automated Reports** - Export attendance data to CSV/Excel
- ✅ **IoT Integration** - Arduino/ESP32 hardware support
- ✅ **Role-based Access** - Admin and Student roles
- ✅ **Cloud Ready** - Deploy to Railway, Heroku, or AWS

## 🎯 Project Overview

This system eliminates manual attendance marking by using fingerprint sensors connected to Arduino/ESP32 devices. When a student scans their fingerprint, the system automatically marks their attendance in the database and displays it in real-time on the web dashboard.

### Demo

🎥 [Watch Demo Video](link-to-video)  
🌐 [Live Demo](https://your-demo-url.com)

### Screenshots

| Login Page | Admin Dashboard | Fingerprint Registration |
|------------|-----------------|-------------------------|
| ![Login](assets/screenshots/login.png) | ![Dashboard](assets/screenshots/dashboard.png) | ![Fingerprint](assets/screenshots/fingerprint.png) |

## 🛠️ Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Lucide Icons
- Axios / React Query

### Backend
- Node.js
- Express.js
- JWT Authentication
- SerialPort (Arduino communication)

### Database
- SQL Server 2022
- Stored Procedures
- Views & Triggers

### Hardware
- Arduino Uno / ESP32
- R305 / AS608 Fingerprint Sensor
- USB / WiFi connectivity

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- SQL Server 2022 Express (or PostgreSQL)
- Arduino IDE (for hardware setup)
- Git installed
- Code editor (VS Code recommended)

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/your-username/fingerprint-attendance-system.git
cd fingerprint-attendance-system
```

### 2. Setup Database
```bash
cd database
# Run setup script in SQL Server Management Studio
# File: database/scripts/setup.sql
```

### 3. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
# Backend runs on http://localhost:5000
```

### 4. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if needed
npm start
# Frontend runs on http://localhost:3000
```

### 5. Setup Arduino
```bash
cd arduino/fingerprint-arduino-uno
# Open fingerprint-arduino-uno.ino in Arduino IDE
# Install Adafruit Fingerprint Sensor library
# Upload to Arduino
# Connect fingerprint sensor (see wiring diagram)
```

## 📖 Documentation

Detailed documentation is available in the `docs/` folder:

- [Installation Guide](docs/guides/installation.md)
- [API Documentation](docs/api/)
- [User Guide](docs/guides/admin-guide.md)
- [Troubleshooting](docs/guides/troubleshooting.md)
- [Contributing](CONTRIBUTING.md)

## 🧪 Testing
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

## 📦 Deployment

### Deploy Backend (Railway)
```bash
railway init
railway up
```

### Deploy Frontend (Vercel)
```bash
vercel --prod
```

See [Deployment Guide](docs/architecture/deployment.md) for details.

## 👥 Team

| Name | Role | GitHub |
|------|------|--------|
| Your Name | Team Lead | [@username](https://github.com/username) |
| Member 2 | Frontend Dev | [@username](https://github.com/username) |
| Member 3 | Backend Dev | [@username](https://github.com/username) |
| Member 4 | Database Dev | [@username](https://github.com/username) |

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

## 🙏 Acknowledgments

- College Name
- Project Guide: Prof. Name
- Adafruit for fingerprint sensor library
- Open source community

## 📞 Contact

Project Link: [https://github.com/your-username/fingerprint-attendance-system](https://github.com/your-username/fingerprint-attendance-system)

---

**⭐ Star this repo if you find it helpful!**
