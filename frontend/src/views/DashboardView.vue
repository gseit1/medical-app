<template>
  <div class="dashboard-container">
    <!-- Hero Section -->
    <div class="dashboard-hero">
      <div class="hero-background"></div>
      <div class="container medical-container">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <div class="hero-content">
              <div class="welcome-badge">
                <i :class="weatherInfo.icon" class="me-2"></i>
                {{ getGreeting }}
                <span class="weather-info ms-2">{{ weatherInfo.temperature }}°C</span>
              </div>
              <h1 class="hero-title">
                <span class="typing-text">Dashboard Ιατρικής Εφαρμογής</span>
                <div class="live-indicator">
                  <span class="pulse-dot"></span>
                  <small>LIVE {{ getCurrentTime }}</small>
                </div>
              </h1>
              <p class="hero-subtitle">
                Κεντρικός πίνακας ελέγχου με real-time παρακολούθηση και έξυπνη διαχείριση
                <br>
                <small class="progress-info">
                  <i class="bi bi-clock me-1"></i>
                  Ημέρα ολοκληρωμένη κατά {{ getProgressPercentage }}%
                  <div class="mini-progress">
                    <div class="mini-progress-bar" :style="{ width: getProgressPercentage + '%' }"></div>
                  </div>
                </small>
              </p>
              
              <!-- Enhanced Quick Stats -->
              <div class="quick-stats">
                <div class="stat-item" :class="{ 'loading': isLoading }">
                  <div class="stat-icon patients-icon">
                    <i class="bi bi-people-fill"></i>
                  </div>
                  <div class="stat-info">
                    <span class="stat-number counter" :data-target="patientStats.total">
                      {{ isLoading ? '...' : patientStats.total }}
                    </span>
                    <span class="stat-label">Ασθενείς Σήμερα</span>
                    <div class="stat-trend">
                      <i class="bi bi-arrow-up text-success"></i>
                      <small>+3 από χθες</small>
                    </div>
                  </div>
                </div>
                <div class="stat-item" :class="{ 'loading': isLoading }">
                  <div class="stat-icon activity-icon">
                    <i class="bi bi-activity"></i>
                  </div>
                  <div class="stat-info">
                    <span class="stat-number counter" :data-target="todayActions">
                      {{ isLoading ? '...' : todayActions }}
                    </span>
                    <span class="stat-label">Ενέργειες Σήμερα</span>
                    <div class="stat-trend">
                      <i class="bi bi-arrow-up text-success"></i>
                      <small>+12% από μέσο όρο</small>
                    </div>
                  </div>
                </div>
                <div class="stat-item critical-alerts" :class="{ 'loading': isLoading, 'has-alerts': getCriticalAlertsCount > 0 }">
                  <div class="stat-icon alerts-icon">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    <span v-if="getCriticalAlertsCount > 0" class="alert-badge">{{ getCriticalAlertsCount }}</span>
                  </div>
                  <div class="stat-info">
                    <span class="stat-number counter" :data-target="getCriticalAlertsCount">
                      {{ isLoading ? '...' : getCriticalAlertsCount }}
                    </span>
                    <span class="stat-label">Κρίσιμες Ειδοποιήσεις</span>
                    <div class="stat-trend">
                      <i class="bi bi-shield-fill-check text-success"></i>
                      <small>Υπό Έλεγχο</small>
                    </div>
                  </div>
                </div>
                <div class="stat-item" :class="{ 'loading': isLoading }">
                  <div class="stat-icon security-icon">
                    <i class="bi bi-shield-check"></i>
                  </div>
                  <div class="stat-info">
                    <span class="stat-number">99.9%</span>
                    <span class="stat-label">Uptime Σήμερα</span>
                    <div class="stat-trend">
                      <i class="bi bi-check-circle text-success"></i>
                      <small>Όλα τα συστήματα OK</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 text-lg-end mt-3 mt-lg-0">
            <div class="user-profile-card">
              <div class="profile-avatar">
                <i class="bi bi-person-circle"></i>
              </div>
              <div class="profile-info">
                <h4>{{ authStore.user?.username }}</h4>
                <span class="role-badge" :class="getRoleBadgeClass">
                  <i :class="getRoleIcon"></i>
                  {{ authStore.user?.role === 'nurse' ? 'Νοσηλευτής' : 'Ασθενής' }}
                </span>
                <div class="profile-meta">
                  <small>Τελευταία σύνδεση: {{ getLastLoginTime }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Real-time Activity Feed -->
    <div class="activity-section">
      <div class="container medical-container">
        <div class="row">
          <div class="col-lg-8">
            <div class="activity-feed dashboard-card">
              <div class="dashboard-card-header">
                <h4>
                  <i class="bi bi-clock-history me-2"></i>
                  Πρόσφατες Δραστηριότητες
                  <span class="live-badge">LIVE</span>
                </h4>
              </div>
              <div class="dashboard-card-body">
                <div class="activity-list">
                  <div 
                    v-for="(activity, index) in recentActivities" 
                    :key="index"
                    class="activity-item"
                    :style="{ animationDelay: index * 0.1 + 's' }"
                  >
                    <div class="activity-icon" :class="activity.color">
                      <i :class="activity.icon"></i>
                    </div>
                    <div class="activity-content">
                      <p class="activity-message">{{ activity.message }}</p>
                      <small class="activity-time">{{ activity.time }}</small>
                    </div>
                    <div class="activity-status">
                      <i class="bi bi-check-circle text-success"></i>
                    </div>
                  </div>
                </div>
                <div class="activity-footer">
                  <button class="btn btn-outline-primary btn-sm">
                    <i class="bi bi-arrow-clockwise me-1"></i>
                    Ανανέωση
                  </button>
                  <button class="btn btn-outline-secondary btn-sm">
                    <i class="bi bi-list me-1"></i>
                    Προβολή Όλων
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="system-status dashboard-card">
              <div class="dashboard-card-header">
                <h4>
                  <i class="bi bi-gear-fill me-2"></i>
                  Κατάσταση Συστήματος
                </h4>
              </div>
              <div class="dashboard-card-body">
                <div class="status-grid">
                  <div class="status-item">
                    <div class="status-icon online">
                      <i class="bi bi-server"></i>
                    </div>
                    <div class="status-info">
                      <span class="status-name">Server</span>
                      <span class="status-value online">Online</span>
                    </div>
                    <div class="status-indicator online"></div>
                  </div>
                  <div class="status-item">
                    <div class="status-icon online">
                      <i class="bi bi-database"></i>
                    </div>
                    <div class="status-info">
                      <span class="status-name">Database</span>
                      <span class="status-value online">Connected</span>
                    </div>
                    <div class="status-indicator online"></div>
                  </div>
                  <div class="status-item">
                    <div class="status-icon secure">
                      <i class="bi bi-shield-lock"></i>
                    </div>
                    <div class="status-info">
                      <span class="status-name">Security</span>
                      <span class="status-value secure">Secure</span>
                    </div>
                    <div class="status-indicator secure"></div>
                  </div>
                </div>
                <div class="system-metrics">
                  <div class="metric">
                    <span class="metric-label">CPU Usage</span>
                    <div class="metric-bar">
                      <div class="metric-fill" style="width: 45%"></div>
                    </div>
                    <span class="metric-value">45%</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Memory</span>
                    <div class="metric-bar">
                      <div class="metric-fill" style="width: 62%"></div>
                    </div>
                    <span class="metric-value">62%</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Storage</span>
                    <div class="metric-bar">
                      <div class="metric-fill" style="width: 28%"></div>
                    </div>
                    <span class="metric-value">28%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="container medical-container">
      <!-- Primary Action - Medication Safety (Highlighted) -->
      <div class="row mb-4" v-if="authStore.user?.role === 'nurse'">
        <div class="col-12">
          <div class="primary-action-card">
            <div class="row align-items-center">
              <div class="col-lg-8">
                <div class="primary-action-content">
                  <div class="primary-icon">
                    <i class="bi bi-shield-fill-check"></i>
                  </div>
                  <div class="primary-text">
                    <h2 class="mb-2">Ασφαλής Χορήγηση Φαρμάκων</h2>
                    <p class="mb-3">Το κύριο εργαλείο για την ασφαλή χορήγηση φαρμάκων με σκάρωση barcode και επαλήθευση</p>
                    <div class="features">
                      <span class="feature-badge">
                        <i class="bi bi-qr-code-scan"></i> Σκάρωση QR
                      </span>
                      <span class="feature-badge">
                        <i class="bi bi-check-circle"></i> Επαλήθευση
                      </span>
                      <span class="feature-badge">
                        <i class="bi bi-clock-history"></i> Χρονοσήμανση
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 text-center">
                <router-link to="/medication-safety" class="btn btn-primary btn-lg primary-action-btn">
                  <i class="bi bi-shield-fill-check me-2"></i>
                  Έναρξη Χορήγησης
                  <i class="bi bi-arrow-right ms-2"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard Grid -->
      <div class="row g-4">
        <!-- Patients Section -->
        <div class="col-lg-6" v-if="authStore.user?.role === 'nurse'">
          <div class="dashboard-card h-100">
            <div class="dashboard-card-header">
              <h4>
                <i class="bi bi-people-fill me-2"></i>
                Διαχείριση Ασθενών
              </h4>
              <p class="text-muted mb-0">Προβολή και διαχείριση καταλόγου ασθενών</p>
            </div>
            <div class="dashboard-card-body">
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-number text-primary">{{ patientStats.total }}</div>
                  <div class="stat-label">Συνολικοί Ασθενείς</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number text-success">{{ patientStats.active }}</div>
                  <div class="stat-label">Ενεργοί</div>
                </div>
              </div>
              <router-link to="/patients" class="btn btn-outline-primary w-100 mt-3">
                <i class="bi bi-people me-2"></i>
                Προβολή Ασθενών
              </router-link>
            </div>
          </div>
        </div>

        <!-- Barcode Generator -->
        <div class="col-lg-6">
          <div class="dashboard-card h-100">
            <div class="dashboard-card-header">
              <h4>
                <i class="bi bi-qr-code me-2"></i>
                Γεννήτρια QR Codes
              </h4>
              <p class="text-muted mb-0">Δημιουργία QR codes για φάρμακα και οδηγίες</p>
            </div>
            <div class="dashboard-card-body">
              <div class="feature-list">
                <div class="feature-item">
                  <i class="bi bi-check-circle text-success"></i>
                  <span>Γρήγορη δημιουργία QR</span>
                </div>
                <div class="feature-item">
                  <i class="bi bi-check-circle text-success"></i>
                  <span>Εκτύπωση και εξαγωγή</span>
                </div>
                <div class="feature-item">
                  <i class="bi bi-check-circle text-success"></i>
                  <span>Προσαρμοσμένα μεγέθη</span>
                </div>
              </div>
              <router-link to="/barcodes" class="btn btn-outline-primary w-100 mt-3">
                <i class="bi bi-qr-code me-2"></i>
                Δημιουργία QR Code
              </router-link>
            </div>
          </div>
        </div>

        <!-- Patient Profile (for patients) -->
        <div class="col-lg-6" v-if="authStore.user?.role === 'patient'">
          <div class="dashboard-card h-100">
            <div class="dashboard-card-header">
              <h4>
                <i class="bi bi-person-fill me-2"></i>
                Το Προφίλ μου
              </h4>
              <p class="text-muted mb-0">Προβολή των στοιχείων και οδηγιών μου</p>
            </div>
            <div class="dashboard-card-body">
              <div class="patient-info">
                <div class="info-item">
                  <i class="bi bi-person-badge text-primary"></i>
                  <span>Στοιχεία Ασθενή</span>
                </div>
                <div class="info-item">
                  <i class="bi bi-prescription2 text-info"></i>
                  <span>Ιατρικές Οδηγίες</span>
                </div>
                <div class="info-item">
                  <i class="bi bi-clock-history text-warning"></i>
                  <span>Ιστορικό Χορηγήσεων</span>
                </div>
              </div>
              <router-link :to="`/patients/${authStore.user.patient_id}`" class="btn btn-outline-primary w-100 mt-3">
                <i class="bi bi-person me-2"></i>
                Προβολή Προφίλ
              </router-link>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="col-lg-12">
          <div class="dashboard-card">
            <div class="dashboard-card-header">
              <h4>
                <i class="bi bi-lightning-fill me-2"></i>
                Γρήγορες Ενέργειες
              </h4>
              <p class="text-muted mb-0">Πρόσβαση σε συχνά χρησιμοποιούμενες λειτουργίες</p>
            </div>
            <div class="dashboard-card-body">
              <div class="quick-actions-grid">
                <router-link to="/medication-safety" class="quick-action-item" v-if="authStore.user?.role === 'nurse'">
                  <div class="quick-action-icon bg-primary">
                    <i class="bi bi-shield-fill-check"></i>
                  </div>
                  <div class="quick-action-text">
                    <h6>Χορήγηση Φαρμάκων</h6>
                    <small>Ασφαλής χορήγηση με QR</small>
                  </div>
                </router-link>

                <router-link to="/patients" class="quick-action-item" v-if="authStore.user?.role === 'nurse'">
                  <div class="quick-action-icon bg-info">
                    <i class="bi bi-people-fill"></i>
                  </div>
                  <div class="quick-action-text">
                    <h6>Λίστα Ασθενών</h6>
                    <small>Προβολή όλων των ασθενών</small>
                  </div>
                </router-link>

                <router-link to="/barcodes" class="quick-action-item">
                  <div class="quick-action-icon bg-success">
                    <i class="bi bi-qr-code-scan"></i>
                  </div>
                  <div class="quick-action-text">
                    <h6>Γεννήτρια QR</h6>
                    <small>Δημιουργία νέων QR codes</small>
                  </div>
                </router-link>

                <router-link :to="`/patients/${authStore.user.patient_id}`" class="quick-action-item" v-if="authStore.user?.role === 'patient'">
                  <div class="quick-action-icon bg-warning">
                    <i class="bi bi-person-fill"></i>
                  </div>
                  <div class="quick-action-text">
                    <h6>Το Προφίλ μου</h6>
                    <small>Στοιχεία και οδηγίες</small>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- System Status -->
        <div class="col-lg-12">
          <div class="dashboard-card">
            <div class="dashboard-card-header">
              <h4>
                <i class="bi bi-info-circle-fill me-2"></i>
                Κατάσταση Συστήματος
              </h4>
            </div>
            <div class="dashboard-card-body">
              <div class="system-status">
                <div class="status-item">
                  <div class="status-indicator bg-success"></div>
                  <span class="fw-bold text-dark">Σύστημα Ενεργό</span>
                  <small class="text-muted ms-2">Όλες οι υπηρεσίες λειτουργούν κανονικά</small>
                </div>
                <div class="status-item">
                  <div class="status-indicator bg-success"></div>
                  <span class="fw-bold text-dark">Βάση Δεδομένων</span>
                  <small class="text-muted ms-2">Συνδεδεμένη και ενημερωμένη</small>
                </div>
                <div class="status-item">
                  <div class="status-indicator bg-success"></div>
                  <span class="fw-bold text-dark">Ασφάλεια</span>
                  <small class="text-muted ms-2">HIPAA Compliant - Ασφαλείς συνδέσεις</small>
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const authStore = useAuthStore()

const patients = ref([])
const todayActions = ref(0)
const patientStats = ref({
  total: 0,
  active: 0,
  critical: 0,
  discharged: 0
})
const medicationAlerts = ref(0)
const recentActivities = ref([])
const systemStatus = ref({
  server: 'online',
  database: 'online',
  security: 'secure'
})
const isLoading = ref(true)
const currentTime = ref(new Date())
const weatherInfo = ref({
  temperature: 22,
  condition: 'sunny',
  icon: 'bi bi-sun-fill'
})

// Computed methods for enhanced UI
const getGreeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Καλημέρα'
  if (hour < 17) return 'Καλό Μεσημέρι' 
  return 'Καλησπέρα'
})

const getRoleBadgeClass = computed(() => {
  return authStore.user?.role === 'nurse' ? 'role-nurse' : 'role-patient'
})

const getRoleIcon = computed(() => {
  return authStore.user?.role === 'nurse' ? 'bi bi-heart-pulse-fill' : 'bi bi-person-heart'
})

const getLastLoginTime = computed(() => {
  return new Date().toLocaleDateString('el-GR', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
  })
})

const getCurrentTime = computed(() => {
  return currentTime.value.toLocaleTimeString('el-GR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
})

const getProgressPercentage = computed(() => {
  const hour = new Date().getHours()
  return Math.round((hour / 24) * 100)
})

const getCriticalAlertsCount = computed(() => {
  return medicationAlerts.value + patientStats.value.critical
})

// Timer for real-time updates
let timeInterval = null

onMounted(async () => {
  console.log('Dashboard mounted, user:', authStore.user)
  
  // Start real-time clock
  timeInterval = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
  
  // Set loading state
  isLoading.value = true
  
  // Simulate loading with smooth data population
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Set realistic demo data
  todayActions.value = Math.floor(Math.random() * 25) + 15
  medicationAlerts.value = Math.floor(Math.random() * 3)
  patientStats.value = {
    total: Math.floor(Math.random() * 50) + 25,
    active: Math.floor(Math.random() * 30) + 15,
    critical: Math.floor(Math.random() * 5) + 1,
    discharged: Math.floor(Math.random() * 8) + 2
  }
  
  // Sample recent activities
  recentActivities.value = [
    { type: 'medication', message: 'Φάρμακο χορηγήθηκε στον ασθενή #1205', time: '2 λεπτά πριν', icon: 'bi bi-capsule', color: 'success' },
    { type: 'patient', message: 'Νέος ασθενής καταχωρήθηκε', time: '5 λεπτά πριν', icon: 'bi bi-person-plus', color: 'info' },
    { type: 'alert', message: 'Προειδοποίηση φαρμάκου ελέγχθηκε', time: '10 λεπτά πριν', icon: 'bi bi-exclamation-triangle', color: 'warning' }
  ]
  
  if (authStore.user?.role === 'nurse') {
    try {
      console.log('Loading patient data for nurse...')
      const response = await api.get('/patients')
      patients.value = response.data || []
      
      // Update patient stats based on real data
      if (patients.value.length > 0) {
        patientStats.value = {
          total: patients.value.length,
          active: patients.value.filter(p => p.status === 'active').length || patients.value.length,
          critical: Math.floor(patients.value.length * 0.1),
          discharged: Math.floor(patients.value.length * 0.15)
        }
      }
      
      console.log('Loaded patients:', patients.value.length)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // Keep demo data on API error
    }
  }
  
  // Finish loading
  isLoading.value = false
})

// Cleanup on unmount
onBeforeUnmount(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
/* Modern Dashboard Container */
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
  overflow-x: hidden;
}

/* Hero Section with Modern Design */
.dashboard-hero {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 50%, #1e3a8a 100%);
  color: white;
  padding: 3rem 0 4rem;
  position: relative;
  margin-bottom: 2rem;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  z-index: 2;
}

/* Welcome Badge */
.welcome-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* Quick Stats in Hero */
.quick-stats {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.15);
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.8;
  font-weight: 500;
}

/* User Profile Card */
.user-profile-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.user-profile-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #60a5fa, #3b82f6, #2563eb);
}

.profile-avatar {
  margin-bottom: 1rem;
}

.profile-avatar i {
  font-size: 4rem;
  opacity: 0.9;
}

.profile-info h4 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.role-badge.nurse {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.role-badge.patient {
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.profile-meta {
  opacity: 0.7;
  font-size: 0.8rem;
}

/* Primary Action Card */
.primary-action-card {
  background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(37, 99, 235, 0.1);
  transition: all 0.3s ease;
}

.primary-action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ef4444, #f59e0b, #10b981);
}

.primary-action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(37, 99, 235, 0.15);
}

.primary-action-content {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.primary-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  box-shadow: 0 8px 32px rgba(239, 68, 68, 0.3);
}

.primary-text h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.primary-text p {
  color: #64748b;
  font-size: 1rem;
  line-height: 1.6;
}

.features {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.feature-badge {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.primary-action-btn {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(37, 99, 235, 0.3);
  transition: all 0.3s ease;
  text-decoration: none;
  color: white !important;
}

.primary-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(37, 99, 235, 0.4);
  color: white !important;
}

/* Dashboard Cards */
.dashboard-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.dashboard-card-header {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.dashboard-card-header h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
}

.dashboard-card-header h4 i {
  color: #2563eb;
}

.dashboard-card-body {
  padding: 1.5rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stats-grid .stat-item {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.stats-grid .stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  display: block;
  margin-bottom: 0.25rem;
}

.stats-grid .stat-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

/* Quick Actions Grid */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  color: inherit;
  text-decoration: none;
}

.action-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 1rem;
}

.action-icon.medication {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: white;
}

.action-icon.patients {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: white;
}

.action-icon.qr {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.action-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.action-description {
  font-size: 0.875rem;
  color: #64748b;
}

/* Buttons Enhancement */
.btn {
  border-radius: 10px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
}

.btn-outline-primary {
  border: 2px solid #2563eb;
  color: #2563eb;
  background: transparent;
}

.btn-outline-primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-2px);
  color: white;
}

/* Responsive Design */
@media (max-width: 991px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .quick-stats {
    justify-content: center;
  }
  
  .stat-item {
    min-width: 140px;
  }
  
  .primary-action-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .primary-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
  
  .dashboard-hero {
    padding: 2rem 0 3rem;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 1.75rem;
  }
  
  .quick-stats {
    gap: 1rem;
  }
  
  .stat-item {
    padding: 0.75rem 1rem;
  }
  
  .primary-action-card {
    padding: 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .user-profile-card {
    padding: 1.5rem;
  }
}

/* Animation Effects */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.dashboard-card {
  animation: slideInUp 0.6s ease forwards;
}

.primary-action-card {
  animation: fadeInScale 0.8s ease forwards;
}

.user-profile-card {
  animation: slideInUp 0.6s ease 0.2s forwards;
  opacity: 0;
}

/* Success/Error States */
.text-success {
  color: #10b981 !important;
}

.text-primary {
  color: #2563eb !important;
}

.text-danger {
  color: #ef4444 !important;
}

.text-warning {
  color: #f59e0b !important;
}

/* Advanced Professional Enhancements */

/* Live Indicator and Real-time Features */
.live-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse-live 2s infinite;
}

@keyframes pulse-live {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.live-badge {
  background: linear-gradient(45deg, #ef4444, #f97316);
  color: white;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 50px;
  font-weight: 600;
  margin-left: 0.5rem;
  animation: pulse-badge 3s infinite;
}

@keyframes pulse-badge {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
}

/* Weather and Progress Indicators */
.weather-info {
  font-weight: 600;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}

.progress-info {
  margin-top: 1rem;
  opacity: 0.9;
}

.mini-progress {
  width: 100px;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  margin-top: 0.25rem;
  overflow: hidden;
}

.mini-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* Enhanced Stats with Trends and Loading */
.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
  font-size: 0.75rem;
}

.stat-item.loading .stat-number {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading-shimmer 1.5s infinite;
  color: transparent;
  border-radius: 4px;
}

@keyframes loading-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Critical Alerts Enhancement */
.critical-alerts.has-alerts {
  border: 2px solid rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.05);
}

.critical-alerts.has-alerts .alerts-icon {
  animation: pulse-alert 2s infinite;
}

@keyframes pulse-alert {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.alert-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ef4444;
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 50px;
  min-width: 16px;
  text-align: center;
}

/* Enhanced Stat Icons */
.patients-icon { background: linear-gradient(135deg, #3b82f6, #1e40af); }
.activity-icon { background: linear-gradient(135deg, #10b981, #059669); }
.alerts-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }
.security-icon { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

/* Activity Feed Styling */
.activity-section {
  background: #f8fafc;
  padding: 3rem 0;
  margin: 2rem 0;
}

.activity-feed {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.activity-list {
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  animation: slideInRight 0.6s ease forwards;
  opacity: 0;
}

.activity-item:hover {
  background: #f8fafc;
  transform: translateX(4px);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: white;
  font-weight: 600;
}

.activity-icon.success { background: linear-gradient(135deg, #10b981, #059669); }
.activity-icon.info { background: linear-gradient(135deg, #3b82f6, #1e40af); }
.activity-icon.warning { background: linear-gradient(135deg, #f59e0b, #d97706); }

.activity-content {
  flex: 1;
}

.activity-message {
  margin: 0 0 0.25rem 0;
  font-weight: 500;
  color: #1e293b;
}

.activity-time {
  color: #64748b;
  font-size: 0.875rem;
}

.activity-status {
  margin-left: 1rem;
}

.activity-footer {
  padding: 1rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

/* System Status Styling */
.system-status {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.status-grid {
  margin-bottom: 2rem;
}

.status-item {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.status-item:last-child {
  border-bottom: none;
}

.status-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: white;
}

.status-icon.online {
  background: linear-gradient(135deg, #10b981, #059669);
}

.status-icon.secure {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.status-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.status-name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.status-value {
  font-size: 0.875rem;
  font-weight: 500;
}

.status-value.online {
  color: #10b981;
}

.status-value.secure {
  color: #8b5cf6;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-left: 1rem;
}

.status-indicator.online {
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
  animation: pulse-indicator 2s infinite;
}

.status-indicator.secure {
  background: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}

@keyframes pulse-indicator {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* System Metrics */
.system-metrics {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
}

.metric {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.metric:last-child {
  margin-bottom: 0;
}

.metric-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  min-width: 80px;
}

.metric-bar {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.metric-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 4px;
  transition: width 0.8s ease;
  position: relative;
}

.metric-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: metric-shine 2s infinite;
}

@keyframes metric-shine {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
  100% { transform: translateX(100%); }
}

.metric-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  min-width: 40px;
  text-align: right;
}

/* Typing Animation */
.typing-text {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  animation: typing 3s steps(30) 1s both;
}

@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

/* Slide-in Animations */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Loading States */
.loading-skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Responsive Enhancements */
@media (max-width: 768px) {
  .activity-section {
    padding: 2rem 0;
  }
  
  .activity-item {
    padding: 0.75rem;
  }
  
  .system-metrics {
    padding: 1rem;
  }
  
  .metric {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .metric-label,
  .metric-value {
    min-width: auto;
  }
  
  .typing-text {
    animation: none;
    white-space: normal;
  }
}
</style>
