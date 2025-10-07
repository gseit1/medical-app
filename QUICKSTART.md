# 🚀 Quick Start Guide

## Step-by-Step Setup Instructions

### 1️⃣ Install Node.js and npm

1. **Download Node.js** from https://nodejs.org/
   - Choose the LTS (Long Term Support) version
   - This will also install npm automatically

2. **Verify installation**:
   ```bash
   node --version
   npm --version
   ```

### 2️⃣ Install MySQL

1. **Download MySQL** from https://dev.mysql.com/downloads/mysql/
   - Choose MySQL Community Server
   - Remember the root password you set during installation!

2. **Verify MySQL is running**:
   - Windows: Check Services for "MySQL" (should be running)
   - Or run: `mysql --version`

### 3️⃣ Setup Backend

1. **Navigate to backend folder**:
   ```bash
   cd d:\efarmogi\klinikiCode\backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure database connection**:
   - Open `backend/.env` file
   - Update with your MySQL password:
   ```env
   DB_PASSWORD=your_mysql_root_password
   ```

### 4️⃣ Setup Database

1. **Open MySQL Command Line** or **MySQL Workbench**

2. **Run the schema file**:
   
   **Option A - Command Line:**
   ```bash
   mysql -u root -p < schema.sql
   ```
   (Enter your MySQL password when prompted)

   **Option B - MySQL Workbench:**
   - Open MySQL Workbench
   - Connect to your local MySQL server
   - Go to File → Open SQL Script
   - Select `backend/schema.sql`
   - Click the lightning bolt icon to execute

3. **Verify database was created**:
   ```sql
   SHOW DATABASES;
   USE medical_app;
   SHOW TABLES;
   ```

### 5️⃣ Setup Frontend

1. **Navigate to frontend folder**:
   ```bash
   cd d:\efarmogi\klinikiCode\frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### 6️⃣ Run the Application

1. **Start Backend Server** (in backend folder):
   ```bash
   cd d:\efarmogi\klinikiCode\backend
   npm start
   ```
   
   You should see:
   ```
   ✅ Database connected successfully
   🚀 Server is running on http://localhost:5000
   ```

2. **Start Frontend** (in a NEW terminal, in frontend folder):
   ```bash
   cd d:\efarmogi\klinikiCode\frontend
   npm run dev
   ```
   
   You should see:
   ```
   VITE ready in XXX ms
   ➜ Local: http://localhost:3000/
   ```

3. **Open your browser** and go to:
   ```
   http://localhost:3000
   ```

### 7️⃣ Login and Test

**Nurse Login:**
- Username: `nurse1`
- Password: `password123`

**Patient Login:**
- Username: `patient1`
- Password: `password123`

**Test Barcodes:**
- `MED001234567` - Valid for Patient 1
- `MED001234569` - Valid for Patient 2
- `INVALID123` - Invalid barcode

## 🎉 You're Done!

The application should now be running. Enjoy exploring the features!

## ⚠️ Common Issues

### "npm: command not found"
- Node.js is not installed or not in PATH
- Solution: Install Node.js from nodejs.org

### "Cannot connect to MySQL"
- MySQL service not running
- Solution: Start MySQL service
  - Windows: Services → MySQL → Start
  - Or check `backend/.env` credentials

### "Port 5000 already in use"
- Another application is using port 5000
- Solution: Change PORT in `backend/.env` to 5001 or another free port

### "ECONNREFUSED" error
- Backend server is not running
- Solution: Make sure you started the backend server first

## 📝 Next Steps

1. Explore the patient list (as nurse)
2. View patient details
3. Try barcode verification
4. Mark instructions as completed
5. Login as a patient to see the patient view

## 🆘 Need Help?

Check the main README.md file for more detailed documentation and troubleshooting tips.
