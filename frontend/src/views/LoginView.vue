<template>
  <div class="login-container">
    <div class="row justify-content-center w-100">
      <div class="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
        <div class="medical-card fade-in">
          <div class="medical-card-body p-4 p-md-5">
            <div class="text-center mb-5">
              <div class="login-icon-container mb-4">
                <i class="bi bi-hospital-fill" style="font-size: 4rem; color: var(--medical-blue);"></i>
                <div class="icon-pulse"></div>
              </div>
              <h1 class="login-title mb-2">MedicalApp Pro</h1>
              <p class="login-subtitle">Professional Healthcare Management System</p>
              <div class="security-badges mt-3">
                <span class="badge bg-success me-2">
                  <i class="bi bi-shield-fill-check me-1"></i>Secure
                </span>
                <span class="badge bg-info">
                  <i class="bi bi-lock-fill me-1"></i>HIPAA Compliant
                </span>
              </div>
            </div>

            <form @submit.prevent="handleLogin" class="login-form">
              <div class="form-group mb-4">
                <label for="username" class="form-label">
                  <i class="bi bi-person-fill me-2"></i>Όνομα Χρήστη
                </label>
                <input
                  type="text"
                  class="form-control medical-input"
                  id="username"
                  v-model="username"
                  required
                  placeholder="Εισάγετε το όνομα χρήστη σας"
                  :disabled="loading"
                />
              </div>

              <div class="form-group mb-4">
                <label for="password" class="form-label">
                  <i class="bi bi-lock-fill me-2"></i>Κωδικός Πρόσβασης
                </label>
                <input
                  type="password"
                  class="form-control medical-input"
                  id="password"
                  v-model="password"
                  required
                  placeholder="Εισάγετε τον κωδικό πρόσβασης"
                  :disabled="loading"
                />
              </div>

              <div class="alert alert-danger slide-up" v-if="authStore.error">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{ authStore.error }}
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100 login-btn"
                :disabled="loading"
              >
                <span v-if="loading">
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  Σύνδεση...
                </span>
                <span v-else>
                  <i class="bi bi-box-arrow-in-right"></i> Σύνδεση
                </span>
              </button>
            </form>

            <div class="demo-section">
              <div class="text-center">
                <i class="bi bi-info-circle-fill text-info me-2"></i>
                <strong>Δοκιμαστικοί Λογαριασμοί</strong>
              </div>
              <div class="demo-accounts">
                <div class="demo-account" @click="fillCredentials('nurse1', 'password123')">
                  <div class="demo-role">
                    <i class="bi bi-person-fill-check text-primary"></i>
                    <span>Νοσηλευτής</span>
                  </div>
                  <div class="demo-credentials">
                    nurse1 / password123
                  </div>
                </div>
                <div class="demo-account" @click="fillCredentials('patient1', 'password123')">
                  <div class="demo-role">
                    <i class="bi bi-person-fill text-success"></i>
                    <span>Ασθενής</span>
                  </div>
                  <div class="demo-credentials">
                    patient1 / password123
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  
  try {
    console.log('Attempting login with:', username.value)
    const success = await authStore.login(username.value, password.value)
    
    console.log('Login success:', success)
    console.log('User:', authStore.user)
    console.log('Is Nurse:', authStore.isNurse)
    console.log('Is Patient:', authStore.isPatient)
    
    if (success) {
      console.log('Login successful, redirecting to dashboard')
      await router.push('/dashboard')
    } else {
      console.error('Login failed:', authStore.error)
    }
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}

const fillCredentials = (user, pass) => {
  username.value = user
  password.value = pass
}
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, var(--medical-blue) 0%, var(--medical-blue-light) 50%, var(--medical-blue-dark) 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  position: relative;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)" /></svg>');
  opacity: 0.3;
}

.medical-card {
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-icon-container {
  position: relative;
  display: inline-block;
}

.icon-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6rem;
  height: 6rem;
  border: 2px solid var(--medical-blue-light);
  border-radius: 50%;
  animation: pulse 2s infinite;
  opacity: 0.6;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.3;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
}

.login-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #4a90e2 !important;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 1.1rem;
  margin-bottom: 0;
}

.form-control {
  padding: 0.75rem;
  border-radius: 8px;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 0.75rem;
  font-weight: 500;
  border-radius: 8px;
  transition: transform 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile Responsive */
@media (max-width: 576px) {
  .card-body {
    padding: 1.5rem !important;
  }
  
  .card-title {
    font-size: 1.5rem;
  }
}
</style>
