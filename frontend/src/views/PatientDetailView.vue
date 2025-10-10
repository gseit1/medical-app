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
          <h1 class="display-5">
            <i class="bi bi-person-badge-fill text-primary"></i>
            {{ patient.full_name }}
          </h1>
        </div>
      </div>

      <div class="row">
        <!-- Left Column - Patient Info -->
        <div class="col-lg-4 mb-4">
          <!-- Basic Info Card -->
          <div class="card mb-3">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">
                <i class="bi bi-person-circle"></i> Στοιχεία Ασθενή
              </h5>
            </div>
            <div class="card-body">
              <!-- Patient Avatar -->
              <div class="text-center mb-4">
                <div class="patient-avatar-large">
                  <img 
                    v-if="getPatientAvatar(patient)"
                    :src="getPatientAvatar(patient)"
                    :alt="patient.full_name"
                    class="patient-profile-image-large"
                  >
                  <i v-else class="bi bi-person-circle"></i>
                </div>
                <h5 class="mt-2 mb-0">{{ patient.full_name }}</h5>
                <small class="text-muted">Patient ID: {{ patient.id }}</small>
              </div>
              
              <div class="mb-3">
                <label class="text-muted small">Ονοματεπώνυμο</label>
                <p class="fw-bold mb-0">{{ patient.full_name }}</p>
              </div>
              <div class="mb-3">
                <label class="text-muted small">Α.Μ.Κ.Α</label>
                <p class="mb-0"><code>{{ patient.amka }}</code></p>
              </div>
              <div class="mb-3">
                <label class="text-muted small">Α.Φ.Μ</label>
                <p class="mb-0"><code>{{ patient.afm }}</code></p>
              </div>
              <div class="mb-0">
                <label class="text-muted small">Ομάδα Αίματος</label>
                <p class="mb-0">
                  <span class="badge bg-danger fs-6">{{ patient.blood_type || 'N/A' }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Medical Instructions & Referrals -->
        <div class="col-lg-8">
          <!-- Medical Instructions -->
          <div class="card mb-4">
            <div class="card-header bg-info text-white">
              <h5 class="mb-0">
                <i class="bi bi-clipboard-pulse"></i> Ιατρικές Οδηγίες
              </h5>
            </div>
            <div class="card-body">
              <div v-if="!patient.medical_instructions || patient.medical_instructions.length === 0" class="text-center py-4">
                <i class="bi bi-inbox" style="font-size: 3rem; color: #ccc;"></i>
                <p class="text-muted mt-2">Δεν υπάρχουν ιατρικές οδηγίες</p>
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

          <!-- Referrals -->
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
                <table class="table table-sm">
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'
import { BrowserMultiFormatReader } from '@zxing/library'

const route = useRoute()
const authStore = useAuthStore()

const patient = ref(null)
const loading = ref(true)
const error = ref(null)

// Verification Modal
const verificationModal = ref({
  show: false,
  instruction: null
})
const scanMethod = ref('manual') // Default to manual entry for reliability
const manualBarcode = ref('')
const scanningBarcode = ref(false)
const verificationResult = ref(null)

// Patient Avatar System
const getPatientAvatar = (patient) => {
  if (!patient) return null
  
  const patientAvatars = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=120&h=120&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&h=120&fit=crop&crop=face&auto=format&q=80'
  ]
  
  const avatarIndex = (patient.id || 0) % patientAvatars.length
  return patientAvatars[avatarIndex]
}

const fetchPatientDetails = async () => {
  try {
    loading.value = true
    error.value = null
    const patientId = route.params.id
    const response = await api.get(`/patients/${patientId}`)
    patient.value = response.data
    
    console.log('Patient data loaded:', patient.value)
    console.log('Medical instructions:', patient.value.medical_instructions)
    console.log('Instructions count:', patient.value.medical_instructions?.length)
    
  } catch (err) {
    error.value = err.response?.data?.message || 'Σφάλμα φόρτωσης στοιχείων ασθενή'
    console.error('Error fetching patient details:', err)
  } finally {
    loading.value = false
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

/* Patient Avatar Large Styling */
.patient-avatar-large {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: relative;
}

.patient-profile-image-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.patient-profile-image-large:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  border-color: #3b82f6;
}

.patient-avatar-large i {
  font-size: 2.5rem;
  color: #ffffff;
}

/* Mobile responsive */
@media (max-width: 576px) {
  .modal-dialog-custom {
    margin: 0.5rem;
  }
  
  .modal-body-custom {
    padding: 1rem;
    max-height: 65vh;
  }
}

</style>
