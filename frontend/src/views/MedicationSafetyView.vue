<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <!-- Header -->
        <div class="text-center mb-4">
          <h1 class="h2 text-primary">
            <i class="bi bi-shield-check"></i> 
            Ασφαλής Χορήγηση Φαρμάκων
          </h1>
          <p class="text-muted">Σύστημα επαλήθευσης δύο βημάτων για τη σωστή χορήγηση φαρμάκων</p>
        </div>

        <!-- Step Indicator -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="d-flex justify-content-center">
              <div class="step-indicator">
                <!-- Step 1 -->
                <div class="step" :class="{ 'active': currentStep >= 1, 'completed': currentStep > 1 }">
                  <div class="step-number">1</div>
                  <div class="step-label">Επιλογή Ασθενή</div>
                </div>
                
                <!-- Connector -->
                <div class="step-connector" :class="{ 'active': currentStep > 1 }"></div>
                
                <!-- Step 2 -->
                <div class="step" :class="{ 'active': currentStep >= 2 }">
                  <div class="step-number">2</div>
                  <div class="step-label">Σάρωση Φαρμάκου</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 1: Patient Selection -->
        <div v-if="currentStep === 1" class="card border-primary">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0">
              <i class="bi bi-person-check"></i> 
              Βήμα 1: Επιλέξτε τον Ασθενή
            </h4>
          </div>
          <div class="card-body">
            <div class="alert alert-info">
              <i class="bi bi-info-circle"></i>
              <strong>Οδηγία:</strong> Πρώτα επιλέξτε τον ασθενή από τη λίστα ή σκαναρίστε το βραχιολάκι του.
            </div>
            
            <div class="row g-3">
              <div 
                v-for="patient in patients" 
                :key="patient.id"
                class="col-md-6"
              >
                <div 
                  class="card patient-card h-100" 
                  @click="selectPatient(patient)"
                  style="cursor: pointer;"
                >
                  <div class="card-body">
                    <h5 class="card-title text-primary">{{ patient.full_name }}</h5>
                    <p class="card-text">
                      <strong>ΑΜΚΑ:</strong> {{ patient.amka }}<br>
                      <strong>Ομάδα Αίματος:</strong> {{ patient.blood_type }}<br>
                      <strong>Φάρμακα:</strong> {{ patient.medical_instructions?.length || 0 }}
                    </p>
                    <div class="text-end">
                      <span class="badge bg-primary">Επιλογή</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Medication Scanning -->
        <div v-if="currentStep === 2" class="card border-warning">
          <div class="card-header bg-warning text-dark">
            <h4 class="mb-0 d-flex justify-content-between align-items-center">
              <span>
                <i class="bi bi-upc-scan"></i> 
                Βήμα 2: Σκαναρίστε το Φάρμακο
              </span>
              <button class="btn btn-outline-dark btn-sm" @click="goBackToPatientSelection">
                <i class="bi bi-arrow-left"></i> Αλλαγή Ασθενή
              </button>
            </h4>
          </div>
          <div class="card-body">
            <!-- Selected Patient Info -->
            <div class="alert alert-primary d-flex align-items-center">
              <i class="bi bi-person-fill me-2"></i>
              <div>
                <strong>Επιλεγμένος Ασθενής:</strong> {{ selectedPatient.full_name }}<br>
                <small>ΑΜΚΑ: {{ selectedPatient.amka }}</small>
              </div>
            </div>

            <!-- Barcode Scanner -->
            <div class="mb-4">
              <label class="form-label">
                <i class="bi bi-upc"></i> Barcode Φαρμάκου:
              </label>
              
              <!-- Show scanned barcode if available -->
              <div v-if="scannedBarcode" class="alert alert-info d-flex justify-content-between align-items-center">
                <div>
                  <i class="bi bi-check-circle me-2"></i>
                  <strong>Σκαρωμένο Barcode:</strong> {{ scannedBarcode }}
                </div>
                <button class="btn btn-outline-primary btn-sm" @click="clearBarcode">
                  <i class="bi bi-arrow-clockwise"></i> Νέα Σκάρωση
                </button>
              </div>
              
              <!-- Barcode Scanner Component -->
              <BarcodeScanner 
                v-if="!scannedBarcode"
                @barcode-detected="handleBarcodeDetected"
              />
              
              <!-- Verify Button -->
              <div v-if="scannedBarcode" class="mt-3">
                <button 
                  class="btn btn-success btn-lg w-100" 
                  @click="verifyMedication"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-shield-check me-2"></i>
                  {{ loading ? 'Επαλήθευση...' : 'Επαλήθευση Ασφαλείας' }}
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="alert alert-danger">
              <i class="bi bi-exclamation-triangle"></i>
              {{ error }}
            </div>

            <!-- Verification Result -->
            <div v-if="verificationResult" class="mt-4">
              <!-- SUCCESS: Correct Medication -->
              <div v-if="verificationResult.success && verificationResult.verified" class="alert alert-success">
                <div class="d-flex align-items-center mb-3">
                  <i class="bi bi-check-circle-fill fs-3 me-3 text-success"></i>
                  <div>
                    <h5 class="mb-1">✅ ΣΩΣΤΟ ΦΑΡΜΑΚΟ</h5>
                    <p class="mb-0">Το φάρμακο είναι σωστό για αυτόν τον ασθενή</p>
                  </div>
                </div>
                
                <!-- Medication Details -->
                <div class="bg-light p-3 rounded">
                  <h6>Στοιχεία Φαρμάκου:</h6>
                  <p class="mb-1"><strong>Περιγραφή:</strong> {{ verificationResult.instruction.description }}</p>
                  <p class="mb-1"><strong>Barcode:</strong> {{ verificationResult.instruction.barcode }}</p>
                  <p class="mb-0">
                    <strong>Κατάσταση:</strong> 
                    <span class="badge" :class="verificationResult.instruction.status === 'Completed' ? 'bg-success' : 'bg-warning'">
                      {{ verificationResult.instruction.status === 'Completed' ? 'Χορηγήθηκε' : 'Εκκρεμή' }}
                    </span>
                  </p>
                </div>

                <!-- Action Button -->
                <div class="mt-3" v-if="verificationResult.instruction.status !== 'Completed'">
                  <button class="btn btn-success btn-lg" @click="markAsCompleted">
                    <i class="bi bi-check-square"></i> Επιβεβαίωση Χορήγησης
                  </button>
                </div>
                <div class="mt-3" v-else>
                  <div class="alert alert-info mb-0">
                    <i class="bi bi-info-circle"></i>
                    Το φάρμακο έχει ήδη χορηγηθεί σε αυτόν τον ασθενή.
                  </div>
                </div>
              </div>

              <!-- ERROR: Wrong Medication or Safety Issue -->
              <div v-else class="alert alert-danger">
                <div class="d-flex align-items-center mb-3">
                  <i class="bi bi-exclamation-triangle-fill fs-3 me-3 text-danger"></i>
                  <div>
                    <h5 class="mb-1">❌ ΠΡΟΣΟΧΗ - ΛΑΘΟΣ ΦΑΡΜΑΚΟ</h5>
                    <p class="mb-0">{{ verificationResult.message }}</p>
                  </div>
                </div>
                
                <!-- Safety Instructions -->
                <div class="bg-light p-3 rounded">
                  <h6 class="text-danger">Οδηγίες Ασφαλείας:</h6>
                  <ul class="mb-0">
                    <li>ΜΗΝ χορηγήσετε αυτό το φάρμακο</li>
                    <li>Ελέγξτε ξανά την ταυτότητα του ασθενή</li>
                    <li>Βεβαιωθείτε ότι έχετε το σωστό φάρμακο</li>
                    <li>Συμβουλευθείτε τον επιβλέποντα ιατρό</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-4 text-center">
              <button class="btn btn-outline-secondary me-2" @click="startOver">
                <i class="bi bi-arrow-clockwise"></i> Νέα Διαδικασία
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import BarcodeScanner from '../components/BarcodeScanner.vue'

export default {
  name: 'MedicationSafetyView',
  components: {
    BarcodeScanner
  },
  setup() {
    const router = useRouter()
    
    const currentStep = ref(1) // 1: Patient Selection, 2: Medication Scanning
    const selectedPatient = ref(null)
    const patients = ref([])
    const scannedBarcode = ref('')
    const verificationResult = ref(null)
    const loading = ref(false)
    const error = ref(null)

    // Fetch all patients for selection
    const fetchPatients = async () => {
      try {
        const response = await api.get('/patients/with-instructions')
        patients.value = response.data
      } catch (err) {
        error.value = 'Σφάλμα φόρτωσης ασθενών'
      }
    }

    // Select patient and move to step 2
    const selectPatient = (patient) => {
      selectedPatient.value = patient
      currentStep.value = 2
      verificationResult.value = null
      scannedBarcode.value = ''
    }

    // Verify medication barcode for selected patient
    const verifyMedication = async () => {
      if (!scannedBarcode.value.trim()) {
        error.value = 'Παρακαλώ εισάγετε barcode'
        return
      }

      try {
        loading.value = true
        error.value = null
        
        // Call new safety verification endpoint
        const response = await api.post('/instructions/verify-safety', {
          patientId: selectedPatient.value.id,
          barcode: scannedBarcode.value.trim()
        })
        
        verificationResult.value = response.data
        
      } catch (err) {
        console.error('Error verifying medication:', err)
        verificationResult.value = {
          success: false,
          safetyError: true,
          message: err.response?.data?.message || 'Σφάλμα επαλήθευσης'
        }
      } finally {
        loading.value = false
      }
    }

    // Mark medication as administered
    const markAsCompleted = async () => {
      if (!verificationResult.value?.instruction?.id) return

      try {
        await api.patch(`/instructions/${verificationResult.value.instruction.id}/complete`)
        
        // Update local state
        if (verificationResult.value.instruction) {
          verificationResult.value.instruction.status = 'Completed'
        }
        
        alert('✅ Το φάρμακο χορηγήθηκε επιτυχώς!')
        
      } catch (err) {
        alert('❌ Σφάλμα κατά την καταγραφή χορήγησης')
      }
    }

    // Reset to start over
    const startOver = () => {
      currentStep.value = 1
      selectedPatient.value = null
      scannedBarcode.value = ''
      verificationResult.value = null
      error.value = null
    }

    // Go back to patient selection
    const goBackToPatientSelection = () => {
      currentStep.value = 1
      scannedBarcode.value = ''
      verificationResult.value = null
      error.value = null
    }

    // Handle barcode detected from scanner
    const handleBarcodeDetected = (barcode) => {
      console.log('Barcode detected:', barcode)
      scannedBarcode.value = barcode
      error.value = null
      
      // Auto-verify after scanning (optional - remove if you want manual confirmation)
      setTimeout(() => {
        verifyMedication()
      }, 500)
    }

    // Clear scanned barcode to allow new scanning
    const clearBarcode = () => {
      scannedBarcode.value = ''
      verificationResult.value = null
      error.value = null
    }

    onMounted(() => {
      fetchPatients()
    })

    return {
      currentStep,
      selectedPatient,
      patients,
      scannedBarcode,
      verificationResult,
      loading,
      error,
      selectPatient,
      verifyMedication,
      markAsCompleted,
      startOver,
      goBackToPatientSelection,
      handleBarcodeDetected,
      clearBarcode
    }
  }
}
</script>

<style scoped>
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  max-width: 400px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.step-number {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e9ecef;
  color: #6c757d;
  font-weight: bold;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background-color: #0d6efd;
  color: white;
}

.step.completed .step-number {
  background-color: #198754;
  color: white;
}

.step-label {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}

.step.active .step-label,
.step.completed .step-label {
  color: #212529;
  font-weight: bold;
}

.step-connector {
  width: 100px;
  height: 2px;
  background-color: #e9ecef;
  margin: 0 20px;
  transition: all 0.3s ease;
}

.step-connector.active {
  background-color: #198754;
}

.patient-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.patient-card:hover {
  border-color: #0d6efd;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.alert {
  border-left: 4px solid;
}

.alert-success {
  border-left-color: #198754;
}

.alert-danger {
  border-left-color: #dc3545;
}

.alert-warning {
  border-left-color: #ffc107;
}

.alert-info {
  border-left-color: #0dcaf0;
}

@media (max-width: 768px) {
  .step-indicator {
    flex-direction: column;
    gap: 20px;
  }
  
  .step-connector {
    width: 2px;
    height: 50px;
    margin: 10px 0;
  }
}
</style>