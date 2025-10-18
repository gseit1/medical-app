<template>
  <div class="patient-detail-container">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-muted">Φόρτωση στοιχείων ασθενή...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      <i class="bi bi-exclamation-triangle-fill"></i>
      {{ error }}
      <button class="btn btn-sm btn-outline-danger ms-3" @click="$router.back()">
        Επιστροφή
      </button>
    </div>

    <!-- Patient Details -->
    <div v-else-if="patient">
      <!-- Header with Back Button -->
      <div class="row mb-4">
        <div class="col">
          <button class="btn btn-outline-secondary mb-3" @click="$router.back()">
            <i class="bi bi-arrow-left"></i> Επιστροφή
          </button>
          <div class="patient-header">
            <div class="patient-avatar-large">
              <span style="font-size: 4rem; line-height: 1;">{{ getGenderEmoji(patient.gender) }}</span>
            </div>
            <div class="patient-title-info">
              <h1 class="display-5 mb-2">{{ patient.full_name }}</h1>
              <div class="patient-badges">
                <span v-if="patient.age" class="badge bg-success me-2">{{ patient.age }} ετών</span>
                <span v-if="patient.gender" class="badge bg-info me-2">{{ patient.gender }}</span>
                <span v-if="patient.blood_type" class="badge bg-danger">{{ patient.blood_type }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Left Column - Patient Info & Medical History -->
        <div class="col-lg-4 mb-4">
          <!-- Basic Info Card -->
          <div class="card mb-3">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0 d-flex align-items-center">
                <i class="bi bi-person-vcard me-2"></i>
                Προσωπικά Στοιχεία
              </h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="text-muted small">🆔 Ονοματεπώνυμο</label>
                <p class="fw-bold mb-0">{{ patient.full_name }}</p>
              </div>
              <div class="mb-3">
                <label class="text-muted small">📋 Α.Μ.Κ.Α</label>
                <p class="mb-0"><code>{{ patient.amka }}</code></p>
              </div>
              <div class="mb-3">
                <label class="text-muted small">💼 Α.Μ</label>
                <p class="mb-0"><code>{{ patient.afm || 'N/A' }}</code></p>
              </div>
              <div class="mb-3">
                <label class="text-muted small">📊 Ομάδα Αίματος</label>
                <p class="mb-0">
                  <span class="badge bg-danger fs-6">{{ patient.blood_type || 'N/A' }}</span>
                </p>
              </div>
              <hr />
              <div class="mb-3">
                <label class="text-muted small">👤 Ηλικία</label>
                <p class="mb-0">{{ patient.age || 'N/A' }} ετών</p>
              </div>
              <div class="mb-3">
                <label class="text-muted small">⚧ Φύλο</label>
                <p class="mb-0">{{ translateGender(patient.gender) }}</p>
              </div>
              <div class="mb-3">
                <label class="text-muted small">📞 Τηλέφωνο</label>
                <p class="mb-0">
                  <a v-if="patient.phone" :href="`tel:${patient.phone}`" class="text-decoration-none">
                    {{ patient.phone }}
                  </a>
                  <span v-else class="text-muted">N/A</span>
                </p>
              </div>
              <div class="mb-0">
                <label class="text-muted small">🏥 Barcode</label>
                <p class="mb-0"><code class="text-success">{{ patient.barcode || 'N/A' }}</code></p>
              </div>
            </div>
          </div>

          <!-- Medical History Card -->
          <div v-if="patient.medical_history" class="card mb-3">
            <div class="card-header bg-warning">
              <h5 class="mb-0">
                <i class="bi bi-file-medical me-2"></i> Ιστορικό Υγείας
              </h5>
            </div>
            <div class="card-body">
              <p class="mb-0">{{ patient.medical_history }}</p>
            </div>
          </div>

          <!-- Registration Date Card -->
          <div class="card">
            <div class="card-header bg-secondary text-white">
              <h5 class="mb-0">
                <i class="bi bi-calendar me-2"></i> Στοιχεία Εγγραφής
              </h5>
            </div>
            <div class="card-body">
              <div class="mb-0">
                <label class="text-muted small">📅 Ημερομηνία Εγγραφής</label>
                <p class="mb-0">{{ formatDate(patient.created_at || patient.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Medical Instructions, History & Referrals -->
        <div class="col-lg-8">
          <!-- Tab Navigation -->
          <ul class="nav nav-tabs mb-4" role="tablist">
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link active" 
                id="instructions-tab" 
                data-bs-toggle="tab" 
                data-bs-target="#instructions-pane" 
                type="button" 
                role="tab"
              >
                <i class="bi bi-clipboard-pulse me-2"></i>
                Τρέχουσες Οδηγίες
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link" 
                id="history-tab" 
                data-bs-toggle="tab" 
                data-bs-target="#history-pane" 
                type="button" 
                role="tab"
              >
                <i class="bi bi-clock-history me-2"></i>
                Ιστορικό Φαρμάκων
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link" 
                id="referrals-tab" 
                data-bs-toggle="tab" 
                data-bs-target="#referrals-pane" 
                type="button" 
                role="tab"
              >
                <i class="bi bi-file-medical me-2"></i>
                Παραπεμπτικά
              </button>
            </li>
          </ul>

          <!-- Tab Content -->
          <div class="tab-content">
            <!-- Instructions Tab -->
            <div class="tab-pane fade show active" id="instructions-pane" role="tabpanel">
              <div class="card">
                <div class="card-header bg-info text-white">
                  <h5 class="mb-0">
                    <i class="bi bi-clipboard-pulse"></i> Τρέχουσες Ιατρικές Οδηγίες
                  </h5>
                </div>
                <div class="card-body">
                  <div v-if="!patient.medical_instructions || patient.medical_instructions.length === 0" class="text-center py-4">
                    <i class="bi bi-inbox" style="font-size: 3rem; color: #ccc;"></i>
                    <p class="text-muted mt-2">Δεν υπάρχουν τρέχουσες ιατρικές οδηγίες</p>
                  </div>
                  
                  <div v-else>
                    <div
                      v-for="instruction in patient.medical_instructions"
                      :key="instruction.id"
                      class="instruction-item p-3 mb-3 border rounded"
                      :class="{ 
                        'completed': instruction.status === 'Completed',
                        'border-success': instruction.verified
                      }"
                    >
                      <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                          <div class="d-flex align-items-start mb-2">
                            <i v-if="instruction.verified" class="bi bi-check-circle-fill text-success me-2 fs-5"></i>
                            <h6 class="mb-0">{{ instruction.description }}</h6>
                          </div>
                          <p class="mb-2 text-muted small">
                            <i class="bi bi-upc-scan"></i>
                            Barcode: <code>{{ instruction.barcode }}</code>
                          </p>
                          <p class="mb-0 text-muted small">
                            <i class="bi bi-calendar"></i>
                            {{ formatDate(instruction.created_at) }}
                          </p>
                          <div v-if="instruction.verified" class="alert alert-success alert-sm mt-2 mb-0 py-1 px-2">
                            <small><i class="bi bi-check-circle"></i> Επαληθευμένο στις {{ instruction.verifiedTime }}</small>
                          </div>
                        </div>
                        <div class="ms-3 d-flex flex-column gap-2">
                          <span
                            class="badge status-badge"
                            :class="instruction.status === 'Completed' ? 'bg-success' : 'bg-warning text-dark'"
                          >
                            {{ instruction.status === 'Completed' ? 'Ολοκληρωμένη' : 'Αναμονή' }}
                          </span>
                          
                          <!-- Verify Button - Show for pending instructions -->
                          <button
                            v-if="authStore.isNurse && instruction.status !== 'Completed'"
                            class="btn btn-sm btn-primary"
                            @click="openVerificationModal(instruction)"
                            :disabled="instruction.verified"
                          >
                            <i class="bi bi-qr-code-scan"></i> 
                            {{ instruction.verified ? 'Επαληθευμένο' : 'Επαλήθευση' }}
                          </button>
                          
                          <!-- Complete Button - Show only after verification -->
                          <button
                            v-if="authStore.isNurse && instruction.verified && instruction.status !== 'Completed'"
                            class="btn btn-sm btn-success"
                            @click="completeInstruction(instruction.id)"
                          >
                            <i class="bi bi-check-circle"></i> Ολοκλήρωση
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- History Tab -->
            <div class="tab-pane fade" id="history-pane" role="tabpanel">
              <div class="card">
                <div class="card-header bg-success text-white">
                  <h5 class="mb-0">
                    <i class="bi bi-clock-history"></i> Ιστορικό Φαρμάκων
                  </h5>
                </div>
                <div class="card-body">
                  <div v-if="!medicationHistory || medicationHistory.length === 0" class="text-center py-4">
                    <i class="bi bi-inbox" style="font-size: 3rem; color: #ccc;"></i>
                    <p class="text-muted mt-2">Δεν υπάρχει ιστορικό ολοκληρωμένων φαρμάκων</p>
                  </div>
                  
                  <div v-else class="medication-timeline">
                    <div
                      v-for="(item, index) in medicationHistory"
                      :key="item.id"
                      class="history-item"
                      :class="{ 'last-item': index === medicationHistory.length - 1 }"
                    >
                      <div class="history-marker">
                        <i class="bi bi-check-circle-fill"></i>
                      </div>
                      <div class="history-content">
                        <h6 class="mb-1">{{ item.description }}</h6>
                        <p class="text-muted small mb-2">
                          <i class="bi bi-upc-scan"></i> Barcode: <code>{{ item.barcode }}</code>
                        </p>
                        <div class="d-flex justify-content-between flex-wrap gap-2">
                          <small class="text-muted">
                            <i class="bi bi-calendar-check"></i>
                            Χορηγήθηκε: {{ formatDate(item.completed_at) }}
                          </small>
                          <small class="text-muted">
                            <i class="bi bi-alarm"></i>
                            {{ formatTime(item.completed_at) }}
                          </small>
                          <small v-if="item.completed_by_name" class="text-info fw-bold">
                            {{ getNurseEmoji() }}
                            Νοσηλευτής: {{ item.completed_by_name }}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Statistics -->
                  <div v-if="medicationHistory && medicationHistory.length > 0" class="mt-4 pt-3 border-top">
                    <div class="row">
                      <div class="col-6">
                        <div class="text-center">
                          <h4 class="text-success mb-0">{{ medicationHistory.length }}</h4>
                          <small class="text-muted">Φάρμακα χορηγηθέντα</small>
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="text-center">
                          <h4 class="text-info mb-0">{{ getCompletionRate }}%</h4>
                          <small class="text-muted">Ποσοστό ολοκλήρωσης</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Referrals Tab -->
            <div class="tab-pane fade" id="referrals-pane" role="tabpanel">
              <div class="card">
                <div class="card-header bg-warning">
                  <h5 class="mb-0">
                    <i class="bi bi-file-medical"></i> Παραπεμπτικά
                  </h5>
                </div>
                <div class="card-body">
                  <div v-if="patient.referrals?.length === 0" class="text-center py-4">
                    <i class="bi bi-inbox" style="font-size: 3rem; color: #ccc;"></i>
                    <p class="text-muted mt-2">Δεν υπάρχουν παραπεμπτικά</p>
                  </div>
                  
                  <div v-else class="table-responsive">
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th>Περιγραφή</th>
                          <th>Ημερομηνία</th>
                          <th>Ιατρός</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="referral in patient.referrals" :key="referral.id">
                          <td>{{ referral.description }}</td>
                          <td>{{ formatDate(referral.referral_date) }}</td>
                          <td>{{ referral.doctor_name || 'N/A' }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Verification Modal -->
    <div v-if="verificationModal.show" class="modal-backdrop" @click.self="closeVerificationModal">
      <div class="modal-dialog-custom">
        <div class="modal-content-custom">
          <!-- Modal Header -->
          <div class="modal-header-custom">
            <h5 class="mb-0 text-white">
              <i class="bi bi-qr-code-scan"></i> Επαλήθευση Ιατρικής Οδηγίας
            </h5>
            <button 
              type="button" 
              class="btn-close-custom"
              @click="closeVerificationModal"
            >
              <i class="bi bi-x-lg text-white"></i>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body-custom">
            <!-- Instruction Details -->
            <div class="alert alert-info mb-3">
              <h6 class="mb-2">📋 Οδηγία προς επαλήθευση:</h6>
              <p class="mb-1"><strong>{{ verificationModal.instruction?.description }}</strong></p>
              <p class="mb-0 small">
                <i class="bi bi-upc-scan"></i> Barcode: 
                <code class="bg-white px-2 py-1 rounded">{{ verificationModal.instruction?.barcode }}</code>
              </p>
            </div>

            <!-- Scanner Component -->
            <div class="scanner-section">
              <!-- Mode Selector -->
              <div class="btn-group w-100 mb-3" role="group">
                <button
                  type="button"
                  class="btn"
                  :class="scanMethod === 'photo' ? 'btn-success' : 'btn-outline-success'"
                  @click="scanMethod = 'photo'"
                >
                  <i class="bi bi-camera-fill"></i> Φωτογραφία
                </button>
                <button
                  type="button"
                  class="btn"
                  :class="scanMethod === 'manual' ? 'btn-success' : 'btn-outline-success'"
                  @click="scanMethod = 'manual'"
                >
                  <i class="bi bi-keyboard"></i> Χειροκίνητα
                </button>
              </div>

              <!-- Photo Mode -->
              <div v-if="scanMethod === 'photo'" class="mb-3">
                <label class="btn btn-success btn-lg w-100" for="modal-photo-input">
                  <i class="bi bi-camera-fill me-2"></i>
                  {{ scanningBarcode ? 'Επεξεργασία...' : 'Άνοιγμα Κάμερας' }}
                </label>
                <input
                  type="file"
                  id="modal-photo-input"
                  accept="image/*"
                  capture="environment"
                  @change="handleModalPhotoScan"
                  style="display: none;"
                  :disabled="scanningBarcode"
                />
                <p class="text-muted text-center small mt-2 mb-0">
                  <i class="bi bi-info-circle"></i> Βγάλτε φωτογραφία του barcode
                </p>
              </div>

              <!-- Manual Mode -->
              <div v-if="scanMethod === 'manual'" class="mb-3">
                <label class="form-label fw-bold">
                  <i class="bi bi-keyboard"></i> Εισάγετε το barcode:
                </label>
                <input
                  id="manual-barcode-input"
                  type="text"
                  class="form-control form-control-lg text-center mb-3"
                  v-model="manualBarcode"
                  placeholder="MED001234567-571"
                  @keyup.enter="verifyScannedBarcode()"
                  style="font-family: 'Courier New', monospace; letter-spacing: 2px; font-size: 1.1rem;"
                  :disabled="scanningBarcode"
                  autofocus
                />
                <button
                  class="btn btn-success btn-lg w-100"
                  @click="verifyScannedBarcode()"
                  :disabled="!manualBarcode || scanningBarcode"
                >
                  <span v-if="scanningBarcode">
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Επαλήθευση...
                  </span>
                  <span v-else>
                    <i class="bi bi-check-circle me-2"></i>Επαλήθευση
                  </span>
                </button>
                
                <!-- Expected barcode hint -->
                <div class="alert alert-light mt-3 mb-0">
                  <small class="text-muted">
                    <i class="bi bi-info-circle"></i> 
                    Αναμενόμενο: <code>{{ verificationModal.instruction?.barcode }}</code>
                  </small>
                </div>
              </div>

              <!-- Verification Result -->
              <div v-if="verificationResult" class="verification-result">
                <div
                  class="alert mb-0"
                  :class="verificationResult.success ? 'alert-success' : 'alert-danger'"
                >
                  <h6 class="mb-2">
                    <i :class="verificationResult.success ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'"></i>
                    {{ verificationResult.message }}
                  </h6>
                  <p v-if="!verificationResult.success" class="mb-0 small">
                    Παρακαλώ ελέγξτε αν σαρώσατε το σωστό φάρμακο.
                  </p>
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
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'
import { BrowserMultiFormatReader } from '@zxing/library'

const route = useRoute()
const authStore = useAuthStore()

const patient = ref(null)
const loading = ref(true)
const error = ref(null)
const medicationHistory = ref([])

// Verification Modal
const verificationModal = ref({
  show: false,
  instruction: null
})
const scanMethod = ref('manual') // Default to manual entry for reliability
const manualBarcode = ref('')
const scanningBarcode = ref(false)
const verificationResult = ref(null)

const fetchPatientDetails = async () => {
  try {
    loading.value = true
    error.value = null
    const patientId = route.params.id
    console.log('🔍 Patient ID from route:', patientId)
    console.log('🔍 Full route params:', route.params)
    
    // Validate patientId exists
    if (!patientId) {
      error.value = 'Δεν βρέθηκε αναγνωριστικό ασθενή'
      console.error('❌ No patient ID provided in route')
      loading.value = false
      return
    }
    
    const response = await api.get(`/patients/${patientId}`)
    
    console.log('🔍 Full API Response:', response.data)
    console.log('🔍 Response has success:', response.data.success)
    console.log('🔍 Response has patient:', response.data.patient)
    
    // Handle the new MongoDB API response structure
    if (response.data.success && response.data.patient) {
      patient.value = response.data.patient
      console.log('📝 Using response.data.patient')
    } else {
      // Fallback for legacy response format
      patient.value = response.data
      console.log('📝 Using response.data (fallback)')
    }
    
    console.log('✅ Patient data loaded with profile image:', patient.value.full_name)
    console.log('📷 Profile image:', patient.value.profile_image)
    console.log('💊 Medical instructions:', patient.value.medical_instructions?.length || 0)
    
    // Load medication history
    await loadMedicationHistory(patientId)
    
  } catch (err) {
    error.value = err.response?.data?.message || 'Σφάλμα φόρτωσης στοιχείων ασθενή'
    console.error('Error fetching patient details:', err)
  } finally {
    loading.value = false
  }
}

const loadMedicationHistory = async (patientId) => {
  try {
    // Get all instructions (both pending and completed)
    const response = await api.get(`/instructions/patient/${patientId}`)
    
    if (response.data && Array.isArray(response.data)) {
      // Filter completed instructions and sort by completion date (newest first)
      medicationHistory.value = response.data
        .filter(inst => inst.status === 'Completed')
        .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
      
      console.log('📊 Loaded medication history:', medicationHistory.value.length, 'completed medications')
    }
  } catch (err) {
    console.error('Error loading medication history:', err)
  }
}

const translateGender = (gender) => {
  const genderMap = {
    'M': 'Άρρεν',
    'F': 'Θήλυ',
    'O': 'Άλλο',
    'Male': 'Άρρεν',
    'Female': 'Θήλυ',
    'Other': 'Άλλο'
  }
  return genderMap[gender] || gender || 'N/A'
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

const getCompletionRate = computed(() => {
  if (!patient.value?.medical_instructions || !medicationHistory.value) return 0
  const total = (patient.value.medical_instructions?.length || 0) + (medicationHistory.value?.length || 0)
  if (total === 0) return 0
  return Math.round((medicationHistory.value.length / total) * 100)
})

const handleImageError = (event) => {
  // Replace broken image with default icon
  event.target.style.display = 'none'
  const parentDiv = event.target.parentNode
  if (!parentDiv.querySelector('.bi-person-circle')) {
    const icon = document.createElement('i')
    icon.className = 'bi bi-person-circle'
    parentDiv.appendChild(icon)
  }
}

const completeInstruction = async (instructionId) => {
  try {
    await api.patch(`/instructions/${instructionId}/complete`)
    // Refresh patient data
    await fetchPatientDetails()
  } catch (err) {
    alert('Σφάλμα κατά την ολοκλήρωση της οδηγίας')
    console.error('Error completing instruction:', err)
  }
}

const openVerificationModal = (instruction) => {
  verificationModal.value = {
    show: true,
    instruction: instruction
  }
  verificationResult.value = null
  manualBarcode.value = ''
  scanMethod.value = 'manual' // Start with manual for reliability
  
  // Auto-focus on input after modal opens
  setTimeout(() => {
    const input = document.querySelector('#manual-barcode-input')
    if (input) {
      input.focus()
    }
  }, 100)
}

const closeVerificationModal = () => {
  verificationModal.value = {
    show: false,
    instruction: null
  }
  verificationResult.value = null
  manualBarcode.value = ''
}

const handleModalPhotoScan = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    scanningBarcode.value = true
    verificationResult.value = null

    console.log('Scanning photo for barcode...')

    // Create image from file
    const imageUrl = URL.createObjectURL(file)
    const img = new Image()
    
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = imageUrl
    })

    console.log('Image loaded, scanning...')

    // Use ZXing to decode barcode from image
    const codeReader = new BrowserMultiFormatReader()
    
    try {
      const result = await codeReader.decodeFromImageElement(img)
      const scannedBarcode = result.getText()
      
      console.log('Barcode detected:', scannedBarcode)
      
      // Clean up
      URL.revokeObjectURL(imageUrl)
      
      // Verify the scanned barcode
      await verifyScannedBarcode(scannedBarcode)
      
    } catch (decodeError) {
      console.error('Decode error:', decodeError)
      
      // Clean up
      URL.revokeObjectURL(imageUrl)
      
      verificationResult.value = {
        success: false,
        message: '❌ Δεν βρέθηκε barcode στη φωτογραφία. Βεβαιωθείτε ότι το barcode είναι ευκρινές και καλά φωτισμένο.'
      }
    }

  } catch (err) {
    console.error('Photo scan error:', err)
    verificationResult.value = {
      success: false,
      message: '❌ Σφάλμα κατά τη φόρτωση της φωτογραφίας'
    }
  } finally {
    scanningBarcode.value = false
    event.target.value = ''
  }
}

const verifyScannedBarcode = async (scannedBarcode) => {
  const barcodeToVerify = scannedBarcode || manualBarcode.value
  
  if (!barcodeToVerify) return

  try {
    scanningBarcode.value = true
    verificationResult.value = null

    const expectedBarcode = verificationModal.value.instruction.barcode

    console.log('Verifying:', {
      scanned: barcodeToVerify,
      expected: expectedBarcode
    })

    // Check if barcodes match
    if (barcodeToVerify.trim() === expectedBarcode.trim()) {
      verificationResult.value = {
        success: true,
        message: '✅ Σωστό! Το barcode ταιριάζει με την οδηγία.'
      }

      // Mark instruction as verified locally
      const instruction = patient.value.medical_instructions.find(
        i => i.id === verificationModal.value.instruction.id
      )
      if (instruction) {
        instruction.verified = true
        instruction.verifiedTime = new Date().toLocaleTimeString('el-GR')
      }

      // Auto-close after 2 seconds
      setTimeout(() => {
        closeVerificationModal()
      }, 2000)

    } else {
      verificationResult.value = {
        success: false,
        message: `❌ Λάθος! Το barcode δεν ταιριάζει.\nΑναμενόμενο: ${expectedBarcode}\nΣαρωμένο: ${barcodeToVerify}`
      }
    }

  } catch (err) {
    console.error('Verification error:', err)
    verificationResult.value = {
      success: false,
      message: '❌ Σφάλμα κατά την επαλήθευση'
    }
  } finally {
    scanningBarcode.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('el-GR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleTimeString('el-GR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchPatientDetails()
})
</script>

<style scoped>
.patient-detail-container {
  max-width: 1400px;
  margin: 0 auto;
}

code {
  color: #d63384;
  background-color: #f8f9fa;
  padding: 2px 6px;
  border-radius: 3px;
}

.instruction-item {
  transition: all 0.2s;
  background-color: white;
}

.instruction-item.completed {
  background-color: #f8f9fa;
  opacity: 0.85;
}

.instruction-item:hover {
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

label {
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.instruction-item.border-success {
  border-width: 2px !important;
  background-color: #f0fff4;
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  overflow-y: auto;
}

.modal-dialog-custom {
  max-width: 600px;
  width: 100%;
  margin: auto;
}

.modal-content-custom {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  animation: modalZoomIn 0.3s ease-out;
  overflow: hidden;
}

@keyframes modalZoomIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header-custom {
  background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body-custom {
  padding: 1.5rem;
  max-height: 70vh;
  overflow-y: auto;
}

.btn-close-custom {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.btn-close-custom:hover {
  transform: scale(1.1);
}

.verification-result {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-sm {
  font-size: 0.875rem;
}

/* Patient Avatar Styles */
.patient-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.patient-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.patient-avatar-large:hover {
  transform: scale(1.05);
}

.patient-info h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.patient-badges {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.patient-badges .badge {
  font-size: 0.85rem;
  padding: 0.4rem 0.8rem;
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
}

.patient-profile-image {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.patient-profile-image:hover {
  transform: scale(1.1);
}

.patient-profile-image-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;
}

.patient-profile-image-large:hover {
  transform: scale(1.1);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .patient-header {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }
  
  .patient-avatar-large {
    width: 70px;
    height: 70px;
  }
  
  .patient-info h2 {
    font-size: 1.5rem;
  }
  
  .patient-badges {
    justify-content: center;
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .patient-header {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }
  
  .patient-avatar-large {
    width: 70px;
    height: 70px;
  }
  
  .patient-info h2 {
    font-size: 1.5rem;
  }
  
  .patient-badges {
    justify-content: center;
  }
}

/* Timeline History Styles */
.medication-timeline {
  position: relative;
  padding: 0;
}

.medication-timeline::before {
  content: '';
  position: absolute;
  left: 24px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, #22c55e 0%, #10b981 100%);
}

.history-item {
  position: relative;
  margin-bottom: 2rem;
  padding-left: 70px;
  min-height: 80px;
}

.history-item.last-item::after {
  content: '';
  position: absolute;
  left: 24px;
  bottom: -2rem;
  width: 2px;
  height: 2rem;
  background: transparent;
}

.history-marker {
  position: absolute;
  left: 0;
  top: 0;
  width: 50px;
  height: 50px;
  background: white;
  border: 3px solid #22c55e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #22c55e;
  font-size: 1.5rem;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.2);
}

.history-content {
  background: #f8f9fa;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.history-content:hover {
  border-color: #22c55e;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15);
  background: #f0fdf4;
}

.history-content h6 {
  color: #1e293b;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.history-content code {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

@media (max-width: 576px) {
  .modal-dialog-custom {
    margin: 0.5rem;
  }
  
  .modal-body-custom {
    padding: 1rem;
    max-height: 65vh;
  }
  
  .patient-avatar-large {
    width: 60px;
    height: 60px;
  }
  
  .patient-profile-image {
    width: 28px;
    height: 28px;
  }
  
  .patient-profile-image-large {
    width: 40px;
    height: 40px;
  }

  .medication-timeline::before {
    left: 17px;
  }

  .history-marker {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }

  .history-item {
    padding-left: 60px;
  }
}
</style>