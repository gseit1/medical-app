import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import PatientListView from '../views/PatientListView.vue'
import PatientDetailView from '../views/PatientDetailView.vue'
import BarcodeGeneratorView from '../views/BarcodeGeneratorView.vue'
import BarcodeVerifyView from '../views/BarcodeVerifyView.vue'
import MedicationSafetyView from '../views/MedicationSafetyView.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/patients',
    name: 'patients',
    component: PatientListView,
    meta: { requiresAuth: true, requiresNurse: true }
  },
  {
    path: '/patients/:id',
    name: 'patient-detail',
    component: PatientDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/barcodes',
    name: 'barcodes',
    component: BarcodeGeneratorView,
    meta: { requiresAuth: true }
  },
  {
    path: '/verify/:patientId/:instructionId',
    name: 'barcode-verify',
    component: BarcodeVerifyView,
    meta: { requiresAuth: false }
  },
  {
    path: '/medication-safety',
    name: 'medication-safety',
    component: MedicationSafetyView,
    meta: { requiresAuth: true, requiresNurse: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresNurse && !authStore.isNurse) {
    next('/')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    // Redirect authenticated users away from login
    if (authStore.isNurse) {
      next('/patients')
    } else {
      next(`/patients/${authStore.user.patient_id}`)
    }
  } else {
    next()
  }
})

export default router
