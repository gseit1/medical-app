<template>
  <nav class="navbar navbar-expand-lg navbar-medical-pro">
    <div class="container-fluid navbar-container">
      <!-- Brand -->
      <router-link class="navbar-brand brand-medical" to="/dashboard">
        <div class="brand-icon">
          <i class="bi bi-hospital"></i>
        </div>
        <div class="brand-text">
          <span class="brand-title">Hospital</span>
          <span class="brand-subtitle">Management System</span>
        </div>
      </router-link>

      <!-- Mobile Toggle -->
      <button
        class="navbar-toggler custom-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="toggler-line"></span>
        <span class="toggler-line"></span>
        <span class="toggler-line"></span>
      </button>

      <!-- Navigation Content -->
      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav mx-auto">
          <!-- Dashboard -->
          <li class="nav-item">
            <router-link class="nav-link nav-link-pro" to="/dashboard" @click="closeNavbar">
              <i class="bi bi-speedometer2"></i>
              <span>Κεντρικό Μενού</span>
            </router-link>
          </li>

          <!-- Medication Safety (Priority Link) -->
          <li class="nav-item" v-if="authStore.user?.role === 'nurse'">
            <router-link class="nav-link nav-link-pro priority-link" to="/medication-safety" @click="closeNavbar">
              <i class="bi bi-shield-fill-check"></i>
              <span>Ασφαλής Χορήγηση</span>
              <div class="priority-badge">PRIORITY</div>
            </router-link>
          </li>

          <!-- Patients -->
          <li class="nav-item" v-if="authStore.user?.role === 'nurse'">
            <router-link class="nav-link nav-link-pro" to="/patients" @click="closeNavbar">
              <i class="bi bi-people-fill"></i>
              <span>Ασθενείς</span>
            </router-link>
          </li>

          <!-- Medical Instructions -->
          <li class="nav-item" v-if="authStore.user?.role === 'nurse'">
            <router-link class="nav-link nav-link-pro" to="/medical-instructions" @click="closeNavbar">
              <i class="bi bi-clipboard2-pulse"></i>
              <span>Ιατρικές Οδηγίες</span>
            </router-link>
          </li>

          <!-- Patient Barcodes -->
          <li class="nav-item" v-if="authStore.user?.role === 'nurse'">
            <router-link class="nav-link nav-link-pro" to="/patient-barcodes" @click="closeNavbar">
              <i class="bi bi-person-badge"></i>
              <span>Patient Barcodes</span>
            </router-link>
          </li>

          <!-- QR Generator -->
          <li class="nav-item">
            <router-link class="nav-link nav-link-pro" to="/barcodes" @click="closeNavbar">
              <i class="bi bi-qr-code-scan"></i>
              <span>Γεννήτρια QR</span>
            </router-link>
          </li>

          <!-- Patient Profile -->
          <li class="nav-item" v-if="authStore.user?.role === 'patient'">
            <router-link class="nav-link nav-link-pro" :to="`/patients/${authStore.user.patient_id}`" @click="closeNavbar">
              <i class="bi bi-person-fill"></i>
              <span>Το Προφίλ μου</span>
            </router-link>
          </li>
        </ul>

        <!-- User Menu -->
        <div class="navbar-nav ms-auto">
          <div class="nav-item dropdown user-dropdown">
            <a
              class="nav-link dropdown-toggle user-menu"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div class="user-avatar">
                <img 
                  v-if="authStore.user?.profile_image" 
                  :src="authStore.user.profile_image" 
                  :alt="authStore.user.full_name || authStore.user.username"
                  class="profile-image"
                >
                <i v-else class="bi bi-person-circle default-avatar"></i>
              </div>
              <div class="user-info">
                <span class="user-name">{{ authStore.user?.full_name || authStore.user?.username }}</span>
                <span class="user-role">
                  {{ authStore.user?.role === 'nurse' ? 'Νοσηλευτής' : 'Ασθενής' }}
                </span>
              </div>
            </a>
            <ul class="dropdown-menu dropdown-menu-pro">
              <li class="dropdown-header">
                <i class="bi bi-person-circle me-2"></i>
                Λογαριασμός Χρήστη
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button class="dropdown-item logout-btn" @click="logout">
                  <i class="bi bi-box-arrow-right me-2"></i>
                  Αποσύνδεση
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

// Close navbar when clicking on mobile links
const closeNavbar = () => {
  const navbarCollapse = document.querySelector('#navbarContent')
  const navbarToggler = document.querySelector('.navbar-toggler')
  
  if (navbarCollapse && navbarCollapse.classList.contains('show')) {
    // Use Bootstrap's collapse functionality to close
    const bsCollapse = new window.bootstrap.Collapse(navbarCollapse, {
      toggle: false
    })
    bsCollapse.hide()
  }
}

// Setup mobile navbar auto-close on mount
onMounted(() => {
  // Add click event listeners to all nav links
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link')
  navLinks.forEach(link => {
    link.addEventListener('click', closeNavbar)
  })

  // Also close when clicking outside the navbar on mobile
  document.addEventListener('click', (event) => {
    const navbar = document.querySelector('.navbar-collapse')
    const toggler = document.querySelector('.navbar-toggler')
    
    if (navbar && navbar.classList.contains('show')) {
      // Check if click is outside navbar
      if (!navbar.contains(event.target) && !toggler.contains(event.target)) {
        closeNavbar()
      }
    }
  })
})
</script>

<style scoped>
/* Modern Professional Navbar */
.navbar-medical-pro {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 50%, #1e3a8a 100%);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(37, 99, 235, 0.2);
  position: sticky;
  top: 0;
  z-index: 1050;
  padding: 0;
  min-height: 70px;
}

.navbar-container {
  padding: 0.5rem 1.5rem;
  position: relative;
}

/* Brand Styling */
.brand-medical {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0.5rem;
  border-radius: 12px;
}

.brand-medical:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.brand-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #2563eb;
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.2);
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.brand-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
  letter-spacing: 0.5px;
}

.brand-subtitle {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Custom Mobile Toggle */
.custom-toggler {
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  position: relative;
  width: 50px;
  height: 50px;
  display: flex !important;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.toggler-line {
  width: 24px;
  height: 3px;
  background: #ffffff;
  border-radius: 3px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.custom-toggler:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.05);
}

.custom-toggler:focus {
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.4);
  outline: none;
}

.custom-toggler:active {
  transform: scale(0.95);
}

/* Animated hamburger menu */
.custom-toggler[aria-expanded="true"] .toggler-line:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.custom-toggler[aria-expanded="true"] .toggler-line:nth-child(2) {
  opacity: 0;
}

.custom-toggler[aria-expanded="true"] .toggler-line:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Navigation Links */
.nav-link-pro {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem !important;
  margin: 0 0.25rem;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.9) !important;
  font-weight: 500;
  font-size: 0.875rem;
  text-decoration: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nav-link-pro i {
  font-size: 1rem;
  min-width: 18px;
}

.nav-link-pro:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.nav-link-pro::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.nav-link-pro:hover::before {
  left: 100%;
}

/* Priority Link Special Styling */
.priority-link {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%) !important;
  border: 1px solid rgba(239, 68, 68, 0.3);
  position: relative;
}

.priority-link:hover {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%) !important;
  border-color: rgba(239, 68, 68, 0.5);
}

.priority-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #ffffff;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
  animation: pulse-priority 2s infinite;
}

@keyframes pulse-priority {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Active Link State */
.router-link-active.nav-link-pro {
  background: rgba(255, 255, 255, 0.2) !important;
  color: #ffffff !important;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* User Menu */
.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem !important;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #ffffff !important;
  text-decoration: none !important;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.user-menu:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.user-avatar i {
  font-size: 1.75rem;
  color: #ffffff;
}

/* Profile Image Styling */
.profile-image {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.profile-image:hover {
  border-color: rgba(255, 255, 255, 0.6);
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.default-avatar {
  font-size: 1.75rem;
  color: #ffffff;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
}

.user-name {
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.2;
}

.user-role {
  font-size: 0.7rem;
  font-weight: 500;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Enhanced Dropdown Menu */
.dropdown-menu-pro {
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(20px);
  border: 2px solid rgba(37, 99, 235, 0.1);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(37, 99, 235, 0.15);
  padding: 1rem;
  margin-top: 0.5rem;
  min-width: 240px;
}

.dropdown-header {
  color: #374151 !important;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.5rem 0;
  margin-bottom: 0.5rem;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  color: #374151 !important;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  margin: 0.25rem 0;
  border: 1px solid transparent;
}

.logout-btn:hover {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
  color: #ffffff !important;
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
}

/* Mobile Responsive */
@media (max-width: 991px) {
  .navbar-container {
    padding: 0.75rem 1rem;
  }

  .brand-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }

  .brand-title {
    font-size: 1.1rem;
  }

  .brand-subtitle {
    font-size: 0.75rem;
  }

  /* Enhanced mobile toggle button */
  .custom-toggler {
    display: flex !important;
    z-index: 1051;
    position: relative;
  }

  /* Mobile menu styling */
  .navbar-collapse {
    background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
    margin: 1rem -1rem -0.75rem -1rem;
    padding: 1.5rem 1rem 2rem 1rem;
    border-radius: 0 0 20px 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
  }

  .navbar-nav.mx-auto {
    margin: 0 !important;
    margin-bottom: 1.5rem !important;
  }

  /* Enhanced mobile nav links */
  .nav-link-pro {
    margin: 0.5rem 0;
    padding: 1.25rem 1rem !important;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
  }

  .nav-link-pro:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(5px);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .nav-link-pro i {
    font-size: 1.2rem;
    width: 24px;
    text-align: center;
  }

  /* Priority link enhancement for mobile */
  .priority-link {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2));
    border-color: rgba(16, 185, 129, 0.3);
  }

  .priority-link:hover {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.3));
  }

  .priority-badge {
    position: relative;
    top: 0;
    right: 0;
    margin-left: 0.5rem;
    font-size: 0.6rem;
    padding: 2px 6px;
  }

  /* User menu mobile styling */
  .user-menu {
    margin-top: 1rem;
    padding: 1rem !important;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    justify-content: center;
  }

  .user-avatar {
    width: 35px;
    height: 35px;
    font-size: 1.5rem;
  }

  .user-name {
    font-size: 0.9rem;
  }

  .user-role {
    font-size: 0.75rem;
  }

  /* Dropdown menu mobile adjustments */
  .dropdown-menu-pro {
    margin-top: 0.5rem !important;
    width: 100% !important;
    background: rgba(30, 64, 175, 0.95) !important;
    backdrop-filter: blur(10px);
  }
}

/* Extra small devices */
@media (max-width: 576px) {
  .navbar-container {
    padding: 0.5rem 0.75rem;
  }

  .brand-text {
    display: none;
  }

  .nav-link-pro span {
    font-size: 0.9rem;
  }

  .custom-toggler {
    width: 45px;
    height: 45px;
  }
}

/* Animations */
@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.navbar-collapse.show {
  animation: slideInDown 0.3s ease;
}

/* Focus States for Accessibility */
.nav-link-pro:focus,
.user-menu:focus,
.custom-toggler:focus {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}
</style>