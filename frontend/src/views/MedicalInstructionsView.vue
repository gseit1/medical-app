<template>
  <div class="medical-instructions-container">
    <!-- Instructions List -->
    <div class="instructions-section">
      <div class="container">
        <!-- Filters -->
        <div class="filters-card">
          <div class="row align-items-center">
            <div class="col-md-6">
              <div class="search-box">
                <i class="bi bi-search"></i>
                <input 
                  v-model="searchTerm" 
                  type="text" 
                  placeholder="Αναζήτηση ασθενή ή φαρμάκου..."
                  class="form-control"
                >
              </div>
            </div>
            <div class="col-md-3">
              <select v-model="statusFilter" class="form-select">
                <option value="">Όλες οι καταστάσεις</option>
                <option value="Pending">Εκκρεμείς</option>
                <option value="Completed">Ολοκληρωμένες</option>
              </select>
            </div>
            <div class="col-md-3">
              <select v-model="severityFilter" class="form-select">
                <option value="">Όλες οι προτεραιότητες</option>
                <option value="Critical">Κρίσιμες</option>
                <option value="High">Υψηλές</option>
                <option value="Moderate">Μέτριες</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Instructions Cards -->
        <div v-if="loading" class="loading-container">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Φόρτωση...</span>
          </div>
        </div>

        <div v-else class="instructions-grid">
          <div 
            v-for="instruction in filteredInstructions" 
            :key="instruction._id"
            class="instruction-card"
            :class="instruction.status.toLowerCase()"
          >
            <!-- Card Header with Patient Info -->
            <div class="card-header-premium">
              <div class="patient-header">
                <div class="patient-avatar">
                  <span style="font-size: 2rem;">{{ getGenderEmoji(instruction.patient_id?.gender) }}</span>
                </div>
                <div class="patient-info">
                  <h5 class="patient-name">{{ instruction.patient_id?.full_name || 'Άγνωστος Ασθενής' }}</h5>
                  <div class="patient-meta">
                    <span class="badge bg-danger me-2">{{ instruction.patient_id?.blood_type }}</span>
                    <span class="badge bg-secondary">ΑΜΚΑ: {{ instruction.patient_id?.amka }}</span>
                  </div>
                </div>
              </div>
              <div class="status-container">
                <span class="status-badge" :class="'status-' + instruction.status.toLowerCase()">
                  {{ getStatusText(instruction.status) }}
                </span>
              </div>
            </div>

            <!-- ICD-10 Information -->
            <div v-if="instruction.icd10_code" class="icd-section">
              <div class="icd-header">
                <i class="bi bi-journal-medical"></i>
                <div class="icd-content">
                  <span class="icd-code-badge">{{ instruction.icd10_code }}</span>
                  <p class="icd-description">{{ instruction.icd10_description }}</p>
                </div>
              </div>
            </div>

            <!-- Medication Information - Enhanced -->
            <div class="medication-section-premium">
              <div class="medication-header">
                <div class="medication-icon">
                  <i class="bi bi-capsule"></i>
                </div>
                <div class="medication-info">
                  <h6 class="medication-name">{{ instruction.medication_name }}</h6>
                  <span class="dosage-badge-premium">{{ instruction.dosage }}</span>
                </div>
              </div>
              
              <div class="medication-grid">
                <div class="med-detail">
                  <span class="detail-label">
                    <i class="bi bi-hourglass-split"></i>
                    Συχνότητα
                  </span>
                  <span class="detail-value">{{ instruction.frequency }}</span>
                </div>
                <div class="med-detail">
                  <span class="detail-label">
                    <i class="bi bi-calendar-event"></i>
                    Διάρκεια
                  </span>
                  <span class="detail-value">{{ instruction.duration }}</span>
                </div>
                <div class="med-detail" v-if="instruction.barcode">
                  <span class="detail-label">
                    <i class="bi bi-upc-scan"></i>
                    Barcode
                  </span>
                  <span class="detail-value barcode-text">{{ instruction.barcode }}</span>
                </div>
              </div>

              <div v-if="instruction.instructions" class="instructions-box">
                <label class="instruction-label">
                  <i class="bi bi-chat-left-text"></i>
                  Οδηγίες Χορήγησης
                </label>
                <p class="instructions-text">{{ instruction.instructions }}</p>
              </div>
            </div>

            <!-- Drug Interactions - Enhanced -->
            <div v-if="instruction.drug_interactions?.length" class="interactions-section">
              <div class="section-header">
                <i class="bi bi-exclamation-triangle-fill"></i>
                <h6 class="section-title">Φαρμακικές Αλληλεπιδράσεις</h6>
                <span class="count-badge">{{ instruction.drug_interactions.length }}</span>
              </div>
              <div 
                v-for="interaction in instruction.drug_interactions"
                :key="interaction._id"
                class="interaction-item"
                :class="'interaction-' + interaction.severity.toLowerCase()"
              >
                <div class="interaction-header">
                  <span class="interaction-drug">🔗 {{ interaction.interaction_with }}</span>
                  <span class="severity-badge" :class="'severity-' + interaction.severity.toLowerCase()">
                    {{ getSeverityText(interaction.severity) }}
                  </span>
                </div>
                <p class="interaction-description">{{ interaction.description }}</p>
                <div class="interaction-recommendation">
                  <i class="bi bi-lightbulb-fill"></i>
                  <strong>Σύσταση:</strong> {{ interaction.recommendation }}
                </div>
              </div>
            </div>

            <!-- Safety Alerts - Enhanced -->
            <div v-if="instruction.safety_alerts?.length" class="alerts-section">
              <div class="section-header">
                <i class="bi bi-shield-exclamation"></i>
                <h6 class="section-title">Ειδοποιήσεις Ασφαλείας</h6>
                <span class="count-badge">{{ instruction.safety_alerts.length }}</span>
              </div>
              <div 
                v-for="alert in instruction.safety_alerts"
                :key="alert._id"
                class="alert-item"
                :class="'alert-' + alert.severity.toLowerCase()"
              >
                <div class="alert-header">
                  <span class="alert-type">⚠️ {{ getAlertTypeText(alert.alert_type) }}</span>
                  <span class="severity-badge" :class="'severity-' + alert.severity.toLowerCase()">
                    {{ getSeverityText(alert.severity) }}
                  </span>
                </div>
                <p class="alert-message">{{ alert.message }}</p>
              </div>
            </div>

            <!-- Completion Information -->
            <div v-if="instruction.status === 'Completed' && instruction.completed_by_name" class="completion-section">
              <div class="completion-info">
                <i class="bi bi-check-circle-fill"></i>
                <div class="completion-details">
                  <span class="label">Ολοκληρώθηκε από:</span>
                  <span class="nurse-name">{{ getNurseEmoji() }} {{ instruction.completed_by_name }}</span>
                </div>
              </div>
              <div v-if="instruction.completed_at" class="completion-date">
                <i class="bi bi-calendar3"></i>
                {{ formatDate(instruction.completed_at) }}
              </div>
            </div>

            <!-- Card Actions -->
            <div class="card-actions">
              <button class="btn btn-outline-primary btn-sm">
                <i class="bi bi-eye"></i>
                Λεπτομέρειες
              </button>
              <button class="btn btn-outline-secondary btn-sm">
                <i class="bi bi-printer"></i>
                Εκτύπωση
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && filteredInstructions.length === 0" class="empty-state">
          <i class="bi bi-clipboard-x"></i>
          <h4>Δεν βρέθηκαν ιατρικές οδηγίες</h4>
          <p>Δοκιμάστε να αλλάξετε τα κριτήρια αναζήτησης</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

// Reactive data
const instructions = ref([])
const loading = ref(true)
const searchTerm = ref('')
const statusFilter = ref('')
const severityFilter = ref('')

// Computed properties
const filteredInstructions = computed(() => {
  let filtered = instructions.value

  if (searchTerm.value) {
    filtered = filtered.filter(instruction => 
      instruction.patient_id?.full_name?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      instruction.medication_name?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      instruction.description?.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(instruction => instruction.status === statusFilter.value)
  }

  if (severityFilter.value) {
    filtered = filtered.filter(instruction => 
      instruction.drug_interactions?.some(interaction => interaction.severity === severityFilter.value) ||
      instruction.safety_alerts?.some(alert => alert.severity === severityFilter.value)
    )
  }

  return filtered
})

const totalInstructions = computed(() => instructions.value.length)
const criticalAlerts = computed(() => 
  instructions.value.filter(instruction => 
    instruction.drug_interactions?.some(interaction => interaction.severity === 'Critical') ||
    instruction.safety_alerts?.some(alert => alert.severity === 'Critical')
  ).length
)
const activePatients = computed(() => {
  const patientIds = new Set(instructions.value.map(instruction => instruction.patient_id?._id))
  return patientIds.size
})

// Methods
const loadInstructions = async () => {
  try {
    loading.value = true
    const response = await api.get('/instructions')
    instructions.value = response.data
  } catch (error) {
    console.error('Error loading instructions:', error)
  } finally {
    loading.value = false
  }
}

const completeInstruction = async (instructionId) => {
  try {
    await api.put(`/instructions/${instructionId}`, { status: 'Completed' })
    await loadInstructions()
  } catch (error) {
    console.error('Error completing instruction:', error)
  }
}

const getStatusText = (status) => {
  const statusMap = {
    'Pending': 'Εκκρεμής',
    'Completed': 'Ολοκληρωμένη',
    'Cancelled': 'Ακυρωμένη'
  }
  return statusMap[status] || status
}

const getSeverityText = (severity) => {
  const severityMap = {
    'Low': 'Χαμηλή',
    'Moderate': 'Μέτρια',
    'High': 'Υψηλή',
    'Critical': 'Κρίσιμη'
  }
  return severityMap[severity] || severity
}

const getAlertTypeText = (alertType) => {
  const alertMap = {
    'Contraindication': 'Αντένδειξη',
    'Warning': 'Προειδοποίηση',
    'Caution': 'Προσοχή',
    'Info': 'Πληροφορία'
  }
  return alertMap[alertType] || alertType
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

const getGenderEmoji = (gender) => {
  if (!gender) return '👤'
  const genderLower = gender.toLowerCase()
  if (genderLower === 'male' || genderLower === 'άρρεν' || genderLower === 'm') {
    return '👨'
  } else if (genderLower === 'female' || genderLower === 'θήλυ' || genderLower === 'f') {
    return '👩'
  }
  return '👤'
}

const getNurseEmoji = () => {
  return '👩‍⚕️'
}

// Lifecycle
onMounted(() => {
  loadInstructions()
})
</script>

<style scoped>
/* Medical Instructions Styling */
.medical-instructions-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  padding: 4rem 0 3rem;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  color: #ffffff;
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-description {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 2.5rem;
  max-width: 600px;
}

.hero-stats {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #ffd89b;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.hero-visual {
  text-align: center;
  position: relative;
}

.medical-icon-container {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.medical-icon-container i {
  font-size: 4rem;
  color: #ffffff;
}

.floating-pill {
  position: absolute;
  font-size: 2rem;
  animation: float 3s ease-in-out infinite;
}

.pill-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.pill-2 {
  top: 60%;
  right: 10%;
  animation-delay: 1s;
}

.pill-3 {
  bottom: 10%;
  left: 20%;
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Instructions Section */
.instructions-section {
  padding: 4rem 0;
  background: #f8fafc;
}

.filters-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;
}

.search-box {
  position: relative;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  z-index: 2;
}

.search-box .form-control {
  padding-left: 3rem;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  font-size: 1rem;
}

.instructions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 2rem;
}

.instruction-card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
}

.instruction-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
}

.instruction-card.pending {
  border-left: 4px solid #f59e0b;
}

.instruction-card.completed {
  border-left: 4px solid #10b981;
}

.card-header-premium {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e5e7eb;
}

.patient-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.patient-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.patient-info {
  flex: 1;
  min-width: 0;
}

.patient-name {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.4rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.patient-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.status-container {
  flex-shrink: 0;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  display: inline-block;
}

.status-badge.status-pending {
  background: #fef3c7;
  color: #b45309;
}

.status-badge.status-completed {
  background: #d1fae5;
  color: #047857;
}

/* ICD Section */
.icd-section {
  padding: 1.25rem 1.5rem;
  background: #f0f9ff;
  border-radius: 12px;
  border-left: 4px solid #0ea5e9;
  margin: 0 1.5rem 1.5rem;
}

.icd-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.icd-header i {
  font-size: 1.25rem;
  color: #0ea5e9;
  flex-shrink: 0;
}

.icd-content {
  flex: 1;
}

.icd-code-badge {
  display: inline-block;
  background: #0ea5e9;
  color: #ffffff;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.icd-description {
  font-size: 0.875rem;
  color: #1e40af;
  margin: 0;
}

/* Medication Section Premium */
.medication-section-premium {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.medication-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.medication-icon {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.medication-info {
  flex: 1;
}

.medication-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.3rem;
}

.dosage-badge-premium {
  display: inline-block;
  background: #dcfce7;
  color: #166534;
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.medication-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.med-detail {
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.detail-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin-bottom: 0.4rem;
}

.detail-label i {
  color: #1f2937;
}

.detail-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1f2937;
}

.detail-value.barcode-text {
  font-family: 'Courier New', monospace;
  color: #059669;
  font-size: 0.85rem;
}

.instructions-box {
  padding: 1rem;
  background: #fef9e7;
  border-radius: 8px;
  border-left: 4px solid #f59e0b;
}

.instruction-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #b45309;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.instructions-text {
  font-size: 0.9rem;
  color: #451a03;
  line-height: 1.5;
  margin: 0;
}

/* Interactions Section */
.interactions-section {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.section-header i {
  font-size: 1.2rem;
  color: #dc2626;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.count-badge {
  margin-left: auto;
  background: #fee2e2;
  color: #991b1b;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
}

.interaction-item {
  padding: 1rem;
  margin-bottom: 0.75rem;
  border-radius: 8px;
  border-left: 4px solid #ef4444;
  background: #fef2f2;
}

.interaction-item.interaction-high {
  border-left-color: #dc2626;
  background: #fee2e2;
}

.interaction-item.interaction-moderate {
  border-left-color: #f59e0b;
  background: #fffbeb;
}

.interaction-item.interaction-low {
  border-left-color: #0ea5e9;
  background: #f0f9ff;
}

.interaction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.interaction-drug {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1f2937;
}

.severity-badge {
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.severity-badge.severity-critical {
  background: #991b1b;
  color: #ffffff;
}

.severity-badge.severity-high {
  background: #dc2626;
  color: #ffffff;
}

.severity-badge.severity-moderate {
  background: #f59e0b;
  color: #ffffff;
}

.severity-badge.severity-low {
  background: #10b981;
  color: #ffffff;
}

.interaction-description {
  font-size: 0.85rem;
  color: #374151;
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.interaction-recommendation {
  display: flex;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #1f2937;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 6px;
}

.interaction-recommendation i {
  color: #10b981;
  flex-shrink: 0;
}

/* Alerts Section */
.alerts-section {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.alert-item {
  padding: 1rem;
  margin-bottom: 0.75rem;
  border-radius: 8px;
  border-left: 4px solid #f59e0b;
  background: #fffbeb;
}

.alert-item.alert-high {
  border-left-color: #dc2626;
  background: #fee2e2;
}

.alert-item.alert-critical {
  border-left-color: #991b1b;
  background: #fecaca;
}

.alert-item.alert-moderate {
  border-left-color: #f59e0b;
  background: #fffbeb;
}

.alert-item.alert-low {
  border-left-color: #0ea5e9;
  background: #f0f9ff;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.alert-type {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1f2937;
}

.alert-message {
  font-size: 0.85rem;
  color: #374151;
  line-height: 1.4;
  margin: 0;
}

.medication-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.detail-item {
  font-size: 0.875rem;
}

.label {
  font-weight: 600;
  color: #6b7280;
}

.value {
  color: #1f2937;
}

.loading-container, .empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: #dc2626;
  margin-bottom: 1rem;
}

.interaction-item, .alert-item {
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  border-left: 4px solid;
}

.interaction-item.critical, .alert-item.critical {
  background: #fef2f2;
  border-color: #dc2626;
}

.interaction-item.high, .alert-item.high {
  background: #fff7ed;
  border-color: #ea580c;
}

.interaction-item.moderate, .alert-item.moderate {
  background: #fefce8;
  border-color: #ca8a04;
}

.interaction-header, .alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.severity-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  text-transform: uppercase;
}

.severity-badge.critical {
  background: #dc2626;
  color: #ffffff;
}

.severity-badge.high {
  background: #ea580c;
  color: #ffffff;
}

.severity-badge.moderate {
  background: #ca8a04;
  color: #ffffff;
}

.interaction-recommendation {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  background: rgba(59, 130, 246, 0.1);
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 0.5rem;
}

/* Completion Section */
.completion-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
  border: 1px solid #d1fae5;
  border-radius: 8px;
  margin-top: 1rem;
}

.completion-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.completion-info i {
  font-size: 1.3rem;
  color: #10b981;
}

.completion-details {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.completion-details .label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.nurse-name {
  font-weight: 600;
  color: #047857;
  font-size: 0.95rem;
}

.completion-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #6b7280;
  background: rgba(255, 255, 255, 0.6);
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
}

.completion-date i {
  color: #10b981;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.loading-container, .empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .instructions-grid {
    grid-template-columns: 1fr;
  }
  
  .hero-stats {
    justify-content: center;
  }
  
  .medication-details {
    grid-template-columns: 1fr;
  }
}
</style>