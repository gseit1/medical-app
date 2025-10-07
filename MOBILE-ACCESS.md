# 📱 Access Webapp from Mobile Phone

## Your Computer's IP Address
**192.168.1.2**

## Steps to Access from Android Phone

### 1. Make sure your phone is on the SAME Wi-Fi network as your computer

### 2. Start the servers on your computer:

**Backend:**
```bash
cd D:\efarmogi\klinikiCode\backend
npm start
```

**Frontend:**
```bash
cd D:\efarmogi\klinikiCode\frontend
npm run dev
```

### 3. Open your phone's browser and go to:
```
https://192.168.1.2:3000
```

⚠️ **Important:** You MUST use **HTTPS** (not HTTP) for camera access to work!

**First time only:** Your browser will show a security warning because the SSL certificate is self-signed. This is normal for local development.
- On Chrome: Click "Advanced" → "Proceed to 192.168.1.2 (unsafe)"
- On Safari: Click "Show Details" → "visit this website"

After accepting the certificate once, it will work normally.

## Login Credentials

### Nurse Account:
- **Username:** `nurse1`
- **Password:** `password123`

### Patient Accounts:
- **Username:** `patient1` / **Password:** `password123` (Γεώργιος Παπαδόπουλος)
- **Username:** `patient2` / **Password:** `password123` (Μαρία Ιωάννου)
- **Username:** `patient3` / **Password:** `password123` (Νίκος Κωνσταντίνου)
- **Username:** `patient4` / **Password:** `password123` (Ελένη Δημητρίου)
- **Username:** `patient5` / **Password:** `password123` (Κωνσταντίνος Αντωνίου)

## Troubleshooting

### If you can't connect:

1. **Check Windows Firewall:**
   - Open Windows Defender Firewall
   - Click "Allow an app or feature through Windows Defender Firewall"
   - Make sure Node.js is allowed for Private networks

2. **Check if both devices are on the same network:**
   - Your computer and phone must be on the same Wi-Fi network

3. **Verify the IP address hasn't changed:**
   - Run this command on your computer to check:
   ```powershell
   ipconfig | Select-String -Pattern "IPv4"
   ```

4. **Check if ports are open:**
   - Backend should be on port 5000
   - Frontend should be on port 3000

## Network Configuration

- **Backend URL:** `http://192.168.1.2:5000`
- **Frontend URL:** `https://192.168.1.2:3000` ⚠️ **HTTPS required for camera!**
- **CORS:** Enabled for all origins
- **Server Host:** Listening on `0.0.0.0` (all network interfaces)
- **SSL Certificate:** Self-signed (you'll need to accept the security warning once)

## Features Available on Mobile

✅ Responsive design optimized for mobile screens
✅ Login with username/password
✅ View patient list (nurse role)
✅ View patient details
✅ Medical instructions with barcode scanning
✅ Referrals view
✅ Logout functionality

## Greek Character Support

The app now properly displays Greek characters:
- Patient names (Ονοματεπώνυμα)
- Medical instructions (Ιατρικές Οδηγίες)
- Doctor names (Ονόματα Ιατρών)
- All Greek text throughout the interface
