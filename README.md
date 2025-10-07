# 🏥 Medical Web Application - Ιατρική Εφαρμογή

A full-stack medical web application for managing patients, medical instructions, and barcode verification.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Default Login Credentials](#default-login-credentials)

## ✨ Features

### For Nurses
- ✅ View all patients in a searchable table
- ✅ Access detailed patient information
- ✅ View medical instructions and their status
- ✅ Mark medical instructions as completed
- ✅ Verify medicine barcodes
- ✅ View patient referrals

### For Patients
- ✅ View their own profile information
- ✅ See their medical instructions
- ✅ Check instruction status (Pending/Completed)
- ✅ View their referrals
- ✅ Verify medicine barcodes

### General Features
- 🔐 Secure JWT-based authentication
- 🎨 Responsive Bootstrap 5 design
- 📱 Mobile-friendly interface
- 🔍 Barcode verification system
- ✅ Real-time status updates
- 🇬🇷 Greek language support

## 🔧 Tech Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled

### Frontend
- **Vue.js 3** (Composition API)
- **Vite** build tool
- **Vue Router** for routing
- **Pinia** for state management
- **Bootstrap 5** for styling
- **Axios** for HTTP requests

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)

## 🚀 Installation

### 1. Clone or Download the Project

```bash
cd d:\efarmogi\klinikiCode
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## 🗄️ Database Setup

### 1. Start MySQL Server

Make sure your MySQL server is running.

### 2. Create Database and Tables

Open MySQL command line or MySQL Workbench and run:

```bash
cd backend
mysql -u root -p < schema.sql
```

Or manually:
1. Open MySQL Workbench or command line
2. Copy the contents of `backend/schema.sql`
3. Execute the SQL commands

This will:
- Create the `medical_app` database
- Create tables: `users`, `patients`, `medical_instructions`, `referrals`
- Insert sample data for testing

### 3. Configure Database Connection

Edit `backend/.env` file with your MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=medical_app
JWT_SECRET=medical_app_secret_key_2025
```

## 🏃 Running the Application

### 1. Start the Backend Server

```bash
cd backend
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Start the Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

### 3. Open the Application

Visit `http://localhost:3000` in your web browser.

## 👥 User Roles

### Nurse (Νοσηλευτής)
- Can view all patients
- Can access any patient's details
- Can mark medical instructions as completed
- Can verify barcodes

### Patient (Ασθενής)
- Can only view their own information
- Can see their medical instructions
- Can verify barcodes for their medicines
- Cannot access other patients' data

## 🔑 Default Login Credentials

### Nurse Account
- **Username:** `nurse1`
- **Password:** `password123`

### Patient Accounts
- **Patient 1:** `patient1` / `password123` (Γεώργιος Παπαδόπουλος)
- **Patient 2:** `patient2` / `password123` (Μαρία Ιωάννου)

## 📡 API Documentation

### Authentication

#### POST `/api/auth/login`
Login to the system
```json
{
  "username": "nurse1",
  "password": "password123"
}
```

#### POST `/api/auth/register`
Register new user (admin only)
```json
{
  "username": "newuser",
  "password": "password",
  "role": "nurse|patient",
  "patient_id": null
}
```

### Patients

#### GET `/api/patients`
Get all patients (nurse only)
- Requires authentication
- Returns array of patient objects

#### GET `/api/patients/:id`
Get specific patient details
- Requires authentication
- Nurse can access any patient
- Patient can only access their own data

#### POST `/api/patients`
Create new patient (nurse only)
```json
{
  "full_name": "Όνομα Επώνυμο",
  "amka": "12345678901",
  "afm": "123456789",
  "blood_type": "A+"
}
```

### Medical Instructions

#### POST `/api/instructions/verify-barcode`
Verify barcode for a patient
```json
{
  "patientId": 1,
  "barcode": "MED001234567"
}
```

#### PATCH `/api/instructions/:id/complete`
Mark instruction as completed
- Requires authentication
- Returns updated instruction

#### GET `/api/instructions/patient/:patientId`
Get all instructions for a patient
- Requires authentication

#### POST `/api/instructions`
Create new medical instruction (nurse only)
```json
{
  "patient_id": 1,
  "description": "Χορήγηση φαρμάκου",
  "barcode": "MED001234567"
}
```

## 📱 Sample Barcodes for Testing

Use these barcodes to test the verification feature:

| Barcode | Patient | Medicine | Status |
|---------|---------|----------|--------|
| `MED001234567` | Γεώργιος Παπαδόπουλος | Αμοξυκιλλίνη 500mg | Εκρεμής |
| `MED001234568` | Γεώργιος Παπαδόπουλος | Μέτρηση Πίεσης | Ολοκληρωμένη |
| `MED001234569` | Μαρία Ιωάννου | Ινσουλίνη 10 μονάδες | Εκρεμής |
| `MED001234570` | Μαρία Ιωάννου | Έλεγχος Σακχάρου | Εκρεμής |
| `MED001234571` | Νίκος Κωνσταντίνου | Παυσίπονο 500mg | Εκρεμής |

## 🎨 Features Overview

### Patient List (Nurses)
- View all registered patients
- Search and filter functionality
- Quick access to patient details
- Display AMKA, AFM, blood type

### Patient Details
- Complete patient profile
- Medical instructions with status badges
- Referrals (παραπεμπτικά) list
- Barcode verification panel
- Mark instructions as completed

### Barcode Verification
- Real-time barcode input
- Instant verification feedback
- Shows ✅ for correct medicine
- Shows ❌ for incorrect barcode
- Displays recent verification history
- Auto-focus for quick scanning

### Authentication
- Secure JWT-based login
- Role-based access control
- Automatic token refresh
- Logout functionality

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- Protected API routes
- CORS configuration
- Input validation

## 📝 Validation

The application includes validation for:
- **AMKA** (11 digits with check digit validation)
- **AFM** (9 digits with check digit validation)
- User input sanitization
- Required field validation

## 🛠️ Development

### Backend Structure
```
backend/
├── config/          # Database configuration
├── controllers/     # Business logic
├── middleware/      # Authentication & authorization
├── routes/          # API routes
├── schema.sql       # Database schema
├── server.js        # Main server file
└── .env            # Environment variables
```

### Frontend Structure
```
frontend/
├── src/
│   ├── assets/      # CSS and static files
│   ├── components/  # Vue components
│   ├── router/      # Vue Router configuration
│   ├── stores/      # Pinia stores
│   ├── utils/       # Utility functions
│   ├── views/       # Page components
│   ├── services/    # API services
│   └── App.vue      # Root component
└── index.html       # HTML entry point
```

## 🐛 Troubleshooting

### Backend won't start
- Check if MySQL is running
- Verify database credentials in `.env`
- Ensure port 5000 is not in use

### Frontend won't connect to backend
- Verify backend is running on port 5000
- Check CORS configuration
- Clear browser cache and localStorage

### Database connection errors
- Check MySQL service is running
- Verify username/password in `.env`
- Ensure database `medical_app` exists

### Login fails
- Verify user exists in database
- Check password is `password123` for test users
- Check JWT_SECRET in `.env`

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Created as a full-stack medical application demonstration.

## 🤝 Contributing

This is a demonstration project. Feel free to fork and modify for your needs.

## 📞 Support

For issues or questions, please check the troubleshooting section or review the code comments.

---

**Note:** This is a demonstration application. For production use, additional security measures, testing, and features should be implemented.
