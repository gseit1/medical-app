<template>
  <div class="card">
    <div class="card-header bg-success text-white">
      <h5 class="mb-0">
        <i class="bi bi-upc-scan"></i> Επαλήθευση Barcode
      </h5>
    </div>
    <div class="card-body">
      <!-- Scan Mode Toggle -->
      <div class="btn-group w-100 mb-3" role="group">
        <button
          type="button"
          class="btn"
          :class="scanMode === 'camera' ? 'btn-success' : 'btn-outline-success'"
          @click="setScanMode('camera')"
        >
          <i class="bi bi-camera"></i> Web Κάμερα
        </button>
        <button
          type="button"
          class="btn"
          :class="scanMode === 'photo' ? 'btn-success' : 'btn-outline-success'"
          @click="setScanMode('photo')"
        >
          <i class="bi bi-camera-fill"></i> Φωτογραφία
        </button>
        <button
          type="button"
          class="btn"
          :class="scanMode === 'manual' ? 'btn-success' : 'btn-outline-success'"
          @click="setScanMode('manual')"
        >
          <i class="bi bi-keyboard"></i> Χειροκίνητα
        </button>
      </div>

      <!-- Photo Scanner (Native Camera) -->
      <div v-if="scanMode === 'photo'" class="photo-section">
        <div class="text-center mb-3">
          <p class="text-muted">
            <i class="bi bi-info-circle"></i>
            Βγάλτε φωτογραφία του barcode με την κάμερα του τηλεφώνου
          </p>
        </div>

        <div class="mb-3">
          <label class="btn btn-success btn-lg w-100" for="photo-input">
            <i class="bi bi-camera-fill"></i>
            {{ photoProcessing ? 'Επεξεργασία...' : 'Άνοιγμα Κάμερας' }}
          </label>
          <input
            type="file"
            id="photo-input"
            accept="image/*"
            capture="environment"
            @change="handlePhotoUpload"
            style="display: none;"
            :disabled="photoProcessing"
          />
        </div>

        <!-- Photo Preview -->
        <div v-if="photoPreview" class="photo-preview mb-3">
          <img :src="photoPreview" alt="Barcode Photo" class="img-fluid rounded" />
          <button class="btn btn-sm btn-secondary mt-2 w-100" @click="clearPhoto">
            <i class="bi bi-x-circle"></i> Καθαρισμός
          </button>
        </div>

        <div v-if="photoError" class="alert alert-warning">
          <i class="bi bi-exclamation-triangle"></i>
          {{ photoError }}
        </div>
      </div>

      <!-- Camera Scanner -->
      <div v-if="scanMode === 'camera'" class="camera-section">
        <div v-show="!scanning" class="text-center">
          <button
            class="btn btn-lg btn-success"
            @click="startScanning"
            :disabled="loading"
          >
            <i class="bi bi-camera-fill"></i>
            {{ loading ? 'Φόρτωση...' : 'Έναρξη Σάρωσης' }}
          </button>
          <p class="text-muted mt-2 small">
            Πατήστε για να ανοίξετε την κάμερα
          </p>
        </div>

        <!-- Scanner is always in DOM when camera mode is active -->
        <div v-show="scanning" class="scanner-container">
          <div id="barcode-scanner" class="scanner-view"></div>
          <button
            class="btn btn-danger w-100 mt-2"
            @click="stopScanning"
          >
            <i class="bi bi-stop-circle"></i> Διακοπή Σάρωσης
          </button>
          <div class="scanner-overlay">
            <div class="scanner-frame"></div>
            <p class="text-white mt-3 text-center">
              Τοποθετήστε το barcode στο πλαίσιο
            </p>
          </div>
        </div>

        <div v-if="cameraError" class="alert alert-warning mt-3">
          <i class="bi bi-exclamation-triangle"></i>
          {{ cameraError }}
          <div class="mt-2">
            <small class="d-block">Δοκιμάστε:</small>
            <ul class="small mb-0">
              <li>Να δώσετε άδεια στην κάμερα στο browser</li>
              <li>Να χρησιμοποιήσετε HTTPS: <code>https://192.168.1.2:3000</code></li>
              <li>Να χρησιμοποιήσετε τη χειροκίνητη λειτουργία</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Manual Input -->
      <div v-if="scanMode === 'manual'">
        <form @submit.prevent="verifyBarcode">
          <div class="mb-3">
            <label for="barcode" class="form-label">
              Εισάγετε barcode
            </label>
            <input
              type="text"
              class="form-control barcode-input"
              id="barcode"
              v-model="barcodeInput"
              placeholder="MED001234567-571"
              required
              :disabled="verifying"
              ref="barcodeInputRef"
            />
            <small class="text-muted">
              Πληκτρολογήστε το barcode και πατήστε Enter
            </small>
          </div>

          <button
            type="submit"
            class="btn btn-success w-100"
            :disabled="verifying || !barcodeInput"
          >
            <span v-if="verifying">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Επαλήθευση...
            </span>
            <span v-else>
              <i class="bi bi-check-circle"></i> Επαλήθευση
            </span>
          </button>
        </form>
      </div>

      <!-- Verification Result -->
      <div
        v-if="verificationResult"
        class="verification-result mt-3"
      >
        <div
          class="alert"
          :class="verificationResult.verified ? 'alert-success' : 'alert-danger'"
          role="alert"
        >
          <h5 class="alert-heading">
            <i :class="verificationResult.verified ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'"></i>
            {{ verificationResult.message }}
          </h5>
          <hr v-if="verificationResult.verified">
          <p v-if="verificationResult.verified && verificationResult.instruction" class="mb-0">
            <strong>Οδηγία:</strong> {{ verificationResult.instruction.description }}<br>
            <strong>Barcode:</strong> <code>{{ verificationResult.instruction.barcode }}</code><br>
            <strong>Κατάσταση:</strong>
            <span
              class="badge ms-2"
              :class="verificationResult.instruction.status === 'Ολοκληρωμένη' ? 'bg-success' : 'bg-warning text-dark'"
            >
              {{ verificationResult.instruction.status }}
            </span>
          </p>
        </div>
      </div>

      <!-- Recent Verifications -->
      <div v-if="recentVerifications.length > 0" class="mt-3">
        <h6 class="text-muted small mb-2">Πρόσφατες Επαληθεύσεις</h6>
        <div class="list-group list-group-flush">
          <div
            v-for="(verification, index) in recentVerifications"
            :key="index"
            class="list-group-item list-group-item-action small py-2"
            :class="verification.verified ? 'list-group-item-success' : 'list-group-item-danger'"
          >
            <div class="d-flex justify-content-between align-items-center">
              <span>
                <i :class="verification.verified ? 'bi bi-check-circle' : 'bi bi-x-circle'"></i>
                <code class="ms-2">{{ verification.barcode }}</code>
              </span>
              <small class="text-muted">{{ verification.time }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Hidden scanner for photo mode -->
  <div id="photo-scanner" style="display: none;"></div>
</template>

<script setup>
import { ref, nextTick, onBeforeUnmount } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'
import api from '../services/api'

const props = defineProps({
  patientId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['verified'])

const scanMode = ref('photo') // Default to photo mode for better mobile experience
const barcodeInput = ref('')
const barcodeInputRef = ref(null)
const verifying = ref(false)
const verificationResult = ref(null)
const recentVerifications = ref([])

// Camera scanning
const scanning = ref(false)
const loading = ref(false)
const cameraError = ref(null)
let html5QrCode = null

// Photo scanning
const photoProcessing = ref(false)
const photoPreview = ref(null)
const photoError = ref(null)

const setScanMode = (mode) => {
  scanMode.value = mode
  verificationResult.value = null
  photoError.value = null
  cameraError.value = null
  
  if (mode === 'manual') {
    stopScanning()
    clearPhoto()
    nextTick(() => {
      barcodeInputRef.value?.focus()
    })
  } else if (mode === 'photo') {
    stopScanning()
  } else if (mode === 'camera') {
    clearPhoto()
  }
}

const handlePhotoUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    photoProcessing.value = true
    photoError.value = null

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target.result
    }
    reader.readAsDataURL(file)

    // Scan barcode from image
    const html5QrCode = new Html5Qrcode('photo-scanner')
    const result = await html5QrCode.scanFile(file, true)
    
    console.log('Scanned from photo:', result)
    barcodeInput.value = result
    await verifyBarcode()

    photoProcessing.value = false

  } catch (err) {
    console.error('Photo scan error:', err)
    photoProcessing.value = false
    photoError.value = 'Δεν βρέθηκε barcode στη φωτογραφία. Δοκιμάστε ξανά με καλύτερο φωτισμό.'
  }

  // Reset input
  event.target.value = ''
}

const clearPhoto = () => {
  photoPreview.value = null
  photoError.value = null
}

const startScanning = async () => {
  try {
    loading.value = true
    cameraError.value = null
    scanning.value = true

    // Wait for DOM to update and render the scanner element
    await nextTick()

    // Add a small delay to ensure element is fully rendered
    await new Promise(resolve => setTimeout(resolve, 100))

    html5QrCode = new Html5Qrcode('barcode-scanner')

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 150 },
      aspectRatio: 1.777778
    }

    await html5QrCode.start(
      { facingMode: 'environment' }, // Use back camera on mobile
      config,
      onScanSuccess,
      onScanError
    )

    loading.value = false

  } catch (err) {
    console.error('Camera error:', err)
    loading.value = false
    scanning.value = false
    cameraError.value = 'Δεν ήταν δυνατή η πρόσβαση στην κάμερα. Βεβαιωθείτε ότι έχετε δώσει άδεια.'
  }
}

const stopScanning = async () => {
  if (html5QrCode && scanning.value) {
    try {
      await html5QrCode.stop()
      html5QrCode.clear()
      html5QrCode = null
    } catch (err) {
      console.error('Error stopping scanner:', err)
    }
  }
  scanning.value = false
}

const onScanSuccess = (decodedText) => {
  console.log('Barcode scanned:', decodedText)
  barcodeInput.value = decodedText
  stopScanning()
  verifyBarcode()
}

const onScanError = (err) => {
  // Ignore scan errors (they happen constantly while scanning)
  // console.warn('Scan error:', err)
}

const verifyBarcode = async () => {
  if (!barcodeInput.value.trim()) return

  try {
    verifying.value = true
    verificationResult.value = null

    const response = await api.post('/instructions/verify-barcode', {
      patientId: props.patientId,
      barcode: barcodeInput.value.trim()
    })

    verificationResult.value = response.data

    // Add to recent verifications
    recentVerifications.value.unshift({
      barcode: barcodeInput.value.trim(),
      verified: response.data.verified,
      time: new Date().toLocaleTimeString('el-GR')
    })

    // Keep only last 5 verifications
    if (recentVerifications.value.length > 5) {
      recentVerifications.value.pop()
    }

    // Clear input
    barcodeInput.value = ''

    // Emit event if verified successfully
    if (response.data.verified) {
      emit('verified', response.data)
    }

    // Focus back on input after a short delay for manual mode
    if (scanMode.value === 'manual') {
      setTimeout(() => {
        nextTick(() => {
          barcodeInputRef.value?.focus()
        })
      }, 2000)
    }

  } catch (err) {
    console.error('Error verifying barcode:', err)
    verificationResult.value = {
      success: false,
      verified: false,
      message: '❌ Σφάλμα κατά την επαλήθευση'
    }
  } finally {
    verifying.value = false
  }
}

// Cleanup on component unmount
onBeforeUnmount(() => {
  stopScanning()
})

// Auto-focus on input when component mounts in manual mode
nextTick(() => {
  if (scanMode.value === 'manual') {
    barcodeInputRef.value?.focus()
  }
})
</script>

<style scoped>
.barcode-input {
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  letter-spacing: 2px;
  text-align: center;
  padding: 12px;
  border: 2px solid #dee2e6;
}

.barcode-input:focus {
  border-color: #198754;
  box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25);
}

.verification-result {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.scanner-container {
  position: relative;
}

.scanner-view {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
  min-height: 300px;
}

.scanner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.scanner-frame {
  width: 250px;
  height: 150px;
  border: 3px solid #28a745;
  border-radius: 8px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    border-color: #28a745;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 20px #28a745;
  }
  50% {
    border-color: #5cb85c;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 30px #5cb85c;
  }
}

.list-group-item {
  border-left: none;
  border-right: none;
}

.list-group-item:first-child {
  border-top: none;
}

code {
  font-size: 0.875rem;
}

.camera-section {
  min-height: 200px;
}

.photo-section {
  min-height: 200px;
}

.photo-preview {
  text-align: center;
}

.photo-preview img {
  max-height: 300px;
  border: 2px solid #dee2e6;
}

/* Mobile optimizations */
@media (max-width: 576px) {
  .scanner-frame {
    width: 200px;
    height: 120px;
  }
  
  .scanner-view {
    min-height: 250px;
  }
}
</style>
