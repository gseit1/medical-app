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
      </div>
    </div>

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
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import JsBarcode from 'jsbarcode'

const sampleInstructions = [
  {
    barcode: 'MED001234567-571',
    patient: 'Γεώργιος Παπαδόπουλος',
    description: 'Χορήγηση Αντιβίωσης - Αμοξυκιλλίνη 500mg',
    status: 'Ολοκληρωμένη'
  },
  {
    barcode: 'MED001234568-589',
    patient: 'Γεώργιος Παπαδόπουλος',
    description: 'Μέτρηση Αρτηριακής Πίεσης',
    status: 'Εκρεμής'
  },
  {
    barcode: 'MED002345678-682',
    patient: 'Μαρία Ιωάννου',
    description: 'Ινσουλίνη - 10 μονάδες',
    status: 'Εκρεμής'
  },
  {
    barcode: 'MED002345679-690',
    patient: 'Μαρία Ιωάννου',
    description: 'Έλεγχος Σακχάρου',
    status: 'Ολοκληρωμένη'
  },
  {
    barcode: 'MED003456789-783',
    patient: 'Νίκος Κωνσταντίνου',
    description: 'Φυσιοθεραπεία',
    status: 'Εκρεμής'
  },
  {
    barcode: 'MED004567890-884',
    patient: 'Ελένη Δημητρίου',
    description: 'Αναπνευστική Θεραπεία',
    status: 'Εκρεμής'
  },
  {
    barcode: 'MED005678901-985',
    patient: 'Κωνσταντίνος Αντωνίου',
    description: 'Χορήγηση Παυσίπονου',
    status: 'Ολοκληρωμένη'
  }
]

const generateBarcodes = () => {
  sampleInstructions.forEach(instruction => {
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
}

const printBarcodes = () => {
  window.print()
}

onMounted(() => {
  generateBarcodes()
})
</script>

<style scoped>
.barcode-svg {
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
