<template>
  <div class="hospital-dashboard">
    <!-- Professional Header with Search -->
    <div class="dashboard-header">
      <div class="container-fluid">
        <div class="row align-items-center py-3">
          <div class="col-lg-4">
            <div class="welcome-section">
              <h2 class="mb-0">
                <i class="bi bi-hospital me-2"></i>
                {{ getGreeting }}
              </h2>
              <p class="text-muted mb-0">
                <i class="bi bi-person-badge me-1"></i>
                {{ authStore.user?.full_name || authStore.user?.username }}
                <span class="ms-2">|</span>
                <i class="bi bi-calendar3 ms-2 me-1"></i>
                {{ getCurrentDate }}
              </p>
            </div>
          </div>
          <div class="col-lg-5">
            <!-- Global Patient Search -->
            <div class="search-container">
              <div class="search-input-group">
                <i class="bi bi-search search-icon"></i>
                <input
                  v-model="searchQuery"
                  @input="handleSearch"
                  @focus="showSearchResults = true"
                  type="text"
                  class="form-control search-input"
                  placeholder="Αναζήτηση ασθενή (Όνομα, AMKA, AFM, Barcode)..."
                >
                <button
                  v-if="searchQuery"
                  @click="clearSearch"
                  class="btn-clear-search"
                  type="button"
                >
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>
              <!-- Search Results Dropdown -->
              <div v-if="showSearchResults && searchResults.length > 0" class="search-results">
                <div
                  v-for="patient in searchResults"
                  :key="patient._id"
                  @click="navigateToPatient(patient._id)"
                  class="search-result-item"
                >
                  <div class="result-avatar">
                    <img 
                      v-if="patient.profile_image"
                      :src="patient.profile_image"
                      :alt="patient.full_name"
                    >
                    <i v-else class="bi bi-person-circle"></i>
                  </div>
                  <div class="result-info">
                    <strong>{{ patient.full_name }}</strong>
                    <div class="result-meta">
                      <span v-if="patient.barcode">
                        <i class="bi bi-upc-scan me-1"></i>{{ patient.barcode }}
                      </span>
                      <span v-if="patient.amka">
                        <i class="bi bi-credit-card me-1"></i>{{ patient.amka }}
                      </span>
                    </div>
                  </div>
                  <i class="bi bi-arrow-right-circle result-arrow"></i>
                </div>
              </div>
              <div v-else-if="showSearchResults && searchQuery && searchResults.length === 0" class="search-results">
                <div class="no-results">
                  <i class="bi bi-search"></i>
                  <p>Δεν βρέθηκαν ασθενείς</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-3 text-end">
            <div class="header-info">
              <div class="live-status">
                <span class="pulse-dot"></span>
                <span>LIVE {{ getCurrentTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid mt-4">
      <!-- Real-Time Statistics Cards -->
      <div class="row g-3 mb-4">
        <div class="col-xl-3 col-md-6">
          <div class="stat-card stat-primary">
            <div class="stat-icon">
              <i class="bi bi-people-fill"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ isLoading ? '...' : stats.totalPatients }}</h3>
              <p class="stat-label">Σύνολο Ασθενών</p>
              <div class="stat-trend positive">
                <i class="bi bi-arrow-up"></i>
                <span>Ενεργοί: {{ stats.activePatients }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6">
          <div class="stat-card stat-warning">
            <div class="stat-icon">
              <i class="bi bi-clock-history"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ isLoading ? '...' : stats.pendingMedications }}</h3>
              <p class="stat-label">Εκκρεμή Φάρμακα</p>
              <div class="stat-trend">
                <i class="bi bi-hourglass-split"></i>
                <span>Προς Χορήγηση</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6">
          <div class="stat-card stat-success">
            <div class="stat-icon">
              <i class="bi bi-check-circle-fill"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ isLoading ? '...' : stats.completedToday }}</h3>
              <p class="stat-label">Ολοκληρώθηκαν Σήμερα</p>
              <div class="stat-trend positive">
                <i class="bi bi-graph-up"></i>
                <span>{{ stats.completionRate }}% Success Rate</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6">
          <div class="stat-card stat-danger" :class="{ 'alert-pulse': stats.criticalAlerts > 0 }">
            <div class="stat-icon">
              <i class="bi bi-exclamation-triangle-fill"></i>
              <span v-if="stats.criticalAlerts > 0" class="alert-badge">{{ stats.criticalAlerts }}</span>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ isLoading ? '...' : stats.criticalAlerts }}</h3>
              <p class="stat-label">Κρίσιμες Ειδοποιήσεις</p>
              <div class="stat-trend" :class="stats.criticalAlerts > 0 ? 'negative' : ''">
                <i :class="stats.criticalAlerts > 0 ? 'bi bi-exclamation-circle' : 'bi bi-shield-check'"></i>
                <span>{{ stats.criticalAlerts > 0 ? 'Απαιτείται Προσοχή' : 'Όλα Εντάξει' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="row mb-4" v-if="authStore.user?.role === 'nurse'">
        <div class="col-12">
          <div class="quick-actions-section">
            <h4 class="section-title">
              <i class="bi bi-lightning-charge-fill me-2"></i>
              Γρήγορες Ενέργειες
            </h4>
            <div class="quick-actions-grid">
              <router-link to="/medication-safety" class="action-button action-primary">
                <div class="action-icon">
                  <i class="bi bi-shield-fill-check"></i>
                </div>
                <div class="action-content">
                  <h5>Χορήγηση Φαρμάκων</h5>
                  <p>Έναρξη ασφαλούς χορήγησης</p>
                </div>
                <i class="bi bi-arrow-right-circle action-arrow"></i>
              </router-link>

              <router-link to="/patients" class="action-button action-info">
                <div class="action-icon">
                  <i class="bi bi-people-fill"></i>
                </div>
                <div class="action-content">
                  <h5>Λίστα Ασθενών</h5>
                  <p>Προβολή όλων των ασθενών</p>
                </div>
                <i class="bi bi-arrow-right-circle action-arrow"></i>
              </router-link>

              <router-link to="/patient-barcodes" class="action-button action-success">
                <div class="action-icon">
                  <i class="bi bi-upc-scan"></i>
                </div>
                <div class="action-content">
                  <h5>Barcodes Ασθενών</h5>
                  <p>Εκτύπωση & διαχείριση</p>
                </div>
                <i class="bi bi-arrow-right-circle action-arrow"></i>
              </router-link>

              <router-link to="/barcodes" class="action-button action-warning">
                <div class="action-icon">
                  <i class="bi bi-qr-code-scan"></i>
                </div>
                <div class="action-content">
                  <h5>Γεννήτρια Barcodes</h5>
                  <p>Δημιουργία νέων codes</p>
                </div>
                <i class="bi bi-arrow-right-circle action-arrow"></i>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3">
        <!-- Recent Activity Timeline -->
        <div class="col-lg-8">
          <div class="activity-card">
            <div class="card-header">
              <h4 class="mb-0">
                <i class="bi bi-clock-history me-2"></i>
                Πρόσφατες Δραστηριότητες
                <span class="live-badge ms-2">LIVE</span>
              </h4>
            </div>
            <div class="card-body">
              <div v-if="recentActivities.length === 0" class="no-activity">
                <i class="bi bi-inbox"></i>
                <p>Δεν υπάρχουν πρόσφατες δραστηριότητες</p>
              </div>
              <div v-else class="activity-timeline">
                <div
                  v-for="(activity, index) in recentActivities"
                  :key="index"
                  class="activity-item"
                  :class="'activity-' + activity.type"
                >
                  <div class="activity-marker">
                    <i :class="activity.icon"></i>
                  </div>
                  <div class="activity-content">
                    <div class="activity-header">
                      <strong>{{ activity.title }}</strong>
                      <span class="activity-time">{{ activity.time }}</span>
                    </div>
                    <p class="activity-description">{{ activity.description }}</p>
                    <div v-if="activity.patient" class="activity-meta">
                      <i class="bi bi-person me-1"></i>{{ activity.patient }}
                    </div>
                  </div>
                  <div class="activity-status">
                    <i :class="activity.statusIcon" :style="{ color: activity.statusColor }"></i>
                  </div>
                </div>
              </div>
              <div class="card-footer text-center">
                <button @click="refreshActivities" class="btn btn-outline-primary btn-sm">
                  <i class="bi bi-arrow-clockwise me-1"></i>
                  Ανανέωση
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Critical Alerts & System Status -->
        <div class="col-lg-4">
          <!-- Critical Alerts -->
          <div class="alerts-card mb-3" v-if="criticalAlerts.length > 0">
            <div class="card-header bg-danger text-white">
              <h5 class="mb-0">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                Κρίσιμες Ειδοποιήσεις
                <span class="badge bg-white text-danger ms-2">{{ criticalAlerts.length }}</span>
              </h5>
            </div>
            <div class="card-body p-0">
              <div class="alert-list">
                <div
                  v-for="(alert, index) in criticalAlerts"
                  :key="index"
                  class="alert-item"
                  :class="'alert-level-' + alert.level"
                >
                  <div class="alert-icon">
                    <i :class="alert.icon"></i>
                  </div>
                  <div class="alert-content">
                    <strong>{{ alert.title }}</strong>
                    <p>{{ alert.message }}</p>
                    <small>{{ alert.time }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- System Status -->
          <div class="system-card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-gear-fill me-2"></i>
                Κατάσταση Συστήματος
              </h5>
            </div>
            <div class="card-body">
              <div class="system-status-list">
                <div class="status-item">
                  <div class="status-icon status-online">
                    <i class="bi bi-server"></i>
                  </div>
                  <div class="status-info">
                    <span class="status-name">Backend Server</span>
                    <span class="status-value">Online</span>
                  </div>
                  <div class="status-indicator online"></div>
                </div>

                <div class="status-item">
                  <div class="status-icon status-online">
                    <i class="bi bi-database"></i>
                  </div>
                  <div class="status-info">
                    <span class="status-name">Database</span>
                    <span class="status-value">Connected</span>
                  </div>
                  <div class="status-indicator online"></div>
                </div>

                <div class="status-item">
                  <div class="status-icon status-secure">
                    <i class="bi bi-shield-lock-fill"></i>
                  </div>
                  <div class="status-info">
                    <span class="status-name">Security</span>
                    <span class="status-value">Secure</span>
                  </div>
                  <div class="status-indicator secure"></div>
                </div>

                <div class="status-item">
                  <div class="status-icon status-online">
                    <i class="bi bi-broadcast"></i>
                  </div>
                  <div class="status-info">
                    <span class="status-name">Real-Time Sync</span>
                    <span class="status-value">{{ socketConnected ? 'Connected' : 'Disconnected' }}</span>
                  </div>
                  <div class="status-indicator" :class="socketConnected ? 'online' : 'offline'"></div>
                </div>
              </div>

              <!-- Testing Controls for Nurses -->
              <div v-if="authStore.user?.role === 'nurse'" class="testing-section mt-3">
                <div class="alert alert-info mb-2">
                  <i class="bi bi-info-circle me-2"></i>
                  <small><strong>Εργαλεία Δοκιμών</strong></small>
                </div>
                <button
                  @click="resetMedications"
                  :disabled="resettingMedications"
                  class="btn btn-outline-warning btn-sm w-100"
                >
                  <i class="bi bi-arrow-counterclockwise me-2"></i>
                  {{ resettingMedications ? 'Επαναφορά...' : 'Επαναφορά Φαρμάκων' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Shift Information (Nurse Only) -->
      <div class="row mt-4" v-if="authStore.user?.role === 'nurse'">
        <div class="col-12">
          <div class="shift-info-card">
            <div class="shift-header">
              <h5>
                <i class="bi bi-clock me-2"></i>
                Πληροφορίες Βάρδιας
              </h5>
            </div>
            <div class="shift-body">
              <div class="shift-stat">
                <i class="bi bi-calendar-check"></i>
                <div>
                  <strong>Σημερινή Βάρδια</strong>
                  <p>{{ getCurrentShift }}</p>
                </div>
              </div>
              <div class="shift-stat">
                <i class="bi bi-stopwatch"></i>
                <div>
                  <strong>Διάρκεια</strong>
                  <p>{{ getShiftDuration }}</p>
                </div>
              </div>
              <div class="shift-stat">
                <i class="bi bi-check2-square"></i>
                <div>
                  <strong>Ολοκληρώθηκαν</strong>
                  <p>{{ stats.completedToday }} / {{ stats.totalToday }} ενέργειες</p>
                </div>
              </div>
              <div class="shift-stat">
                <i class="bi bi-person-badge"></i>
                <div>
                  <strong>Υπεύθυνος</strong>
                  <p>{{ authStore.user?.full_name }}</p>
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'
import socketService from '../services/socket'

const router = useRouter()
const authStore = useAuthStore()

// State
const isLoading = ref(true)
const searchQuery = ref('')
const showSearchResults = ref(false)
const searchResults = ref([])
const socketConnected = ref(false)
const resettingMedications = ref(false)

const stats = ref({
  totalPatients: 0,
  activePatients: 0,
  pendingMedications: 0,
  completedToday: 0,
  criticalAlerts: 0,
  completionRate: 0,
  totalToday: 0
})

const recentActivities = ref([])
const criticalAlerts = ref([])

// Computed Properties
const getGreeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Καλημέρα'
  if (hour < 18) return 'Καλό Απόγευμα'
  return 'Καλησπέρα'
})

const getCurrentDate = computed(() => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return new Date().toLocaleDateString('el-GR', options)
})

const getCurrentTime = computed(() => {
  return new Date().toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })
})

const getCurrentShift = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 7 && hour < 15) return 'Πρωινή Βάρδια (07:00 - 15:00)'
  if (hour >= 15 && hour < 23) return 'Απογευματινή Βάρδια (15:00 - 23:00)'
  return 'Νυχτερινή Βάρδια (23:00 - 07:00)'
})

const getShiftDuration = computed(() => {
  const hour = new Date().getHours()
  const minute = new Date().getMinutes()
  
  let shiftStart, shiftEnd
  if (hour >= 7 && hour < 15) {
    shiftStart = 7
    shiftEnd = 15
  } else if (hour >= 15 && hour < 23) {
    shiftStart = 15
    shiftEnd = 23
  } else {
    shiftStart = 23
    shiftEnd = 7
  }
  
  const elapsed = hour >= shiftStart ? hour - shiftStart : (24 - shiftStart) + hour
  const remaining = shiftEnd > shiftStart ? shiftEnd - hour : (24 - hour) + shiftEnd
  
  return `Ώρα ${elapsed}η από 8ωρο`
})

// Methods
const loadDashboardData = async () => {
  isLoading.value = true
  try {
    // Load patients with instructions in one API call
    const patientsResponse = await api.get('/patients/with-instructions')
    const patients = patientsResponse.data || []
    stats.value.totalPatients = patients.length
    stats.value.activePatients = patients.filter(p => p.medical_instructions?.length > 0).length

    // Flatten all medical instructions from all patients
    let allInstructions = []
    for (const patient of patients) {
      if (patient.medical_instructions && patient.medical_instructions.length > 0) {
        const instructionsWithPatient = patient.medical_instructions.map(inst => ({
          ...inst,
          patientName: patient.full_name,
          patientId: patient._id || patient.id
        }))
        allInstructions = [...allInstructions, ...instructionsWithPatient]
      }
    }

    // Calculate medication stats
    const today = new Date().toISOString().split('T')[0]
    
    // Status is 'Pending' or 'Completed' (capitalized)
    stats.value.pendingMedications = allInstructions.filter(inst => 
      inst.status && inst.status.toLowerCase() === 'pending'
    ).length
    
    stats.value.completedToday = allInstructions.filter(inst => {
      if (!inst.status || inst.status.toLowerCase() !== 'completed' || !inst.completed_at) return false
      const completedDate = new Date(inst.completed_at).toISOString().split('T')[0]
      return completedDate === today
    }).length
    
    // Total today = all instructions (since we don't have scheduled_time in this schema)
    stats.value.totalToday = allInstructions.length

    // Calculate completion rate
    if (stats.value.totalToday > 0) {
      stats.value.completionRate = Math.round((stats.value.completedToday / stats.value.totalToday) * 100)
    }

    // Find critical alerts (for now, just show pending items older than 1 day)
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const criticalInstructions = allInstructions.filter(inst => {
      if (!inst.status || inst.status.toLowerCase() !== 'pending') return false
      const createdTime = new Date(inst.created_at)
      return createdTime < oneDayAgo // Older than 1 day
    })
    stats.value.criticalAlerts = criticalInstructions.length

    // Generate critical alerts
    criticalAlerts.value = criticalInstructions.slice(0, 5).map(inst => ({
      level: 'critical',
      icon: 'bi bi-exclamation-triangle-fill',
      title: 'Εκκρεμής Ιατρική Οδηγία',
      message: `${inst.patientName} - ${inst.description}`,
      time: formatTimeAgo(inst.created_at)
    }))

    // Generate recent activities
    const completedInstructions = allInstructions
      .filter(inst => inst.status && inst.status.toLowerCase() === 'completed' && inst.completed_at)
      .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
      .slice(0, 10)

    recentActivities.value = completedInstructions.map(inst => ({
      type: 'medication',
      icon: 'bi bi-capsule',
      title: 'Ολοκληρώθηκε Ιατρική Οδηγία',
      description: inst.description,
      patient: inst.patientName,
      time: formatTimeAgo(inst.completed_at),
      statusIcon: 'bi bi-check-circle-fill',
      statusColor: '#28a745'
    }))

  } catch (error) {
    console.error('Error loading dashboard data:', error)
    // Set default values on error
    stats.value = {
      totalPatients: 0,
      activePatients: 0,
      pendingMedications: 0,
      completedToday: 0,
      criticalAlerts: 0,
      completionRate: 0,
      totalToday: 0
    }
    recentActivities.value = []
    criticalAlerts.value = []
  } finally {
    isLoading.value = false
  }
}

const handleSearch = async () => {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }

  try {
    const response = await api.get('/patients')
    const patients = response.data
    
    const query = searchQuery.value.toLowerCase()
    searchResults.value = patients.filter(patient => {
      return (
        patient.full_name?.toLowerCase().includes(query) ||
        patient.amka?.toLowerCase().includes(query) ||
        patient.afm?.toLowerCase().includes(query) ||
        patient.barcode?.toLowerCase().includes(query)
      )
    }).slice(0, 5)
  } catch (error) {
    console.error('Error searching patients:', error)
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  showSearchResults.value = false
}

const navigateToPatient = (patientId) => {
  clearSearch()
  router.push(`/patients/${patientId}`)
}

const refreshActivities = () => {
  loadDashboardData()
}

const resetMedications = async () => {
  if (!confirm('Είστε σίγουροι ότι θέλετε να επαναφέρετε όλα τα φάρμακα σε κατάσταση "Εκκρεμή";')) {
    return
  }

  resettingMedications.value = true
  try {
    const patientsResponse = await api.get('/patients')
    const patients = patientsResponse.data

    for (const patient of patients) {
      const instructionsResponse = await api.get(`/patients/${patient._id}/instructions`)
      const instructions = instructionsResponse.data

      for (const instruction of instructions) {
        await api.put(`/patients/${patient._id}/instructions/${instruction._id}`, {
          status: 'pending',
          administered_at: null,
          administered_by: null
        })
      }
    }

    alert('Όλα τα φάρμακα επαναφέρθηκαν σε κατάσταση "Εκκρεμή"')
    await loadDashboardData()
  } catch (error) {
    console.error('Error resetting medications:', error)
    alert('Σφάλμα κατά την επαναφορά των φαρμάκων')
  } finally {
    resettingMedications.value = false
  }
}

const formatTimeAgo = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diff = now - time
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `πριν ${days} μέρα${days > 1 ? 'ς' : ''}`
  if (hours > 0) return `πριν ${hours} ώρα${hours > 1 ? 'ς' : ''}`
  if (minutes > 0) return `πριν ${minutes} λεπτό${minutes > 1 ? '' : ''}`
  return 'μόλις τώρα'
}

// Socket.IO Event Listeners
const setupSocketListeners = () => {
  socketConnected.value = socketService.isConnected()

  // Listen for medication completed
  socketService.on('medication-completed', () => {
    console.log('📡 Dashboard: Medication completed - refreshing data')
    loadDashboardData()
  })

  // Listen for medication scanned
  socketService.on('medication-scanned', () => {
    console.log('📡 Dashboard: Medication scanned - refreshing data')
    loadDashboardData()
  })

  // Listen for patient selected
  socketService.on('patient-selected', () => {
    console.log('📡 Dashboard: Patient selected - refreshing data')
    loadDashboardData()
  })
}

// Click outside to close search
const handleClickOutside = (event) => {
  if (!event.target.closest('.search-container')) {
    showSearchResults.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadDashboardData()
  setupSocketListeners()
  document.addEventListener('click', handleClickOutside)

  // Auto-refresh every 30 seconds
  const refreshInterval = setInterval(() => {
    loadDashboardData()
  }, 30000)

  onBeforeUnmount(() => {
    clearInterval(refreshInterval)
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<style scoped>
/* Professional Hospital Dashboard Styles */
.hospital-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* Header */
.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.welcome-section h2 {
  font-size: 1.8rem;
  font-weight: 700;
}

.welcome-section p {
  font-size: 0.95rem;
  opacity: 0.9;
}

/* Global Search */
.search-container {
  position: relative;
}

.search-input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 15px;
  color: #6c757d;
  font-size: 1.1rem;
  z-index: 1;
}

.search-input {
  padding: 12px 45px 12px 45px;
  border-radius: 50px;
  border: none;
  font-size: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-input:focus {
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  outline: none;
}

.btn-clear-search {
  position: absolute;
  right: 10px;
  background: transparent;
  border: none;
  color: #6c757d;
  padding: 5px 10px;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-clear-search:hover {
  color: #dc3545;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  margin-top: 8px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.search-result-item:hover {
  background: #f8f9fa;
}

.search-result-item:last-child {
  border-bottom: none;
}

.result-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e9ecef;
}

.result-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.result-avatar i {
  font-size: 2rem;
  color: #6c757d;
}

.result-info {
  flex: 1;
}

.result-info strong {
  display: block;
  font-size: 1rem;
  color: #212529;
}

.result-meta {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 2px;
}

.result-meta span {
  margin-right: 12px;
}

.result-arrow {
  font-size: 1.2rem;
  color: #667eea;
}

.no-results {
  padding: 40px;
  text-align: center;
  color: #6c757d;
}

.no-results i {
  font-size: 3rem;
  margin-bottom: 10px;
  opacity: 0.5;
}

/* Live Status */
.live-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: 600;
}

.pulse-dot {
  width: 10px;
  height: 10px;
  background: #28a745;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.1); }
}

/* Statistics Cards */
.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
}

.stat-primary::before { background: #667eea; }
.stat-warning::before { background: #ffc107; }
.stat-success::before { background: #28a745; }
.stat-danger::before { background: #dc3545; }

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: white;
  position: relative;
}

.stat-primary .stat-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-warning .stat-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.stat-success .stat-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.stat-danger .stat-icon { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
  line-height: 1;
}

.stat-label {
  color: #6c757d;
  font-size: 0.95rem;
  margin-top: 4px;
  display: block;
}

.stat-trend {
  margin-top: 8px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6c757d;
}

.stat-trend.positive { color: #28a745; }
.stat-trend.negative { color: #dc3545; }

.alert-pulse {
  animation: alertPulse 2s infinite;
}

@keyframes alertPulse {
  0%, 100% { box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3); }
  50% { box-shadow: 0 4px 25px rgba(220, 53, 69, 0.6); }
}

.alert-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  border: 2px solid white;
}

/* Quick Actions */
.quick-actions-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #212529;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.action-button:hover {
  transform: translateX(5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  border-color: transparent;
}

.action-primary:hover { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
.action-info:hover { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; }
.action-success:hover { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; }
.action-warning:hover { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; }

.action-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: #f8f9fa;
  color: #667eea;
  transition: all 0.3s;
}

.action-button:hover .action-icon {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.action-content {
  flex: 1;
}

.action-content h5 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #212529;
  transition: color 0.3s;
}

.action-content p {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 0;
  transition: color 0.3s;
}

.action-button:hover .action-content h5,
.action-button:hover .action-content p {
  color: white;
}

.action-arrow {
  font-size: 1.5rem;
  color: #667eea;
  transition: all 0.3s;
}

.action-button:hover .action-arrow {
  color: white;
  transform: translateX(5px);
}

/* Activity Timeline */
.activity-card,
.alerts-card,
.system-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 2px solid #f0f0f0;
}

.card-header h4,
.card-header h5 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #212529;
}

.live-badge {
  display: inline-block;
  background: #28a745;
  color: white;
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
}

.card-body {
  padding: 24px;
}

.no-activity {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}

.no-activity i {
  font-size: 3rem;
  margin-bottom: 10px;
  opacity: 0.3;
}

.activity-timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s;
}

.activity-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.activity-marker {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.activity-header strong {
  font-size: 1rem;
  color: #212529;
}

.activity-time {
  font-size: 0.8rem;
  color: #6c757d;
}

.activity-description {
  font-size: 0.9rem;
  color: #495057;
  margin: 0 0 8px 0;
}

.activity-meta {
  font-size: 0.85rem;
  color: #6c757d;
}

.activity-status {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
}

.card-footer {
  padding: 16px 24px;
  border-top: 2px solid #f0f0f0;
}

/* Critical Alerts */
.alert-list {
  max-height: 300px;
  overflow-y: auto;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}

.alert-item:hover {
  background: #fff5f5;
}

.alert-item:last-child {
  border-bottom: none;
}

.alert-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fee;
  color: #dc3545;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-content strong {
  display: block;
  font-size: 0.95rem;
  color: #212529;
  margin-bottom: 4px;
}

.alert-content p {
  font-size: 0.85rem;
  color: #495057;
  margin: 0 0 4px 0;
}

.alert-content small {
  font-size: 0.75rem;
  color: #6c757d;
}

/* System Status */
.system-status-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.status-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.status-online {
  background: #d4edda;
  color: #28a745;
}

.status-secure {
  background: #d1ecf1;
  color: #17a2b8;
}

.status-info {
  flex: 1;
}

.status-name {
  display: block;
  font-size: 0.9rem;
  color: #212529;
  font-weight: 600;
}

.status-value {
  display: block;
  font-size: 0.8rem;
  color: #6c757d;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-indicator.online {
  background: #28a745;
  box-shadow: 0 0 10px rgba(40, 167, 69, 0.5);
}

.status-indicator.secure {
  background: #17a2b8;
  box-shadow: 0 0 10px rgba(23, 162, 184, 0.5);
}

.status-indicator.offline {
  background: #dc3545;
  box-shadow: 0 0 10px rgba(220, 53, 69, 0.5);
}

/* Testing Section */
.testing-section {
  padding-top: 16px;
  border-top: 2px solid #f0f0f0;
}

/* Shift Information */
.shift-info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.shift-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.shift-header h5 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
}

.shift-body {
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.shift-stat {
  display: flex;
  align-items: center;
  gap: 12px;
}

.shift-stat i {
  font-size: 2rem;
  opacity: 0.9;
}

.shift-stat strong {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 4px;
  opacity: 0.9;
}

.shift-stat p {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-header .row {
    text-align: center;
  }

  .welcome-section h2 {
    font-size: 1.4rem;
  }

  .search-input {
    font-size: 0.9rem;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }

  .stat-number {
    font-size: 1.8rem;
  }

  .quick-actions-grid {
    grid-template-columns: 1fr;
  }

  .action-button {
    padding: 16px;
  }

  .shift-body {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .stat-card {
    flex-direction: column;
    text-align: center;
  }

  .action-button {
    flex-direction: column;
    text-align: center;
  }

  .action-arrow {
    display: none;
  }
}
</style>
