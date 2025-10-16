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

    <!-- Step 1: Advanced Patient Selection -->
    <div v-if="currentStep === 1" class="main-content">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <div class="selection-card">
              <div class="card-header-modern">
                <div class="header-content">
                  <div class="header-icon">
                    <i class="bi bi-person-check"></i>
                  </div>
                  <div class="header-text">
                    <h2>Επιλογή Ασθενή</h2>
                    <p>Ταυτοποιήστε τον ασθενή για ασφαλή χορήγηση φαρμάκου</p>
                  </div>
                  <div class="header-badge">
                    <span class="step-badge">Βήμα 1/2</span>
                  </div>
                </div>
              </div>
              
              <div class="card-body-modern">
                <!-- Search & Filter -->
                <div class="search-section">
                  <div class="search-wrapper">
                    <i class="bi bi-search search-icon"></i>
                    <input 
                      type="text" 
                      class="form-control search-input" 
                      placeholder="Αναζήτηση ασθενή (όνομα, ΑΜΚΑ)..."
                      v-model="patientSearch"
                    >
                    <div class="search-filters">
                      <button class="filter-btn" :class="{ active: activeFilter === 'all' }" @click="setFilter('all')">
                        Όλοι ({{ patients.length }})
                      </button>
                      <button class="filter-btn" :class="{ active: activeFilter === 'pending' }" @click="setFilter('pending')">
                        Εκκρεμή Φάρμακα ({{ getPendingCount() }})
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Patients Grid -->
                <div class="patients-grid" v-if="filteredPatients.length > 0">
                  <div 
                    v-for="patient in filteredPatients" 
                    :key="patient.id"
                    class="patient-card-modern"
                    @click="selectPatient(patient)"
                  >
                    <div class="patient-avatar">
                      <i class="bi bi-person-fill"></i>
                      <div class="online-indicator"></div>
                    </div>
                    
                    <div class="patient-info">
                      <h4 class="patient-name">{{ patient.full_name }}</h4>
                      <div class="patient-details">
                        <div class="detail-item">
                          <i class="bi bi-credit-card-2-front"></i>
                          <span>{{ patient.amka }}</span>
                        </div>
                        <div class="detail-item">
                          <i class="bi bi-droplet-fill"></i>
                          <span>{{ patient.blood_type }}</span>
                        </div>
                      </div>
                      
                      <!-- Medication Summary -->
                      <div class="medication-summary">
                        <small class="summary-text">{{ getMedicationSummary(patient.id) }}</small>
                      </div>
                    </div>
                    
                    <!-- Medication Status Badge -->
                    <div class="medication-status-badge" 
                         :class="getPatientMedicationStatus(patient.id).class">
                      <div class="status-icon">
                        <i :class="getPatientMedicationStatus(patient.id).icon"></i>
                      </div>
                      <div class="status-info">
                        <div class="status-text">{{ getPatientMedicationStatus(patient.id).text }}</div>
                        <div class="status-subtext" v-if="patientMedications[patient.id]?.total > 0">
                          {{ patientMedications[patient.id]?.pending }}/{{ patientMedications[patient.id]?.total }} φάρμακα
                        </div>
                      </div>
                    </div>
                    
                    <div class="selection-arrow">
                      <i class="bi bi-arrow-right"></i>
                    </div>
                  </div>
                </div>
                
                <!-- Empty State -->
                <div v-else class="empty-state">
                  <div class="empty-icon">
                    <i class="bi bi-people"></i>
                  </div>
                  <h3>Δεν βρέθηκαν ασθενείς</h3>
                  <p>Δοκιμάστε να αλλάξετε τα κριτήρια αναζήτησης</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 2: Advanced Medication Scanning -->
    <div v-if="currentStep === 2" class="main-content">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <div class="scanning-card">
              <div class="card-header-modern scanning-header">
                <div class="header-content">
                  <div class="header-icon scanning-icon">
                    <i class="bi bi-upc-scan"></i>
                    <div class="scan-pulse"></div>
                  </div>
                  <div class="header-text">
                    <h2>AI-Powered Medication Verification</h2>
                    <p>Σαρώστε το φάρμακο για επαλήθευση ασφαλείας</p>
                  </div>
                  <button class="btn-back" @click="goBackToPatientSelection">
                    <i class="bi bi-arrow-left"></i>
                    <span>Αλλαγή Ασθενή</span>
                  </button>
                </div>
              </div>
              
              <div class="card-body-modern">
                <!-- Selected Patient Banner -->
                <div class="patient-banner">
                  <div class="patient-avatar-large">
                    <i class="bi bi-person-fill"></i>
                  </div>
                  <div class="patient-details-large">
                    <h3>{{ selectedPatient.full_name }}</h3>
                    <div class="patient-meta">
                      <span class="meta-item">
                        <i class="bi bi-credit-card-2-front"></i>
                        ΑΜΚΑ: {{ selectedPatient.amka }}
                      </span>
                      <span class="meta-item">
                        <i class="bi bi-droplet-fill"></i>
                        {{ selectedPatient.blood_type }}
                      </span>
                    </div>
                  </div>
                  <div class="safety-indicator">
                    <div class="indicator-dot online"></div>
                    <span>Verified Patient</span>
                  </div>
                </div>
                <!-- Patient's Medical Instructions -->
                <div class="medications-section">
                  <div class="section-header">
                    <h3>
                      <i class="bi bi-capsule-pill me-2"></i>
                      Assigned Medications
                    </h3>
                    <div class="medication-summary">
                      <span class="summary-badge pending">
                        {{ selectedPatient.medical_instructions?.filter(i => i.status === 'Pending').length || 0 }} Pending
                      </span>
                      <span class="summary-badge completed">
                        {{ selectedPatient.medical_instructions?.filter(i => i.status === 'Completed').length || 0 }} Completed
                      </span>
                    </div>
                  </div>
                  
                  <div class="medications-grid">
                    <div 
                      v-for="instruction in selectedPatient.medical_instructions" 
                      :key="instruction.id"
                      class="medication-card-modern"
                      :class="{
                        'completed': instruction.status === 'Completed',
                        'pending': instruction.status === 'Pending'
                      }"
                    >
                      <div class="medication-header">
                        <div class="medication-icon">
                          <i class="bi bi-prescription2"></i>
                        </div>
                        <div class="medication-info">
                          <h4>{{ instruction.description }}</h4>
                          <p class="barcode-info">
                            <i class="bi bi-upc me-1"></i>
                            {{ instruction.barcode }}
                          </p>
                        </div>
                        <div class="status-badge" :class="instruction.status.toLowerCase()">
                          <i :class="instruction.status === 'Completed' ? 'bi bi-check-circle-fill' : 'bi bi-clock'"></i>
                          {{ instruction.status === 'Completed' ? 'Χορηγήθηκε' : 'Εκκρεμή' }}
                        </div>
                      </div>
                      
                      <div class="medication-timeline">
                        <div class="timeline-item">
                          <i class="bi bi-plus-circle"></i>
                          <span>Δημιουργήθηκε: {{ formatDateTime(instruction.created_at) }}</span>
                        </div>
                        <div v-if="instruction.status === 'Completed'" class="timeline-item completed">
                          <i class="bi bi-check-circle-fill"></i>
                          <span>Χορηγήθηκε: {{ formatDateTime(instruction.completed_at) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Advanced Barcode Scanner -->
                <div class="scanner-section">
                  <div class="scanner-header">
                    <h3>
                      <i class="bi bi-camera me-2"></i>
                      Barcode Scanner
                    </h3>
                    <div class="scanner-status" :class="{ active: !scannedBarcode, completed: scannedBarcode }">
                      <div class="status-dot"></div>
                      <span v-if="!scannedBarcode">Ready to Scan</span>
                      <span v-else>Barcode Detected</span>
                    </div>
                  </div>
                  
                  <!-- Scanner Interface -->
                  <div class="scanner-interface">
                    <div v-if="!scannedBarcode" class="scanner-active">
                      <div class="scanner-frame">
                        <BarcodeScanner @barcode-detected="handleBarcodeDetected" />
                        <div class="scan-overlay">
                          <div class="scan-line"></div>
                          <div class="corner corner-tl"></div>
                          <div class="corner corner-tr"></div>
                          <div class="corner corner-bl"></div>
                          <div class="corner corner-br"></div>
                        </div>
                      </div>
                      <p class="scanner-instruction">
                        <i class="bi bi-camera me-2"></i>
                        Position the barcode within the frame and it will scan automatically
                      </p>
                    </div>
                    
                    <!-- Scanned Result -->
                    <div v-else class="scanner-result">
                      <div class="result-card">
                        <div class="result-icon">
                          <i class="bi bi-upc-scan"></i>
                        </div>
                        <div class="result-info">
                          <h4>Barcode Detected Successfully</h4>
                          <p class="barcode-display">{{ scannedBarcode }}</p>
                        </div>
                        <button class="btn-rescan" @click="clearBarcode">
                          <i class="bi bi-arrow-clockwise"></i>
                          Scan Again
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- AI Verification Button -->
                  <div v-if="scannedBarcode" class="verification-section">
                    <button 
                      class="verification-btn" 
                      @click="verifyMedication"
                      :disabled="loading"
                      :class="{ loading: loading }"
                    >
                      <div class="btn-content">
                        <div class="btn-icon">
                          <i v-if="loading" class="bi bi-arrow-repeat spin"></i>
                          <i v-else class="bi bi-shield-check"></i>
                        </div>
                        <div class="btn-text">
                          <span class="main-text">{{ loading ? 'Analyzing...' : 'AI Safety Verification' }}</span>
                          <span class="sub-text">{{ loading ? 'Please wait' : 'Click to verify medication safety' }}</span>
                        </div>
                      </div>
                      <div class="btn-glow"></div>
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
                  <p class="mb-1">
                    <strong>Κατάσταση:</strong> 
                    <span class="badge" :class="verificationResult.instruction.status === 'Completed' ? 'bg-success' : 'bg-warning text-dark'">
                      {{ verificationResult.instruction.status === 'Completed' ? 'Χορηγήθηκε' : 'Εκκρεμή' }}
                    </span>
                  </p>
                  <!-- Show completion time if available -->
                  <p class="mb-0" v-if="verificationResult.instruction.status === 'Completed' && verificationResult.instruction.completed_at">
                    <strong>Χορηγήθηκε στις:</strong> {{ formatDateTime(verificationResult.instruction.completed_at) }}
                  </p>
                </div>

                <!-- Action Buttons -->
                <div class="mt-3 d-flex gap-2">
                  <button 
                    v-if="verificationResult.instruction.status !== 'Completed'" 
                    class="btn btn-success" 
                    @click="markAsCompleted"
                  >
                    <i class="bi bi-check-square"></i> Επιβεβαίωση Χορήγησης
                  </button>
                  
                  <button class="btn btn-outline-primary" @click="scanNextMedication">
                    <i class="bi bi-plus-circle"></i> Σκάναρε Άλλο Φάρμακο
                  </button>
                </div>
                
                <div class="mt-2" v-if="verificationResult.instruction.status === 'Completed'">
                  <div class="alert alert-info mb-0">
                    <i class="bi bi-info-circle"></i>
                    Το φάρμακο έχει ήδη χορηγηθεί. Μπορείτε να σκανάρετε άλλο φάρμακο για αυτόν τον ασθενή.
                  </div>
                </div>
              </div>

              <!-- ERROR: Wrong Medication or Safety Issue -->
              <div v-else class="alert" :class="getSeverityClass(verificationResult.severity)">
                <div class="d-flex align-items-center mb-3">
                  <i class="fs-3 me-3" :class="getAlertIcon(verificationResult.alertType)"></i>
                  <div>
                    <h5 class="mb-1">{{ verificationResult.message }}</h5>
                    <p class="mb-0 fw-bold">{{ verificationResult.details }}</p>
                  </div>
                </div>
                
                <!-- Safety Instructions based on Alert Type -->
                <div class="bg-light p-3 rounded mt-3">
                  <h6 class="text-danger">
                    <i class="bi bi-shield-exclamation"></i> Οδηγίες Ασφαλείας:
                  </h6>
                  
                  <!-- Drug Interaction Alert -->
                  <div v-if="verificationResult.alertType === 'DRUG_INTERACTION'">
                    <div class="alert alert-danger mb-2">
                      <strong>🚨 ΚΡΙΤΙΚΗ ΑΝΤΕΝΔΕΙΞΗ:</strong> Συνχορήγηση Φαρμάκων
                    </div>
                    <ul class="mb-2">
                      <li><strong>ΜΗ</strong> χορηγήσετε αυτό το φάρμακο</li>
                      <li>{{ verificationResult.recommendation }}</li>
                      <li>Επικοινωνήστε άμεσα με τον θεράποντα ιατρό</li>
                    </ul>
                  </div>
                  
                  <!-- Allergy Alert -->
                  <div v-else-if="verificationResult.alertType === 'ALLERGY'">
                    <div class="alert alert-danger mb-2">
                      <strong>🚨 ΑΛΛΕΡΓΙΑ ΑΣΘΕΝΗ:</strong> Κίνδυνος Αναφυλακτικής Αντίδρασης
                    </div>
                    <ul class="mb-2">
                      <li><strong>ΑΠΑΓΟΡΕΥΕΤΑΙ</strong> η χορήγηση - Αλλεργία ασθενή</li>
                      <li>{{ verificationResult.recommendation }}</li>
                      <li>Ενημερώστε άμεσα τον ιατρό</li>
                    </ul>
                  </div>
                  
                  <!-- Duplicate Medication Alert -->
                  <div v-else-if="verificationResult.alertType === 'DUPLICATE'">
                    <div class="alert alert-warning mb-2">
                      <strong>⚠️ ΔΙΠΛΗ ΔΟΣΗ:</strong> Ήδη Χορηγηθέν Φάρμακο
                    </div>
                    <ul class="mb-2">
                      <li>Το φάρμακο έχει ήδη χορηγηθεί σήμερα</li>
                      <li>Ελέγξτε το ιστορικό χορηγήσεων</li>
                      <li>Επιβεβαιώστε με τον ιατρό πριν συνεχίσετε</li>
                    </ul>
                  </div>
                  
                  <!-- Wrong Medication Alert -->
                  <div v-else-if="verificationResult.alertType === 'WRONG_MEDICATION'">
                    <div class="alert alert-danger mb-2">
                      <strong>🚨 ΛΑΘΟΣ ΦΑΡΜΑΚΟ:</strong> Μη Αντιστοιχία με Εντολή Ιατρού
                    </div>
                    <ul class="mb-2">
                      <li><strong>ΣΤΑΜΑΤΗΣΤΕ</strong> - Το σαρωμένο φάρμακο δεν αντιστοιχεί</li>
                      <li>{{ verificationResult.recommendation }}</li>
                      <li>Βρείτε το σωστό φάρμακο πριν συνεχίσετε</li>
                    </ul>
                  </div>
                  
                  <!-- Overdose Alert -->
                  <div v-else-if="verificationResult.alertType === 'OVERDOSE'">
                    <div class="alert alert-danger mb-2">
                      <strong>🚨 ΥΠΕΡΔΟΣΟΛΟΓΙΑ:</strong> Δόση Υπερβαίνει τα Όρια Ασφαλείας
                    </div>
                    <ul class="mb-2">
                      <li><strong>ΜΗ ΧΟΡΗΓΗΣΕΤΕ</strong> - Υπερβολική δόση</li>
                      <li>{{ verificationResult.recommendation }}</li>
                      <li>Επικοινωνήστε άμεσα με τον ιατρό για διόρθωση</li>
                    </ul>
                  </div>
                  
                  <!-- Wrong Timing Alert -->
                  <div v-else-if="verificationResult.alertType === 'WRONG_TIME'">
                    <div class="alert alert-warning mb-2">
                      <strong>⚠️ ΛΑΘΟΣ ΧΡΟΝΟΣ:</strong> Εκτός Παραθύρου Ασφαλείας
                    </div>
                    <ul class="mb-2">
                      <li>Η χορήγηση είναι εκτός του προγραμματισμένου χρόνου</li>
                      <li>{{ verificationResult.recommendation }}</li>
                      <li>Καταγράψτε την απόκλιση στο σύστημα</li>
                    </ul>
                  </div>
                  
                  <!-- Wrong Route Alert -->
                  <div v-else-if="verificationResult.alertType === 'WRONG_ROUTE'">
                    <div class="alert alert-danger mb-2">
                      <strong>🚨 ΛΑΘΟΣ ΟΔΟΣ ΧΟΡΗΓΗΣΗΣ:</strong> P.O. vs IV
                    </div>
                    <ul class="mb-2">
                      <li><strong>ΣΤΑΜΑΤΗΣΤΕ</strong> - Το σκεύασμα δεν αντιστοιχεί στην οδό</li>
                      <li>{{ verificationResult.recommendation }}</li>
                      <li>Βρείτε το σωστό σκεύασμα</li>
                    </ul>
                  </div>
                  
                  <!-- Generic Error -->
                  <div v-else>
                    <ul class="mb-0">
                      <li><strong>ΜΗ</strong> χορηγήσετε αυτό το φάρμακο</li>
                      <li>Ελέγξτε ξανά την ταυτότητα του ασθενή</li>
                      <li>Βεβαιωθείτε ότι έχετε το σωστό φάρμακο</li>
                      <li>Συμβουλευθείτε τον επιβλέποντα ιατρό</li>
                    </ul>
                  </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="mt-3 d-flex gap-2">
                  <button class="btn btn-danger" @click="contactPhysician">
                    <i class="bi bi-telephone-fill"></i> Επικοινωνία με Ιατρό
                  </button>
                  <button class="btn btn-outline-secondary" @click="scanNextMedication">
                    <i class="bi bi-arrow-clockwise"></i> Νέα Σάρωση
                  </button>
                </div>
              </div>
            </div>

                <!-- Verification Results Section -->
                <div v-if="verificationResult" class="results-section">
                  <!-- Success Result -->
                  <div v-if="verificationResult.success && verificationResult.verified" class="result-success">
                    <div class="success-header">
                      <div class="success-icon">
                        <i class="bi bi-check-circle-fill"></i>
                      </div>
                      <div class="success-content">
                        <h3>✅ MEDICATION VERIFIED</h3>
                        <p>Safe to administer - All safety checks passed</p>
                      </div>
                    </div>
                    
                    <div class="medication-details">
                      <h4>Verified Medication Details</h4>
                      <div class="detail-grid">
                        <div class="detail-item">
                          <span class="label">Description:</span>
                          <span class="value">{{ verificationResult.instruction.description }}</span>
                        </div>
                        <div class="detail-item">
                          <span class="label">Barcode:</span>
                          <span class="value">{{ verificationResult.instruction.barcode }}</span>
                        </div>
                        <div class="detail-item">
                          <span class="label">Status:</span>
                          <span class="value" :class="verificationResult.instruction.status.toLowerCase()">
                            {{ verificationResult.instruction.status === 'Completed' ? 'Already Administered' : 'Ready to Administer' }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div class="action-buttons success">
                      <button 
                        v-if="verificationResult.instruction.status !== 'Completed'" 
                        class="btn-primary-action" 
                        @click="markAsCompleted"
                      >
                        <i class="bi bi-check-square"></i>
                        Confirm Administration
                      </button>
                      
                      <button class="btn-secondary-action" @click="scanNextMedication">
                        <i class="bi bi-plus-circle"></i>
                        Scan Next Medication
                      </button>
                    </div>
                  </div>

                  <!-- Error Result -->
                  <div v-else class="result-error">
                    <div class="error-header">
                      <div class="error-icon">
                        <i class="bi bi-exclamation-triangle-fill"></i>
                      </div>
                      <div class="error-content">
                        <h3>❌ SAFETY ALERT</h3>
                        <p>{{ verificationResult.message }}</p>
                      </div>
                    </div>
                    
                    <div class="safety-protocol">
                      <h4>🚨 Safety Protocol</h4>
                      <ul class="protocol-list">
                        <li><strong>DO NOT</strong> administer this medication</li>
                        <li>Verify patient identity again</li>
                        <li>Check medication prescription</li>
                        <li>Consult supervising physician</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Error Messages -->
                <div v-if="error" class="error-section">
                  <div class="error-alert">
                    <i class="bi bi-exclamation-triangle"></i>
                    <span>{{ error }}</span>
                  </div>
                </div>

                <!-- Action Bar -->
                <div class="action-bar">
                  <button class="btn-restart" @click="startOver">
                    <i class="bi bi-arrow-clockwise"></i>
                    New Process
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
import { ref, computed, onMounted } from 'vue'
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
    
    // New variables for enhanced UI
    const patientSearch = ref('')
    const activeFilter = ref('all')
    const todayVerifications = ref(Math.floor(Math.random() * 50) + 25)
    const safetyScore = ref(99.8)
    const isScanning = ref(false)
    const scannerActive = ref(false)

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
        
        // Show modal based on verification result
        modalType.value = response.data.success ? 'success' : 'error'
        showVerificationModal.value = true
        
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
        
        // Show success message
        console.log('Medication completed successfully')
        
        // Auto-close modal after a short delay
        setTimeout(() => {
          closeModal()
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
      getMedicationSummary
    }
  }
}
</script>

<style scoped>
/* Main Container */
.medication-safety-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
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
  padding: 3rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.advanced-stepper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.step-progress-bar {
  position: absolute;
  top: 30px;
  left: 50px;
  right: 50px;
  height: 3px;
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
  flex: 1;
  max-width: 250px;
}

.step-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.step-inner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #64748b;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
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
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.step-description {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.step-info {
  font-size: 0.8rem;
  color: #2563eb;
  font-weight: 500;
  background: rgba(37, 99, 235, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  display: inline-block;
}

/* Main Content Section */
.main-content {
  padding: 3rem 0;
}

.selection-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header-modern {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
  border-bottom: 2px solid #e2e8f0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.header-text h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.header-text p {
  color: #64748b;
  margin: 0;
  font-size: 0.9rem;
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
  padding: 2rem;
}

/* Search Section */
.search-section {
  margin-bottom: 2rem;
}

.search-wrapper {
  background: #f8fafc;
  border-radius: 16px;
  padding: 1.5rem;
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

/* Patients Grid */
.patients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.patient-card-modern {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
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
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
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
  border-radius: 16px;
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
  width: 16px;
  height: 16px;
  background: #10b981;
  border: 2px solid white;
  border-radius: 50%;
  z-index: 1;
}

.patient-info {
  flex: 1;
}

.patient-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
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
  border-radius: 24px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.1);
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
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  animation: scan-pulse 2s infinite;
}

.btn-back {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* Patient Banner */
.patient-banner {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: white;
  padding: 2rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.patient-banner::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(50%, -50%);
}

.patient-avatar-large {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}

.patient-avatar-large.has-image {
  background: transparent;
  border: 3px solid rgba(255, 255, 255, 0.3);
  padding: 0;
}

.patient-avatar-large .avatar-image-large {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 17px;
  display: block;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

.patient-details-large h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.patient-meta {
  display: flex;
  gap: 1.5rem;
  opacity: 0.9;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.safety-indicator {
  margin-left: auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse-indicator 2s infinite;
}

/* Medications Section */
.medications-section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.section-header h3 {
  color: #1e293b;
  font-weight: 700;
  margin: 0;
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
</style>