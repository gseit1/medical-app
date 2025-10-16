<template>
  <div class="barcode-scanner">
    <!--              <button class="btn btn-success" @click="submitManualBarcode">
                <i class="bi bi-check"></i> Υποβολή
              </button>
            </div>
            
            Quick Test Buttons
            <div class="mt-2">
              <p class="text-white-50 small mb-2">Δοκιμαστικά barcodes:</p>
              <div class="d-flex flex-wrap gap-1">
                <button class="btn btn-outline-info btn-sm" @click="testBarcode('MED001234567')">
                  MED001234567
                </button>
                <button class="btn btn-outline-info btn-sm" @click="testBarcode('MED001234568')">
                  MED001234568
                </button>
                <button class="btn btn-outline-info btn-sm" @click="testBarcode('MED001234569')">
                  MED001234569
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <!-- End of commented Container section -->
    <div v-if="isScanning" class="scanner-container">
      <div class="scanner-overlay">
        <div class="scanner-header">
          <h5 class="text-white mb-0">
            <i class="bi bi-upc-scan"></i> Σάρωση Barcode
          </h5>
          <button class="btn btn-outline-light btn-sm" @click="stopScanner">
            <i class="bi bi-x"></i> Κλείσιμο
          </button>
        </div>
        
        <div class="scanner-viewfinder">
          <div id="scanner" ref="scannerElement"></div>
          <div class="viewfinder-overlay">
            <div class="scanning-line"></div>
            <div class="corner corner-tl"></div>
            <div class="corner corner-tr"></div>
            <div class="corner corner-bl"></div>
            <div class="corner corner-br"></div>
          </div>
        </div>
        
        <div class="scanner-instructions">
          <p class="text-white text-center mb-2">
            Κρατήστε το barcode μέσα στο πλαίσιο
          </p>
          <p class="text-white-50 text-center small">
            Βεβαιωθείτε ότι το barcode είναι καθαρό και ευκρινές
          </p>
          
          <!-- Manual Input Fallback -->
          <div class="mt-3">
            <button class="btn btn-outline-light btn-sm" @click="showManualInput = !showManualInput">
              <i class="bi bi-keyboard"></i> Χειροκίνητη Εισαγωγή
            </button>
            <button class="btn btn-outline-warning btn-sm ms-2" @click="useSimpleScanner = !useSimpleScanner">
              <i class="bi bi-camera2"></i> Απλό Scanner
            </button>
          </div>
          
          <div v-if="showManualInput" class="mt-3">
            <div class="input-group">
              <input 
                v-model="manualBarcode" 
                type="text" 
                class="form-control" 
                placeholder="π.χ. MED001234567"
                @keyup.enter="submitManualBarcode"
                style="background: rgba(255,255,255,0.9);"
              >
              <button class="btn btn-success" @click="submitManualBarcode">
                <i class="bi bi-check"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Scanner Trigger Button -->
    <div v-else class="scanner-trigger">
      <button class="btn btn-primary btn-lg w-100" @click="startScanner">
        <i class="bi bi-camera me-2"></i> 
        Σάρωση με Κάμερα
      </button>
      
      <!-- Manual Input Option -->
      <div class="text-center mt-3">
        <button class="btn btn-outline-secondary" @click="showManualInput = !showManualInput">
          <i class="bi bi-keyboard"></i> Χειροκίνητη Εισαγωγή
        </button>
      </div>
      
      <div v-if="showManualInput && !isScanning" class="mt-3">
        <label class="form-label">Barcode:</label>
        <div class="input-group">
          <input 
            v-model="manualBarcode" 
            type="text" 
            class="form-control" 
            placeholder="Εισάγετε ή σκαναρίστε barcode..."
            @keyup.enter="submitManualBarcode"
          >
          <button class="btn btn-primary" @click="submitManualBarcode" :disabled="!manualBarcode.trim()">
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Error Display -->
    <div v-if="error" class="alert alert-warning mt-3">
      <div class="d-flex align-items-start">
        <i class="bi bi-exclamation-triangle me-2 mt-1"></i>
        <div>
          <strong>Πρόβλημα με την κάμερα:</strong><br>
          {{ error }}
          
          <div v-if="error.includes('chrome://flags')" class="mt-2">
            <small class="text-muted">
              <strong>Βήματα:</strong><br>
              1. Ανοίξτε νέα καρτέλα και πηγαίνετε στο chrome://flags/#unsafely-treat-insecure-origin-as-secure<br>
              2. Προσθέστε: http://192.168.1.2:3000<br>
              3. Επανεκκινήστε το Chrome
            </small>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Success Display -->
    <div v-if="lastScannedBarcode" class="alert alert-success mt-3">
      <i class="bi bi-check-circle"></i>
      <strong>Σκαρώθηκε:</strong> {{ lastScannedBarcode }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import Quagga from 'quagga'

export default {
  name: 'BarcodeScanner',
  emits: ['barcode-detected'],
  setup(props, { emit }) {
    const scannerElement = ref(null)
    const isScanning = ref(false)
    const showManualInput = ref(false)
    const useSimpleScanner = ref(false)
    const manualBarcode = ref('')
    const lastScannedBarcode = ref('')
    const error = ref(null)
    const scannerInitialized = ref(false)

    const startScanner = async () => {
      try {
        error.value = null
        isScanning.value = true
        showManualInput.value = false
        
        // Check if we're on HTTPS or localhost
        const isSecure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1'
        
        if (!isSecure) {
          error.value = 'Για την κάμερα απαιτείται HTTPS ή localhost. Χρησιμοποιήστε τη χειροκίνητη εισαγωγή ή ενεργοποιήστε το chrome://flags/#unsafely-treat-insecure-origin-as-secure'
          isScanning.value = false
          showManualInput.value = true
          return
        }
        
        // Wait for DOM update
        await new Promise(resolve => setTimeout(resolve, 100))
        
        if (!scannerElement.value) {
          throw new Error('Scanner element not found')
        }

        const config = {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: scannerElement.value,
            constraints: {
              width: 640,
              height: 480,
              facingMode: "environment" // Use back camera
            }
          },
          locator: {
            patchSize: "large",
            halfSample: false
          },
          numOfWorkers: navigator.hardwareConcurrency || 2,
          frequency: 10,
          decoder: {
            readers: [
              "code_128_reader",
              "ean_reader",
              "ean_8_reader", 
              "code_39_reader",
              "code_39_vin_reader",
              "codabar_reader",
              "upc_reader",
              "upc_e_reader",
              "i2of5_reader"
            ],
            debug: {
              showCanvas: false,
              showPatches: false,
              showFoundPatches: false,
              showSkeleton: false,
              showLabels: false,
              showPatchLabels: false,
              showRemainingPatchLabels: false,
              boxFromPatches: {
                showTransformed: false,
                showTransformedBox: false,
                showBB: false
              }
            }
          },
          locate: true
        }

        Quagga.init(config, (err) => {
          if (err) {
            console.error('Scanner initialization error:', err)
            
            // Provide specific error messages
            if (err.name === 'NotAllowedError' || err.message.includes('Permission denied')) {
              error.value = '🚫 Δεν επιτρέπεται η πρόσβαση στην κάμερα. Παρακαλώ δώστε άδεια χρήσης κάμερας.'
            } else if (err.name === 'NotFoundError') {
              error.value = '📹 Δεν βρέθηκε κάμερα στη συσκευή σας.'
            } else if (err.message.includes('getUserMedia') || err.message.includes('HTTPS')) {
              error.value = '🔒 Για την κάμερα απαιτείται HTTPS. Ενεργοποιήστε το chrome://flags/#unsafely-treat-insecure-origin-as-secure και προσθέστε τη διεύθυνση: http://192.168.1.2:3000'
            } else {
              error.value = 'Σφάλμα κάμερας. Χρησιμοποιήστε τη χειροκίνητη εισαγωγή παρακάτω.'
            }
            
            isScanning.value = false
            showManualInput.value = true
            return
          }
          
          console.log("Scanner initialized successfully")
          scannerInitialized.value = true
          Quagga.start()
        })

        // Track consecutive detections for reliability
        let consecutiveDetections = {}
        let detectionThreshold = 3 // Require 3 consecutive detections
        
        // Listen for successful barcode detection
        Quagga.onDetected((result) => {
          const code = result.codeResult.code
          console.log('🔍 Barcode detected:', code)
          
          if (!code || code.length < 5) {
            console.log('❌ Invalid barcode (too short):', code)
            return
          }
          
          // Count consecutive detections
          if (!consecutiveDetections[code]) {
            consecutiveDetections[code] = 0
          }
          consecutiveDetections[code]++
          
          console.log(`📊 Consecutive detections for ${code}: ${consecutiveDetections[code]}/${detectionThreshold}`)
          
          // If we have enough consecutive detections, accept the barcode
          if (consecutiveDetections[code] >= detectionThreshold) {
            console.log('✅ Valid barcode confirmed, emitting event:', code)
            lastScannedBarcode.value = code
            emit('barcode-detected', code)
            stopScanner()
          }
          
          // Clear other codes after successful detection
          setTimeout(() => {
            if (consecutiveDetections[code] < detectionThreshold) {
              consecutiveDetections = {}
            }
          }, 1000)
        })

        // Add processing listener for debugging
        Quagga.onProcessed((result) => {
          const drawingCtx = Quagga.canvas.ctx.overlay
          const drawingCanvas = Quagga.canvas.dom.overlay

          if (result) {
            if (result.boxes) {
              drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")))
              result.boxes.filter(function (box) {
                return box !== result.box
              }).forEach(function (box) {
                Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 })
              })
            }

            if (result.box) {
              Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 })
            }

            if (result.codeResult && result.codeResult.code) {
              Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 })
            }
          }
        })

      } catch (err) {
        console.error('Error starting scanner:', err)
        error.value = 'Δεν ήταν δυνατή η πρόσβαση στην κάμερα'
        isScanning.value = false
      }
    }

    const stopScanner = () => {
      if (scannerInitialized.value) {
        Quagga.stop()
        scannerInitialized.value = false
      }
      isScanning.value = false
      error.value = null
    }

    const submitManualBarcode = () => {
      if (manualBarcode.value.trim()) {
        const code = manualBarcode.value.trim()
        console.log('📝 Manual barcode input:', code)
        lastScannedBarcode.value = code
        emit('barcode-detected', code)
        manualBarcode.value = ''
        showManualInput.value = false
      }
    }

    const testBarcode = (code) => {
      console.log('🧪 Test barcode:', code)
      lastScannedBarcode.value = code
      emit('barcode-detected', code)
      stopScanner()
    }

    onUnmounted(() => {
      stopScanner()
    })

    return {
      scannerElement,
      isScanning,
      showManualInput,
      useSimpleScanner,
      manualBarcode,
      lastScannedBarcode,
      error,
      startScanner,
      stopScanner,
      submitManualBarcode,
      testBarcode
    }
  }
}
</script>

<style scoped>
.scanner-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  flex-direction: column;
}

.scanner-overlay {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.scanner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.scanner-viewfinder {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  max-height: 400px;
}

#scanner {
  width: 100%;
  max-width: 320px;
  height: 240px;
  border: 2px solid #fff;
  border-radius: 8px;
  overflow: hidden;
}

.viewfinder-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.scanning-line {
  position: absolute;
  top: 50%;
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ff00, transparent);
  animation: scanning 2s linear infinite;
}

@keyframes scanning {
  0% { transform: translateY(-100px); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(100px); opacity: 0; }
}

.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid #00ff00;
}

.corner-tl {
  top: 10px;
  left: 10px;
  border-right: none;
  border-bottom: none;
}

.corner-tr {
  top: 10px;
  right: 10px;
  border-left: none;
  border-bottom: none;
}

.corner-bl {
  bottom: 10px;
  left: 10px;
  border-right: none;
  border-top: none;
}

.corner-br {
  bottom: 10px;
  right: 10px;
  border-left: none;
  border-top: none;
}

.scanner-instructions {
  margin-top: 2rem;
  text-align: center;
}

.scanner-trigger {
  text-align: center;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .scanner-overlay {
    padding: 0.5rem;
  }
  
  .scanner-viewfinder {
    max-height: 300px;
  }
  
  #scanner {
    width: 100%;
    height: 200px;
  }
}

/* Ensure proper aspect ratio */
#scanner canvas,
#scanner video {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
}
</style>