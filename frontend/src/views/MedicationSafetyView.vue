<template>
  <div class="medication-safety-container">
    <!-- Hero Section -->
    

    <!-- Advanced Step Indicator -->
    <div class="steps-section">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="advanced-stepper">
              <div class="step-progress-bar">
                <div class="progress-fill" :style="{ width: currentStep === 1 ? '0%' : '100%' }"></div>
              </div>
              
              <!-- Step 1 -->
              <div class="advanced-step" :class="{ 'active': currentStep >= 1, 'completed': currentStep > 1 }">
                <div class="step-circle">
                  <div class="step-inner">
                    <i v-if="currentStep > 1" class="bi bi-check-lg"></i>
                    <span v-else>1</span>
                  </div>
                  <div class="step-pulse" v-if="currentStep === 1"></div>
                </div>
                <div class="step-content">
                  <h3 class="step-title">Επιλογή Ασθενή</h3>
                  <p class="step-description">Ταυτοποίηση και επιλογή ασθενή</p>
                  <div v-if="selectedPatient && currentStep >= 2" class="step-info">
                    <i class="bi bi-person-check me-1"></i>
                    {{ selectedPatient.full_name }}
                  </div>
                </div>
              </div>
              
              <!-- Step 2 -->
              <div class="advanced-step" :class="{ 'active': currentStep >= 2, 'scanning': currentStep === 2 && !scannedBarcode }">
                <div class="step-circle">
                  <div class="step-inner">
                    <i v-if="verificationResult?.success" class="bi bi-shield-check"></i>
                    <i v-else-if="scannedBarcode" class="bi bi-upc-scan"></i>
                    <span v-else>2</span>
                  </div>
                  <div class="step-pulse" v-if="currentStep === 2"></div>
                </div>
                <div class="step-content">
                  <h3 class="step-title">Σάρωση & Επαλήθευση</h3>
                  <p class="step-description">AI-powered έλεγχος ασφαλείας</p>
                  <div v-if="scannedBarcode" class="step-info">
                    <i class="bi bi-upc me-1"></i>
                    {{ scannedBarcode }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 1: Patient Barcode Scanner - Professional Hospital GUI -->
    <div v-if="currentStep === 1" class="main-content">
      <div class="scanner-wrapper">
        <!-- Professional Header -->
        <div class="scanner-pro-header">
          <div class="header-glow"></div>
          <div class="header-content">
            <div class="header-step">
              <span class="step-number">1</span>
              <span class="step-label">Ταυτοποίηση Ασθενή</span>
            </div>
            <h1 class="scanner-title">Σάρωση Barcode</h1>
            <p class="scanner-subtitle">Τοποθετήστε το barcode του ασθενή μπροστά από την κάμερα</p>
          </div>
        </div>

        <!-- Main Scanner Area -->
        <div class="scanner-main">
          <!-- Scanning Mode -->
          <div v-if="!patientBarcodeScanned" class="scanning-mode">
            <!-- Premium Scanner Frame -->
            <div class="scanner-frame-pro">
              <BarcodeScanner @barcode-detected="handlePatientBarcodeDetected" />
              
              <!-- Advanced Overlay -->
              <div class="scanner-overlay-pro">
                <!-- Animated Scan Line -->
                <div class="scan-line-pro"></div>
                
                <!-- Corner Markers with Glow -->
                <div class="corners-container">
                  <div class="corner-marker corner-tl">
                    <span class="corner-line h"></span>
                    <span class="corner-line v"></span>
                  </div>
                  <div class="corner-marker corner-tr">
                    <span class="corner-line h"></span>
                    <span class="corner-line v"></span>
                  </div>
                  <div class="corner-marker corner-bl">
                    <span class="corner-line h"></span>
                    <span class="corner-line v"></span>
                  </div>
                  <div class="corner-marker corner-br">
                    <span class="corner-line h"></span>
                    <span class="corner-line v"></span>
                  </div>
                </div>

                <!-- Center Focus Circle -->
                <div class="focus-circle">
                  <div class="focus-dot"></div>
                </div>
              </div>
            </div>

            <!-- Status & Tips -->
            <div class="scanner-status-area">
              <div class="status-badge">
                <span class="status-indicator"></span>
                <span class="status-text">Έτοιμο για Σάρωση</span>
              </div>

              <div class="tips-grid">
                <div class="tip-item">
                  <div class="tip-icon-box">
                    <i class="bi bi-phone"></i>
                  </div>
                  <span class="tip-text">Κρατήστε Σταθερά</span>
                </div>
                <div class="tip-item">
                  <div class="tip-icon-box">
                    <i class="bi bi-brightness-high"></i>
                  </div>
                  <span class="tip-text">Καλός Φωτισμός</span>
                </div>
                <div class="tip-item">
                  <div class="tip-icon-box">
                    <i class="bi bi-bullseye"></i>
                  </div>
                  <span class="tip-text">Κεντράρετε</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Success Mode -->
          <div v-else class="success-mode">
            <!-- Success Animation -->
            <div class="success-animation-wrapper">
              <div class="success-circle-bg">
                <svg class="success-checkmark" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" class="circle-outline"/>
                  <path d="M 30 50 L 45 65 L 70 40" class="checkmark-path" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="success-pulses">
                <span class="pulse pulse-1"></span>
                <span class="pulse pulse-2"></span>
                <span class="pulse pulse-3"></span>
              </div>
            </div>

            <!-- Result Info -->
            <div class="result-info">
              <h2 class="result-title">Επιτυχής Σάρωση!</h2>
              <p class="result-subtitle">Ο ασθενής αναγνωρίστηκε επιτυχώς</p>

              <!-- Barcode Info Card -->
              <div class="barcode-card">
                <div class="barcode-icon-wrapper">
                  <i class="bi bi-upc"></i>
                </div>
                <div class="barcode-info">
                  <div class="barcode-label">Κωδικός Ασθενή</div>
                  <div class="barcode-value">{{ patientBarcodeScanned }}</div>
                </div>
              </div>

              <!-- Loading Progress -->
              <div class="loading-progress-wrapper">
                <div class="progress-bar">
                  <div class="progress-fill"></div>
                </div>
                <div class="loading-text">
                  <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                  Φόρτωση δεδομένων ασθενή...
                </div>
              </div>

              <!-- Rescan Button -->
              <button class="btn-rescan-pro" @click="clearPatientBarcode">
                <i class="bi bi-arrow-clockwise"></i>
                <span>Σάρωση Διαφορετικού Ασθενή</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 2: Professional Medication Scanner - Two Column Layout -->
    <div v-if="currentStep === 2" class="main-content step2-layout">
      <!-- Professional Header -->
      <div class="scanner-pro-header">
        <div class="header-glow"></div>
        <div class="header-content">
          <div class="header-step">
            <span class="step-number">2</span>
            <span class="step-label">Σάρωση & Επαλήθευση Φαρμάκου</span>
          </div>
          <h1 class="scanner-title">Φαρμακοασφάλεια</h1>
          <p class="scanner-subtitle">Σαρώστε το barcode του φαρμάκου για AI-ενισχυμένη επαλήθευση</p>
          <button class="btn-back-pro" @click="goBackToPatientSelection">
            <i class="bi bi-arrow-left"></i>
            Αλλαγή Ασθενή
          </button>
        </div>
      </div>

      <!-- Two Column Container -->
      <div class="step2-two-column">
        <!-- Left Column: Medical Instructions -->
        <div class="step2-left-column">
          <div class="instructions-container">
            <!-- Patient Info Summary -->
            <div class="patient-summary-card-compact">
              <div class="summary-patient-avatar">
                <span style="font-size: 2.5rem;">{{ getGenderEmoji(selectedPatient.gender) }}</span>
              </div>
              <div class="summary-patient-info">
                <h4>{{ selectedPatient.full_name }}</h4>
                <p>ΑΜΚΑ: {{ selectedPatient.amka }}</p>
                <p>ΟΜΑ: {{ selectedPatient.blood_type }}</p>
              </div>
            </div>

            <!-- Medical Instructions List -->
            <div class="medications-list">
              <h3 class="medications-title">
                <i class="bi bi-capsule"></i>
                Φάρμακα προς Χορήγηση
              </h3>
              
              <div v-if="selectedPatient.medical_instructions && selectedPatient.medical_instructions.length > 0" class="instructions-scroll">
                <div v-for="instruction in selectedPatient.medical_instructions" 
                     :key="instruction.id"
                     class="instruction-card"
                     :class="{ 'completed': instruction.status === 'Completed' }">
                  
                  <!-- Status Badge -->
                  <div class="instruction-status">
                    <span v-if="instruction.status === 'Completed'" class="status-badge completed">
                      <i class="bi bi-check-circle-fill"></i> Χορηγήθηκε
                    </span>
                    <span v-else class="status-badge pending">
                      <i class="bi bi-hourglass-split"></i> Εκκρεμή
                    </span>
                  </div>

                  <!-- Instruction Details -->
                  <div class="instruction-details">
                    <h4 class="medication-name">{{ instruction.medication_name || instruction.description }}</h4>
                    
                    <div class="detail-row">
                      <span class="detail-label">Δοσολογία:</span>
                      <span class="detail-value">{{ instruction.dosage }}</span>
                    </div>
                    
                    <div v-if="instruction.frequency" class="detail-row">
                      <span class="detail-label">Συχνότητα:</span>
                      <span class="detail-value">{{ instruction.frequency }}</span>
                    </div>
                    
                    <div v-if="instruction.route" class="detail-row">
                      <span class="detail-label">Οδός:</span>
                      <span class="detail-value">{{ instruction.route }}</span>
                    </div>
                    
                    <div class="detail-row">
                      <span class="detail-label">Barcode:</span>
                      <span class="detail-value barcode-value">{{ instruction.barcode }}</span>
                    </div>

                    <!-- Full Description -->
                    <div class="instruction-description">
                      {{ instruction.description }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="no-medications">
                <i class="bi bi-inbox"></i>
                <p>Δεν υπάρχουν φάρμακα για χορήγηση</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Scanner -->
        <div class="step2-right-column">
          <div class="scanner-wrapper-compact">
            <!-- Scanning Mode -->
            <div v-if="!scannedBarcode" class="scanning-mode-compact">
              <!-- Premium Scanner Frame -->
              <div class="scanner-frame-pro-compact">
                <BarcodeScanner @barcode-detected="handleBarcodeDetected" />
                
                <!-- Advanced Overlay -->
                <div class="scanner-overlay-pro">
                  <!-- Animated Scan Line -->
                  <div class="scan-line-pro"></div>
                  
                  <!-- Corner Markers -->
                  <div class="corners-container">
                    <div class="corner-marker corner-tl">
                      <span class="corner-line h"></span>
                      <span class="corner-line v"></span>
                    </div>
                    <div class="corner-marker corner-tr">
                      <span class="corner-line h"></span>
                      <span class="corner-line v"></span>
                    </div>
                    <div class="corner-marker corner-bl">
                      <span class="corner-line h"></span>
                      <span class="corner-line v"></span>
                    </div>
                    <div class="corner-marker corner-br">
                      <span class="corner-line h"></span>
                      <span class="corner-line v"></span>
                    </div>
                  </div>

                  <!-- Center Focus Circle -->
                  <div class="focus-circle">
                    <div class="focus-dot"></div>
                  </div>
                </div>
              </div>

              <!-- Status & Tips -->
              <div class="scanner-status-area-compact">
                <div class="status-badge">
                  <span class="status-indicator"></span>
                  <span class="status-text">Έτοιμο για Σάρωση</span>
                </div>

                <div class="tips-grid-compact">
                  <div class="tip-item-compact">
                    <i class="bi bi-pills"></i>
                    <span>Δείχνε</span>
                  </div>
                  <div class="tip-item-compact">
                    <i class="bi bi-brightness-high"></i>
                    <span>Φως</span>
                  </div>
                  <div class="tip-item-compact">
                    <i class="bi bi-eye"></i>
                    <span>Κέντρο</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Scanned Result -->
            <div v-else class="success-mode-compact">
              <!-- Success Animation -->
              <div class="success-animation-wrapper-compact">
                <div class="success-circle-bg">
                  <svg class="success-checkmark" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" class="circle-outline"/>
                    <path d="M 30 50 L 45 65 L 70 40" class="checkmark-path" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="success-pulses">
                  <span class="pulse pulse-1"></span>
                  <span class="pulse pulse-2"></span>
                  <span class="pulse pulse-3"></span>
                </div>
              </div>

              <!-- Result Info -->
              <div class="result-info-compact">
                <h2 class="result-title">✓ Σκανάρθηκε!</h2>
                <p class="result-subtitle">Επαλήθευση...</p>

                <!-- Medication Info Card -->
                <div class="barcode-card-compact">
                  <div class="barcode-icon-wrapper">
                    <i class="bi bi-capsule-pill"></i>
                  </div>
                  <div class="barcode-info">
                    <div class="barcode-label">Κωδικός</div>
                    <div class="barcode-value">{{ scannedBarcode }}</div>
                  </div>
                </div>

                <!-- AI Verification Loading -->
                <div class="loading-progress-wrapper-compact">
                  <div class="progress-bar">
                    <div class="progress-fill"></div>
                  </div>
                  <div class="loading-text-compact">AI...</div>
                </div>

                <!-- Rescan Button -->
                <button class="btn-rescan-compact" @click="clearBarcode">
                  <i class="bi bi-arrow-clockwise"></i>
                  Ξανά
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Verification Result Modal/Alert - Below Scanner -->
      <div v-if="verificationResult" class="verification-result-section">
        <!-- SUCCESS: Correct Medication -->
        <div v-if="verificationResult.success && verificationResult.verified" class="result-success-container">
          <div class="result-success-header">
            <i class="bi bi-check-circle-fill"></i>
            <h3>✅ Φάρμακο Επαληθευμένο</h3>
          </div>
          
          <div class="result-details">
            <p class="result-description">Το φάρμακο είναι σωστό για αυτόν τον ασθενή</p>
            
            <div class="medication-details-box">
              <div class="detail-row">
                <span class="detail-label">Περιγραφή:</span>
                <span class="detail-value">{{ verificationResult.instruction.description }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Barcode:</span>
                <span class="detail-value">{{ verificationResult.instruction.barcode }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Κατάσταση:</span>
                <span class="detail-value">
                  <span class="status-badge-small" :class="verificationResult.instruction.status.toLowerCase()">
                    {{ verificationResult.instruction.status === 'Completed' ? 'Χορηγήθηκε' : 'Εκκρεμή' }}
                  </span>
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="result-actions">
              <button v-if="verificationResult.instruction.status !== 'Completed'" class="btn-action btn-confirm" @click="markAsCompleted">
                <i class="bi bi-check-square"></i>
                Επιβεβαίωση Χορήγησης
              </button>
              <button class="btn-action btn-next" @click="scanNextMedication">
                <i class="bi bi-arrow-right"></i>
                Επόμενο Φάρμακο
              </button>
            </div>
          </div>
        </div>

        <!-- ERROR: Wrong Medication or Safety Issue -->
        <div v-else class="result-error-container" :class="'severity-' + verificationResult.severity">
          <div class="result-error-header">
            <i :class="getAlertIcon(verificationResult.alertType)"></i>
            <h3>{{ verificationResult.message }}</h3>
          </div>
          
          <div class="result-details">
            <p class="result-description">{{ verificationResult.details }}</p>
            
            <div class="safety-warnings">
              <p><strong>⚠️ Προειδοποίηση:</strong> Ελέγξτε την ασθένεια πριν να συνεχίσετε</p>
            </div>

            <!-- Retry Button -->
            <button class="btn-action btn-retry" @click="clearBarcode">
              <i class="bi bi-arrow-clockwise"></i>
              Δοκιμή Ξανά
            </button>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-banner">
        <i class="bi bi-exclamation-circle"></i>
        <span>{{ error }}</span>
      </div>
    </div>

  </div>

  <!-- Verification Result Modal -->
    <div v-if="showVerificationModal" class="modal-overlay" @click="closeModal">
      <div class="verification-modal" @click.stop>
        <div class="modal-header">
          <div v-if="modalType === 'success'" class="success-icon">
            <i class="bi bi-check-circle-fill"></i>
          </div>
          <div v-if="modalType === 'error'" class="error-icon">
            <i class="bi bi-x-circle-fill"></i>
          </div>
          <div v-if="modalType === 'already-completed'" class="warning-icon">
            <i class="bi bi-exclamation-triangle-fill"></i>
          </div>
          <button class="close-btn" @click="closeModal">
            <i class="bi bi-x"></i>
          </button>
        </div>

        <div class="modal-body">
          <!-- Success Modal -->
          <div v-if="modalType === 'success' && verificationResult">
            <h3 class="modal-title success-title">✅ Επιτυχής Επαλήθευση</h3>
            <div class="verification-details">
              <div class="detail-item">
                <span class="label">Ασθενής:</span>
                <span class="value">{{ selectedPatient?.full_name || selectedPatient?.name }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Φάρμακο:</span>
                <span class="value">{{ verificationResult.instruction?.medication_name }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Δοσολογία:</span>
                <span class="value">{{ verificationResult.instruction?.dosage }}</span>
              </div>
              <div class="detail-item" v-if="verificationResult.instruction?.frequency">
                <span class="label">Συχνότητα:</span>
                <span class="value">{{ verificationResult.instruction?.frequency }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Πλήρης Οδηγία:</span>
                <span class="value">{{ verificationResult.instruction?.description }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Barcode:</span>
                <span class="value barcode-text">{{ scannedBarcode }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Κατάσταση:</span>
                <span class="value status-badge" :class="getStatusClass(verificationResult.instruction?.status)">
                  {{ getStatusText(verificationResult.instruction?.status) }}
                </span>
              </div>
            </div>
            <div class="safety-status success-status">
              <i class="bi bi-shield-check"></i>
              {{ verificationResult.message }}
            </div>
            
            <!-- Medication Administration Confirmation -->
            <div v-if="verificationResult.instruction?.status !== 'Completed'" class="administration-section">
              <div class="admin-warning">
                <i class="bi bi-exclamation-triangle-fill"></i>
                <strong>Προσοχή:</strong> Επιβεβαιώστε ότι το φάρμακο χορηγήθηκε με ασφάλεια στον ασθενή.
              </div>
            </div>
            
            <div v-else class="already-administered">
              <div class="completed-info">
                <i class="bi bi-check-circle-fill"></i>
                Το φάρμακο έχει ήδη χορηγηθεί στις {{ formatDateTime(verificationResult.instruction?.completed_at) }}
              </div>
            </div>
          </div>

          <!-- Error Modal -->
          <div v-if="modalType === 'error' && verificationResult">
            <h3 class="modal-title error-title">❌ Σφάλμα Επαλήθευσης</h3>
            
            <!-- Alert Type Badge -->
            <div v-if="verificationResult.alertType" class="alert-type-badge" :class="getSeverityClass(verificationResult.severity)">
              <i :class="getAlertIcon(verificationResult.alertType)"></i>
              <span>{{ getAlertTypeText(verificationResult.alertType) }}</span>
            </div>
            
            <!-- Main Message -->
            <div class="safety-status error-status">
              <i class="bi bi-shield-exclamation"></i>
              {{ verificationResult.message }}
            </div>
            
            <!-- Detailed Information -->
            <div v-if="verificationResult.details" class="alert-details-section">
              <h4 class="details-title">
                <i class="bi bi-info-circle-fill"></i>
                Λεπτομέρειες:
              </h4>
              <p class="details-text">{{ verificationResult.details }}</p>
            </div>
            
            <!-- Recommendation -->
            <div v-if="verificationResult.recommendation" class="alert-recommendation-section">
              <h4 class="recommendation-title">
                <i class="bi bi-lightbulb-fill"></i>
                Συνιστώμενη Ενέργεια:
              </h4>
              <p class="recommendation-text">{{ verificationResult.recommendation }}</p>
            </div>
            
            <!-- Medication Information -->
            <div v-if="verificationResult.instruction" class="verification-details mt-3">
              <div class="detail-item">
                <span class="label">Ασθενής:</span>
                <span class="value">{{ selectedPatient?.full_name }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Φάρμακο:</span>
                <span class="value">{{ verificationResult.instruction?.medication_name || verificationResult.instruction?.description }}</span>
              </div>
              <div class="detail-item" v-if="verificationResult.instruction?.dosage">
                <span class="label">Δοσολογία:</span>
                <span class="value">{{ verificationResult.instruction?.dosage }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Barcode:</span>
                <span class="value barcode-text">{{ scannedBarcode }}</span>
              </div>
            </div>
            
            <!-- Safety Warning -->
            <div v-if="verificationResult.safetyError" class="safety-warning-critical">
              <i class="bi bi-exclamation-triangle-fill"></i>
              <strong>ΚΡΙΣΙΜΟ:</strong> ΜΗ χορηγήσετε το φάρμακο χωρίς επιβεβαίωση από θεράποντα ιατρό!
            </div>
            
            <!-- Contact Physician Button -->
            <div v-if="verificationResult.severity === 'CRITICAL' || verificationResult.severity === 'HIGH'" class="contact-section">
              <button class="btn btn-warning btn-contact-physician" @click="contactPhysician">
                <i class="bi bi-telephone-fill me-2"></i>
                Επικοινωνία με Ιατρό
              </button>
            </div>
          </div>

          <!-- Already Completed Modal -->
          <div v-if="modalType === 'already-completed' && verificationResult">
            <h3 class="modal-title warning-title">⚠️ Φάρμακο Ήδη Χορηγημένο</h3>
            <div class="safety-status warning-status">
              <i class="bi bi-info-circle"></i>
              {{ verificationResult.message }}
            </div>
            <div class="verification-details">
              <div class="detail-item">
                <span class="label">Ασθενής:</span>
                <span class="value">{{ selectedPatient?.full_name }}</span>
              </div>
              <div class="detail-item" v-if="verificationResult.instruction">
                <span class="label">Φάρμακο:</span>
                <span class="value">{{ verificationResult.instruction.medication_name }}</span>
              </div>
              <div class="detail-item" v-if="verificationResult.instruction">
                <span class="label">Δοσολογία:</span>
                <span class="value">{{ verificationResult.instruction.dosage }}</span>
              </div>
              <div class="detail-item" v-if="verificationResult.instruction?.frequency">
                <span class="label">Συχνότητα:</span>
                <span class="value">{{ verificationResult.instruction.frequency }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Barcode:</span>
                <span class="value barcode-text">{{ scannedBarcode }}</span>
              </div>
              <div class="detail-item" v-if="verificationResult.instruction?.completed_at">
                <span class="label">Χορηγήθηκε στις:</span>
                <span class="value">{{ formatDateTime(verificationResult.instruction.completed_at) }}</span>
              </div>
              <div class="detail-item" v-if="verificationResult.instruction?.completed_by_name">
                <span class="label">Χορήγηση από:</span>
                <span class="value nurse-info">{{ getNurseEmoji() }} {{ verificationResult.instruction.completed_by_name }}</span>
              </div>
            </div>
            <div class="completion-warning">
              <i class="bi bi-exclamation-triangle-fill"></i>
              <strong>Προσοχή:</strong> Το φάρμακο έχει ήδη χορηγηθεί. Επιβεβαιώστε ότι είναι απαραίτητη η επανάληψη της δόσης.
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <!-- Success Modal Footer -->
          <div v-if="modalType === 'success'" class="success-actions">
            <button class="btn btn-outline-secondary" @click="closeModal">
              <i class="bi bi-x"></i> Ακύρωση
            </button>
            <button v-if="verificationResult.instruction?.status !== 'Completed'" 
                    class="btn btn-success btn-complete" 
                    @click="completeMedication"
                    :disabled="completing">
              <div v-if="completing" class="spinner-border spinner-border-sm me-2" role="status"></div>
              <i v-else class="bi bi-check-square me-1"></i>
              {{ completing ? 'Επεξεργασία...' : 'Επιβεβαίωση Χορήγησης' }}
            </button>
            <button v-else class="btn btn-info" @click="closeModal">
              <i class="bi bi-check"></i> Εντάξει
            </button>
          </div>
          
          <!-- Error Modal Footer -->
          <button v-if="modalType === 'error'" class="btn btn-danger" @click="closeModal">
            <i class="bi bi-arrow-left"></i> Προσπάθεια Ξανά
          </button>
          
          <!-- Already Completed Modal Footer -->
          <div v-if="modalType === 'already-completed'" class="completion-actions">
            <button class="btn btn-warning" @click="closeModal">
              <i class="bi bi-arrow-left"></i> Επιστροφή
            </button>
            <button class="btn btn-outline-primary" @click="verifyMedication(); closeModal()">
              <i class="bi bi-arrow-repeat"></i> Χορήγηση Ξανά
            </button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'
import socketService from '../services/socket'
import BarcodeScanner from '../components/BarcodeScanner.vue'

export default {
  name: 'MedicationSafetyView',
  components: {
    BarcodeScanner
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const currentStep = ref(1) // 1: Patient Selection, 2: Medication Scanning
    const selectedPatient = ref(null)
    const patients = ref([])
    const scannedBarcode = ref('')
    const verificationResult = ref(null)
    const loading = ref(false)
    const error = ref(null)
    
    // New variables for enhanced UI
    const patientSearch = ref('')
    const activeFilter = ref('all')
    const todayVerifications = ref(Math.floor(Math.random() * 50) + 25)
    const safetyScore = ref(99.8)
    const isScanning = ref(false)
    const scannerActive = ref(false)
    
    // Patient barcode scanning in Step 1
    const patientBarcodeScanned = ref('')

    // Modal functionality
    const showVerificationModal = ref(false)
    const modalType = ref('') // 'success', 'error', 'already-completed'
    const completing = ref(false)

    // Patient medications tracking
    const patientMedications = ref({})

    // Computed properties for enhanced UI
    const filteredPatients = computed(() => {
      let filtered = patients.value
      
      // Apply search filter
      if (patientSearch.value.trim()) {
        const search = patientSearch.value.toLowerCase()
        filtered = filtered.filter(patient => 
          patient.full_name.toLowerCase().includes(search) ||
          patient.amka.includes(search)
        )
      }
      
      // Apply status filter
      if (activeFilter.value === 'pending') {
        filtered = filtered.filter(patient => 
          patient.medical_instructions?.some(inst => inst.status === 'Pending')
        )
      }
      
      return filtered
    })
    
    const getPendingCount = () => {
      return patients.value.filter(patient => {
        const meds = patientMedications.value[patient.id]
        return meds && meds.pending > 0
      }).length
    }
    
    const getPendingMedications = (patient) => {
      const meds = patientMedications.value[patient.id]
      return meds ? meds.pending : 0
    }
    
    const setFilter = (filter) => {
      activeFilter.value = filter
    }

    // Helper function to get gender emoji
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

    // Helper function to get nurse emoji
    const getNurseEmoji = () => {
      return '👩‍⚕️'
    }

    // Fetch all patients for selection
    const fetchPatients = async () => {
      try {
        const response = await api.get('/patients/with-instructions')
        patients.value = response.data
        
        // Fetch medication status for each patient
        for (const patient of patients.value) {
          await fetchPatientMedications(patient.id)
        }
      } catch (err) {
        error.value = 'Σφάλμα φόρτωσης ασθενών'
      }
    }

    // Fetch medications for a specific patient
    const fetchPatientMedications = async (patientId) => {
      try {
        const response = await api.get(`/instructions/patient/${patientId}`)
        const medications = response.data
        
        const pending = medications.filter(med => med.status === 'Pending').length
        const completed = medications.filter(med => med.status === 'Completed').length
        
        patientMedications.value[patientId] = {
          total: medications.length,
          pending: pending,
          completed: completed,
          medications: medications
        }
      } catch (err) {
        console.error(`Error fetching medications for patient ${patientId}:`, err)
        patientMedications.value[patientId] = {
          total: 0,
          pending: 0,
          completed: 0,
          medications: []
        }
      }
    }

    // Helper functions for medication status
    const getPatientMedicationStatus = (patientId) => {
      const meds = patientMedications.value[patientId]
      if (!meds || meds.total === 0) {
        return {
          status: 'none',
          text: 'Δεν έχει φάρμακα',
          class: 'no-medications',
          icon: 'bi-x-circle',
          color: '#6b7280'
        }
      }
      
      if (meds.pending === 0) {
        return {
          status: 'complete',
          text: `Όλα ολοκληρώθηκαν (${meds.completed})`,
          class: 'all-complete',
          icon: 'bi-check-circle-fill',
          color: '#10b981'
        }
      }
      
      return {
        status: 'pending',
        text: `${meds.pending} εκκρεμή φάρμακα`,
        class: 'has-pending',
        icon: 'bi-exclamation-circle-fill',
        color: '#f59e0b'
      }
    }

    const getMedicationSummary = (patientId) => {
      const meds = patientMedications.value[patientId]
      if (!meds) return 'Φόρτωση...'
      
      if (meds.total === 0) return 'Χωρίς φάρμακα'
      
      return `${meds.total} συνολικά • ${meds.pending} εκκρεμή • ${meds.completed} ολοκληρώθηκαν`
    }

    // Get severity CSS class based on alert severity
    const getSeverityClass = (severity) => {
      const severityMap = {
        'CRITICAL': 'alert-danger',
        'HIGH': 'alert-danger',
        'MEDIUM': 'alert-warning',
        'LOW': 'alert-info'
      }
      return severityMap[severity] || 'alert-danger'
    }

    // Get alert icon based on alert type
    const getAlertIcon = (alertType) => {
      const iconMap = {
        'DRUG_INTERACTION': 'bi-exclamation-octagon-fill text-danger',
        'ALLERGY': 'bi-bandaid-fill text-danger',
        'DUPLICATE': 'bi-files text-warning',
        'WRONG_MEDICATION': 'bi-capsule text-danger',
        'OVERDOSE': 'bi-exclamation-triangle-fill text-danger',
        'WRONG_TIME': 'bi-clock-fill text-warning',
        'WRONG_ROUTE': 'bi-sign-turn-right-fill text-danger',
        'WRONG_PATIENT': 'bi-person-x-fill text-danger',
        'NOT_FOUND': 'bi-question-circle-fill text-danger'
      }
      return iconMap[alertType] || 'bi-exclamation-triangle-fill text-danger'
    }

    // Get alert type text in Greek
    const getAlertTypeText = (alertType) => {
      const textMap = {
        'DRUG_INTERACTION': 'Φαρμακευτική Αλληλεπίδραση',
        'ALLERGY': 'Αλλεργία',
        'DUPLICATE': 'Διπλή Χορήγηση',
        'WRONG_MEDICATION': 'Λάθος Φάρμακο',
        'OVERDOSE': 'Υπερβολική Δόση',
        'WRONG_TIME': 'Λάθος Χρόνος Χορήγησης',
        'WRONG_ROUTE': 'Λάθος Οδός Χορήγησης',
        'WRONG_PATIENT': 'Λάθος Ασθενής',
        'NOT_FOUND': 'Μη Εύρεση Φαρμάκου'
      }
      return textMap[alertType] || 'Προειδοποίηση Ασφαλείας'
    }

    // Contact physician function
    const contactPhysician = () => {
      alert('📞 Επικοινωνώντας με τον θεράποντα ιατρό...\n\nΣτην πραγματική εφαρμογή, αυτό θα ανοίξει σύστημα επικοινωνίας ή θα στείλει ειδοποίηση.')
    }

    // Select patient and move to step 2
    const selectPatient = (patient) => {
      selectedPatient.value = patient
      currentStep.value = 2
      verificationResult.value = null
      scannedBarcode.value = ''
      
      // Broadcast patient selection to other devices
      socketService.selectPatient(patient.id, patient.full_name)
      console.log('🎯 Patient selected and broadcasted:', patient.full_name)
    }

    // Verify medication barcode for selected patient
    const verifyMedication = async (isFromSync = false) => {
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
        
        // Show modal based on verification result
        modalType.value = response.data.success ? 'success' : 'error'
        showVerificationModal.value = true
        
        // Broadcast medication scan to other devices (only if not from sync to prevent loops)
        if (!isFromSync) {
          socketService.scanMedication(
            selectedPatient.value.id, 
            scannedBarcode.value.trim(),
            response.data.instruction?.description || '',
            response.data // Also broadcast the full verification result
          )
          console.log('💊 Medication scan broadcasted')
        }
        
      } catch (err) {
        console.error('Error verifying medication:', err)
        verificationResult.value = {
          success: false,
          safetyError: true,
          message: err.response?.data?.message || 'Σφάλμα επαλήθευσης'
        }
        
        // Show error modal
        modalType.value = 'error'
        showVerificationModal.value = true
        
      } finally {
        loading.value = false
      }
    }

    // Mark medication as administered
    const markAsCompleted = async () => {
      if (!verificationResult.value?.instruction?.id) return

      try {
        await api.patch(`/instructions/${verificationResult.value.instruction.id}/complete`)
        
        const completedTime = new Date().toISOString()
        
        // Update local state with completion timestamp
        if (verificationResult.value.instruction) {
          verificationResult.value.instruction.status = 'Completed'
          verificationResult.value.instruction.completed_at = completedTime
        }
        
        // Update the instruction in the patient's list - Create new array to trigger reactivity
        const instructionIndex = selectedPatient.value.medical_instructions.findIndex(
          inst => inst.id === verificationResult.value.instruction.id
        )
        if (instructionIndex !== -1) {
          // Create a new instruction object to ensure Vue detects the change
          const updatedInstruction = {
            ...selectedPatient.value.medical_instructions[instructionIndex],
            status: 'Completed',
            completed_at: completedTime
          }
          
          // Replace the instruction in the array
          selectedPatient.value.medical_instructions.splice(instructionIndex, 1, updatedInstruction)
        }
        
        // Update patientMedications count for Step 1
        if (patientMedications.value[selectedPatient.value.id]) {
          patientMedications.value[selectedPatient.value.id].pending -= 1
          patientMedications.value[selectedPatient.value.id].completed += 1
        }
        
        alert('✅ Το φάρμακο χορηγήθηκε επιτυχώς!')
        
      } catch (err) {
        alert('❌ Σφάλμα κατά την καταγραφή χορήγησης')
      }
    }

    // Scan next medication for the same patient
    const scanNextMedication = () => {
      scannedBarcode.value = ''
      verificationResult.value = null
      error.value = null
    }

    // Format date and time for display
    const formatDateTime = (dateString) => {
      if (!dateString) return ''
      
      const date = new Date(dateString)
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }
      
      return date.toLocaleDateString('el-GR', options)
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
    const handleBarcodeDetected = async (barcode) => {
      console.log('🎯 Parent received barcode:', barcode)
      scannedBarcode.value = barcode
      error.value = null
      
      // Check if this medication is already completed
      const completedCheck = await checkMedicationCompleted(barcode)
      if (completedCheck.completed) {
        // Store the medication data for display in modal
        verificationResult.value = {
          success: false,
          completed: true,
          instruction: completedCheck.instruction,
          message: 'Αυτό το φάρμακο έχει ήδη χορηγηθεί στον ασθενή'
        }
        modalType.value = 'already-completed'
        showVerificationModal.value = true
        return
      }
      
      // Auto-verify after scanning (optional - remove if you want manual confirmation)
      setTimeout(() => {
        console.log('🔄 Auto-verifying medication...')
        verifyMedication()
      }, 500)
    }

    const checkMedicationCompleted = async (barcode) => {
      try {
        const response = await api.post('/instructions/check-completed', {
          barcode: barcode,
          patientId: selectedPatient.value.id
        })
        
        return {
          completed: response.data.completed,
          instruction: response.data.instruction
        }
      } catch (error) {
        console.error('Error checking medication completion:', error)
        return { completed: false, instruction: null }
      }
    }

    // Clear scanned barcode to allow new scanning
    const clearBarcode = () => {
      scannedBarcode.value = ''
      verificationResult.value = null
      error.value = null
    }

    // Handle patient barcode detected in Step 1
    const handlePatientBarcodeDetected = async (barcode) => {
      console.log('🎯 Patient barcode detected:', barcode)
      patientBarcodeScanned.value = barcode
      
      // Search for patient by barcode, AMKA, or AFM
      const patient = patients.value.find(p => 
        p.barcode === barcode ||
        p.amka === barcode || 
        p.afm === barcode ||
        p.amka.includes(barcode) ||
        barcode.includes(p.amka)
      )
      
      if (patient) {
        console.log('✅ Patient found:', patient.full_name)
        // Automatically select the patient
        setTimeout(() => {
          selectPatient(patient)
        }, 500)
      } else {
        console.log('❌ Patient not found for barcode:', barcode)
        error.value = 'Δεν βρέθηκε ασθενής με αυτό το barcode'
        setTimeout(() => {
          error.value = null
          patientBarcodeScanned.value = ''
        }, 3000)
      }
    }

    // Clear patient barcode
    const clearPatientBarcode = () => {
      patientBarcodeScanned.value = ''
      error.value = null
    }

    // Modal functions
    const closeModal = () => {
      showVerificationModal.value = false
      modalType.value = ''
      completing.value = false
      // Clear barcode after modal closes to allow new scanning
      clearBarcode()
    }

    const completeMedication = async () => {
      if (!verificationResult.value || !verificationResult.value.instruction) {
        console.error('No verification result or instruction found')
        return
      }

      try {
        completing.value = true

        const completedTime = new Date().toISOString()

        // Call the complete instruction endpoint
        const response = await api.patch(`/instructions/${verificationResult.value.instruction.id}/complete`)
        
        // Update the local verification result
        verificationResult.value.instruction.status = 'Completed'
        verificationResult.value.instruction.completed_at = completedTime
        
        // Update the instruction in the patient's list - Create new object to trigger reactivity
        const instructionIndex = selectedPatient.value.medical_instructions.findIndex(
          inst => inst.id === verificationResult.value.instruction.id
        )
        if (instructionIndex !== -1) {
          // Create a new instruction object to ensure Vue detects the change
          const updatedInstruction = {
            ...selectedPatient.value.medical_instructions[instructionIndex],
            status: 'Completed',
            completed_at: completedTime
          }
          
          // Replace the instruction in the array
          selectedPatient.value.medical_instructions.splice(instructionIndex, 1, updatedInstruction)
        }
        
        // Update patientMedications count for Step 1
        if (patientMedications.value[selectedPatient.value.id]) {
          patientMedications.value[selectedPatient.value.id].pending -= 1
          patientMedications.value[selectedPatient.value.id].completed += 1
        }
        
        // Update today's verification count
        todayVerifications.value += 1
        
        // Broadcast medication completion to other devices
        socketService.completeMedication(
          selectedPatient.value.id, 
          verificationResult.value.instruction.id
        )
        console.log('✅ Medication completion broadcasted')
        
        // Show success message
        console.log('Medication completed successfully')
        
        // Auto-close modal and clear state after a short delay
        setTimeout(() => {
          closeModal()
          // Clear barcode and results to prevent re-broadcasting
          scannedBarcode.value = ''
          verificationResult.value = null
        }, 1500)

      } catch (error) {
        console.error('Error completing medication:', error)
        // You could show an error toast here
        alert('Σφάλμα κατά την επιβεβαίωση χορήγησης: ' + (error.response?.data?.message || error.message))
      } finally {
        completing.value = false
      }
    }

    const getStatusClass = (status) => {
      const statusClasses = {
        'Pending': 'status-pending',
        'Completed': 'status-completed',
        'Cancelled': 'status-cancelled'
      }
      return statusClasses[status] || 'status-unknown'
    }

    const getStatusText = (status) => {
      const statusTexts = {
        'Pending': 'Εκκρεμή',
        'Completed': 'Ολοκληρώθηκε', 
        'Cancelled': 'Ακυρώθηκε'
      }
      return statusTexts[status] || status || 'Άγνωστο'
    }

    onMounted(() => {
      fetchPatients()
      
      // Set up socket listeners for synchronization from other devices
      // Note: Socket service converts 'sync-patient-selected' to 'patient-selected' locally
      socketService.on('patient-selected', async (data) => {
        console.log('📱 Received patient-selected event from socketService:', data)
        console.log('📊 Current patients list:', patients.value.length, 'patients')
        console.log('📊 Looking for patient with ID:', data.patientId)
        
        // Wait for patients to load if not loaded yet
        if (patients.value.length === 0) {
          console.log('⏳ Patients not loaded yet, waiting...')
          await fetchPatients()
        }
        
        // Find the patient in our list
        const patient = patients.value.find(p => p.id === data.patientId)
        console.log('🔍 Found patient:', patient ? patient.full_name : 'NOT FOUND')
        
        if (patient) {
          // Sync the selection without broadcasting again
          selectedPatient.value = patient
          currentStep.value = 2
          verificationResult.value = null
          scannedBarcode.value = ''
          
          // Scroll to step 2
          setTimeout(() => {
            const step2Element = document.querySelector('.step-2-section')
            if (step2Element) {
              step2Element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }, 100)
          
          // Show notification
          console.log('✅ Successfully synced to patient:', data.patientName)
          console.log('✅ Current step:', currentStep.value)
          console.log('✅ Selected patient:', selectedPatient.value?.full_name)
        } else {
          console.error('❌ Patient not found in list')
        }
      })
      
      socketService.on('medication-scanned', async (data) => {
        console.log('📱 Syncing medication scan from other device:', data)
        
        // If we're on the same patient, sync the barcode and show verification result
        if (selectedPatient.value?.id === data.patientId && data.barcode) {
          scannedBarcode.value = data.barcode
          
          // Use the verification result from the other device if available
          if (data.verificationResult) {
            verificationResult.value = data.verificationResult
            modalType.value = data.verificationResult.success ? 'success' : 'error'
            showVerificationModal.value = true
            console.log('✅ Synced verification result from other device')
          } else {
            // If no verification result, verify locally
            console.log('🔄 Auto-verifying synced medication...')
            await verifyMedication(true) // Pass true to indicate this is from sync
          }
          
          console.log('✅ Synced and verified medication barcode:', data.barcode)
        }
      })
      
      socketService.on('medication-completed', async (data) => {
        console.log('📱 Syncing medication completion from other device:', data)
        
        // Refresh patient data to show updated status
        if (selectedPatient.value?.id === data.patientId) {
          await fetchPatients()
          
          // Update selected patient reference
          const updatedPatient = patients.value.find(p => p.id === data.patientId)
          if (updatedPatient) {
            selectedPatient.value = updatedPatient
          }
          
          console.log('✅ Synced medication completion')
        }
      })
    })
    
    onUnmounted(() => {
      // Clean up socket listeners
      socketService.off('patient-selected')
      socketService.off('medication-scanned')
      socketService.off('medication-completed')
    })

    return {
      currentStep,
      selectedPatient,
      patients,
      scannedBarcode,
      verificationResult,
      loading,
      error,
      patientSearch,
      activeFilter,
      todayVerifications,
      safetyScore,
      isScanning,
      scannerActive,
      filteredPatients,
      getPendingCount,
      getPendingMedications,
      setFilter,
      selectPatient,
      verifyMedication,
      markAsCompleted,
      startOver,
      goBackToPatientSelection,
      handleBarcodeDetected,
      clearBarcode,
      scanNextMedication,
      formatDateTime,
      showVerificationModal,
      modalType,
      closeModal,
      checkMedicationCompleted,
      completing,
      completeMedication,
      getStatusClass,
      getStatusText,
      getSeverityClass,
      getAlertIcon,
      getAlertTypeText,
      contactPhysician,
      patientMedications,
      fetchPatientMedications,
      getPatientMedicationStatus,
      getMedicationSummary,
      patientBarcodeScanned,
      handlePatientBarcodeDetected,
      clearPatientBarcode,
      getGenderEmoji,
      getNurseEmoji
    }
  }
}
</script>

<style scoped>
/* Main Container */
.medication-safety-container {
  min-height: 100vh;
  overflow-y: auto;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Hero Section */
.medication-hero {
  background: linear-gradient(135deg, 
    #1e40af 0%, 
    #3b82f6 50%, 
    #06b6d4 100%);
  color: white;
  padding: 5rem 0;
  position: relative;
  overflow: hidden;
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
}

.floating-pills {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.pill {
  position: absolute;
  width: 40px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  animation: float 6s ease-in-out infinite;
}

.pill-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.pill-2 {
  top: 60%;
  left: 80%;
  animation-delay: 2s;
}

.pill-3 {
  top: 40%;
  left: 70%;
  animation-delay: 4s;
}

.pill-4 {
  top: 80%;
  left: 20%;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); opacity: 0.3; }
  50% { transform: translateY(-20px); opacity: 0.7; }
}

.hero-content {
  position: relative;
  z-index: 2;
}

.safety-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  flex-direction: column;
  gap: 0.5rem;
  color: #ffffff;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.security-level {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  opacity: 0.9;
}

.security-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse-security 2s infinite;
}

@keyframes pulse-security {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.2); }
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.gradient-text {
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.title-underline {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #ffffff, #ef4444);
  margin: 1rem auto;
  border-radius: 2px;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #ffffff;
  opacity: 1;
  margin-bottom: 2rem;
  line-height: 1.6;
  font-weight: 500;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.security-features {
  font-size: 0.9rem;
  color: #ffffff;
  opacity: 1;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.hero-stats .stat-item {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 120px;
}

.hero-stats .stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  display: block;
  margin-bottom: 0.5rem;
  color: #ffffff;
}

.hero-stats .stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
  font-weight: 500;
}

/* Advanced Steps Section */
.steps-section {
  background: white;
  padding: 1.5rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.advanced-stepper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  flex-wrap: wrap;
}

.step-progress-bar {
  position: absolute;
  top: 25px;
  left: 50px;
  right: 50px;
  height: 2px;
  background: #e2e8f0;
  z-index: 1;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  transition: width 0.8s ease;
}

.advanced-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 2;
  flex: 0 1 calc(50% - 0.75rem);
  flex: 1;
  max-width: 250px;
  min-width: 0;
}

.step-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

.step-inner {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #64748b;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.advanced-step.active .step-circle {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  box-shadow: 0 8px 32px rgba(37, 99, 235, 0.3);
}

.advanced-step.active .step-inner {
  background: transparent;
}

.advanced-step.completed .step-circle {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
}

.advanced-step.completed .step-inner {
  background: transparent;
}

.advanced-step.scanning .step-circle {
  animation: scan-pulse 2s infinite;
}

@keyframes scan-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 8px 32px rgba(37, 99, 235, 0.3); }
  50% { transform: scale(1.05); box-shadow: 0 12px 40px rgba(37, 99, 235, 0.5); }
}

.step-pulse {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 2px solid #2563eb;
  border-radius: 50%;
  animation: pulse-ring 2s infinite;
}

@keyframes pulse-ring {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.3); }
}

.step-content {
  text-align: center;
}

.step-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.step-description {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.step-info {
  font-size: 0.75rem;
  color: #2563eb;
  font-weight: 500;
  background: rgba(37, 99, 235, 0.1);
  padding: 0.2rem 0.6rem;
  border-radius: 15px;
  display: inline-block;
}

/* Main Content Section */
.main-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1.5rem 0;
  display: flex;
  align-items: center;
}

/* Step 2 Two-Column Layout */
.main-content.step2-layout {
  flex-direction: column;
  padding: 0;
  align-items: stretch;
}

.step2-two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  overflow-x: hidden;
  background: linear-gradient(180deg, #f0f4ff 0%, #ffffff 50%, #f8faff 100%);
}

/* Left Column: Medical Instructions */
.step2-left-column {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.instructions-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 1rem;
}

.patient-summary-card-compact {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(30, 64, 175, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%);
  border: 1px solid rgba(30, 64, 175, 0.15);
  border-radius: 12px;
  flex-shrink: 0;
}

.summary-patient-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
  border-radius: 50%;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.summary-patient-info {
  flex: 1;
}

.summary-patient-info h4 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e1b4b;
}

.summary-patient-info p {
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  color: #64748b;
}

/* Medications List */
.medications-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.08);
}

.medications-title {
  margin: 0 0 1rem;
  font-size: 1rem;
  font-weight: 700;
  color: #1e1b4b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.medications-title i {
  color: #2563eb;
}

.instructions-scroll {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-right: 0.5rem;
}

.instructions-scroll::-webkit-scrollbar {
  width: 6px;
}

.instructions-scroll::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.instructions-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.instructions-scroll::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.instruction-card {
  padding: 0.75rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.instruction-card:hover {
  border-color: #2563eb;
  background: #eff6ff;
}

.instruction-card.completed {
  opacity: 0.6;
  background: #f0fdf4;
  border-color: #22c55e;
}

.instruction-status {
  margin-bottom: 0.5rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.pending {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.status-badge.completed {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.instruction-details {
  font-size: 0.85rem;
}

.medication-name {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e1b4b;
}

.detail-row {
  display: flex;
  gap: 0.5rem;
  margin: 0.3rem 0;
  font-size: 0.8rem;
}

.detail-label {
  font-weight: 600;
  color: #64748b;
  white-space: nowrap;
}

.detail-value {
  color: #334155;
  flex: 1;
  word-break: break-word;
}

.barcode-value {
  font-family: monospace;
  font-size: 0.75rem;
}

.instruction-description {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e2e8f0;
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.4;
}

.no-medications {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
  gap: 0.5rem;
}

.no-medications i {
  font-size: 2rem;
  opacity: 0.5;
}

.no-medications p {
  margin: 0;
  font-size: 0.9rem;
}

/* Right Column: Scanner */
.step2-right-column {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.scanner-wrapper-compact {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(135deg, #1a1f3a 0%, #0f1420 100%);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.scanning-mode-compact {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
  padding: 1rem;
}

.scanner-frame-pro-compact {
  position: relative;
  width: 100%;
  height: 60%;
  background: linear-gradient(135deg, #1a1f3a 0%, #0f1420 100%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 
    0 20px 60px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.1);
}

.scanner-status-area-compact {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.tips-grid-compact {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.tip-item-compact {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.6rem;
  background: rgba(37, 99, 235, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
}

.tip-item-compact i {
  font-size: 1.25rem;
  color: #22c55e;
}

.success-mode-compact {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
  padding: 1rem;
}

.success-animation-wrapper-compact {
  position: relative;
  width: 100px;
  height: 100px;
}

.result-info-compact {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
}

.result-info-compact h2 {
  margin: 0;
  font-size: 1.25rem;
  color: white;
}

.result-info-compact p {
  margin: 0;
  font-size: 0.9rem;
  color: #cbd5e1;
}

.barcode-card-compact {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 8px;
  width: 100%;
}

.barcode-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(34, 197, 94, 0.2);
  border-radius: 6px;
  color: #22c55e;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.barcode-info {
  flex: 1;
}

.barcode-label {
  font-size: 0.75rem;
  color: #cbd5e1;
}

.barcode-value {
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  font-family: monospace;
}

.loading-progress-wrapper-compact {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.loading-text-compact {
  font-size: 0.8rem;
  color: #cbd5e1;
}

.btn-rescan-compact {
  padding: 0.6rem 1.25rem;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  border: none;
  color: white;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.btn-rescan-compact:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
}

/* Responsive */
@media (max-width: 1024px) {
  .step2-two-column {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .step2-two-column {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }

  .step2-left-column {
    max-height: 50vh;
  }

  .step2-right-column {
    min-height: 50vh;
  }
}

.selection-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header-modern {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 1.25rem 1.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: white;
}

.header-text h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.header-text p {
  color: #64748b;
  margin: 0;
  font-size: 0.85rem;
}

.header-badge {
  margin-left: auto;
}

.step-badge {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.card-body-modern {
  padding: 1.25rem 1.5rem;
  max-height: calc(100vh - 280px);
  overflow-y: auto;
}

/* Search Section */
.search-section {
  margin-bottom: 1rem;
}

.search-wrapper {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
  border: 2px solid #e2e8f0;
}

.search-input {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.75rem 1rem 0.75rem 3rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  z-index: 2;
}

.search-wrapper {
  position: relative;
}

.search-filters {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  background: white;
  color: #64748b;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.filter-btn.active {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  border-color: #2563eb;
}

/* ============================================
   STEP 1: PROFESSIONAL HOSPITAL SCANNER GUI
   ============================================ */

.scanner-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #f0f4ff 0%, #ffffff 50%, #f8faff 100%);
  position: relative;
  overflow: hidden;
}

/* Professional Header Section */
.scanner-pro-header {
  position: relative;
  padding: 2rem 1.5rem 1.5rem;
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
  color: white;
  text-align: center;
  overflow: hidden;
}

.header-glow {
  position: absolute;
  top: -50%;
  left: -20%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.header-content {
  position: relative;
  z-index: 2;
}

.header-step {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255,255,255,0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1rem;
  backdrop-filter: blur(10px);
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(255,255,255,0.3);
  border-radius: 50%;
  font-weight: 700;
  font-size: 1rem;
}

.scanner-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.scanner-subtitle {
  font-size: 1rem;
  opacity: 0.95;
  margin: 0;
  font-weight: 400;
}

/* Main Scanner Area */
.scanner-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  overflow: hidden;
}

/* Scanning Mode */
.scanning-mode {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
}

/* Premium Scanner Frame */
.scanner-frame-pro {
  position: relative;
  width: 100%;
  max-width: 600px;
  aspect-ratio: 4 / 3;
  background: linear-gradient(135deg, #1a1f3a 0%, #0f1420 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 
    0 20px 60px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.1);
}

.scanner-overlay-pro {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

/* Animated Scan Line */
.scan-line-pro {
  position: absolute;
  left: 5%;
  width: 90%;
  height: 3px;
  background: linear-gradient(90deg, 
    transparent 0%,
    rgba(34, 197, 94, 0.3) 25%,
    rgba(34, 197, 94, 1) 50%,
    rgba(34, 197, 94, 0.3) 75%,
    transparent 100%);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.8);
  animation: scan-sweep 2.5s ease-in-out infinite;
}

@keyframes scan-sweep {
  0%, 100% {
    top: 10%;
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  100% {
    top: 90%;
    opacity: 0;
  }
}

/* Corner Markers */
.corners-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.corner-marker {
  position: absolute;
  width: 50px;
  height: 50px;
}

.corner-marker.corner-tl {
  top: 12%;
  left: 12%;
}

.corner-marker.corner-tr {
  top: 12%;
  right: 12%;
}

.corner-marker.corner-bl {
  bottom: 12%;
  left: 12%;
}

.corner-marker.corner-br {
  bottom: 12%;
  right: 12%;
}

.corner-line {
  position: absolute;
  background: linear-gradient(135deg, rgba(34, 197, 94, 1), rgba(34, 197, 94, 0.4));
  box-shadow: 0 0 12px rgba(34, 197, 94, 0.6);
  animation: corner-glow 2.5s ease-in-out infinite;
}

.corner-line.h {
  width: 100%;
  height: 3px;
}

.corner-line.v {
  width: 3px;
  height: 100%;
}

.corner-marker.corner-tl .corner-line.h {
  top: 0;
  left: 0;
}

.corner-marker.corner-tl .corner-line.v {
  top: 0;
  left: 0;
}

.corner-marker.corner-tr .corner-line.h {
  top: 0;
  right: 0;
}

.corner-marker.corner-tr .corner-line.v {
  top: 0;
  right: 0;
}

.corner-marker.corner-bl .corner-line.h {
  bottom: 0;
  left: 0;
}

.corner-marker.corner-bl .corner-line.v {
  bottom: 0;
  left: 0;
}

.corner-marker.corner-br .corner-line.h {
  bottom: 0;
  right: 0;
}

.corner-marker.corner-br .corner-line.v {
  bottom: 0;
  right: 0;
}

@keyframes corner-glow {
  0%, 100% {
    opacity: 0.5;
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.4);
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.8);
  }
}

/* Focus Circle */
.focus-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border: 2px solid rgba(34, 197, 94, 0.4);
  border-radius: 50%;
  animation: focus-breathe 2s ease-in-out infinite;
}

.focus-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: rgba(34, 197, 94, 0.8);
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(34, 197, 94, 0.8);
}

@keyframes focus-breathe {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    border-color: rgba(34, 197, 94, 0.4);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.15);
    border-color: rgba(34, 197, 94, 0.8);
  }
}

/* Status & Tips Area */
.scanner-status-area {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: fade-in 0.6s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.85rem 1.5rem;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05));
  border: 1.5px solid rgba(34, 197, 94, 0.3);
  border-radius: 16px;
  margin: 0 auto;
  backdrop-filter: blur(10px);
}

.status-indicator {
  width: 10px;
  height: 10px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(34, 197, 94, 0.8);
  animation: pulse-indicator 2s ease-in-out infinite;
}

@keyframes pulse-indicator {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

.status-text {
  font-size: 0.95rem;
  font-weight: 600;
  color: #10b981;
}

/* Tips Grid */
.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.tip-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.03));
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tip-item:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.08));
  border-color: rgba(59, 130, 246, 0.4);
  transform: translateY(-4px);
}

.tip-icon-box {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.tip-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: #334155;
  text-align: center;
}

/* Patient Summary Card - Step 2 */
.patient-summary-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, rgba(30, 64, 175, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%);
  border: 1px solid rgba(30, 64, 175, 0.15);
  border-radius: 12px;
  margin-bottom: 1.25rem;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.08);
}

.summary-patient-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
  border-radius: 50%;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
}

.summary-patient-info {
  flex: 1;
}

.summary-patient-info h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1e1b4b;
}

.summary-patient-info p {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: #64748b;
}

.summary-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.75rem;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 20px;
  font-size: 0.8rem;
  color: #16a34a;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.summary-badge i {
  font-size: 0.9rem;
}

/* Back Button */
.btn-back-pro {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  padding: 0.6rem 1rem;
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-back-pro:hover {
  background: rgba(255,255,255,0.3);
  border-color: rgba(255,255,255,0.5);
  transform: translateX(-2px);
}

/* Verification Result Section - Below Scanner */
.verification-result-section {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(100vh - 400px);
}

/* Success Result Container */
.result-success-container {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(34, 197, 94, 0.04) 100%);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.result-success-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #16a34a;
  font-weight: 600;
}

.result-success-header i {
  font-size: 1.5rem;
}

.result-success-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.result-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.result-description {
  margin: 0;
  color: #475569;
  font-size: 0.95rem;
}

/* Medication Details Box */
.medication-details-box {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid rgba(30, 64, 175, 0.1);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;
  gap: 1rem;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #475569;
  font-size: 0.9rem;
  white-space: nowrap;
}

.detail-value {
  color: #1e293b;
  font-size: 0.9rem;
  text-align: right;
  flex: 1;
}

.status-badge-small {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge-small.completed {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.status-badge-small.pending {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

/* Result Actions */
.result-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-action {
  padding: 0.7rem 1.25rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-confirm {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.3);
}

.btn-next {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: white;
}

.btn-next:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(30, 64, 175, 0.3);
}

.btn-retry {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(245, 158, 11, 0.3);
}

/* Error Result Container */
.result-error-container {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0.04) 100%);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.result-error-container.severity-CRITICAL {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%);
  border-color: rgba(239, 68, 68, 0.5);
}

.result-error-container.severity-HIGH {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.06) 100%);
  border-color: rgba(239, 68, 68, 0.4);
}

.result-error-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #dc2626;
  font-weight: 600;
}

.result-error-header i {
  font-size: 1.5rem;
}

.result-error-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.safety-warnings {
  background: rgba(245, 158, 11, 0.1);
  border-left: 3px solid #f59e0b;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #92400e;
}

.safety-warnings p {
  margin: 0;
}

/* Success Mode */
.success-mode {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  animation: success-appear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes success-appear {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.success-animation-wrapper {
  position: relative;
  width: 140px;
  height: 140px;
}

.success-circle-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140px;
  height: 140px;
}

.success-checkmark {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 10px 30px rgba(34, 197, 94, 0.4));
}

.circle-outline {
  fill: none;
  stroke: #22c55e;
  stroke-width: 3;
  animation: circle-draw 0.6s ease-out forwards;
}

.checkmark-path {
  stroke: #22c55e;
  stroke-width: 4;
  animation: checkmark-draw 0.5s ease-out 0.4s forwards;
}

@keyframes circle-draw {
  from {
    stroke-dasharray: 282;
    stroke-dashoffset: 282;
  }
  to {
    stroke-dasharray: 282;
    stroke-dashoffset: 0;
  }
}

@keyframes checkmark-draw {
  from {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
  }
  to {
    stroke-dasharray: 100;
    stroke-dashoffset: 0;
  }
}

.success-pulses {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140px;
  height: 140px;
  border: 2px solid rgba(34, 197, 94, 0.3);
  border-radius: 50%;
  animation: pulse-expand 2s ease-out infinite;
}

.pulse.pulse-1 {
  animation-delay: 0s;
}

.pulse.pulse-2 {
  animation-delay: 0.4s;
}

.pulse.pulse-3 {
  animation-delay: 0.8s;
}

@keyframes pulse-expand {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.2);
    opacity: 0;
  }
}

/* Result Info */
.result-info {
  text-align: center;
  animation: slide-up 0.5s ease-out 0.3s both;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.35rem;
}

.result-subtitle {
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 1.25rem;
}

/* Barcode Info Card */
.barcode-card {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(34, 197, 94, 0.08));
  border: 1.5px solid rgba(37, 99, 235, 0.2);
  border-radius: 14px;
  margin-bottom: 1.25rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.barcode-icon-wrapper {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.barcode-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.barcode-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.barcode-value {
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  font-weight: 700;
  color: #2563eb;
}

/* Loading Progress */
.loading-progress-wrapper {
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #10b981);
  background-size: 200% 100%;
  animation: progress-flow 1.5s ease-in-out infinite;
  border-radius: 10px;
  box-shadow: 0 0 12px rgba(37, 99, 235, 0.5);
}

@keyframes progress-flow {
  0% {
    width: 0%;
    background-position: 0% 50%;
  }
  50% {
    width: 70%;
  }
  100% {
    width: 100%;
    background-position: 100% 50%;
  }
}

.loading-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #64748b;
  font-weight: 500;
}

.dot {
  width: 6px;
  height: 6px;
  background: #2563eb;
  border-radius: 50%;
  animation: dot-bounce 1.4s ease-in-out infinite;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes dot-bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Rescan Button */
.btn-rescan-pro {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 2rem;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-rescan-pro:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
}

.btn-rescan-pro:active {
  transform: translateY(-1px);
}

.scanner-header {
  background: linear-gradient(135deg, 
    var(--primary-color) 0%, 
    var(--primary-dark) 100%);
  padding: 1.5rem 1.5rem 1.25rem;
  text-align: center;
  color: white;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.scanner-header::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.1), transparent);
  pointer-events: none;
}

.scanner-header-icon {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.85rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

.scanner-header h2 {
  font-size: 1.45rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
  letter-spacing: -0.5px;
}

.scanner-header p {
  font-size: 0.95rem;
  opacity: 0.95;
  margin: 0;
}

.scanner-body {
  padding: 1.75rem 1.5rem;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(to bottom, var(--bg-primary), rgba(59, 130, 246, 0.03));
}

/* Scanner Container */
.scanner-container {
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.scanner-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.scanner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.scan-line {
  position: absolute;
  left: 10%;
  width: 80%;
  height: 3px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(16, 185, 129, 0.3) 15%,
    rgba(16, 185, 129, 1) 50%,
    rgba(16, 185, 129, 0.3) 85%,
    transparent 100%);
  box-shadow: 
    0 0 15px rgba(16, 185, 129, 0.8),
    0 0 30px rgba(16, 185, 129, 0.4);
  animation: scan-move 2.2s ease-in-out infinite;
  filter: blur(0.5px);
}

@keyframes scan-move {
  0%, 100% {
    top: 15%;
    opacity: 0;
  }
  50% {
    top: 85%;
    opacity: 1;
  }
}

.scan-corners {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.corner {
  position: absolute;
  width: 45px;
  height: 45px;
  border: 2.5px solid transparent;
  background: linear-gradient(135deg, #10b981, #10b981) padding-box,
              linear-gradient(135deg, #10b981, rgba(16, 185, 129, 0.3)) border-box;
}

.corner.tl {
  top: 10%;
  left: 10%;
  border-right: none;
  border-bottom: none;
  border-radius: 6px 0 0 0;
  box-shadow: -2px -2px 15px rgba(16, 185, 129, 0.3);
}

.corner.tr {
  top: 10%;
  right: 10%;
  border-left: none;
  border-bottom: none;
  border-radius: 0 6px 0 0;
  box-shadow: 2px -2px 15px rgba(16, 185, 129, 0.3);
}

.corner.bl {
  bottom: 10%;
  left: 10%;
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 6px;
  box-shadow: -2px 2px 15px rgba(16, 185, 129, 0.3);
}

.corner.br {
  bottom: 10%;
  right: 10%;
  border-left: none;
  border-top: none;
  border-radius: 0 0 6px 0;
  box-shadow: 2px 2px 15px rgba(16, 185, 129, 0.3);
}

/* Scanner Tips */
.scanner-tips {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  background: rgba(59, 130, 246, 0.05);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.1);
}

.tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 95px;
}

.tip i {
  font-size: 1.5rem;
  color: var(--primary-color);
  filter: drop-shadow(0 2px 8px rgba(59, 130, 246, 0.3));
}

.tip span {
  font-size: 0.82rem;
  color: var(--text-secondary);
  text-align: center;
  font-weight: 500;
}

.corner.tl {
  top: 10%;
  left: 10%;
  border-right: none;
  border-bottom: none;
  border-radius: 4px 0 0 0;
}

.corner.tr {
  top: 10%;
  right: 10%;
  border-left: none;
  border-bottom: none;
  border-radius: 0 4px 0 0;
}

.corner.bl {
  bottom: 10%;
  left: 10%;
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 4px;
}

.corner.br {
  bottom: 10%;
  right: 10%;
  border-left: none;
  border-top: none;
  border-radius: 0 0 4px 0;
}

/* Scanner Tips */
.scanner-tips {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  min-width: 90px;
}

.tip i {
  font-size: 1.35rem;
  color: var(--primary-color);
}

.tip span {
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-align: center;
}

/* Success State */
.scanner-success {
  text-align: center;
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.success-icon {
  width: 110px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  animation: success-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 
    0 15px 45px rgba(16, 185, 129, 0.3),
    0 0 0 20px rgba(16, 185, 129, 0.1);
}

.success-icon i {
  font-size: 3.2rem;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

@keyframes success-pop {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.scanner-success h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.5px;
}

.barcode-display {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.1) 0%, 
    rgba(16, 185, 129, 0.1) 100%);
  padding: 0.85rem 1.5rem;
  border-radius: 12px;
  font-family: 'Courier New', monospace;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--primary-color);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
  font-weight: 500;
}

.btn-rescan {
  background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
  color: var(--text-primary);
  border: 2px solid var(--border-color);
  padding: 0.8rem 1.75rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.98rem;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.btn-rescan:hover {
  background: linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary));
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.25);
}

.btn-rescan:active {
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .scanner-card {
    height: calc(100vh - 180px);
    border-radius: 16px;
  }
  
  .scanner-header {
    padding: 1.25rem 1.25rem 1rem;
  }
  
  .scanner-header-icon {
    width: 56px;
    height: 56px;
    font-size: 1.6rem;
    margin-bottom: 0.75rem;
  }
  
  .scanner-header h2 {
    font-size: 1.25rem;
  }
  
  .scanner-header p {
    font-size: 0.9rem;
  }
  
  .scanner-body {
    padding: 1.5rem 1.25rem;
  }
  
  .scanner-container {
    gap: 1rem;
  }
  
  .scanner-frame {
    border-radius: 14px;
  }
  
  .corner {
    width: 40px;
    height: 40px;
  }
  
  .scanner-tips {
    gap: 1.5rem;
    padding: 0.85rem;
  }
  
  .tip {
    min-width: 85px;
  }
  
  .tip i {
    font-size: 1.35rem;
  }
  
  .tip span {
    font-size: 0.78rem;
  }
  
  .success-icon {
    width: 100px;
    height: 100px;
  }
  
  .success-icon i {
    font-size: 3rem;
  }
  
  .scanner-success h3 {
    font-size: 1.3rem;
  }
  
  .barcode-display {
    font-size: 0.95rem;
    padding: 0.75rem 1.25rem;
  }
  
  .loading-indicator {
    font-size: 0.9rem;
  }
  
  .btn-rescan {
    padding: 0.7rem 1.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .scanner-card {
    border-radius: 14px;
    height: calc(100vh - 160px);
  }
  
  .scanner-header {
    padding: 1rem 1rem 0.85rem;
  }
  
  .scanner-header-icon {
    width: 52px;
    height: 52px;
    font-size: 1.5rem;
    margin-bottom: 0.65rem;
  }
  
  .scanner-header h2 {
    font-size: 1.15rem;
  }
  
  .scanner-header p {
    font-size: 0.85rem;
  }
  
  .scanner-body {
    padding: 1.25rem 1rem;
  }
  
  .scanner-container {
    gap: 0.95rem;
  }
  
  .corner {
    width: 36px;
    height: 36px;
  }
  
  .scanner-tips {
    gap: 1.25rem;
    padding: 0.8rem;
  }
  
  .tip {
    min-width: 75px;
  }
  
  .tip i {
    font-size: 1.25rem;
  }
  
  .tip span {
    font-size: 0.75rem;
  }
  
  .success-icon {
    width: 90px;
    height: 90px;
  }
  
  .success-icon i {
    font-size: 2.7rem;
  }
  
  .scanner-success h3 {
    font-size: 1.2rem;
  }
  
  .barcode-display {
    font-size: 0.9rem;
    padding: 0.7rem 1.15rem;
  }
}

@media (min-height: 900px) {
  .scanner-card {
    max-height: 850px;
  }
}

@media (max-height: 700px) {
  .scanner-card {
    height: calc(100vh - 140px);
  }
  
  .scanner-header {
    padding: 1rem 1.25rem 0.85rem;
  }
  
  .scanner-header-icon {
    width: 52px;
    height: 52px;
    font-size: 1.5rem;
    margin-bottom: 0.6rem;
  }
  
  .scanner-body {
    padding: 1.15rem 1.25rem;
  }
  
  .scanner-container {
    gap: 1rem;
  }
}

@media (min-height: 900px) {
  .scanner-card {
    max-height: 850px;
  }
}

@media (max-height: 700px) {
  .scanner-card {
    height: calc(100vh - 140px);
  }
  
  .scanner-header {
    padding: 1rem 1.25rem 0.85rem;
  }
  
  .scanner-header-icon {
    width: 52px;
    height: 52px;
    font-size: 1.5rem;
    margin-bottom: 0.6rem;
  }
  
  .scanner-body {
    padding: 1.15rem 1.25rem;
  }
  
  .scanner-container {
    gap: 1rem;
  }
}

/* Old styles fallback */
.patient-scanner-centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 380px);
  padding: 2rem 0;
}

.scanner-area-large {
  width: 100%;
  max-width: 600px;
  text-align: center;
}

.scanner-frame-large {
  position: relative;
  background: #000;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
  aspect-ratio: 4/3;
}

.scan-overlay-large {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.scan-line-large {
  position: absolute;
  top: 50%;
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #10b981, transparent);
  box-shadow: 0 0 10px #10b981;
  animation: scan-line-large 2s ease-in-out infinite;
}

@keyframes scan-line-large {
  0%, 100% { transform: translateY(-50px); opacity: 0; }
  50% { transform: translateY(50px); opacity: 1; }
}

.corner-large {
  position: absolute;
  width: 40px;
  height: 40px;
  border: 3px solid #10b981;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
}

.corner-tl {
  top: 15%;
  left: 15%;
  border-right: none;
  border-bottom: none;
  border-top-left-radius: 8px;
}

.corner-tr {
  top: 15%;
  right: 15%;
  border-left: none;
  border-bottom: none;
  border-top-right-radius: 8px;
}

.corner-bl {
  bottom: 15%;
  left: 15%;
  border-right: none;
  border-top: none;
  border-bottom-left-radius: 8px;
}

.corner-br {
  bottom: 15%;
  right: 15%;
  border-left: none;
  border-top: none;
  border-bottom-right-radius: 8px;
}

.scanner-instructions {
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
}

.instruction-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  margin: 0 auto 1.5rem;
  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.3);
}

.scanner-instructions h4 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.scanner-instructions p {
  color: #64748b;
  margin-bottom: 2rem;
}

.instruction-items {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.instruction-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.9rem;
}

.instruction-item i {
  font-size: 1.2rem;
}

/* Patient Scanned Result */
.patient-scanned-result {
  text-align: center;
  padding: 3rem 2rem;
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-icon {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
}

.success-circle {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
  box-shadow: 0 20px 50px rgba(16, 185, 129, 0.4);
  animation: scaleIn 0.5s ease;
  position: relative;
  z-index: 2;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.success-pulse {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 3px solid #10b981;
  border-radius: 50%;
  animation: pulse-ring 2s infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

.patient-scanned-result h3 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.scanned-barcode {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  color: #0369a1;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  border: 2px solid #bae6fd;
}

.loading-text {
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-rescan-patient {
  background: transparent;
  border: 2px solid #e2e8f0;
  color: #64748b;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-rescan-patient:hover {
  background: #f8fafc;
  border-color: #2563eb;
  color: #2563eb;
  transform: translateY(-2px);
}

/* Patients Grid */
.patients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  max-height: calc(100vh - 380px);
  overflow-y: auto;
  padding-right: 0.5rem;
}

.patient-card-modern {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.patient-card-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2563eb, #1e40af);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.patient-card-modern:hover {
  border-color: #2563eb;
  box-shadow: 0 12px 32px rgba(37, 99, 235, 0.15);
  transform: translateY(-4px);
}

.patient-card-modern:hover::before {
  transform: scaleX(1);
}

.patient-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: #64748b;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.patient-avatar.has-image {
  background: transparent;
  padding: 0;
}

.patient-avatar .avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  display: block;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  transition: transform 0.3s ease;
}

.patient-card-modern:hover .patient-avatar .avatar-image {
  transform: scale(1.05);
}

.online-indicator {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 14px;
  height: 14px;
  background: #10b981;
  border: 2px solid white;
  border-radius: 50%;
  z-index: 1;
}

.patient-info {
  flex: 1;
}

.patient-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.35rem;
}

.patient-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
}

.detail-item i {
  width: 16px;
  color: #94a3b8;
}

.patient-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.stat-pill {
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.pending-pill {
  background: linear-gradient(135def, #fef3c7, #fde68a);
  color: #92400e;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.selection-arrow {
  color: #94a3b8;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.patient-card-modern:hover .selection-arrow {
  color: #2563eb;
  transform: translateX(4px);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  color: #1e293b;
  margin-bottom: 0.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-stats {
    gap: 1rem;
  }
  
  .hero-stats .stat-item {
    padding: 1rem;
    min-width: 100px;
  }
  
  .advanced-stepper {
    flex-direction: column;
    gap: 2rem;
  }
  
  .step-progress-bar {
    display: none;
  }
  
  .patients-grid {
    grid-template-columns: 1fr;
  }
  
  .patient-card-modern {
    padding: 1rem;
    flex-wrap: wrap;
  }
  
  .patient-avatar {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
  
  .patient-avatar .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .patient-avatar-large {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
  
  .patient-avatar-large .avatar-image-large {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .medication-status-badge {
    min-width: 100%;
    order: 3;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .header-badge {
    margin-left: 0;
  }
  
  .security-features {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .patient-banner {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .patient-details-large {
    text-align: center;
  }
  
  .patient-meta {
    justify-content: center;
    flex-wrap: wrap;
  }
}

/* Tablet Responsive */
@media (max-width: 1024px) and (min-width: 769px) {
  .patients-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .patient-avatar {
    width: 55px;
    height: 55px;
  }
  
  .patient-avatar .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .patient-avatar-large {
    width: 70px;
    height: 70px;
  }
  
  .patient-avatar-large .avatar-image-large {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

/* Small Mobile Responsive */
@media (max-width: 480px) {
  .patient-card-modern {
    padding: 0.75rem;
    gap: 12px;
  }
  
  .patient-avatar {
    width: 45px;
    height: 45px;
    font-size: 1rem;
  }
  
  .patient-avatar .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 14px;
  }
  
  .patient-avatar-large {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
  
  .patient-avatar-large .avatar-image-large {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 16px;
  }
  
  .patient-name {
    font-size: 1rem;
  }
  
  .detail-item {
    font-size: 0.8rem;
  }
  
  .online-indicator {
    width: 12px;
    height: 12px;
  }
  
  .medication-status-badge {
    padding: 8px;
    gap: 8px;
  }
  
  .status-icon {
    font-size: 1.2rem;
  }
  
  .status-text {
    font-size: 0.8rem;
  }
  
  .status-subtext {
    font-size: 0.7rem;
  }
}

/* Animation Classes */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.patients-grid {
  animation: slideInUp 0.6s ease forwards;
}

.patient-card-modern {
  animation: fadeIn 0.6s ease forwards;
}

/* Step 2: Advanced Scanning Styles */
.scanning-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.scanning-header {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.scanning-icon {
  background: rgba(255, 255, 255, 0.2);
  position: relative;
}

.scan-pulse {
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  animation: scan-pulse 2s infinite;
}

.btn-back {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 500;
  font-size: 0.85rem;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* Patient Banner */
.patient-banner {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: white;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
}

.patient-banner::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(50%, -50%);
}

.patient-avatar-large {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}

.patient-avatar-large.has-image {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0;
}

.patient-avatar-large .avatar-image-large {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  display: block;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

.patient-details-large h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
}

.patient-meta {
  display: flex;
  gap: 1rem;
  opacity: 0.9;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
}

.safety-indicator {
  margin-left: auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
}

.indicator-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse-indicator 2s infinite;
}

/* Medications Section */
.medications-section {
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
}

.section-header h3 {
  color: #1e293b;
  font-weight: 700;
  margin: 0;
  font-size: 1.1rem;
}

.medication-summary {
  display: flex;
  gap: 0.75rem;
}

.summary-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.summary-badge.pending {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e;
}

.summary-badge.completed {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #065f46;
}

.medications-grid {
  display: grid;
  gap: 1rem;
}

.medication-card-modern {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.medication-card-modern.completed {
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border-color: #10b981;
}

.medication-card-modern.pending {
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
  border-color: #f59e0b;
}

.medication-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.medication-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #64748b;
}

.medication-info {
  flex: 1;
}

.medication-info h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.barcode-info {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
  font-family: 'Courier New', monospace;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-badge.completed {
  background: #10b981;
  color: white;
}

.status-badge.pending {
  background: #f59e0b;
  color: white;
}

.medication-timeline {
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.timeline-item.completed {
  color: #10b981;
  font-weight: 500;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

/* Scanner Section */
.scanner-section {
  margin-bottom: 3rem;
}

.scanner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.scanner-header h3 {
  color: #1e293b;
  font-weight: 700;
  margin: 0;
}

.scanner-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.scanner-status.active {
  color: #2563eb;
}

.scanner-status.completed {
  color: #10b981;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s infinite;
}

.scanner-interface {
  background: #f8fafc;
  border-radius: 16px;
  padding: 2rem;
  border: 2px dashed #cbd5e1;
  position: relative;
}

.scanner-active {
  text-align: center;
}

.scanner-frame {
  position: relative;
  max-width: 400px;
  margin: 0 auto 1rem;
  border-radius: 16px;
  overflow: hidden;
  background: #000;
}

.scan-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.scan-line {
  position: absolute;
  top: 50%;
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ef4444, transparent);
  animation: scan-sweep 2s ease-in-out infinite;
}

@keyframes scan-sweep {
  0%, 100% { opacity: 0; transform: translateY(-100px); }
  50% { opacity: 1; transform: translateY(100px); }
}

.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 3px solid #ef4444;
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

.scanner-instruction {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
}

/* Scanner Result */
.scanner-result {
  text-align: center;
}

.result-card {
  background: white;
  border: 2px solid #10b981;
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

.result-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.result-info h4 {
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.barcode-display {
  font-family: 'Courier New', monospace;
  background: #f8fafc;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: #1e293b;
  font-weight: 600;
  margin: 0;
}

.btn-rescan {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  color: #64748b;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-rescan:hover {
  border-color: #2563eb;
  color: #2563eb;
}

/* Verification Section */
.verification-section {
  margin-top: 2rem;
  text-align: center;
}

.verification-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  color: white;
  padding: 0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 80px;
  min-width: 320px;
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
}

.verification-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(16, 185, 129, 0.4);
}

.verification-btn.loading {
  pointer-events: none;
  opacity: 0.8;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  position: relative;
  z-index: 2;
}

.btn-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.btn-text {
  flex: 1;
  text-align: left;
}

.main-text {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.sub-text {
  display: block;
  font-size: 0.85rem;
  opacity: 0.9;
}

.btn-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.verification-btn:hover .btn-glow {
  transform: translateX(100%);
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Results Section */
.results-section {
  margin-top: 3rem;
}

.result-success, .result-error {
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.result-success {
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border: 2px solid #10b981;
}

.result-error {
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border: 2px solid #ef4444;
}

.success-header, .error-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.success-icon, .error-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.success-icon {
  background: #10b981;
  color: white;
}

.error-icon {
  background: #ef4444;
  color: white;
}

.success-content h3, .error-content h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.success-content {
  color: #065f46;
}

.error-content {
  color: #991b1b;
}

.medication-details {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.medication-details h4 {
  color: #1e293b;
  margin-bottom: 1rem;
}

.detail-grid {
  display: grid;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item .label {
  font-weight: 500;
  color: #64748b;
}

.detail-item .value {
  font-weight: 600;
  color: #1e293b;
}

.detail-item .value.completed {
  color: #10b981;
}

.detail-item .value.pending {
  color: #f59e0b;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary-action, .btn-secondary-action {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
}

.btn-primary-action {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
}

.btn-primary-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
}

.btn-secondary-action {
  background: white;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.btn-secondary-action:hover {
  border-color: #2563eb;
  color: #2563eb;
}

/* Safety Protocol */
.safety-protocol {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
}

.safety-protocol h4 {
  color: #991b1b;
  margin-bottom: 1rem;
}

.protocol-list {
  margin: 0;
  padding-left: 1.5rem;
}

.protocol-list li {
  margin-bottom: 0.5rem;
  color: #374151;
}

.protocol-list strong {
  color: #991b1b;
}

/* Error Section */
.error-section {
  margin-top: 2rem;
}

.error-alert {
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border: 2px solid #ef4444;
  color: #991b1b;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}

/* Action Bar */
.action-bar {
  margin-top: 3rem;
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.btn-restart {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  color: #64748b;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.btn-restart:hover {
  border-color: #2563eb;
  color: #2563eb;
  transform: translateY(-2px);
}

/* Responsive Enhancements for Step 2 */
@media (max-width: 768px) {
  .patient-banner {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .patient-meta {
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .safety-indicator {
    margin-left: 0;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .medication-header {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .verification-btn {
    min-width: 280px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}

/* Verification Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.verification-modal {
  background: linear-gradient(135deg, #fff 0%, #f8f9ff 100%);
  border-radius: 20px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to { 
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 20px 20px 0 0;
  position: relative;
  text-align: center;
}

.success-icon, .error-icon, .warning-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.success-icon {
  color: #28a745;
}

.error-icon {
  color: #dc3545;
}

.warning-icon {
  color: #ffc107;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.modal-body {
  padding: 2rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.success-title {
  color: #28a745;
}

.error-title {
  color: #dc3545;
}

.warning-title {
  color: #ffc107;
}

.verification-details {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(0, 123, 255, 0.1);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.detail-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #495057;
}

.value {
  color: #212529;
  font-weight: 500;
}

.nurse-info {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
  color: #047857 !important;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: 1px solid #d1fae5;
  font-weight: 600;
}

.barcode-text {
  font-family: 'Courier New', monospace;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.safety-status {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.5rem;
  border-radius: 15px;
  font-weight: 600;
  margin-bottom: 1rem;
}

.success-status {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.error-status {
  background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
}

.warning-status {
  background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
  color: #212529;
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
}

.safety-warning {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border: 1px solid #ffeaa7;
  border-radius: 15px;
  padding: 1rem;
  color: #856404;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 1rem;
}

.safety-warning-critical {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  border: 2px solid #dc3545;
  border-radius: 15px;
  padding: 1.25rem;
  color: #721c24;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 1.5rem;
  font-weight: 600;
  animation: pulse-warning 2s infinite;
}

@keyframes pulse-warning {
  0%, 100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(220, 53, 69, 0); }
}

.alert-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.alert-type-badge.alert-danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
}

.alert-type-badge.alert-warning {
  background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
  color: #212529;
}

.alert-details-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-left: 4px solid #0d6efd;
  border-radius: 10px;
  padding: 1.25rem;
  margin-top: 1.5rem;
}

.details-title {
  font-size: 1rem;
  font-weight: 600;
  color: #0d6efd;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.details-text {
  font-size: 0.95rem;
  color: #495057;
  line-height: 1.6;
  margin: 0;
}

.alert-recommendation-section {
  background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
  border-left: 4px solid #17a2b8;
  border-radius: 10px;
  padding: 1.25rem;
  margin-top: 1rem;
}

.recommendation-title {
  font-size: 1rem;
  font-weight: 600;
  color: #17a2b8;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.recommendation-text {
  font-size: 0.95rem;
  color: #0c5460;
  line-height: 1.6;
  margin: 0;
  font-weight: 500;
}

.contact-section {
  margin-top: 1.5rem;
  text-align: center;
}

.btn-contact-physician {
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
  border: none;
  color: #212529;
  font-weight: 700;
  padding: 0.875rem 2rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  animation: shake 3s infinite;
}

.btn-contact-physician:hover {
  background: linear-gradient(135deg, #ff9800 0%, #ff5722 100%);
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(255, 152, 0, 0.4);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}

.patient-info {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 15px;
  padding: 1.5rem;
  margin-top: 1rem;
}

.modal-footer {
  padding: 1.5rem 2rem 2rem;
  text-align: center;
}

.completion-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.8rem 2rem;
  border-radius: 25px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  min-width: 140px;
  justify-content: center;
}

/* Completion Warning Styles */
.completion-warning {
  background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
  border: 2px solid #f59e0b;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1.5rem;
  color: #92400e;
  font-size: 0.95rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.completion-warning i {
  color: #f59e0b;
  font-size: 1.1rem;
  margin-top: 0.1rem;
  flex-shrink: 0;
}

.completion-warning strong {
  color: #78350f;
}

/* Enhanced Modal Styles for Already Completed */
.modal-overlay {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}

.warning-title {
  color: #f59e0b !important;
  margin-bottom: 1rem;
}

.warning-status {
  background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
  border: 2px solid #f59e0b;
  color: #92400e;
}

.warning-status i {
  color: #f59e0b;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .verification-modal {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-header, .modal-body {
    padding: 1.5rem;
  }
  
  .completion-actions {
    flex-direction: column;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

/* Success Modal Enhancements */
.success-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  align-items: center;
}

.btn-complete {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-complete:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.btn-complete:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.administration-section {
  margin-top: 20px;
  padding: 15px;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 8px;
}

.admin-warning {
  color: #d97706;
  font-size: 0.9rem;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.admin-warning i {
  color: #f59e0b;
  margin-top: 2px;
}

.already-administered {
  margin-top: 20px;
  padding: 15px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 8px;
}

.completed-info {
  color: #059669;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.completed-info i {
  color: #10b981;
  font-size: 1.1rem;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-pending {
  background: rgba(251, 191, 36, 0.15);
  color: #d97706;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.status-completed {
  background: rgba(34, 197, 94, 0.15);
  color: #059669;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.status-cancelled {
  background: rgba(239, 68, 68, 0.15);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.status-unknown {
  background: rgba(107, 114, 128, 0.15);
  color: #6b7280;
  border: 1px solid rgba(107, 114, 128, 0.3);
}

/* Enhanced Detail Items */
.detail-item .value {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Medical-themed Animations */
@keyframes heroGlow {
  0% { 
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6), 
                 0 0 15px rgba(0, 0, 0, 0.4), 
                 0 0 30px rgba(255, 255, 255, 0.1); 
  }
  100% { 
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6), 
                 0 0 15px rgba(0, 0, 0, 0.4), 
                 0 0 30px rgba(255, 255, 255, 0.3); 
  }
}

@keyframes floatPill {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg) scale(1); 
    opacity: 0.6;
  }
  25% { 
    transform: translateY(-20px) rotate(5deg) scale(1.05); 
    opacity: 0.8;
  }
  50% { 
    transform: translateY(-15px) rotate(-3deg) scale(1.1); 
    opacity: 1;
  }
  75% { 
    transform: translateY(-25px) rotate(7deg) scale(1.05); 
    opacity: 0.8;
  }
}

@keyframes medicalPulse {
  0%, 100% { 
    transform: scale(1); 
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
  }
  50% { 
    transform: scale(1.05); 
    box-shadow: 0 0 30px rgba(34, 197, 94, 0.6);
  }
}

@keyframes badgeHover {
  0% { transform: perspective(1000px) rotateX(5deg); }
  100% { transform: perspective(1000px) rotateX(0deg) translateY(-5px); }
}

/* Enhanced Medical Badge */
.safety-badge:hover {
  animation: badgeHover 0.3s ease forwards;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

/* Medical Cross Icon Animation */
.safety-badge i {
  animation: medicalPulse 3s ease-in-out infinite;
}

/* Enhanced Security Dot */
.security-dot {
  animation: medicalPulse 2s ease-in-out infinite;
}

/* Hero Stats Enhancement */
.stat-item {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-item:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.stat-number {
  position: relative;
}

.stat-number::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 3px;
  background: linear-gradient(90deg, #4ade80, #22c55e);
  border-radius: 2px;
  animation: medicalPulse 2s ease-in-out infinite;
}

/* Medical Theme Colors Enhancement */
.hero-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(245, 158, 11, 0.1) 0%, transparent 50%);
  animation: medicalAura 8s ease-in-out infinite;
  z-index: 1;
}

@keyframes medicalAura {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

/* Enhanced Title Underline */
.title-underline {
  background: linear-gradient(90deg, 
    #22c55e 0%, 
    #4ade80 25%, 
    #60a5fa 50%, 
    #a78bfa 75%, 
    #f472b6 100%);
  animation: medicalPulse 3s ease-in-out infinite;
}

/* Medication Status Styling */
.medication-summary {
  margin-top: 8px;
  padding: 4px 0;
}

.summary-text {
  color: #6b7280;
  font-size: 0.8rem;
  font-weight: 500;
}

.medication-status-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  min-width: 180px;
}

.medication-status-badge.has-pending {
  background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
  border-color: #f59e0b;
  color: #92400e;
}

.medication-status-badge.all-complete {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border-color: #10b981;
  color: #065f46;
}

.medication-status-badge.no-medications {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-color: #9ca3af;
  color: #4b5563;
}

.status-icon {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-info {
  flex: 1;
}

.status-text {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 2px;
}

.status-subtext {
  font-size: 0.75rem;
  opacity: 0.8;
  font-weight: 500;
}

/* Patient Card Enhancement */
.patient-card-modern {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #e5e7eb;
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.patient-card-modern:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
}

.patient-card-modern:hover .medication-status-badge.has-pending {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  transform: scale(1.02);
}

.patient-card-modern:hover .medication-status-badge.all-complete {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  transform: scale(1.02);
}

.patient-card-modern:hover .medication-status-badge.no-medications {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
  transform: scale(1.02);
}

/* Loading state for medication summary */
.summary-text:empty::after {
  content: 'Φόρτωση στατιστικών...';
  color: #9ca3af;
  font-style: italic;
}
/* ============================================
   COMPREHENSIVE MOBILE RESPONSIVE UPDATES
   ============================================ */

/* Account for sidebar on mobile (60px top bar) */
@media (max-width: 991.98px) {
  .medication-safety-container {
    min-height: auto;
    overflow-y: auto;
  }
  
  .steps-section {
    padding: 1rem 0;
    flex-shrink: 0;
  }
}

/* Tablet Responsive (768px - 991px) */
@media (min-width: 768px) and (max-width: 991.98px) {
  .medication-safety-container {
    height: auto;
    min-height: 100vh;
    overflow-y: auto;
  }
  
  .steps-section {
    padding: 1rem;
    flex-shrink: 0;
    min-height: auto;
  }
  
  .advanced-stepper {
    max-width: 100%;
    padding: 0;
    width: 100%;
  }
  
  .advanced-step {
    max-width: none;
    padding: 0.75rem;
  }
  
  .main-content {
    padding: 1.5rem;
    min-height: auto;
  }
  
  .scanner-wrapper {
    padding: 1rem;
  }
  
  .step2-two-column {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .step2-left-column {
    max-height: 45vh;
  }
  
  .step2-right-column {
    min-height: 45vh;
  }
}

/* Mobile Responsive (481px - 767px) */
@media (min-width: 481px) and (max-width: 767.98px) {
  .medication-safety-container {
    height: auto;
    overflow-y: auto;
    min-height: 100vh;
  }
  
  .steps-section {
    padding: 0.75rem;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.03);
    flex-shrink: 0;
  }
  
  .advanced-stepper {
    flex-direction: row;
    width: 100%;
    max-width: 100%;
    padding: 0;
    gap: 0.75rem;
    justify-content: space-between;
  }
  
  .step-progress-bar {
    display: none;
  }
  
  .advanced-step {
    flex: 1;
    max-width: none;
    padding: 0.6rem;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }
  
  .advanced-step.active {
    background: #eff6ff;
    border-color: #2563eb;
  }
  
  .step-circle {
    width: 42px;
    height: 42px;
  }
  
  .step-inner {
    width: 30px;
    height: 30px;
    font-size: 0.9rem;
  }
  
  .step-title {
    font-size: 0.88rem;
  }
  
  .step-description {
    font-size: 0.72rem;
  }
  
  .step-info {
    font-size: 0.68rem;
    padding: 0.15rem 0.45rem;
  }
  
  .main-content {
    padding: 1.25rem;
    height: auto;
    min-height: auto;
  }
  
  .scanner-wrapper {
    padding: 0.75rem;
  }
  
  .scanner-pro-header {
    padding: 1rem;
  }
  
  .scanner-main {
    height: auto;
    min-height: 50vh;
  }
  
  .scanner-frame-pro {
    border-radius: 12px;
    min-height: 40vh;
  }
  
  .step2-two-column {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 0.75rem;
    overflow-y: auto;
    max-height: 70vh;
  }
  
  .step2-left-column {
    max-height: 40vh;
    border-radius: 12px;
  }
  
  .step2-right-column {
    min-height: 40vh;
  }
  
  .instructions-list {
    max-height: 35vh;
  }
  
  .instruction-card {
    padding: 0.75rem;
    margin-bottom: 0.5rem;
  }
  
  .scanner-card {
    border-radius: 12px;
    padding: 1rem;
  }
}

/* Mobile Responsive (Small: 320px - 480px) - OPTIMIZED FOR NO OVERLAP */
@media (max-width: 480px) {
  .medication-safety-container {
    height: auto;
    overflow-y: auto;
    min-height: auto;
  }
  
  /* STEPS SECTION - Fix overlapping issue */
  .steps-section {
    padding: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    flex-shrink: 0;
    width: 100%;
    min-height: auto;
  }
  
  .advanced-stepper {
    flex-direction: column;
    gap: 0.5rem;
    padding: 0;
    max-width: 100%;
    width: 100%;
    margin: 0;
  }
  
  .step-progress-bar {
    display: none !important;
  }
  
  .advanced-step {
    flex: 0 0 auto;
    width: calc(100% - 0.5rem);
    max-width: none;
    padding: 0.5rem;
    background: #f8fafc;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    margin: 0;
  }
  
  .advanced-step.active {
    background: #eff6ff;
    border-color: #2563eb;
  }
  
  .step-circle {
    width: 36px;
    height: 36px;
    margin-bottom: 0.25rem;
  }
  
  .step-inner {
    width: 26px;
    height: 26px;
    font-size: 0.8rem;
  }
  
  .step-title {
    font-size: 0.8rem;
    font-weight: 600;
    margin: 0.25rem 0 0 0;
    line-height: 1.2;
  }
  
  .step-description {
    font-size: 0.6rem;
    display: none;
  }
  
  .step-info {
    font-size: 0.55rem;
    padding: 0.1rem 0.25rem;
    margin-top: 0.1rem;
  }
  
  /* MAIN CONTENT - Fix scrolling and sizing */
  .main-content {
    padding: 0.5rem;
    height: auto;
    min-height: auto;
    align-items: stretch;
    justify-content: flex-start;
  }
  
  .scanner-wrapper {
    padding: 0.5rem;
    width: 100%;
  }
  
  .scanner-pro-header {
    padding: 0.65rem;
  }
  
  .header-step {
    gap: 0.5rem;
  }
  
  .step-number {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }
  
  .step-label {
    font-size: 0.75rem;
  }
  
  .scanner-title {
    font-size: 1.2rem;
    margin: 0.3rem 0;
  }
  
  .scanner-subtitle {
    font-size: 0.8rem;
  }
  
  .scanner-main {
    height: auto;
    min-height: 55vh;
    max-height: none;
    padding: 0.75rem;
  }
  
  .scanner-frame-pro {
    border-radius: 10px;
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 1;
    max-width: 100%;
  }
  
  .corner-marker {
    width: 32px;
    height: 32px;
  }
  
  .corner-line {
    width: 22px;
    height: 22px;
  }
  
  .focus-circle {
    width: 75px;
    height: 75px;
  }
  
  /* Step 2 Two Column */
  .step2-two-column {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 0.5rem;
    height: auto;
    min-height: auto;
    overflow-y: auto;
    max-height: calc(100vh - 200px);
  }
  
  .step2-left-column {
    max-height: 35vh;
    border-radius: 8px;
    min-height: auto;
  }
  
  .step2-right-column {
    min-height: 40vh;
  }
  
  .instructions-list {
    max-height: 32vh;
    padding: 0.4rem;
  }
  
  .instruction-card {
    padding: 0.6rem;
    margin-bottom: 0.35rem;
    border-radius: 8px;
  }
  
  .instruction-title {
    font-size: 0.88rem;
  }
  
  .instruction-barcode {
    font-size: 0.7rem;
  }
  
  .instruction-status {
    font-size: 0.68rem;
    padding: 0.25rem 0.5rem;
  }
  
  .scanner-card {
    border-radius: 8px;
    padding: 0.65rem;
    height: auto;
    min-height: 36vh;
  }
  
  .scanner-header {
    padding: 0.65rem 0.65rem 0.4rem;
  }
  
  .scanner-header-icon {
    width: 44px;
    height: 44px;
    font-size: 1.3rem;
    margin-bottom: 0.35rem;
  }
  
  .scanner-header h2 {
    font-size: 1.05rem;
  }
  
  .scanner-header p {
    font-size: 0.78rem;
  }
  
  .scanner-body {
    padding: 0.65rem;
  }
  
  .scanner-frame {
    border-radius: 8px;
    min-height: 24vh;
  }
  
  .corner {
    width: 30px;
    height: 30px;
  }
  
  .scanner-tips {
    gap: 0.65rem;
    padding: 0.5rem;
  }
  
  .tip {
    min-width: 65px;
    font-size: 0.7rem;
  }
  
  .tip i {
    font-size: 1.1rem;
  }
  
  .tip span {
    font-size: 0.65rem;
  }
  
  .success-icon {
    width: 75px;
    height: 75px;
  }
  
  .success-icon i {
    font-size: 2.3rem;
  }
  
  .scanner-success h3 {
    font-size: 1.15rem;
    margin: 0.35rem 0;
  }
  
  .barcode-display {
    font-size: 0.88rem;
    padding: 0.55rem 0.95rem;
    word-break: break-all;
  }
  
  .loading-indicator {
    font-size: 0.8rem;
  }
  
  .btn-rescan {
    padding: 0.55rem 1.1rem;
    font-size: 0.8rem;
  }
  
  .btn-next {
    padding: 0.55rem 1.1rem;
    font-size: 0.8rem;
  }
  
  .modal-dialog {
    margin: 0.5rem !important;
  }
  
  .modal-content {
    border-radius: 10px;
  }
  
  .modal-header {
    padding: 0.9rem;
  }
  
  .modal-body {
    padding: 0.9rem;
  }
  
  .medication-hero {
    min-height: auto;
    padding: 1.5rem 0;
  }
  
  .hero-title {
    font-size: 1.9rem;
  }
  
  .hero-subtitle {
    font-size: 0.95rem;
  }
  
  .hero-stats {
    gap: 0.75rem;
  }
  
  .hero-stats .stat-item {
    padding: 0.65rem;
    min-width: 85px;
  }
  
  .hero-stats .stat-number {
    font-size: 1.9rem;
  }
  
  .hero-stats .stat-label {
    font-size: 0.7rem;
  }
}

/* Extra Small Mobile (< 320px) */
@media (max-width: 319px) {
  .medication-safety-container {
    min-height: auto;
  }
  
  .steps-section {
    padding: 0.5rem;
  }
  
  .advanced-stepper {
    gap: 0.5rem;
    padding: 0;
  }
  
  .step-circle {
    width: 36px;
    height: 36px;
  }
  
  .step-title {
    font-size: 0.8rem;
  }
  
  .scanner-title {
    font-size: 1.05rem;
  }
  
  .scanner-subtitle {
    font-size: 0.7rem;
  }
}
</style>