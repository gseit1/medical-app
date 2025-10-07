# 🔧 Troubleshooting Login Issues

## Quick Checklist

### 1. Check if Backend is Running
Open: `http://localhost:5000`
You should see:
```json
{
  "message": "Medical Application API",
  "version": "1.0.0",
  "endpoints": {...}
}
```

### 2. Check if Frontend is Running
Open: `http://localhost:3000`
You should see the login page

### 3. Check Browser Console
1. Open browser (Chrome/Edge)
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Try to login
5. Look for errors (red text)

### 4. Check Network Tab
1. Press `F12` → **Network** tab
2. Try to login
3. Look for `/api/auth/login` request
4. Click on it to see:
   - Status Code (should be 200 for success)
   - Response data
   - Any errors

### 5. Check Backend Terminal
Look at the backend terminal for console logs showing:
```
=== LOGIN ATTEMPT ===
Request body: { username: '...', password: '...' }
✓ Searching for user: ...
✓ User found: ...
✓ Password valid
✓ Token generated
✅ Login successful
```

## Common Issues & Solutions

### Issue 1: "Cannot connect" or Network Error
**Cause:** Backend not running or wrong port

**Solution:**
```bash
cd D:\efarmogi\klinikiCode\backend
node server.js
```

Make sure you see:
```
🚀 Server is running on http://localhost:5000
✅ Database connected successfully
```

### Issue 2: "Invalid credentials"
**Cause:** Wrong username/password or password not hashed correctly

**Solution:**
Try these exact credentials:
- Username: `nurse1`
- Password: `password123`

**OR**

- Username: `patient1`
- Password: `password123`

### Issue 3: Login appears to work but doesn't redirect
**Cause:** Issue with Vue Router or auth store

**Check Browser Console for:**
```
Attempting login with: nurse1
Login success: true
User: {id: 1, username: 'nurse1', role: 'nurse'}
Is Nurse: true
Redirecting to /patients
```

**Solution:**
Clear browser cache and localStorage:
```javascript
// In browser console (F12)
localStorage.clear()
location.reload()
```

### Issue 4: CORS Error
**Cause:** Backend CORS not configured properly

**Look for:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
Backend `server.js` should have:
```javascript
app.use(cors());
```

### Issue 5: Database Connection Failed
**Cause:** XAMPP MySQL not running

**Solution:**
1. Open XAMPP Control Panel
2. Start **MySQL**
3. Restart backend server

## Testing Login Manually

### Test 1: Test Backend API Directly

Open PowerShell and run:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000" -UseBasicParsing
```

Should return API information.

### Test 2: Test Login Endpoint

```powershell
$body = @{
    username = "nurse1"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
```

Should return:
```json
{
  "message": "Login successful",
  "token": "eyJ...",
  "user": {...}
}
```

### Test 3: Check Database

```bash
# In XAMPP MySQL terminal or phpMyAdmin
SELECT username, role FROM users;
```

Should show:
```
+----------+---------+
| username | role    |
+----------+---------+
| nurse1   | nurse   |
| patient1 | patient |
| patient2 | patient |
+----------+---------+
```

## Step-by-Step Debug Process

1. **Open browser** → `http://localhost:3000`
2. **Press F12** → Open DevTools
3. **Go to Console tab**
4. **Enter credentials:**
   - Username: `nurse1`
   - Password: `password123`
5. **Click Login**
6. **Watch Console** for logs
7. **Check Network tab** for API call
8. **Check Backend terminal** for server logs

## Still Not Working?

### Restart Everything:

1. **Stop all terminals** (Ctrl+C)
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Close browser completely**
4. **Start backend:**
   ```bash
   cd D:\efarmogi\klinikiCode\backend
   node server.js
   ```
5. **Start frontend:** (in new terminal)
   ```bash
   cd D:\efarmogi\klinikiCode\frontend
   npm run dev
   ```
6. **Open fresh browser** → `http://localhost:3000`
7. **Try login again**

### Check Firewall:
Windows Firewall might be blocking ports 3000 or 5000.

### Check Ports:
```powershell
netstat -ano | findstr ":5000"
netstat -ano | findstr ":3000"
```

Both should show LISTENING status.

## What to Report if Still Failing:

1. Screenshot of browser console (F12 → Console tab)
2. Screenshot of Network tab showing /api/auth/login request
3. Backend terminal output
4. Result of: `http://localhost:5000` in browser
5. XAMPP MySQL status (running or stopped)

---

**Need more help? Check the main README.md for full documentation.**
