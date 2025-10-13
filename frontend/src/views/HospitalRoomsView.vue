<template>
  <div class="hospital-rooms-container">
    <!-- Header -->
    <div class="hospital-header">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <h1 class="hospital-title">
              <i class="bi bi-building"></i>
              Νοσοκομείο "Γεν. Αθηνών"
              <span class="floor-indicator">Όροφος 2 - Παθολογικό Τμήμα</span>
            </h1>
            <div class="hospital-stats">
              <div class="stat-item">
                <span class="stat-number">{{ occupiedRooms }}/{{ totalRooms }}</span>
                <span class="stat-label">Δωμάτια</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ totalPatients }}</span>
                <span class="stat-label">Ασθενείς</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ criticalPatients }}</span>
                <span class="stat-label">Κρίσιμοι</span>
              </div>
            </div>
          </div>
          <div class="col-lg-4 text-end">
            <div class="control-panel">
              <button class="btn btn-primary" @click="toggleView">
                <i class="bi bi-grid-3x3-gap"></i>
                {{ view3D ? '2D View' : '3D View' }}
              </button>
              <button class="btn btn-outline-primary" @click="refreshRooms">
                <i class="bi bi-arrow-clockwise"></i>
                Ανανέωση
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hospital Floor Plan -->
    <div class="hospital-floor" :class="{ 'view-3d': view3D }">
      <div class="container-fluid">
        
        <!-- Floor Legend -->
        <div class="floor-legend">
          <div class="legend-item">
            <div class="room-status-indicator occupied"></div>
            <span>Κατειλημμένο</span>
          </div>
          <div class="legend-item">
            <div class="room-status-indicator available"></div>
            <span>Διαθέσιμο</span>
          </div>
          <div class="legend-item">
            <div class="room-status-indicator critical"></div>
            <span>Κρίσιμο</span>
          </div>
          <div class="legend-item">
            <div class="room-status-indicator maintenance"></div>
            <span>Συντήρηση</span>
          </div>
        </div>

        <!-- Corridor and Rooms Layout -->
        <div class="hospital-layout">
          
          <!-- Main Corridor -->
          <div class="main-corridor">
            <div class="corridor-line"></div>
            <div class="corridor-markers">
              <div class="marker">Κεντρικός Διάδρομος</div>
              <div class="emergency-signs">
                <i class="bi bi-plus-circle-fill"></i>
                <span>ΕΞΟΔΟΣ ΚΙΝΔΥΝΟΥ</span>
                <i class="bi bi-arrow-right"></i>
              </div>
            </div>
          </div>

          <!-- Left Wing Rooms -->
          <div class="rooms-wing left-wing">
            <h3 class="wing-title">Αριστερή Πτέρυγα</h3>
            <div class="rooms-grid">
              <div 
                v-for="room in leftWingRooms" 
                :key="room.number"
                class="hospital-room"
                :class="[`room-${room.status}`, { 'room-selected': selectedRoom?.number === room.number }]"
                @click="selectRoom(room)"
              >
                <div class="room-header">
                  <div class="room-number">{{ room.number }}</div>
                  <div class="room-type">{{ room.type }}</div>
                </div>
                
                <!-- Room Interior -->
                <div class="room-interior">
                  <!-- Beds -->
                  <div class="beds-layout">
                    <div 
                      v-for="bed in room.beds" 
                      :key="bed.id"
                      class="hospital-bed"
                      :class="{ 'bed-occupied': bed.patient }"
                    >
                      <div class="bed-frame"></div>
                      
                      <!-- Patient Card -->
                      <div v-if="bed.patient" class="patient-card">
                        <div class="patient-avatar">
                          <img 
                            :src="getPatientAvatar(bed.patient)"
                            :alt="bed.patient.name"
                            class="patient-image"
                          >
                        </div>
                        <div class="patient-info">
                          <div class="patient-name">{{ bed.patient.name }}</div>
                          <div class="patient-condition" :class="`condition-${bed.patient.condition}`">
                            {{ getConditionText(bed.patient.condition) }}
                          </div>
                          <div class="patient-vitals">
                            <div class="vital">
                              <i class="bi bi-heart-pulse"></i>
                              {{ bed.patient.heartRate }}
                            </div>
                            <div class="vital">
                              <i class="bi bi-thermometer"></i>
                              {{ bed.patient.temperature }}°C
                            </div>
                            <div class="vital blood-pressure">
                              <i class="bi bi-activity"></i>
                              {{ bed.patient.bloodPressure }}
                            </div>
                          </div>
                          <div class="patient-medications">
                            <div 
                              v-for="med in bed.patient.medications" 
                              :key="med.id"
                              class="medication-pill"
                              :class="`med-${med.urgency}`"
                            >
                              {{ med.name }}
                            </div>
                          </div>
                        </div>
                        
                        <!-- Alert Indicators -->
                        <div v-if="bed.patient.alerts" class="patient-alerts">
                          <div 
                            v-for="alert in bed.patient.alerts"
                            :key="alert.id"
                            class="alert-indicator"
                            :class="`alert-${alert.severity}`"
                            :title="alert.message"
                          >
                            <i :class="getAlertIcon(alert.type)"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Room Equipment -->
                  <div class="room-equipment">
                    <div v-if="room.equipment.includes('monitor')" class="equipment-item monitor">
                      <i class="bi bi-tv"></i>
                    </div>
                    <div v-if="room.equipment.includes('oxygen')" class="equipment-item oxygen">
                      <i class="bi bi-circle"></i>
                    </div>
                    <div v-if="room.equipment.includes('iv')" class="equipment-item iv-stand">
                      <i class="bi bi-droplet"></i>
                    </div>
                  </div>
                </div>

                <!-- Room Door -->
                <div class="room-door" :class="{ 'door-open': room.doorOpen }">
                  <div class="door-handle"></div>
                  <div class="door-sign">
                    <span class="room-number-sign">{{ room.number }}</span>
                    <div class="occupancy-indicator">
                      <div class="occupancy-lights">
                        <div 
                          v-for="n in room.capacity" 
                          :key="n"
                          class="occupancy-light"
                          :class="{ 'light-occupied': n <= room.occupied }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Wing Rooms -->
          <div class="rooms-wing right-wing">
            <h3 class="wing-title">Δεξιά Πτέρυγα</h3>
            <div class="rooms-grid">
              <div 
                v-for="room in rightWingRooms" 
                :key="room.number"
                class="hospital-room"
                :class="[`room-${room.status}`, { 'room-selected': selectedRoom?.number === room.number }]"
                @click="selectRoom(room)"
              >
                <div class="room-header">
                  <div class="room-number">{{ room.number }}</div>
                  <div class="room-type">{{ room.type }}</div>
                </div>
                
                <!-- Room Interior (Same structure as left wing) -->
                <div class="room-interior">
                  <div class="beds-layout">
                    <div 
                      v-for="bed in room.beds" 
                      :key="bed.id"
                      class="hospital-bed"
                      :class="{ 'bed-occupied': bed.patient }"
                    >
                      <div class="bed-frame"></div>
                      
                      <div v-if="bed.patient" class="patient-card">
                        <div class="patient-avatar">
                          <img 
                            :src="getPatientAvatar(bed.patient)"
                            :alt="bed.patient.name"
                            class="patient-image"
                          >
                        </div>
                        <div class="patient-info">
                          <div class="patient-name">{{ bed.patient.name }}</div>
                          <div class="patient-condition" :class="`condition-${bed.patient.condition}`">
                            {{ getConditionText(bed.patient.condition) }}
                          </div>
                          <div class="patient-vitals">
                            <div class="vital">
                              <i class="bi bi-heart-pulse"></i>
                              {{ bed.patient.heartRate }}
                            </div>
                            <div class="vital">
                              <i class="bi bi-thermometer"></i>
                              {{ bed.patient.temperature }}°C
                            </div>
                            <div class="vital blood-pressure">
                              <i class="bi bi-activity"></i>
                              {{ bed.patient.bloodPressure }}
                            </div>
                          </div>
                          <div class="patient-medications">
                            <div 
                              v-for="med in bed.patient.medications" 
                              :key="med.id"
                              class="medication-pill"
                              :class="`med-${med.urgency}`"
                            >
                              {{ med.name }}
                            </div>
                          </div>
                        </div>
                        
                        <div v-if="bed.patient.alerts" class="patient-alerts">
                          <div 
                            v-for="alert in bed.patient.alerts"
                            :key="alert.id"
                            class="alert-indicator"
                            :class="`alert-${alert.severity}`"
                            :title="alert.message"
                          >
                            <i :class="getAlertIcon(alert.type)"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="room-equipment">
                    <div v-if="room.equipment.includes('monitor')" class="equipment-item monitor">
                      <i class="bi bi-tv"></i>
                    </div>
                    <div v-if="room.equipment.includes('oxygen')" class="equipment-item oxygen">
                      <i class="bi bi-circle"></i>
                    </div>
                    <div v-if="room.equipment.includes('iv')" class="equipment-item iv-stand">
                      <i class="bi bi-droplet"></i>
                    </div>
                  </div>
                </div>

                <div class="room-door" :class="{ 'door-open': room.doorOpen }">
                  <div class="door-handle"></div>
                  <div class="door-sign">
                    <span class="room-number-sign">{{ room.number }}</span>
                    <div class="occupancy-indicator">
                      <div class="occupancy-lights">
                        <div 
                          v-for="n in room.capacity" 
                          :key="n"
                          class="occupancy-light"
                          :class="{ 'light-occupied': n <= room.occupied }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Nursing Station -->
          <div class="nursing-station">
            <div class="station-header">
              <i class="bi bi-person-badge"></i>
              <h4>Σταθμός Νοσηλευτών</h4>
            </div>
            <div class="station-content">
              <div class="nurse-on-duty">
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=60&h=60&fit=crop&crop=face&auto=format&q=80" alt="Νοσηλευτής" class="nurse-avatar">
                <div class="nurse-info">
                  <div class="nurse-name">Μαρία Παπαδοπούλου</div>
                  <div class="nurse-shift">Βάρδια: 07:00 - 19:00</div>
                </div>
              </div>
              <div class="station-alerts">
                <div class="alert-summary critical">
                  <i class="bi bi-exclamation-triangle-fill"></i>
                  <span>{{ criticalAlerts }} Κρίσιμες</span>
                </div>
                <div class="alert-summary warning">
                  <i class="bi bi-exclamation-circle-fill"></i>
                  <span>{{ warningAlerts }} Προειδοποιήσεις</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Room Detail Modal -->
    <div v-if="selectedRoom" class="room-modal-overlay" @click="closeRoomModal">
      <div class="room-modal" @click.stop>
        <div class="room-modal-header">
          <h3>Δωμάτιο {{ selectedRoom.number }} - {{ selectedRoom.type }}</h3>
          <button class="btn-close" @click="closeRoomModal">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="room-modal-content">
          <div class="room-details">
            <div class="detail-row">
              <span class="label">Χωρητικότητα:</span>
              <span class="value">{{ selectedRoom.capacity }} κρεβάτια</span>
            </div>
            <div class="detail-row">
              <span class="label">Κατάληψη:</span>
              <span class="value">{{ selectedRoom.occupied }}/{{ selectedRoom.capacity }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Εξοπλισμός:</span>
              <span class="value">{{ selectedRoom.equipment.join(', ') }}</span>
            </div>
          </div>
          
          <div class="patients-in-room">
            <h4>Ασθενείς στο Δωμάτιο</h4>
            <div v-for="bed in selectedRoom.beds" :key="bed.id" class="bed-detail">
              <div class="bed-info">
                <span class="bed-number">Κρεβάτι {{ bed.id }}</span>
                <div v-if="bed.patient" class="patient-full-info">
                  <img :src="getPatientAvatar(bed.patient)" :alt="bed.patient.name" class="patient-detail-avatar">
                  <div class="patient-details">
                    <h5>{{ bed.patient.name }}</h5>
                    <p><strong>Κατάσταση:</strong> {{ getConditionText(bed.patient.condition) }}</p>
                    <p><strong>Ηλικία:</strong> {{ bed.patient.age }} ετών</p>
                    <p><strong>Διάγνωση:</strong> {{ bed.patient.diagnosis }}</p>
                    <div class="medications-detail">
                      <strong>Φάρμακα:</strong>
                      <ul>
                        <li v-for="med in bed.patient.medications" :key="med.id">
                          {{ med.name }} - {{ med.dosage }} ({{ med.urgency }})
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div v-else class="empty-bed">
                  <i class="bi bi-bed"></i>
                  <span>Κενό κρεβάτι</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Reactive data
const view3D = ref(false)
const selectedRoom = ref(null)
const rooms = ref([])

// Generate hospital data from real patients
const generateHospitalData = async () => {
  try {
    // Fetch real patients from database
    const response = await fetch('http://localhost:5000/api/patients', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch patients')
    }
    
    const data = await response.json()
    const patients = data.patients || [] 
    
    console.log('Fetched patients for hospital rooms:', patients.length)

    const conditions = ['stable', 'critical', 'recovering', 'monitoring']
    const roomTypes = ['Μονόκλινο', 'Δίκλινο', 'Τρίκλινο', 'ΜΕΘ']
    const equipment = ['monitor', 'oxygen', 'iv']

    const generatedRooms = []
    let patientIndex = 0

    // Left wing rooms (201-220)
    for (let i = 201; i <= 220; i++) {
      const capacity = Math.floor(Math.random() * 3) + 1 // 1-3 beds
      const occupied = Math.min(capacity, Math.floor(Math.random() * (capacity + 1))) // 0 to capacity, but not more than available patients
      const beds = []

      for (let bedNum = 1; bedNum <= capacity; bedNum++) {
        const hasPatient = bedNum <= occupied && patientIndex < patients.length
        let patient = null
        
        if (hasPatient) {
          const dbPatient = patients[patientIndex]
          patient = {
            id: dbPatient.id || dbPatient._id,
            name: dbPatient.name,
            age: dbPatient.age,
            amka: dbPatient.amka,
            profile_image: dbPatient.profile_image,
            condition: conditions[Math.floor(Math.random() * conditions.length)],
            diagnosis: dbPatient.medical_history || 'Γενική Παρακολούθηση',
            heartRate: Math.floor(Math.random() * 40) + 60,
            temperature: (Math.random() * 2 + 36).toFixed(1),
            bloodPressure: `${Math.floor(Math.random() * 40) + 110}/${Math.floor(Math.random() * 20) + 70}`,
            medications: [
              { id: 1, name: 'Coversyl', dosage: '5mg', urgency: 'high' },
              { id: 2, name: 'Aspirin', dosage: '100mg', urgency: 'low' }
            ],
            alerts: Math.random() > 0.7 ? [
              {
                id: Math.random(),
                type: 'medication',
                severity: 'high',
                message: 'Ώρα για φάρμακο'
              }
            ] : null
          }
          patientIndex++
        }

        beds.push({
          id: bedNum,
          patient
        })
      }

      generatedRooms.push({
        number: i,
        type: roomTypes[capacity - 1],
        capacity,
        occupied,
        status: occupied === 0 ? 'available' : occupied === capacity ? 'occupied' : 'partial',
        doorOpen: Math.random() > 0.7,
        equipment: equipment.slice(0, Math.floor(Math.random() * 3) + 1),
        beds
      })
    }

    // Right wing rooms (221-240)
    for (let i = 221; i <= 240; i++) {
      const capacity = Math.floor(Math.random() * 3) + 1
      const occupied = Math.min(capacity, Math.floor(Math.random() * (capacity + 1)))
      const beds = []

      for (let bedNum = 1; bedNum <= capacity; bedNum++) {
        const hasPatient = bedNum <= occupied && patientIndex < patients.length
        let patient = null
        
        if (hasPatient) {
          const dbPatient = patients[patientIndex]
          patient = {
            id: dbPatient.id || dbPatient._id,
            name: dbPatient.name,
            age: dbPatient.age,
            amka: dbPatient.amka,
            profile_image: dbPatient.profile_image,
            condition: conditions[Math.floor(Math.random() * conditions.length)],
            diagnosis: dbPatient.medical_history || 'Γενική Παρακολούθηση',
            heartRate: Math.floor(Math.random() * 40) + 60,
            temperature: (Math.random() * 2 + 36).toFixed(1),
            bloodPressure: `${Math.floor(Math.random() * 40) + 110}/${Math.floor(Math.random() * 20) + 70}`,
            medications: [
              { id: 1, name: 'Lipitor', dosage: '40mg', urgency: 'medium' },
              { id: 2, name: 'Paracetamol', dosage: '500mg', urgency: 'low' }
            ],
            alerts: Math.random() > 0.7 ? [
              {
                id: Math.random(),
                type: 'vitals',
                severity: 'medium',
                message: 'Ζωτικά σημεία εκτός ορίων'
              }
            ] : null
          }
          patientIndex++
        }

        beds.push({
          id: bedNum,
          patient
        })
      }

      generatedRooms.push({
        number: i,
        type: roomTypes[capacity - 1],
        capacity,
        occupied,
        status: occupied === 0 ? 'available' : occupied === capacity ? 'occupied' : 'partial',
        doorOpen: Math.random() > 0.7,
        equipment: equipment.slice(0, Math.floor(Math.random() * 3) + 1),
        beds
      })
    }

    return generatedRooms
  } catch (error) {
    console.error('Error generating hospital data:', error)
    // Fallback to empty rooms if API fails
    const fallbackRooms = []
    for (let i = 201; i <= 240; i++) {
      fallbackRooms.push({
        number: i,
        type: 'Μονόκλινο',
        capacity: 1,
        occupied: 0,
        status: 'available',
        doorOpen: false,
        equipment: ['monitor'],
        beds: [{ id: 1, patient: null }]
      })
    }
    return fallbackRooms
  }
}

// Computed properties
const leftWingRooms = computed(() => rooms.value.filter(room => room.number <= 220))
const rightWingRooms = computed(() => rooms.value.filter(room => room.number > 220))
const totalRooms = computed(() => rooms.value.length)
const occupiedRooms = computed(() => rooms.value.filter(room => room.status === 'occupied' || room.status === 'partial').length)
const totalPatients = computed(() => rooms.value.reduce((total, room) => total + room.occupied, 0))
const criticalPatients = computed(() => {
  let count = 0
  rooms.value.forEach(room => {
    room.beds.forEach(bed => {
      if (bed.patient?.condition === 'critical') count++
    })
  })
  return count
})
const criticalAlerts = computed(() => {
  let count = 0
  rooms.value.forEach(room => {
    room.beds.forEach(bed => {
      if (bed.patient?.alerts?.some(alert => alert.severity === 'high')) count++
    })
  })
  return count
})
const warningAlerts = computed(() => {
  let count = 0
  rooms.value.forEach(room => {
    room.beds.forEach(bed => {
      if (bed.patient?.alerts?.some(alert => alert.severity === 'medium')) count++
    })
  })
  return count
})

// Methods
const getPatientAvatar = (patient) => {
  const avatars = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=80&h=80&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&h=80&fit=crop&crop=face&auto=format&q=80'
  ]
  
  const hash = patient.name.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  return avatars[hash % avatars.length]
}

const getConditionText = (condition) => {
  const conditions = {
    stable: 'Σταθερός',
    critical: 'Κρίσιμος',
    recovering: 'Αναρρώνων',
    monitoring: 'Υπό Παρακολούθηση'
  }
  return conditions[condition] || condition
}

const getAlertIcon = (alertType) => {
  const icons = {
    medication: 'bi-capsule',
    vitals: 'bi-heart-pulse',
    emergency: 'bi-exclamation-triangle',
    equipment: 'bi-tools'
  }
  return icons[alertType] || 'bi-info-circle'
}

const toggleView = () => {
  view3D.value = !view3D.value
}

const refreshRooms = async () => {
  rooms.value = await generateHospitalData()
}

const selectRoom = (room) => {
  selectedRoom.value = room
}

const closeRoomModal = () => {
  selectedRoom.value = null
}

// Lifecycle
onMounted(async () => {
  rooms.value = await generateHospitalData()
})
</script>

<style scoped>
/* Hospital Container */
.hospital-rooms-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Header */
.hospital-header {
  background: linear-gradient(135deg, #1e40af 0%, #3730a3 100%);
  color: white;
  padding: 2rem 0;
  box-shadow: 0 4px 20px rgba(30, 64, 175, 0.3);
}

.hospital-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.floor-indicator {
  font-size: 1rem;
  opacity: 0.8;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 25px;
}

.hospital-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.control-panel {
  display: flex;
  gap: 1rem;
}

/* Hospital Floor */
.hospital-floor {
  padding: 2rem 0;
}

.floor-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.room-status-indicator {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.room-status-indicator.occupied { background: #ef4444; }
.room-status-indicator.available { background: #22c55e; }
.room-status-indicator.critical { background: #dc2626; }
.room-status-indicator.maintenance { background: #f59e0b; }

/* Hospital Layout */
.hospital-layout {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
}

/* Main Corridor */
.main-corridor {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 80%;
  background: linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 100%);
  border-radius: 10px;
  z-index: 1;
}

.corridor-line {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 80%;
  background: repeating-linear-gradient(
    to bottom,
    #94a3b8 0px,
    #94a3b8 20px,
    transparent 20px,
    transparent 40px
  );
}

.corridor-markers {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.marker {
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.emergency-signs {
  margin-top: 2rem;
  color: #dc2626;
  font-size: 0.7rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

/* Rooms Wings */
.rooms-wing {
  position: relative;
  z-index: 2;
}

.left-wing {
  float: left;
  width: 45%;
  padding-right: 2rem;
}

.right-wing {
  float: right;
  width: 45%;
  padding-left: 2rem;
}

.wing-title {
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

/* Hospital Room */
.hospital-room {
  position: relative;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid;
}

.room-occupied { border-color: #ef4444; }
.room-available { border-color: #22c55e; }
.room-partial { border-color: #f59e0b; }
.room-maintenance { border-color: #6b7280; }

.hospital-room:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.room-selected {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
}

.room-header {
  padding: 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-bottom: 2px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.room-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.room-type {
  font-size: 0.875rem;
  color: #6b7280;
  background: rgba(59, 130, 246, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
}

/* Room Interior */
.room-interior {
  padding: 1rem;
  min-height: 200px;
  position: relative;
  background: linear-gradient(45deg, #fafafa 25%, transparent 25%), 
              linear-gradient(-45deg, #fafafa 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #fafafa 75%), 
              linear-gradient(-45deg, transparent 75%, #fafafa 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

.beds-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

/* Hospital Bed */
.hospital-bed {
  position: relative;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 0.5rem;
  min-height: 120px;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

.bed-occupied {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-color: #f59e0b;
}

.bed-frame {
  width: 100%;
  height: 20px;
  background: linear-gradient(90deg, #6b7280 0%, #9ca3af 50%, #6b7280 100%);
  border-radius: 4px;
  margin-bottom: 0.5rem;
  position: relative;
}

.bed-frame::before,
.bed-frame::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 12px;
  background: #374151;
  border-radius: 2px;
  top: -6px;
}

.bed-frame::before { left: 5px; }
.bed-frame::after { right: 5px; }

/* Patient Card */
.patient-card {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 0.75rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.patient-avatar {
  text-align: center;
  margin-bottom: 0.5rem;
}

.patient-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #3b82f6;
}

.patient-name {
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.25rem;
  color: #1f2937;
}

.patient-condition {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  margin-bottom: 0.5rem;
}

.condition-stable { background: #dcfce7; color: #166534; }
.condition-critical { background: #fecaca; color: #dc2626; }
.condition-recovering { background: #dbeafe; color: #1d4ed8; }
.condition-monitoring { background: #fef3c7; color: #d97706; }

.patient-vitals {
  display: flex;
  justify-content: space-around;
  margin-bottom: 0.5rem;
  font-size: 0.7rem;
}

.vital {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  color: #374151;
}

.vital i {
  color: #3b82f6;
}

.patient-medications {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.medication-pill {
  font-size: 0.6rem;
  padding: 0.2rem 0.4rem;
  border-radius: 8px;
  font-weight: 500;
}

.med-critical { background: #fecaca; color: #dc2626; }
.med-high { background: #fed7aa; color: #ea580c; }
.med-medium { background: #fef3c7; color: #d97706; }
.med-low { background: #d1fae5; color: #059669; }

/* Patient Alerts */
.patient-alerts {
  position: absolute;
  top: -5px;
  right: -5px;
  display: flex;
  gap: 0.25rem;
}

.alert-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: white;
  animation: pulse-alert 2s infinite;
}

.alert-high { background: #dc2626; }
.alert-medium { background: #f59e0b; }
.alert-low { background: #3b82f6; }

@keyframes pulse-alert {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Room Equipment */
.room-equipment {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.5rem;
}

.equipment-item {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: white;
}

.monitor { background: #1f2937; }
.oxygen { background: #059669; }
.iv-stand { background: #3b82f6; }

/* Room Door */
.room-door {
  position: absolute;
  top: 50%;
  right: -20px;
  transform: translateY(-50%);
  width: 20px;
  height: 80px;
  background: linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%);
  border-radius: 0 10px 10px 0;
  transition: all 0.3s ease;
}

.door-open {
  right: -30px;
  background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
}

.door-handle {
  position: absolute;
  right: 2px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 8px;
  background: #fbbf24;
  border-radius: 2px;
}

.door-sign {
  position: absolute;
  right: 25px;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  padding: 0.5rem;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}

.room-number-sign {
  font-weight: 700;
  color: #1f2937;
  display: block;
  text-align: center;
}

.occupancy-lights {
  display: flex;
  gap: 2px;
  margin-top: 0.25rem;
  justify-content: center;
}

.occupancy-light {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #e5e7eb;
}

.light-occupied {
  background: #ef4444;
}

/* Nursing Station */
.nursing-station {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(59, 130, 246, 0.2);
  z-index: 10;
}

.station-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.station-header h4 {
  margin: 0;
  font-size: 1.1rem;
}

.nurse-on-duty {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 12px;
}

.nurse-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #3b82f6;
}

.nurse-name {
  font-weight: 600;
  color: #1f2937;
}

.nurse-shift {
  font-size: 0.875rem;
  color: #6b7280;
}

.station-alerts {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.alert-summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
}

.alert-summary.critical {
  background: #fecaca;
  color: #dc2626;
}

.alert-summary.warning {
  background: #fed7aa;
  color: #ea580c;
}

/* 3D View Effect */
.view-3d .hospital-room {
  transform-style: preserve-3d;
  transform: perspective(800px) rotateX(15deg) rotateY(-5deg);
}

.view-3d .hospital-room:hover {
  transform: perspective(800px) rotateX(10deg) rotateY(-10deg) translateZ(20px);
}

/* Room Modal */
.room-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.room-modal {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.room-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.btn-close:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.room-details {
  margin-bottom: 2rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.label {
  font-weight: 600;
  color: #374151;
}

.value {
  color: #1f2937;
}

.bed-detail {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.bed-number {
  font-weight: 600;
  color: #3b82f6;
  display: block;
  margin-bottom: 0.75rem;
}

.patient-full-info {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.patient-detail-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #3b82f6;
  flex-shrink: 0;
}

.patient-details h5 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
}

.patient-details p {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.medications-detail ul {
  margin: 0.5rem 0 0 0;
  padding-left: 1rem;
}

.medications-detail li {
  font-size: 0.875rem;
  margin: 0.25rem 0;
  color: #374151;
}

.empty-bed {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
  font-style: italic;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .rooms-grid {
    grid-template-columns: 1fr;
  }
  
  .left-wing,
  .right-wing {
    width: 48%;
  }
}

@media (max-width: 768px) {
  .left-wing,
  .right-wing {
    width: 100%;
    float: none;
    padding: 0;
    margin-bottom: 2rem;
  }
  
  .main-corridor {
    display: none;
  }
  
  .hospital-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nursing-station {
    position: relative;
    margin-top: 2rem;
    transform: none;
  }
}

/* Loading Animation */
@keyframes roomPulse {
  0%, 100% {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  }
}

.hospital-room {
  animation: roomPulse 4s ease-in-out infinite;
}
</style>