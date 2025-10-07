<template>
  <div class="login-container">
    <div class="row justify-content-center w-100">
      <div class="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
        <div class="card shadow-lg">
          <div class="card-body p-4 p-md-5">
            <div class="text-center mb-4">
              <i class="bi bi-hospital-fill text-primary d-block mb-3" style="font-size: 3.5rem;"></i>
              <h2 class="card-title h3 h-md-2 mb-2">Ιατρική Εφαρμογή</h2>
              <p class="text-muted small">Medical Application</p>
            </div>

            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="username" class="form-label">Όνομα Χρήστη</label>
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  v-model="username"
                  required
                  placeholder="Εισάγετε το όνομα χρήστη"
                  :disabled="loading"
                />
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Κωδικός Πρόσβασης</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  required
                  placeholder="Εισάγετε τον κωδικό"
                  :disabled="loading"
                />
              </div>

              <div class="alert alert-danger" v-if="authStore.error">
                {{ authStore.error }}
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100"
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

            <div class="mt-3 mt-md-4 p-3 bg-light rounded">
              <small class="text-muted d-block">
                <strong>Δοκιμαστικοί Λογαριασμοί:</strong>
              </small>
              <small class="text-muted d-block mt-2">
                Νοσηλευτής: <code>nurse1</code> / <code>password123</code>
              </small>
              <small class="text-muted d-block">
                Ασθενής: <code>patient1</code> / <code>password123</code>
              </small>
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
      if (authStore.isNurse) {
        console.log('Redirecting to /patients')
        await router.push('/patients')
      } else if (authStore.isPatient) {
        console.log('Redirecting to /patients/' + authStore.user.patient_id)
        await router.push(`/patients/${authStore.user.patient_id}`)
      } else {
        console.error('Unknown user role:', authStore.user?.role)
      }
    } else {
      console.error('Login failed:', authStore.error)
    }
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.card {
  border: none;
  border-radius: 15px;
  animation: fadeInUp 0.5s ease-out;
}

.card-title {
  color: #333;
  font-weight: 600;
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
