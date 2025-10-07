<template>
  <div class="patient-list-container">
    <div class="row mb-3 mb-md-4">
      <div class="col">
        <h1 class="display-6 display-md-5">
          <i class="bi bi-people-fill text-primary"></i>
          Λίστα Ασθενών
        </h1>
        <p class="text-muted d-none d-md-block">Διαχείριση και προβολή όλων των ασθενών</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-muted">Φόρτωση ασθενών...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      <i class="bi bi-exclamation-triangle-fill"></i>
      {{ error }}
    </div>

    <!-- Patients Table -->
    <div v-else class="card">
      <div class="card-header d-flex justify-content-between align-items-center flex-wrap">
        <h5 class="mb-0 mb-sm-0">
          <i class="bi bi-table"></i> Ασθενείς ({{ patients.length }})
        </h5>
      </div>
      <div class="card-body p-0">
        <!-- Desktop Table View -->
        <div class="table-responsive d-none d-lg-block">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Ονοματεπώνυμο</th>
                <th>Α.Μ.Κ.Α</th>
                <th>Α.Φ.Μ</th>
                <th>Ομάδα Αίματος</th>
                <th>Ημερομηνία Εγγραφής</th>
                <th>Ενέργειες</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="patient in patients" :key="patient.id">
                <td>{{ patient.id }}</td>
                <td>
                  <strong>{{ patient.full_name }}</strong>
                </td>
                <td>
                  <code>{{ patient.amka }}</code>
                </td>
                <td>
                  <code>{{ patient.afm }}</code>
                </td>
                <td>
                  <span class="badge bg-danger">{{ patient.blood_type || 'N/A' }}</span>
                </td>
                <td>{{ formatDate(patient.created_at) }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-primary"
                    @click="viewPatient(patient.id)"
                  >
                    <i class="bi bi-eye"></i> Προβολή
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="d-lg-none p-3">
          <div
            v-for="patient in patients"
            :key="patient.id"
            class="card mb-3 patient-card-mobile"
            @click="viewPatient(patient.id)"
          >
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 class="mb-1">{{ patient.full_name }}</h6>
                  <span class="badge bg-danger">{{ patient.blood_type || 'N/A' }}</span>
                </div>
                <span class="badge bg-secondary">ID: {{ patient.id }}</span>
              </div>
              <div class="small text-muted">
                <div class="mb-1">
                  <i class="bi bi-credit-card"></i> ΑΜΚΑ: <code>{{ patient.amka }}</code>
                </div>
                <div class="mb-1">
                  <i class="bi bi-card-text"></i> ΑΦΜ: <code>{{ patient.afm }}</code>
                </div>
                <div>
                  <i class="bi bi-calendar"></i> {{ formatDate(patient.created_at) }}
                </div>
              </div>
              <button class="btn btn-primary btn-sm mt-2 w-100">
                <i class="bi bi-eye"></i> Προβολή Λεπτομερειών
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !error && patients.length === 0" class="text-center py-5">
      <i class="bi bi-inbox" style="font-size: 4rem; color: #ccc;"></i>
      <p class="text-muted mt-3">Δεν βρέθηκαν ασθενείς</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const patients = ref([])
const loading = ref(true)
const error = ref(null)

const fetchPatients = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await api.get('/patients')
    patients.value = response.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Σφάλμα φόρτωσης ασθενών'
    console.error('Error fetching patients:', err)
  } finally {
    loading.value = false
  }
}

const viewPatient = (patientId) => {
  router.push(`/patients/${patientId}`)
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
  fetchPatients()
})
</script>

<style scoped>
.patient-list-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 15px;
}

.table {
  font-size: 0.95rem;
}

.table tbody tr {
  cursor: pointer;
}

code {
  color: #d63384;
  background-color: #f8f9fa;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.875rem;
}

.bi-inbox {
  opacity: 0.5;
}

.patient-card-mobile {
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #dee2e6;
}

.patient-card-mobile:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.patient-card-mobile code {
  font-size: 0.75rem;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .display-6 {
    font-size: 1.75rem;
  }
  
  .card-header h5 {
    font-size: 1rem;
  }
}
</style>
