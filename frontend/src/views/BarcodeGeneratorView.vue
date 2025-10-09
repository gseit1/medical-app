<template>
  <div class="container py-4">
    <div class="row">
      <div class="col-12">
        <h2 class="mb-4">
          <i class="bi bi-upc"></i> Γεννήτρια Barcodes
        </h2>
        <p class="text-muted">
          Εκτυπώστε αυτά τα barcodes για να δοκιμάσετε τη λειτουργία σάρωσης
        </p>

        <div class="alert alert-info">
          <i class="bi bi-info-circle"></i>
          <strong>Οδηγίες:</strong> Εκτυπώστε αυτή τη σελίδα ή εμφανίστε τα barcodes σε άλλη οθόνη και σαρώστε τα με την κάμερα του τηλεφώνου σας.
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Φόρτωση...</span>
          </div>
          <p class="mt-3">Φόρτωση barcodes...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-danger">
          <i class="bi bi-exclamation-triangle"></i>
          {{ error }}
        </div>

        <!-- Content -->
        <div v-else>
          <!-- URL Barcodes Section -->
        <div class="mb-5">
          <h3 class="mb-3">
            <i class="bi bi-link-45deg"></i> URL Barcodes (Νέο Σύστημα)
          </h3>
          <div class="alert alert-success">
            <i class="bi bi-phone"></i>
            <strong>Σκαναρίστε με την κάμερα του τηλεφώνου:</strong> Αυτά τα barcodes περιέχουν URLs που ανοίγουν αυτόματα στον browser και εμφανίζουν το αποτέλεσμα επαλήθευσης.
          </div>
          
          <div class="row g-4">
            <div
              v-for="urlBarcode in urlBarcodes"
              :key="urlBarcode.url"
              class="col-md-6 col-lg-4"
            >
              <div class="card h-100 border-success">
                <div class="card-body text-center">
                  <h6 class="card-title mb-3 text-success">{{ urlBarcode.patient }}</h6>
                  <p class="small text-muted mb-3">{{ urlBarcode.description }}</p>
                  
                  <!-- URL Barcode using QR Code -->
                  <div
                    :id="'qr-' + urlBarcode.patientId + '-' + urlBarcode.instructionId"
                    class="qr-code mb-3"
                  ></div>
                  
                  <code class="d-block mb-2 small">{{ urlBarcode.url }}</code>
                  
                  <span
                    class="badge"
                    :class="urlBarcode.status === 'Ολοκληρωμένη' ? 'bg-success' : 'bg-warning text-dark'"
                  >
                    {{ urlBarcode.status }}
                  </span>

                  <div class="mt-2">
                    <small class="text-muted d-block">Patient ID: {{ urlBarcode.patientId }}</small>
                    <small class="text-muted d-block">Instruction ID: {{ urlBarcode.instructionId }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Traditional Barcode Section -->
        <div class="mb-5">
          <h3 class="mb-3">
            <i class="bi bi-upc"></i> Παραδοσιακά Barcodes
          </h3>
          
          <div class="row g-4">
            <div
              v-for="instruction in sampleInstructions"
              :key="instruction.barcode"
              class="col-md-6 col-lg-4"
            >
              <div class="card h-100">
                <div class="card-body text-center">
                  <h6 class="card-title mb-3">{{ instruction.patient }}</h6>
                  <p class="small text-muted mb-3">{{ instruction.description }}</p>
                  
                  <!-- Barcode using SVG -->
                  <svg
                    :id="'barcode-' + instruction.barcode"
                    class="barcode-svg mb-2"
                  ></svg>
                  
                  <code class="d-block mb-2">{{ instruction.barcode }}</code>
                  
                  <span
                    class="badge"
                    :class="instruction.status === 'Ολοκληρωμένη' ? 'bg-success' : 'bg-warning text-dark'"
                  >
                    {{ instruction.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

          <div class="row mt-4">
            <div class="col-12 text-center no-print">
              <button class="btn btn-primary btn-lg" @click="printBarcodes">
                <i class="bi bi-printer"></i> Εκτύπωση Barcodes
              </button>
              <router-link to="/patients" class="btn btn-secondary btn-lg ms-2">
                <i class="bi bi-arrow-left"></i> Επιστροφή
              </router-link>
            </div>
          </div>
        </div> <!-- End of v-else content section -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import JsBarcode from 'jsbarcode'
import QRCode from 'qrcode'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const sampleInstructions = ref([])
const urlBarcodes = ref([])
const loading = ref(true)
const error = ref(null)

// Get frontend URL from environment variables
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || window.location.origin

// Fetch all patients and their medical instructions
const fetchAllData = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Get all patients with instructions
    console.log('Fetching patients with instructions...')
    const response = await api.get('/patients/with-instructions')
    const patients = response.data
    console.log('Patients received:', patients)
    
    // Build URL barcodes and sample instructions from real data
    const urlBarcodesData = []
    const sampleInstructionsData = []
    
    for (const patient of patients) {
      console.log('Processing patient:', patient.full_name, 'Instructions:', patient.medical_instructions?.length || 0)
      if (patient.medical_instructions && patient.medical_instructions.length > 0) {
        patient.medical_instructions.forEach(instruction => {
          // URL barcode data
          urlBarcodesData.push({
            patientId: patient.id,
            instructionId: instruction.id,
            patient: patient.full_name,
            description: instruction.description,
            status: instruction.status === 'Completed' ? 'Ολοκληρωμένη' : 'Αναμονή',
            url: `${FRONTEND_URL}/verify/${patient.id}/${instruction.id}`
          })
          
          // Sample instruction data for traditional barcodes
          sampleInstructionsData.push({
            barcode: instruction.barcode,
            patient: patient.full_name,
            description: instruction.description,
            status: instruction.status === 'Completed' ? 'Ολοκληρωμένη' : 'Αναμονή'
          })
        })
      }
    }
    
    console.log('URL Barcodes generated:', urlBarcodesData.length)
    console.log('Sample Instructions generated:', sampleInstructionsData.length)
    
    urlBarcodes.value = urlBarcodesData
    sampleInstructions.value = sampleInstructionsData
    
  } catch (err) {
    console.error('Error fetching data:', err)
    error.value = 'Σφάλμα κατά τη φόρτωση των δεδομένων'
  } finally {
    loading.value = false
  }
}

const generateBarcodes = () => {
  // Wait a bit for DOM to update
  setTimeout(() => {
    // Generate traditional barcodes
    sampleInstructions.value.forEach(instruction => {
      try {
        JsBarcode(`#barcode-${instruction.barcode}`, instruction.barcode, {
          format: 'CODE128',
          width: 2,
          height: 80,
          displayValue: false,
          margin: 10
        })
      } catch (error) {
        console.error('Error generating barcode:', instruction.barcode, error)
      }
    })

    // Generate QR codes for URL barcodes
    urlBarcodes.value.forEach(async (urlBarcode) => {
      try {
        const canvas = document.createElement('canvas')
        await QRCode.toCanvas(canvas, urlBarcode.url, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        
        const container = document.getElementById(`qr-${urlBarcode.patientId}-${urlBarcode.instructionId}`)
        if (container) {
          // Clear existing content first
          container.innerHTML = ''
          container.appendChild(canvas)
        }
      } catch (error) {
        console.error('Error generating QR code:', urlBarcode.url, error)
      }
    })
  }, 100)
}

const printBarcodes = () => {
  window.print()
}

onMounted(async () => {
  // Check if user is authenticated and is a nurse
  if (!authStore.isAuthenticated || !authStore.isNurse) {
    router.push('/login')
    return
  }
  
  await fetchAllData()
  generateBarcodes()
})
</script>

<style scoped>
.barcode-svg {
  max-width: 100%;
  height: auto;
}

.qr-code {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 150px;
}

.qr-code canvas {
  max-width: 100%;
  height: auto;
}

.card {
  break-inside: avoid;
}

@media print {
  .no-print {
    display: none !important;
  }
  
  .card {
    page-break-inside: avoid;
    border: 1px solid #000;
  }
  
  .container {
    max-width: 100%;
  }
}
</style>
