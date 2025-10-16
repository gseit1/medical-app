<template>
  <div class="container py-4">
    <div class="row">
      <div class="col-12">
        <h2 class="mb-4">
          <i class="bi bi-person-badge"></i> Patient Barcodes
        </h2>
        <p class="text-muted">
          Εκτυπώστε αυτά τα patient barcodes για γρήγορη επαλήθευση στο Βήμα 1
        </p>

        <div class="alert alert-info">
          <i class="bi bi-info-circle"></i>
          <strong>Οδηγίες:</strong> Εκτυπώστε αυτή τη σελίδα ή εμφανίστε τα barcodes σε άλλη οθόνη και σαρώστε τα με την κάμερα στο Βήμα 1 για να επιλέξετε γρήγορα τον ασθενή.
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Φόρτωση...</span>
          </div>
          <p class="mt-3">Φόρτωση patient barcodes...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-danger">
          <i class="bi bi-exclamation-triangle"></i>
          {{ error }}
        </div>

        <!-- Content -->
        <div v-else>
          <!-- Patient Barcodes Grid -->
          <div class="row g-4 mb-5">
            <div
              v-for="patient in patients"
              :key="patient.barcode"
              class="col-md-6 col-lg-4"
            >
              <div class="card h-100 border-primary shadow-sm">
                <div class="card-body text-center">
                  <div class="patient-icon mb-3">
                    <i class="bi bi-person-circle text-primary" style="font-size: 3rem;"></i>
                  </div>
                  
                  <h5 class="card-title mb-3 text-primary fw-bold">
                    {{ patient.full_name }}
                  </h5>
                  
                  <div class="patient-info mb-3 text-start">
                    <p class="mb-1">
                      <strong>ΑΜΚΑ:</strong> <code>{{ patient.amka }}</code>
                    </p>
                    <p class="mb-1">
                      <strong>ΑΦΜ:</strong> <code>{{ patient.afm }}</code>
                    </p>
                    <p class="mb-1">
                      <strong>Ομάδα Αίματος:</strong> 
                      <span class="badge bg-danger">{{ patient.blood_type }}</span>
                    </p>
                    <p class="mb-0">
                      <strong>Ηλικία:</strong> {{ patient.age }} ετών
                    </p>
                  </div>
                  
                  <div class="barcode-container mb-3">
                    <!-- Patient Barcode using SVG -->
                    <svg
                      :id="'patient-barcode-' + patient.barcode"
                      class="barcode-svg"
                    ></svg>
                  </div>
                  
                  <code class="d-block small text-dark fw-bold mb-2">{{ patient.barcode }}</code>
                  
                  <div class="badge bg-primary">
                    <i class="bi bi-qr-code"></i> Patient ID
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="row mt-4">
            <div class="col-12 text-center no-print">
              <button class="btn btn-primary btn-lg" @click="printBarcodes">
                <i class="bi bi-printer"></i> Εκτύπωση Patient Barcodes
              </button>
              <router-link to="/medication-safety" class="btn btn-success btn-lg ms-2">
                <i class="bi bi-shield-check"></i> Πήγαινε στη Σάρωση Φαρμάκων
              </router-link>
              <router-link to="/patients" class="btn btn-secondary btn-lg ms-2">
                <i class="bi bi-arrow-left"></i> Επιστροφή
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import JsBarcode from 'jsbarcode'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const patients = ref([])
const loading = ref(true)
const error = ref(null)

// Fetch all patients
const fetchPatients = async () => {
  try {
    loading.value = true
    error.value = null
    
    console.log('Fetching patients...')
    const response = await api.get('/patients')
    console.log('API response:', response.data)
    
    // Handle response format
    let patientsData = []
    if (response.data.success && response.data.patients) {
      patientsData = response.data.patients
    } else if (Array.isArray(response.data)) {
      patientsData = response.data
    } else {
      patientsData = []
    }
    
    console.log('Patients data:', patientsData)
    
    // Filter patients with barcodes
    const patientsWithBarcodes = patientsData.filter(p => p.barcode)
    
    if (patientsWithBarcodes.length === 0) {
      error.value = 'Δεν βρέθηκαν ασθενείς με barcodes. Παρακαλώ επικοινωνήστε με τον διαχειριστή.'
      console.log('⚠️ No patients with barcodes found')
    }
    
    patients.value = patientsWithBarcodes
    console.log('✅ Patients with barcodes:', patientsWithBarcodes.length)
    
  } catch (err) {
    console.error('Error fetching patients:', err)
    error.value = 'Σφάλμα κατά τη φόρτωση των ασθενών'
  } finally {
    loading.value = false
  }
}

const generateBarcodes = () => {
  // Wait a bit for DOM to update
  setTimeout(() => {
    patients.value.forEach(patient => {
      try {
        JsBarcode(`#patient-barcode-${patient.barcode}`, patient.barcode, {
          format: 'CODE128',
          width: 2,
          height: 100,
          displayValue: false,
          margin: 10
        })
      } catch (error) {
        console.error('Error generating barcode for patient:', patient.full_name, error)
      }
    })
  }, 100)
}

const printBarcodes = () => {
  window.print()
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  await fetchPatients()
  generateBarcodes()
})
</script>

<style scoped>
.barcode-svg {
  max-width: 100%;
  height: auto;
}

.card {
  transition: transform 0.2s, box-shadow 0.2s;
  page-break-inside: avoid;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.patient-info {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.barcode-container {
  background: white;
  padding: 1rem;
  border: 2px dashed #0d6efd;
  border-radius: 8px;
}

/* Print Styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  .container {
    max-width: 100%;
  }
  
  .card {
    page-break-inside: avoid;
    margin-bottom: 20px;
    border: 2px solid #0d6efd !important;
  }
  
  .alert {
    display: none;
  }
  
  h2, p.text-muted {
    display: none;
  }
}
</style>
