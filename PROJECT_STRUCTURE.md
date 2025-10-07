# 📁 Project Structure

## Complete Directory Tree

```
klinikiCode/
│
├── backend/                          # Node.js + Express Backend
│   ├── config/
│   │   └── database.js              # MySQL connection pool
│   │
│   ├── controllers/
│   │   ├── authController.js        # Login & registration logic
│   │   ├── patientController.js     # Patient CRUD operations
│   │   └── instructionController.js # Medical instructions & barcode
│   │
│   ├── middleware/
│   │   └── auth.js                  # JWT authentication & authorization
│   │
│   ├── routes/
│   │   ├── auth.js                  # /api/auth/* routes
│   │   ├── patients.js              # /api/patients/* routes
│   │   └── instructions.js          # /api/instructions/* routes
│   │
│   ├── .env                         # Environment variables (DATABASE, JWT)
│   ├── .env.example                 # Template for .env
│   ├── .gitignore                   # Git ignore rules
│   ├── package.json                 # Backend dependencies
│   ├── schema.sql                   # Database schema & sample data
│   ├── hashPassword.js              # Utility to hash passwords
│   └── server.js                    # Main Express server
│
├── frontend/                        # Vue.js 3 Frontend
│   ├── public/
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   └── main.css            # Custom CSS styles
│   │   │
│   │   ├── components/
│   │   │   └── BarcodeVerification.vue  # Barcode scanner component
│   │   │
│   │   ├── router/
│   │   │   └── index.js            # Vue Router config & guards
│   │   │
│   │   ├── services/
│   │   │   └── api.js              # Axios instance with interceptors
│   │   │
│   │   ├── stores/
│   │   │   └── auth.js             # Pinia auth store
│   │   │
│   │   ├── utils/
│   │   │   └── validation.js       # AMKA/AFM validation
│   │   │
│   │   ├── views/
│   │   │   ├── LoginView.vue       # Login page
│   │   │   ├── PatientListView.vue # Patient list (nurse)
│   │   │   └── PatientDetailView.vue # Patient details
│   │   │
│   │   ├── App.vue                 # Root component
│   │   └── main.js                 # Vue app initialization
│   │
│   ├── .gitignore
│   ├── index.html                  # HTML entry point
│   ├── package.json                # Frontend dependencies
│   └── vite.config.js              # Vite configuration
│
├── README.md                        # Complete documentation
└── QUICKSTART.md                    # Quick setup guide
```

## 🗄️ Database Schema

### Tables

#### 1. **patients**
Stores patient information
```sql
- id (PRIMARY KEY)
- full_name
- amka (UNIQUE, 11 digits)
- afm (UNIQUE, 9 digits)
- blood_type
- created_at
```

#### 2. **users**
Authentication and authorization
```sql
- id (PRIMARY KEY)
- username (UNIQUE)
- password (hashed)
- role (nurse/patient)
- patient_id (FOREIGN KEY → patients.id)
- created_at
```

#### 3. **medical_instructions**
Medical instructions assigned to patients
```sql
- id (PRIMARY KEY)
- patient_id (FOREIGN KEY → patients.id)
- description
- barcode (UNIQUE)
- status (Εκρεμής/Ολοκληρωμένη)
- created_at
- completed_at
```

#### 4. **referrals**
Medical referrals (παραπεμπτικά)
```sql
- id (PRIMARY KEY)
- patient_id (FOREIGN KEY → patients.id)
- description
- referral_date
- doctor_name
- created_at
```

## 🔄 Data Flow

### Authentication Flow
```
1. User enters credentials → LoginView.vue
2. Credentials sent to backend → POST /api/auth/login
3. Backend validates → authController.js
4. JWT token generated
5. Token stored in localStorage
6. Token attached to all API requests → api.js interceptor
```

### Patient List Flow (Nurse)
```
1. Nurse navigates to /patients → PatientListView.vue
2. Router checks role → router/index.js
3. Fetch patients → GET /api/patients
4. Display in table with Bootstrap
```

### Barcode Verification Flow
```
1. User enters/scans barcode → BarcodeVerification.vue
2. Submit to backend → POST /api/instructions/verify-barcode
3. Backend checks database → instructionController.js
4. Return result (✅ Correct or ❌ Incorrect)
5. Display visual feedback
```

## 🎨 Key Components

### Backend

| File | Purpose |
|------|---------|
| `server.js` | Express app setup, middleware, routes |
| `database.js` | MySQL connection pool configuration |
| `auth.js` (middleware) | JWT verification, role checks |
| `authController.js` | Login/register logic |
| `patientController.js` | CRUD for patients |
| `instructionController.js` | Barcode verification, instruction management |

### Frontend

| File | Purpose |
|------|---------|
| `main.js` | Vue app initialization, Pinia, Router |
| `App.vue` | Root component with navbar |
| `auth.js` (store) | Authentication state management |
| `api.js` | Axios configuration, JWT injection |
| `LoginView.vue` | Login form |
| `PatientListView.vue` | Table of all patients |
| `PatientDetailView.vue` | Patient profile, instructions, referrals |
| `BarcodeVerification.vue` | Barcode scanner component |
| `index.js` (router) | Routes & navigation guards |

## 🔐 Security Features

1. **Password Hashing**: bcryptjs with salt rounds
2. **JWT Tokens**: Signed with secret, 24h expiration
3. **Role-Based Access**: Middleware checks user role
4. **Protected Routes**: Frontend guards, backend middleware
5. **CORS Configuration**: Controlled API access
6. **Input Validation**: AMKA/AFM format validation

## 🎯 API Endpoints Summary

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Create new user

### Patients
- `GET /api/patients` - List all patients (nurse only)
- `GET /api/patients/:id` - Get patient details
- `POST /api/patients` - Create new patient (nurse only)

### Instructions
- `POST /api/instructions/verify-barcode` - Verify barcode
- `PATCH /api/instructions/:id/complete` - Mark as completed
- `GET /api/instructions/patient/:patientId` - Get patient instructions
- `POST /api/instructions` - Create instruction (nurse only)

## 📦 Dependencies

### Backend
- express: Web framework
- mysql2: MySQL driver with promises
- bcryptjs: Password hashing
- jsonwebtoken: JWT generation/verification
- cors: Cross-origin resource sharing
- dotenv: Environment variables

### Frontend
- vue: Progressive JavaScript framework
- vue-router: Official router for Vue.js
- pinia: State management
- axios: HTTP client
- bootstrap: CSS framework
- vite: Build tool and dev server

## 🚀 Development Commands

### Backend
```bash
npm start          # Start server
npm run dev        # Start with nodemon (auto-restart)
node hashPassword.js password123  # Generate password hash
```

### Frontend
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=medical_app
JWT_SECRET=your_secret_key
```

### Frontend (vite.config.js)
```javascript
server: {
  port: 3000,
  proxy: {
    '/api': 'http://localhost:5000'
  }
}
```

## 🎨 UI Components Used

- Bootstrap 5 Cards
- Bootstrap Tables
- Bootstrap Badges
- Bootstrap Buttons
- Bootstrap Alerts
- Bootstrap Forms
- Bootstrap Icons (CDN)
- Custom CSS animations

## 🔄 State Management

### Pinia Store (auth)
- `user`: Current user object
- `token`: JWT token
- `isAuthenticated`: Boolean computed property
- `isNurse`: Role check computed property
- `isPatient`: Role check computed property
- `login()`: Login action
- `logout()`: Logout action

## 🛣️ Routes

| Path | Component | Auth | Role |
|------|-----------|------|------|
| `/login` | LoginView | No | - |
| `/` | Redirect to /login | No | - |
| `/patients` | PatientListView | Yes | Nurse |
| `/patients/:id` | PatientDetailView | Yes | Nurse or Self |

---

This structure provides a complete, production-ready medical application with authentication, role-based access, and barcode verification!
