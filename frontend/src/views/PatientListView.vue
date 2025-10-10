<template>
  <div class="patient-list-container">
    <!-- Hero Section -->
    

    <!-- Search and Filters Section -->
    <div class="search-filters-section">
      <div class="container">
        <div class="search-card">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <div class="search-group">
                <div class="search-input-wrapper">
                  <i class="bi bi-search search-icon"></i>
                  <input 
                    v-model="searchQuery" 
                    type="text" 
                    class="form-control search-input" 
                    placeholder="Αναζήτηση ασθενή (όνομα, ΑΜΚΑ, ΑΦΜ...)"
                  >
                  <button v-if="searchQuery" @click="clearSearch" class="clear-search">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="filter-controls">
                <div class="filter-group">
                  <select v-model="sortBy" class="form-select filter-select">
                    <option value="name">Ταξινόμηση: Όνομα</option>
                    <option value="date">Ταξινόμηση: Ημερομηνία</option>
                    <option value="id">Ταξινόμηση: ID</option>
                  </select>
                  <select v-model="bloodTypeFilter" class="form-select filter-select">
                    <option value="">Όλες οι ομάδες αίματος</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="container">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner">
          <div class="medical-spinner"></div>
        </div>
        <p class="loading-text">Φόρτωση δεδομένων ασθενών...</p>
        <div class="loading-progress">
          <div class="progress-bar"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">
          <i class="bi bi-exclamation-triangle-fill"></i>
        </div>
        <h4>Σφάλμα Φόρτωσης</h4>
        <p>{{ error }}</p>
        <button @click="fetchPatients" class="btn btn-primary retry-btn">
          <i class="bi bi-arrow-clockwise me-2"></i>Προσπάθεια Ξανά
        </button>
      </div>

      <!-- Patients Table -->
      <div v-else class="patients-table-section">
        <div class="table-header">
          <div class="row align-items-center">
            <div class="col-lg-8">
              <h3 class="section-title">
                <i class="bi bi-people-fill me-2"></i>
                Κατάλογος Ασθενών
              </h3>
              <p class="section-subtitle">
                Εμφάνιση {{ filteredPatients.length }} από {{ patients.length }} ασθενείς
              </p>
            </div>
            <div class="col-lg-4 text-lg-end">
              <div class="table-actions">
                <button class="btn btn-outline-primary me-2">
                  <i class="bi bi-download me-1"></i>Εξαγωγή
                </button>
                <button class="btn btn-primary">
                  <i class="bi bi-plus-lg me-1"></i>Νέος Ασθενής
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Advanced Patients Table -->
        <div class="advanced-table-card">
          <!-- Desktop Table View -->
          <div class="table-responsive d-none d-lg-block">
            <table class="table advanced-patients-table mb-0">
              <thead>
                <tr>
                  <th class="table-header-cell">
                    <div class="header-content">
                      <i class="bi bi-hash me-1"></i>
                      ID
                    </div>
                  </th>
                  <th class="table-header-cell">
                    <div class="header-content">
                      <i class="bi bi-person me-1"></i>
                      Ασθενής
                    </div>
                  </th>
                  <th class="table-header-cell">
                    <div class="header-content">
                      <i class="bi bi-credit-card me-1"></i>
                      Α.M
                    </div>
                  </th>
                  <th class="table-header-cell">
                    <div class="header-content">
                      <i class="bi bi-card-text me-1"></i>
                      Α.Φ.Μ
                    </div>
                  </th>
                  <th class="table-header-cell">
                    <div class="header-content">
                      <i class="bi bi-droplet me-1"></i>
                      Ομάδα Αίματος
                    </div>
                  </th>
                  <th class="table-header-cell">
                    <div class="header-content">
                      <i class="bi bi-calendar me-1"></i>
                      Εγγραφή
                    </div>
                  </th>
                  <th class="table-header-cell text-center">
                    <div class="header-content">
                      <i class="bi bi-gear me-1"></i>
                      Ενέργειες
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(patient, index) in filteredPatients" :key="patient.id" 
                    class="patient-row" 
                    :style="{ animationDelay: (index * 0.1) + 's' }">
                  <td class="table-cell">
                    <div class="patient-id">
                      <span class="id-badge">{{ patient.id }}</span>
                    </div>
                  </td>
                  <td class="table-cell">
                    <div class="patient-info">
                      <div class="patient-avatar">
                        <img 
                          v-if="getPatientAvatar(patient)"
                          :src="getPatientAvatar(patient)"
                          :alt="patient.full_name"
                          class="patient-profile-image"
                        >
                        <i v-else class="bi bi-person-circle"></i>
                      </div>
                      <div class="patient-details">
                        <div class="patient-name">{{ patient.full_name }}</div>
                        <div class="patient-meta">ID: {{ patient.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="table-cell">
                    <div class="code-field">
                      <code class="amka-code">{{ patient.amka }}</code>
                      <button class="copy-btn" @click="copyToClipboard(patient.amka)">
                        <i class="bi bi-copy"></i>
                      </button>
                    </div>
                  </td>
                  <td class="table-cell">
                    <div class="code-field">
                      <code class="afm-code">{{ patient.afm }}</code>
                      <button class="copy-btn" @click="copyToClipboard(patient.afm)">
                        <i class="bi bi-copy"></i>
                      </button>
                    </div>
                  </td>
                  <td class="table-cell">
                    <span class="blood-type-badge" :class="getBloodTypeClass(patient.blood_type)">
                      <i class="bi bi-droplet-fill me-1"></i>
                      {{ patient.blood_type || 'N/A' }}
                    </span>
                  </td>
                  <td class="table-cell">
                    <div class="date-info">
                      <div class="date-primary">{{ formatDate(patient.created_at) }}</div>
                      <div class="date-secondary">{{ getRelativeTime(patient.created_at) }}</div>
                    </div>
                  </td>
                  <td class="table-cell text-center">
                    <div class="action-buttons">
                      <button class="btn btn-sm btn-outline-primary action-btn" 
                              @click="viewPatient(patient.id)"
                              title="Προβολή Λεπτομερειών">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-success action-btn" 
                              @click="viewMedications(patient.id)"
                              title="Φάρμακα">
                        <i class="bi bi-capsule"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-info action-btn" 
                              @click="viewHistory(patient.id)"
                              title="Ιστορικό">
                        <i class="bi bi-clock-history"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Card View -->
          <div class="d-lg-none mobile-patients-grid">
            <div v-for="(patient, index) in filteredPatients" :key="patient.id" 
                 class="mobile-patient-card"
                 :style="{ animationDelay: (index * 0.1) + 's' }">
              <div class="mobile-card-header">
                <div class="patient-avatar-mobile">
                  <img 
                    v-if="getPatientAvatar(patient)"
                    :src="getPatientAvatar(patient)"
                    :alt="patient.full_name"
                    class="patient-profile-image-mobile"
                  >
                  <i v-else class="bi bi-person-circle"></i>
                </div>
                <div class="patient-info-mobile">
                  <h6 class="patient-name-mobile">{{ patient.full_name }}</h6>
                  <span class="patient-id-mobile">ID: {{ patient.id }}</span>
                </div>
                <span class="blood-type-badge-mobile" :class="getBloodTypeClass(patient.blood_type)">
                  {{ patient.blood_type || 'N/A' }}
                </span>
              </div>
              
              <div class="mobile-card-body">
                <div class="patient-details-mobile">
                  <div class="detail-row">
                    <div class="detail-label">
                      <i class="bi bi-credit-card me-1"></i>
                      ΑΜΚΑ:
                    </div>
                    <div class="detail-value">
                      <code>{{ patient.amka }}</code>
                      <button class="copy-btn-mobile" @click="copyToClipboard(patient.amka)">
                        <i class="bi bi-copy"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div class="detail-row">
                    <div class="detail-label">
                      <i class="bi bi-card-text me-1"></i>
                      ΑΦΜ:
                    </div>
                    <div class="detail-value">
                      <code>{{ patient.afm }}</code>
                      <button class="copy-btn-mobile" @click="copyToClipboard(patient.afm)">
                        <i class="bi bi-copy"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div class="detail-row">
                    <div class="detail-label">
                      <i class="bi bi-calendar me-1"></i>
                      Εγγραφή:
                    </div>
                    <div class="detail-value">
                      {{ formatDate(patient.created_at) }}
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mobile-card-footer">
                <button class="btn btn-primary mobile-action-btn" @click="viewPatient(patient.id)">
                  <i class="bi bi-eye me-1"></i>Προβολή
                </button>
                <button class="btn btn-outline-success mobile-action-btn" @click="viewMedications(patient.id)">
                  <i class="bi bi-capsule me-1"></i>Φάρμακα
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !error && patients.length === 0" class="text-center py-5">
        <i class="bi bi-inbox" style="font-size: 4rem; color: #ccc;"></i>
        <p class="text-muted mt-3">Δεν βρέθηκαν ασθενείς</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const patients = ref([])
const loading = ref(true)
const error = ref(null)

// Search and filter state
const searchQuery = ref('')
const sortBy = ref('name')
const bloodTypeFilter = ref('')

// Computed properties
const activePatients = computed(() => {
  return Math.floor(patients.value.length * 0.7) // Simulated active patients
})

const filteredPatients = computed(() => {
  let filtered = [...patients.value]

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(patient => 
      patient.full_name?.toLowerCase().includes(query) ||
      patient.amka?.includes(query) ||
      patient.afm?.includes(query) ||
      patient.id?.toString().includes(query)
    )
  }

  // Apply blood type filter
  if (bloodTypeFilter.value) {
    filtered = filtered.filter(patient => 
      patient.blood_type === bloodTypeFilter.value
    )
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return (a.full_name || '').localeCompare(b.full_name || '')
      case 'date':
        return new Date(b.created_at) - new Date(a.created_at)
      case 'id':
        return a.id - b.id
      default:
        return 0
    }
  })

  return filtered
})

const fetchPatients = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await api.get('/patients')
    patients.value = response.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Σφάλμα φόρτωσης ασθενών'
    console.error('Error fetching patients:', err)
  } finally {
    loading.value = false
  }
}

const viewPatient = (patientId) => {
  router.push(`/patients/${patientId}`)
}

const viewMedications = (patientId) => {
  router.push(`/medication-safety?patient=${patientId}`)
}

const viewHistory = (patientId) => {
  // Future implementation for patient history
  console.log('View history for patient:', patientId)
}

const clearSearch = () => {
  searchQuery.value = ''
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    // You could add a toast notification here
    console.log('Copied to clipboard:', text)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Professional Patient Avatar System
const getPatientAvatar = (patient) => {
  // Generate consistent avatar based on patient ID or name
  const patientAvatars = [
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face&auto=format', // Medical professional woman
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face&auto=format', // Medical professional man
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face&auto=format', // Healthcare worker woman
    'https://images.unsplash.com/photo-1594824475968-1c6c3738ce8e?w=100&h=100&fit=crop&crop=face&auto=format', // Healthcare worker man
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format', // Professional man
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face&auto=format', // Professional woman
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format', // Business professional
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face&auto=format', // Young professional
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face&auto=format', // Business woman
    'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=100&h=100&fit=crop&crop=face&auto=format', // Senior professional
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face&auto=format', // Professional woman with glasses
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=face&auto=format', // Young man
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face&auto=format', // Professional woman
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face&auto=format', // Professional man
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face&auto=format'  // Young woman
  ]
  
  // Use patient ID to get consistent avatar
  const avatarIndex = (patient.id || 0) % patientAvatars.length
  return patientAvatars[avatarIndex]
}

const getBloodTypeClass = (bloodType) => {
  const bloodTypeClasses = {
    'A+': 'blood-a-pos',
    'A-': 'blood-a-neg', 
    'B+': 'blood-b-pos',
    'B-': 'blood-b-neg',
    'AB+': 'blood-ab-pos',
    'AB-': 'blood-ab-neg',
    'O+': 'blood-o-pos',
    'O-': 'blood-o-neg'
  }
  return bloodTypeClasses[bloodType] || 'blood-unknown'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('el-GR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getRelativeTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Σήμερα'
  if (diffDays === 1) return 'Χθες'
  if (diffDays < 7) return `${diffDays} ημέρες πριν`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} εβδομάδες πριν`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} μήνες πριν`
  return `${Math.floor(diffDays / 365)} χρόνια πριν`
}

onMounted(() => {
  fetchPatients()
})
</script>

<style scoped>
.patient-list-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow-x: hidden;
}

/* Hero Section */
.patients-hero {
  position: relative;
  padding: 80px 0 60px 0;
  background: linear-gradient(135deg, 
    #059669 0%, 
    #0891b2 50%, 
    #3b82f6 100%);
  overflow: hidden;
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-icons {
  position: absolute;
  width: 100%;
  height: 100%;
}

.medical-icon {
  position: absolute;
  color: rgba(255, 255, 255, 0.2);
  font-size: 4rem;
  animation: floatMedicalIcon 8s ease-in-out infinite;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  border-radius: 50%;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.medical-icon.icon-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.medical-icon.icon-2 {
  top: 60%;
  right: 15%;
  animation-delay: 1.5s;
}

.medical-icon.icon-3 {
  bottom: 30%;
  left: 20%;
  animation-delay: 3s;
}

.medical-icon.icon-4 {
  top: 40%;
  right: 30%;
  animation-delay: 4.5s;
}

@keyframes floatIcon {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.hero-content {
  position: relative;
  z-index: 2;
}

.system-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  padding: 8px 20px;
  margin-bottom: 20px;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  position: relative;
}

.system-level {
  margin-left: 10px;
  display: flex;
  align-items: center;
  font-size: 0.75rem;
}

.system-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ade80;
  margin-right: 5px;
  animation: pulse 2s infinite;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  line-height: 1.2;
}

.gradient-text {
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.title-underline {
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #4ade80, #06d6a0);
  margin: 10px auto;
  border-radius: 2px;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #ffffff;
  margin-bottom: 40px;
  line-height: 1.6;
  font-weight: 500;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.system-features {
  color: #ffffff;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 40px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 120px;
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #4ade80;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

/* Search and Filters */
.search-filters-section {
  background: white;
  padding: 30px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.search-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.search-input-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  z-index: 2;
}

.search-input {
  padding: 12px 15px 12px 45px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
}

.clear-search {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.clear-search:hover {
  background: #f3f4f6;
  color: #ef4444;
}

.filter-controls {
  display: flex;
  gap: 15px;
}

.filter-select {
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 15px;
  font-size: 1rem;
  background: #f9fafb;
  transition: all 0.3s ease;
}

.filter-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
}

/* Loading States */
.loading-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 15px;
  margin: 30px 0;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.medical-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px auto;
}

.loading-text {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 20px;
}

.loading-progress {
  width: 200px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  margin: 0 auto;
  overflow: hidden;
}

.progress-bar {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  animation: progress 2s ease-in-out infinite;
  border-radius: 2px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes progress {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0%); }
  100% { transform: translateX(100%); }
}

/* Error State */
.error-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 15px;
  margin: 30px 0;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 4rem;
  color: #ef4444;
  margin-bottom: 20px;
}

.retry-btn {
  margin-top: 20px;
  padding: 12px 24px;
  font-weight: 600;
}

/* Table Section */
.patients-table-section {
  margin: 30px 0;
}

.table-header {
  background: white;
  border-radius: 15px 15px 0 0;
  padding: 25px;
  border-bottom: 1px solid #e5e7eb;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 5px;
}

.section-subtitle {
  color: #6b7280;
  margin-bottom: 0;
}

.table-actions {
  display: flex;
  gap: 10px;
}

.advanced-table-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.1);
}

/* Advanced Table Styles */
.advanced-patients-table {
  margin: 0;
}

.advanced-patients-table thead {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.table-header-cell {
  padding: 20px 15px;
  border: none;
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 5px;
}

.patient-row {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.patient-row:hover {
  background: rgba(102, 126, 234, 0.02);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.table-cell {
  padding: 20px 15px;
  border: none;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

/* Patient Info Styles */
.patient-id .id-badge {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
}

.patient-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.patient-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

/* Patient Profile Image Styling */
.patient-profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.patient-profile-image:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  border-color: #3b82f6;
}

.patient-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
}

.patient-meta {
  font-size: 0.8rem;
  color: #6b7280;
}

.code-field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.amka-code, .afm-code {
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.85rem;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.copy-btn {
  background: none;
  border: none;
  color: #6b7280;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: #f3f4f6;
  color: #667eea;
}

/* Blood Type Badges */
.blood-type-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
}

.blood-a-pos, .blood-a-neg { background: #fef3c7; color: #d97706; }
.blood-b-pos, .blood-b-neg { background: #dbeafe; color: #2563eb; }
.blood-ab-pos, .blood-ab-neg { background: #f3e8ff; color: #9333ea; }
.blood-o-pos, .blood-o-neg { background: #fee2e2; color: #dc2626; }
.blood-unknown { background: #f3f4f6; color: #6b7280; }

.date-info .date-primary {
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
}

.date-info .date-secondary {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 2px;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 6px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Mobile Styles */
.mobile-patients-grid {
  padding: 20px;
  display: grid;
  gap: 20px;
}

.mobile-patient-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.1);
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.mobile-patient-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.mobile-card-header {
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
}

.patient-avatar-mobile {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

/* Mobile Patient Profile Image */
.patient-profile-image-mobile {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ffffff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.patient-info-mobile {
  flex: 1;
  margin-left: 15px;
}

.patient-name-mobile {
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  font-size: 1.1rem;
}

.patient-id-mobile {
  color: #6b7280;
  font-size: 0.85rem;
}

.blood-type-badge-mobile {
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.8rem;
}

.mobile-card-body {
  padding: 20px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 500;
  color: #6b7280;
  font-size: 0.9rem;
}

.detail-value {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1f2937;
}

.copy-btn-mobile {
  background: none;
  border: none;
  color: #6b7280;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn-mobile:hover {
  background: #f3f4f6;
  color: #667eea;
}

.mobile-card-footer {
  padding: 20px;
  background: #f8fafc;
  display: flex;
  gap: 10px;
}

.mobile-action-btn {
  flex: 1;
  font-weight: 600;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.mobile-action-btn:hover {
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 20px;
  }
  
  .stat-item {
    min-width: auto;
  }
  
  .search-card {
    padding: 20px;
  }
  
  .filter-controls {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 576px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .system-badge {
    font-size: 0.75rem;
    padding: 6px 15px;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
}

.table {
  font-size: 0.95rem;
}

.table tbody tr {
  cursor: pointer;
}

code {
  color: #d63384;
  background-color: #f8f9fa;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.875rem;
}

.bi-inbox {
  opacity: 0.5;
}

.patient-card-mobile {
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #dee2e6;
}

.patient-card-mobile:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.patient-card-mobile code {
  font-size: 0.75rem;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .display-6 {
    font-size: 1.75rem;
  }
  
  .card-header h5 {
    font-size: 1rem;
  }
}
</style>
