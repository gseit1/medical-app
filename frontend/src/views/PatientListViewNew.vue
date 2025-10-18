<template>
  <div class="patient-list-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="container-fluid">
        <div class="row align-items-center py-4">
          <div class="col-lg-6">
            <h1 class="page-title">
              <i class="bi bi-people-fill me-3"></i>
              Λίστα Ασθενών
            </h1>
            <p class="page-subtitle">
              Διαχείριση και παρακολούθηση όλων των ασθενών
            </p>
          </div>
          <div class="col-lg-6 text-lg-end mt-3 mt-lg-0">
            <div class="header-actions">
              <div class="view-toggle">
                <button
                  @click="viewMode = 'table'"
                  :class="['btn', viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary']"
                  title="Προβολή Πίνακα"
                >
                  <i class="bi bi-table"></i>
                </button>
                <button
                  @click="viewMode = 'cards'"
                  :class="['btn', viewMode === 'cards' ? 'btn-primary' : 'btn-outline-primary']"
                  title="Προβολή Καρτών"
                >
                  <i class="bi bi-grid-3x3-gap-fill"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <!-- Quick Stats -->
      <div class="row g-3 mb-4">
        <div class="col-xl-3 col-md-6">
          <div class="quick-stat-card stat-primary">
            <div class="stat-icon">
              <i class="bi bi-people"></i>
            </div>
            <div class="stat-content">
              <h3>{{ filteredPatients.length }}</h3>
              <p>Σύνολο Ασθενών</p>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="quick-stat-card stat-success">
            <div class="stat-icon">
              <i class="bi bi-capsule"></i>
            </div>
            <div class="stat-content">
              <h3>{{ activePatientsCount }}</h3>
              <p>Με Ενεργά Φάρμακα</p>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="quick-stat-card stat-warning">
            <div class="stat-icon">
              <i class="bi bi-clock-history"></i>
            </div>
            <div class="stat-content">
              <h3>{{ pendingMedicationsCount }}</h3>
              <p>Εκκρεμή Φάρμακα</p>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="quick-stat-card stat-info">
            <div class="stat-icon">
              <i class="bi bi-gender-ambiguous"></i>
            </div>
            <div class="stat-content">
              <h3>{{ genderDistribution }}</h3>
              <p>Άνδρες / Γυναίκες</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="filters-section mb-4">
        <div class="card">
          <div class="card-body">
            <div class="row g-3 align-items-center">
              <div class="col-lg-5">
                <div class="search-box">
                  <i class="bi bi-search search-icon"></i>
                  <input
                    v-model="searchQuery"
                    type="text"
                    class="form-control search-input"
                    placeholder="Αναζήτηση ασθενή (Όνομα, AMKA, AM, Barcode)..."
                  >
                  <button
                    v-if="searchQuery"
                    @click="clearSearch"
                    class="btn-clear"
                    type="button"
                  >
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
              <div class="col-lg-3">
                <select v-model="filterGender" class="form-select">
                  <option value="">Όλα τα Φύλα</option>
                  <option value="male">Άνδρας</option>
                  <option value="female">Γυναίκα</option>
                </select>
              </div>
              <div class="col-lg-2">
                <select v-model="filterBloodType" class="form-select">
                  <option value="">Όλες οι Ομάδες Αίματος</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div class="col-lg-2">
                <button @click="clearFilters" class="btn btn-outline-secondary w-100">
                  <i class="bi bi-arrow-clockwise me-2"></i>
                  Καθαρισμός
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Φόρτωση...</span>
        </div>
        <p class="mt-3">Φόρτωση λίστας ασθενών...</p>
      </div>

      <!-- No Patients -->
      <div v-else-if="filteredPatients.length === 0" class="no-results">
        <i class="bi bi-inbox"></i>
        <h3>Δεν βρέθηκαν ασθενείς</h3>
        <p>Δοκιμάστε να αλλάξετε τα φίλτρα αναζήτησης</p>
        <button @click="clearFilters" class="btn btn-primary">
          <i class="bi bi-arrow-clockwise me-2"></i>
          Καθαρισμός Φίλτρων
        </button>
      </div>

      <!-- Table View -->
      <div v-else-if="viewMode === 'table'" class="table-view">
        <div class="card">
          <div class="table-responsive">
            <table class="table table-hover patient-table">
              <thead>
                <tr>
                  <th @click="sortBy('full_name')" class="sortable">
                    <i class="bi bi-person-circle me-2"></i>
                    Ασθενής
                    <i :class="getSortIcon('full_name')"></i>
                  </th>
                  <th>
                    <i class="bi bi-upc-scan me-2"></i>
                    Barcode
                  </th>
                  <th @click="sortBy('amka')" class="sortable">
                    <i class="bi bi-credit-card me-2"></i>
                    AMKA
                    <i :class="getSortIcon('amka')"></i>
                  </th>
                  <th @click="sortBy('age')" class="sortable">
                    <i class="bi bi-calendar-check me-2"></i>
                    Ηλικία
                    <i :class="getSortIcon('age')"></i>
                  </th>
                  <th>
                    <i class="bi bi-droplet-fill me-2"></i>
                    Ομ. Αίματος
                  </th>
                  <th>
                    <i class="bi bi-capsule me-2"></i>
                    Φάρμακα
                  </th>
                  <th>
                    <i class="bi bi-telephone me-2"></i>
                    Τηλέφωνο
                  </th>
                  <th class="text-center">
                    <i class="bi bi-gear me-2"></i>
                    Ενέργειες
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="patient in paginatedPatients"
                  :key="patient._id"
                  @click="navigateToPatient(patient._id)"
                  class="patient-row"
                >
                  <td>
                    <div class="patient-info">
                      <div class="patient-avatar">
                        <span v-if="!patient.profile_image" style="font-size: 2rem;">{{ getGenderEmoji(patient.gender) }}</span>
                        <img
                          v-else
                          :src="patient.profile_image"
                          :alt="patient.full_name"
                        >
                      </div>
                      <div class="patient-details">
                        <strong>{{ patient.full_name }}</strong>
                        <small class="text-muted">
                          {{ getGenderEmoji(patient.gender) }}
                          {{ patient.gender === 'male' ? 'Άνδρας' : 'Γυναίκα' }}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge bg-primary">{{ patient.barcode || 'N/A' }}</span>
                  </td>
                  <td>
                    <span class="text-muted">{{ patient.amka || 'N/A' }}</span>
                  </td>
                  <td>
                    <span class="age-badge">{{ patient.age || 'N/A' }} ετών</span>
                  </td>
                  <td>
                    <span class="badge bg-danger">{{ patient.blood_type || 'N/A' }}</span>
                  </td>
                  <td>
                    <div class="medication-status">
                      <span
                        v-if="patient.medical_instructions && patient.medical_instructions.length > 0"
                        class="badge bg-success"
                      >
                        {{ patient.medical_instructions.length }} ενεργά
                      </span>
                      <span v-else class="badge bg-secondary">
                        Κανένα
                      </span>
                    </div>
                  </td>
                  <td>
                    <a :href="'tel:' + patient.phone" @click.stop class="phone-link">
                      <i class="bi bi-telephone me-1"></i>
                      {{ patient.phone || 'N/A' }}
                    </a>
                  </td>
                  <td class="text-center">
                    <div class="action-buttons">
                      <button
                        @click.stop="navigateToPatient(patient._id)"
                        class="btn btn-sm btn-primary"
                        title="Προβολή Λεπτομερειών"
                      >
                        <i class="bi bi-eye"></i>
                      </button>
                      <button
                        @click.stop="startMedication(patient._id)"
                        class="btn btn-sm btn-success"
                        title="Χορήγηση Φαρμάκων"
                      >
                        <i class="bi bi-capsule"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Card View -->
      <div v-else class="card-view">
        <div class="row g-4">
          <div
            v-for="patient in paginatedPatients"
            :key="patient._id"
            class="col-xl-3 col-lg-4 col-md-6"
          >
            <div class="patient-card" @click="navigateToPatient(patient._id)">
              <div class="card-header-custom">
                <div class="patient-avatar-large">
                  <span v-if="!patient.profile_image" style="font-size: 3.5rem; line-height: 1;">{{ getGenderEmoji(patient.gender) }}</span>
                  <img
                    v-else
                    :src="patient.profile_image"
                    :alt="patient.full_name"
                  >
                </div>
                <span
                  v-if="patient.medical_instructions && patient.medical_instructions.length > 0"
                  class="status-badge active"
                >
                  <i class="bi bi-capsule"></i>
                  {{ patient.medical_instructions.length }}
                </span>
              </div>
              <div class="card-body">
                <h5 class="patient-name">{{ patient.full_name }}</h5>
                <div class="patient-meta">
                  <div class="meta-item">
                    <i class="bi bi-upc-scan"></i>
                    <span>{{ patient.barcode || 'N/A' }}</span>
                  </div>
                  <div class="meta-item">
                    {{ getGenderEmoji(patient.gender) }}
                    <span>{{ patient.gender === 'male' ? 'Άνδρας' : 'Γυναίκα' }}</span>
                  </div>
                  <div class="meta-item">
                    <i class="bi bi-calendar-check"></i>
                    <span>{{ patient.age || 'N/A' }} ετών</span>
                  </div>
                  <div class="meta-item">
                    <i class="bi bi-droplet-fill"></i>
                    <span>{{ patient.blood_type || 'N/A' }}</span>
                  </div>
                  <div class="meta-item">
                    <i class="bi bi-credit-card"></i>
                    <span>{{ patient.amka || 'N/A' }}</span>
                  </div>
                  <div class="meta-item">
                    <i class="bi bi-telephone"></i>
                    <a :href="'tel:' + patient.phone" @click.stop class="phone-link-card">
                      {{ patient.phone || 'N/A' }}
                    </a>
                  </div>
                </div>
              </div>
              <div class="card-footer-custom">
                <button
                  @click.stop="navigateToPatient(patient._id)"
                  class="btn btn-sm btn-outline-primary flex-fill"
                >
                  <i class="bi bi-eye me-1"></i>
                  Προβολή
                </button>
                <button
                  @click.stop="startMedication(patient._id)"
                  class="btn btn-sm btn-success flex-fill"
                >
                  <i class="bi bi-capsule me-1"></i>
                  Φάρμακα
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination-section mt-4">
        <nav>
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button
                class="page-link"
                @click="currentPage = currentPage - 1"
                :disabled="currentPage === 1"
              >
                <i class="bi bi-chevron-left"></i>
                Προηγούμενο
              </button>
            </li>
            <li
              v-for="page in visiblePages"
              :key="page"
              class="page-item"
              :class="{ active: currentPage === page }"
            >
              <button class="page-link" @click="currentPage = page">
                {{ page }}
              </button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button
                class="page-link"
                @click="currentPage = currentPage + 1"
                :disabled="currentPage === totalPages"
              >
                Επόμενο
                <i class="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
        <div class="pagination-info text-center mt-2">
          <small class="text-muted">
            Εμφάνιση {{ startIndex + 1 }} - {{ endIndex }} από {{ filteredPatients.length }} ασθενείς
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

// State
const isLoading = ref(true)
const patients = ref([])
const searchQuery = ref('')
const filterGender = ref('')
const filterBloodType = ref('')
const viewMode = ref('table') // 'table' or 'cards'
const sortField = ref('full_name')
const sortDirection = ref('asc')
const currentPage = ref(1)
const itemsPerPage = ref(12)

// Computed Properties
const filteredPatients = computed(() => {
  let result = [...patients.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(patient => {
      return (
        patient.full_name?.toLowerCase().includes(query) ||
        patient.amka?.toLowerCase().includes(query) ||
        patient.afm?.toLowerCase().includes(query) ||
        patient.barcode?.toLowerCase().includes(query) ||
        patient.phone?.includes(query)
      )
    })
  }

  // Gender filter
  if (filterGender.value) {
    result = result.filter(patient => patient.gender === filterGender.value)
  }

  // Blood type filter
  if (filterBloodType.value) {
    result = result.filter(patient => patient.blood_type === filterBloodType.value)
  }

  // Sorting
  result.sort((a, b) => {
    let aVal = a[sortField.value]
    let bVal = b[sortField.value]

    // Handle null/undefined values
    if (!aVal) aVal = ''
    if (!bVal) bVal = ''

    // Convert to lowercase for string comparison
    if (typeof aVal === 'string') aVal = aVal.toLowerCase()
    if (typeof bVal === 'string') bVal = bVal.toLowerCase()

    if (sortDirection.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  return result
})

const paginatedPatients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredPatients.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredPatients.value.length / itemsPerPage.value)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredPatients.value.length))

const activePatientsCount = computed(() => {
  return patients.value.filter(p => p.medical_instructions && p.medical_instructions.length > 0).length
})

const pendingMedicationsCount = computed(() => {
  return patients.value.reduce((count, patient) => {
    if (!patient.medical_instructions) return count
    return count + patient.medical_instructions.filter(inst => inst.status === 'pending').length
  }, 0)
})

const genderDistribution = computed(() => {
  const males = patients.value.filter(p => p.gender === 'male').length
  const females = patients.value.filter(p => p.gender === 'female').length
  return `${males} / ${females}`
})

// Methods
const loadPatients = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/patients')
    patients.value = response.data || []
  } catch (error) {
    console.error('Error loading patients:', error)
    patients.value = []
  } finally {
    isLoading.value = false
  }
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const getSortIcon = (field) => {
  if (sortField.value !== field) return 'bi bi-arrow-down-up ms-1'
  return sortDirection.value === 'asc' ? 'bi bi-arrow-up ms-1' : 'bi bi-arrow-down ms-1'
}

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

const getNurseEmoji = () => {
  return '👩‍⚕️'
}

const clearSearch = () => {
  searchQuery.value = ''
}

const clearFilters = () => {
  searchQuery.value = ''
  filterGender.value = ''
  filterBloodType.value = ''
  currentPage.value = 1
}

const navigateToPatient = (patientId) => {
  router.push(`/patients/${patientId}`)
}

const startMedication = (patientId) => {
  router.push({
    name: 'medication-safety',
    query: { patientId }
  })
}

// Lifecycle
onMounted(() => {
  loadPatients()
})
</script>

<style scoped>
/* Container */
.patient-list-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-bottom: 40px;
}

/* Header */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.page-subtitle {
  margin: 8px 0 0 0;
  opacity: 0.9;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.view-toggle {
  display: flex;
  gap: 8px;
}

.view-toggle .btn {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  border-radius: 8px;
}

/* Quick Stats */
.quick-stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  border-left: 4px solid;
}

.quick-stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-primary { border-left-color: #667eea; }
.stat-success { border-left-color: #28a745; }
.stat-warning { border-left-color: #ffc107; }
.stat-info { border-left-color: #17a2b8; }

.quick-stat-card .stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: white;
}

.stat-primary .stat-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-success .stat-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.stat-warning .stat-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.stat-info .stat-icon { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }

.quick-stat-card .stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: #212529;
}

.quick-stat-card .stat-content p {
  margin: 4px 0 0 0;
  color: #6c757d;
  font-size: 0.9rem;
}

/* Filters Section */
.filters-section .card {
  border: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 15px;
  color: #6c757d;
  font-size: 1.1rem;
}

.search-input {
  padding-left: 45px;
  padding-right: 45px;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-clear {
  position: absolute;
  right: 10px;
  background: transparent;
  border: none;
  color: #6c757d;
  padding: 5px 10px;
  cursor: pointer;
}

.btn-clear:hover {
  color: #dc3545;
}

/* Loading & No Results */
.loading-container,
.no-results {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.no-results i {
  font-size: 5rem;
  color: #6c757d;
  opacity: 0.3;
  margin-bottom: 20px;
}

.no-results h3 {
  color: #212529;
  margin-bottom: 10px;
}

.no-results p {
  color: #6c757d;
  margin-bottom: 20px;
}

/* Table View */
.table-view .card {
  border: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: hidden;
}

.patient-table {
  margin: 0;
}

.patient-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.patient-table thead th {
  border: none;
  padding: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.patient-table thead th.sortable {
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}

.patient-table thead th.sortable:hover {
  background: rgba(255, 255, 255, 0.1);
}

.patient-table tbody tr {
  cursor: pointer;
  transition: background 0.2s;
}

.patient-table tbody tr:hover {
  background: #f8f9fa;
}

.patient-table tbody td {
  padding: 16px;
  vertical-align: middle;
  border-bottom: 1px solid #f0f0f0;
}

.patient-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.patient-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.patient-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.patient-avatar i {
  font-size: 2.5rem;
  color: #6c757d;
}

.patient-details {
  display: flex;
  flex-direction: column;
}

.patient-details strong {
  font-size: 1rem;
  color: #212529;
}

.patient-details small {
  font-size: 0.85rem;
  margin-top: 2px;
}

.age-badge {
  padding: 4px 12px;
  background: #f8f9fa;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #495057;
}

.phone-link {
  color: #667eea;
  text-decoration: none;
  transition: color 0.2s;
}

.phone-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

/* Card View */
.card-view {
  margin-top: 20px;
}

.patient-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.patient-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.card-header-custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px 20px;
  text-align: center;
  position: relative;
}

.patient-avatar-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto;
  overflow: hidden;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid rgba(255, 255, 255, 0.3);
}

.patient-avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.patient-avatar-large i {
  font-size: 4rem;
  color: #6c757d;
}

.status-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: white;
  color: #667eea;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-badge.active {
  background: #28a745;
  color: white;
}

.patient-card .card-body {
  padding: 20px;
  flex: 1;
}

.patient-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 16px;
  text-align: center;
}

.patient-meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: #495057;
}

.meta-item i {
  width: 20px;
  text-align: center;
  color: #667eea;
}

.phone-link-card {
  color: #667eea;
  text-decoration: none;
}

.phone-link-card:hover {
  text-decoration: underline;
}

.card-footer-custom {
  padding: 16px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 10px;
}

/* Pagination */
.pagination-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.pagination {
  margin: 0;
}

.page-link {
  color: #667eea;
  border: 1px solid #e9ecef;
  padding: 8px 16px;
}

.page-link:hover {
  background: #f8f9fa;
  color: #764ba2;
}

.page-item.active .page-link {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.page-item.disabled .page-link {
  color: #6c757d;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .header-actions {
    justify-content: center;
  }

  .quick-stat-card {
    padding: 16px;
  }

  .quick-stat-card .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }

  .quick-stat-card .stat-content h3 {
    font-size: 1.5rem;
  }

  .patient-table {
    font-size: 0.85rem;
  }

  .patient-avatar {
    width: 40px;
    height: 40px;
  }

  .patient-avatar i {
    font-size: 2rem;
  }
}

@media (max-width: 576px) {
  .table-responsive {
    font-size: 0.8rem;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
