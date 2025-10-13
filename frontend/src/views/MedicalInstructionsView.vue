<template>
  <div class="medical-instructions-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <div class="hero-content">
              <div class="hero-badge">
                <i class="bi bi-clipboard2-pulse"></i>
                <span>Ιατρικές Οδηγίες</span>
              </div>
              <h1 class="hero-title">
                Διαχείριση Ιατρικών 
                <span class="gradient-text">Οδηγιών</span>
              </h1>
              <p class="hero-description">
                Σύστημα παρακολούθησης φαρμακευτικής θεραπείας με ICD-10 κωδικοποίηση 
                και ειδοποιήσεις φαρμακικών αλληλεπιδράσεων
              </p>
              <div class="hero-stats">
                <div class="stat-item">
                  <div class="stat-number">{{ totalInstructions }}</div>
                  <div class="stat-label">Συνολικές Οδηγίες</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">{{ criticalAlerts }}</div>
                  <div class="stat-label">Κρίσιμες Ειδοποιήσεις</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">{{ activePatients }}</div>
                  <div class="stat-label">Ενεργοί Ασθενείς</div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="hero-visual">
              <div class="medical-icon-container">
                <i class="bi bi-prescription2"></i>
              </div>
              <div class="floating-elements">
                <div class="floating-pill pill-1">💊</div>
                <div class="floating-pill pill-2">🧬</div>
                <div class="floating-pill pill-3">⚕️</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
          >
            <!-- Card Header -->
            <div class="card-header">
              <div class="patient-info">
                <h5 class="patient-name">{{ instruction.patient_id?.full_name || 'Άγνωστος Ασθενής' }}</h5>
                <div class="patient-details">
                  <span class="blood-type">{{ instruction.patient_id?.blood_type }}</span>
                  <span class="amka">ΑΜΚΑ: {{ instruction.patient_id?.amka }}</span>
                </div>
              </div>
              <div class="status-badge" :class="instruction.status.toLowerCase()">
                {{ getStatusText(instruction.status) }}
              </div>
            </div>

            <!-- ICD-10 Information -->
            <div v-if="instruction.icd10_code" class="icd-section">
              <div class="icd-badge">
                <i class="bi bi-journal-medical"></i>
                <span>{{ instruction.icd10_code }}</span>
              </div>
              <p class="icd-description">{{ instruction.icd10_description }}</p>
            </div>

            <!-- Medication Information -->
            <div class="medication-section">
              <div class="medication-header">
                <h6 class="medication-name">
                  <i class="bi bi-capsule"></i>
                  {{ instruction.medication_name }}
                </h6>
                <span class="dosage-badge">{{ instruction.dosage }}</span>
              </div>
              <div class="medication-details">
                <div class="detail-item">
                  <span class="label">Συχνότητα:</span>
                  <span class="value">{{ instruction.frequency }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Διάρκεια:</span>
                  <span class="value">{{ instruction.duration }}</span>
                </div>
              </div>
              <p class="instructions-text">{{ instruction.instructions }}</p>
            </div>

            <!-- Drug Interactions -->
            <div v-if="instruction.drug_interactions?.length" class="interactions-section">
              <h6 class="section-title">
                <i class="bi bi-exclamation-triangle-fill"></i>
                Φαρμακικές Αλληλεπιδράσεις
              </h6>
              <div 
                v-for="interaction in instruction.drug_interactions"
                :key="interaction._id"
                class="interaction-item"
                :class="interaction.severity.toLowerCase()"
              >
                <div class="interaction-header">
                  <span class="interaction-drug">{{ interaction.interaction_with }}</span>
                  <span class="severity-badge" :class="interaction.severity.toLowerCase()">
                    {{ getSeverityText(interaction.severity) }}
                  </span>
                </div>
                <p class="interaction-description">{{ interaction.description }}</p>
                <div class="interaction-recommendation">
                  <i class="bi bi-info-circle"></i>
                  {{ interaction.recommendation }}
                </div>
              </div>
            </div>

            <!-- Safety Alerts -->
            <div v-if="instruction.safety_alerts?.length" class="alerts-section">
              <h6 class="section-title">
                <i class="bi bi-shield-exclamation"></i>
                Ειδοποιήσεις Ασφαλείας
              </h6>
              <div 
                v-for="alert in instruction.safety_alerts"
                :key="alert._id"
                class="alert-item"
                :class="alert.severity.toLowerCase()"
              >
                <div class="alert-header">
                  <span class="alert-type">{{ getAlertTypeText(alert.alert_type) }}</span>
                  <span class="severity-badge" :class="alert.severity.toLowerCase()">
                    {{ getSeverityText(alert.severity) }}
                  </span>
                </div>
                <p class="alert-message">{{ alert.message }}</p>
              </div>
            </div>

            <!-- Card Actions -->
            <div class="card-actions">
              <button 
                v-if="instruction.status === 'Pending'"
                @click="completeInstruction(instruction._id)"
                class="btn btn-success btn-sm"
              >
                <i class="bi bi-check-circle"></i>
                Ολοκλήρωση
              </button>
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
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
}

.instruction-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.instruction-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.patient-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.patient-details {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.blood-type {
  background: #fef2f2;
  color: #dc2626;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: 600;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.completed {
  background: #d1fae5;
  color: #059669;
}

.icd-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f0f9ff;
  border-radius: 12px;
  border-left: 4px solid #0ea5e9;
}

.icd-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #0ea5e9;
  color: #ffffff;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.medication-section {
  margin-bottom: 1.5rem;
}

.medication-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.medication-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
}

.dosage-badge {
  background: #dcfce7;
  color: #166534;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
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

.interactions-section, .alerts-section {
  margin-bottom: 1.5rem;
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