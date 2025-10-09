<template>
  <div class="container-fluid p-3">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <!-- Header -->
        <div class="text-center mb-4">
          <h2 class="text-success mb-2">
            <i class="bi bi-upc-scan"></i>
            Επαλήθευση Φαρμάκου
          </h2>
          <p class="text-muted">Έλεγχος γνησιότητας barcode φαρμάκου</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-success" role="status">
            <span class="visually-hidden">Φόρτωση...</span>
          </div>
          <p class="mt-3 text-muted">Επαλήθευση barcode...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-danger text-center">
          <i class="bi bi-exclamation-triangle-fill fs-1 text-danger d-block mb-3"></i>
          <h4>❌ Σφάλμα Επαλήθευσης</h4>
          <p class="mb-3">{{ error }}</p>
          <button @click="retry" class="btn btn-outline-danger">
            <i class="bi bi-arrow-clockwise"></i> Δοκιμή Ξανά
          </button>
        </div>

        <!-- Success/Failure Result -->
        <div v-else-if="result" class="card border-0 shadow">
          <!-- Success Header -->
          <div v-if="result.verified" class="card-header bg-success text-white text-center py-4">
            <i class="bi bi-check-circle-fill fs-1 mb-3"></i>
            <h3 class="mb-0">✅ Επαλήθευση Επιτυχής</h3>
          </div>
          
          <!-- Failure Header -->
          <div v-else-if="result.alreadyCompleted" class="card-header bg-warning text-dark text-center py-4">
            <i class="bi bi-exclamation-triangle-fill fs-1 mb-3"></i>
            <h3 class="mb-0">⚠️ Ήδη Εκτελεσμένη</h3>
          </div>
          
          <!-- General Failure Header -->
          <div v-else class="card-header bg-danger text-white text-center py-4">
            <i class="bi bi-x-circle-fill fs-1 mb-3"></i>
            <h3 class="mb-0">❌ Λάθος Φάρμακο</h3>
          </div>

          <div class="card-body">
            <!-- Result Message -->
            <div class="alert" :class="result.verified ? 'alert-success' : (result.alreadyCompleted ? 'alert-warning' : 'alert-danger')" role="alert">
              <strong>{{ result.message }}</strong>
            </div>

            <!-- Patient Information -->
            <div v-if="patientInfo" class="mb-4">
              <h5 class="text-primary mb-3">
                <i class="bi bi-person-fill"></i> Στοιχεία Ασθενούς
              </h5>
              <div class="row">
                <div class="col-sm-6">
                  <strong>Όνομα:</strong><br>
                  <span class="text-muted">{{ patientInfo.full_name }}</span>
                </div>
                <div class="col-sm-6">
                  <strong>ΑΜΚΑ:</strong><br>
                  <span class="text-muted">{{ patientInfo.amka }}</span>
                </div>
              </div>
            </div>

            <!-- Instruction Information -->
            <div v-if="result.instruction" class="mb-4">
              <h5 class="text-info mb-3">
                <i class="bi bi-prescription2"></i> Ιατρική Οδηγία
              </h5>
              <div class="bg-light p-3 rounded">
                <p class="mb-2">
                  <strong>Περιγραφή:</strong><br>
                  {{ result.instruction.description }}
                </p>
                <p class="mb-2">
                  <strong>Barcode:</strong><br>
                  <code>{{ result.instruction.barcode }}</code>
                </p>
                <div class="d-flex align-items-center">
                  <strong class="me-2">Κατάσταση:</strong>
                  <span 
                    class="badge" 
                    :class="result.instruction.status === 'Completed' ? 'bg-success' : 'bg-warning'"
                  >
                    {{ result.instruction.status === 'Completed' ? 'Ολοκληρωμένη' : 'Αναμονή' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="d-grid gap-2">
              <!-- Mark as Completed Button (only show if verified and not completed) -->
              <button 
                v-if="result.verified && result.instruction && result.instruction.status !== 'Completed'"
                @click="markAsCompleted"
                :disabled="completing"
                class="btn btn-success btn-lg"
              >
                <i class="bi bi-check-square"></i>
                {{ completing ? 'Επεξεργασία...' : 'Επιβεβαίωση Εκτέλεσης' }}
              </button>

              <!-- Already Completed Message -->
              <div v-if="result.alreadyCompleted || (result.instruction && result.instruction.status === 'Completed')" class="alert alert-info">
                <i class="bi bi-check-circle-fill"></i>
                <strong>Η οδηγία έχει ήδη εκτελεστεί και δεν μπορεί να επαναληφθεί.</strong>
              </div>
              
              <button @click="scanAnother" class="btn btn-outline-primary">
                <i class="bi bi-arrow-clockwise"></i> Νέα Επαλήθευση
              </button>

              <button @click="goToLogin" class="btn btn-outline-secondary">
                <i class="bi bi-box-arrow-in-right"></i> Σύνδεση στο Σύστημα
              </button>
            </div>
          </div>
        </div>

        <!-- Instructions for scanning -->
        <div class="mt-4 text-center">
          <small class="text-muted d-block">
            <i class="bi bi-info-circle"></i>
            Αυτή η σελίδα ανοίγει αυτόματα όταν σκαναρίσετε το barcode με την κάμερα του τηλεφώνου σας
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'

export default {
  name: 'BarcodeVerifyView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const loading = ref(true)
    const error = ref(null)
    const result = ref(null)
    const patientInfo = ref(null)
    const completing = ref(false)
    
    const patientId = route.params.patientId
    const instructionId = route.params.instructionId

    const verifyBarcode = async () => {
      try {
        loading.value = true
        error.value = null
        
        console.log('Verifying barcode for:', { patientId, instructionId })
        
        // Verify the instruction by ID
        const response = await api.post('/instructions/verify-by-id', {
          patientId: parseInt(patientId),
          instructionId: parseInt(instructionId)
        })
        
        result.value = response.data
        
        // If verification is successful, get patient info
        if (response.data.verified) {
          try {
            const patientResponse = await api.get(`/patients/${patientId}/public`)
            patientInfo.value = patientResponse.data
          } catch (err) {
            console.warn('Could not fetch patient info:', err)
          }
        }
        
      } catch (err) {
        console.error('Error verifying barcode:', err)
        error.value = err.response?.data?.message || 'Σφάλμα κατά την επαλήθευση του barcode'
      } finally {
        loading.value = false
      }
    }

    const markAsCompleted = async () => {
      try {
        completing.value = true
        
        await api.patch(`/instructions/${instructionId}/complete`)
        
        // Update the local result
        if (result.value && result.value.instruction) {
          result.value.instruction.status = 'Completed'
        }
        
        // Show success message (could add a toast notification here)
        alert('✅ Η οδηγία σημάνθηκε ως ολοκληρωμένη!')
        
      } catch (err) {
        console.error('Error completing instruction:', err)
        alert('❌ Σφάλμα κατά την ολοκλήρωση της οδηγίας')
      } finally {
        completing.value = false
      }
    }

    const retry = () => {
      verifyBarcode()
    }

    const scanAnother = () => {
      // Reload the page or go back to allow scanning another barcode
      window.location.reload()
    }

    const goToLogin = () => {
      router.push('/login')
    }

    onMounted(() => {
      // Validate route parameters
      if (!patientId || !instructionId) {
        error.value = 'Μη έγκυροι παράμετροι URL'
        loading.value = false
        return
      }
      
      // Start verification
      verifyBarcode()
    })

    return {
      loading,
      error,
      result,
      patientInfo,
      completing,
      patientId,
      instructionId,
      verifyBarcode,
      markAsCompleted,
      retry,
      scanAnother,
      goToLogin
    }
  }
}
</script>

<style scoped>
.container-fluid {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.card {
  border-radius: 15px;
}

.card-header {
  border-radius: 15px 15px 0 0 !important;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.alert {
  border-radius: 10px;
}

.badge {
  font-size: 0.9em;
}

code {
  background-color: #f8f9fa;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}

.btn {
  border-radius: 8px;
}

@media (max-width: 768px) {
  .container-fluid {
    padding: 1rem;
  }
  
  .fs-1 {
    font-size: 2.5rem !important;
  }
}
</style>