<template>
  <div class="medical-sidebar-wrapper">
    <!-- Sidebar -->
    <aside class="medical-sidebar" :class="{ 'sidebar-open': sidebarOpen }">
      <!-- Sidebar Header/Brand -->
      <div class="sidebar-brand">
        <router-link to="/dashboard" class="brand-link">
          <div class="brand-icon">
            <i class="bi bi-hospital"></i>
          </div>
          <div class="brand-content">
            <span class="brand-title">Hospital</span>
            <span class="brand-subtitle">Management</span>
          </div>
        </router-link>
        
        <!-- Mobile Close Button -->
        <button 
          class="sidebar-close-btn d-lg-none"
          @click="toggleSidebar"
          aria-label="Close sidebar"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Sidebar Navigation -->
      <nav class="sidebar-nav">
        <ul class="nav-menu">
          <!-- Dashboard -->
          <li class="nav-item">
            <router-link 
              class="nav-link" 
              to="/dashboard" 
              @click="handleNavClick"
              active-class="active"
            >
              <i class="nav-icon bi bi-speedometer2"></i>
              <span class="nav-text">Κεντρικό Μενού</span>
            </router-link>
          </li>

          <!-- Medication Safety (Priority Link) -->
          <li class="nav-item" v-if="authStore.user?.role === 'nurse'">
            <router-link 
              class="nav-link priority-nav-link" 
              to="/medication-safety" 
              @click="handleNavClick"
              active-class="active"
            >
              <i class="nav-icon bi bi-shield-fill-check"></i>
              <span class="nav-text">Ασφαλής Χορήγηση</span>
              <span class="priority-badge">PRIORITY</span>
            </router-link>
          </li>

          <!-- Patients -->
          <li class="nav-item" v-if="authStore.user?.role === 'nurse'">
            <router-link 
              class="nav-link" 
              to="/patients" 
              @click="handleNavClick"
              active-class="active"
            >
              <i class="nav-icon bi bi-people-fill"></i>
              <span class="nav-text">Ασθενείς</span>
            </router-link>
          </li>

          <!-- Medical Instructions -->
          <li class="nav-item" v-if="authStore.user?.role === 'nurse'">
            <router-link 
              class="nav-link" 
              to="/medical-instructions" 
              @click="handleNavClick"
              active-class="active"
            >
              <i class="nav-icon bi bi-clipboard2-pulse"></i>
              <span class="nav-text">Ιατρικές Οδηγίες</span>
            </router-link>
          </li>

          <!-- Patient Barcodes -->
          <li class="nav-item" v-if="authStore.user?.role === 'nurse'">
            <router-link 
              class="nav-link" 
              to="/patient-barcodes" 
              @click="handleNavClick"
              active-class="active"
            >
              <i class="nav-icon bi bi-person-badge"></i>
              <span class="nav-text">Patient Barcodes</span>
            </router-link>
          </li>

          <!-- QR Generator -->
          <li class="nav-item">
            <router-link 
              class="nav-link" 
              to="/barcodes" 
              @click="handleNavClick"
              active-class="active"
            >
              <i class="nav-icon bi bi-qr-code-scan"></i>
              <span class="nav-text">Γεννήτρια QR</span>
            </router-link>
          </li>

          <!-- Patient Profile -->
          <li class="nav-item" v-if="authStore.user?.role === 'patient'">
            <router-link 
              class="nav-link" 
              :to="`/patients/${authStore.user.patient_id}`" 
              @click="handleNavClick"
              active-class="active"
            >
              <i class="nav-icon bi bi-person-fill"></i>
              <span class="nav-text">Το Προφίλ μου</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Sidebar Footer - User Menu -->
      <div class="sidebar-footer">
        <div class="user-section">
          <div class="user-avatar">
            <img 
              v-if="authStore.user?.profile_image" 
              :src="authStore.user.profile_image" 
              :alt="authStore.user.full_name || authStore.user.username"
              class="avatar-img"
            >
            <i v-else class="bi bi-person-circle"></i>
          </div>
          <div class="user-details">
            <p class="user-name">{{ authStore.user?.full_name || authStore.user?.username }}</p>
            <small class="user-role">
              {{ authStore.user?.role === 'nurse' ? 'Νοσηλευτής' : 'Ασθενής' }}
            </small>
          </div>
        </div>

        <button 
          class="btn-logout" 
          @click="logout"
          title="Αποσύνδεση"
        >
          <i class="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </aside>

    <!-- Sidebar Overlay (Mobile) -->
    <div 
      v-if="sidebarOpen" 
      class="sidebar-overlay d-lg-none"
      @click="toggleSidebar"
    ></div>

    <!-- Mobile Top Bar -->
    <div class="mobile-topbar d-lg-none">
      <button 
        class="btn-toggle-sidebar"
        @click="toggleSidebar"
        aria-label="Toggle sidebar"
      >
        <i class="bi bi-list"></i>
      </button>
      <div class="topbar-title">Hospital Management</div>
      <div class="topbar-spacer"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const handleNavClick = () => {
  // Close sidebar on mobile after navigation
  if (window.innerWidth < 992) {
    sidebarOpen.value = false
  }
}

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* Sidebar Wrapper */
.medical-sidebar-wrapper {
  position: relative;
}

/* Mobile Top Bar */
.mobile-topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
  border-bottom: 2px solid #1e3a8a;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  z-index: 1040;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-toggle-sidebar {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.topbar-title {
  flex: 1;
  text-align: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
}

.topbar-spacer {
  width: 50px; /* Match button width */
}

/* Sidebar */
.medical-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 280px;
  height: 100vh;
  background: #ffffff;
  border-right: 2px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  z-index: 1050;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

/* Mobile sidebar positioning */
@media (max-width: 991.98px) {
  .medical-sidebar {
    transform: translateX(-100%);
    top: 60px;
    height: calc(100vh - 60px);
    z-index: 1045;
  }

  .medical-sidebar.sidebar-open {
    transform: translateX(0);
  }
}

/* Sidebar Brand */
.sidebar-brand {
  padding: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: inherit;
  flex: 1;
  transition: all 0.3s ease;
}

.brand-link:hover {
  opacity: 0.8;
}

.brand-icon {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.brand-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e40af;
}

.brand-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.sidebar-close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sidebar-close-btn:hover {
  color: #1e40af;
}

/* Sidebar Navigation */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
  scroll-behavior: smooth;
}

.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: #f3f4f6;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin: 0;
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  color: #4b5563;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  font-weight: 500;
  border-left: 3px solid transparent;
  position: relative;
}

.nav-link:hover {
  background-color: #f3f4f6;
  color: #1e40af;
  border-left-color: #2563eb;
}

.nav-link.active {
  background-color: #eff6ff;
  color: #1e40af;
  border-left-color: #2563eb;
  font-weight: 600;
}

.nav-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  width: 24px;
  text-align: center;
}

.nav-text {
  flex: 1;
}

/* Priority Link */
.priority-nav-link {
  background: linear-gradient(90deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
  border-left-color: #22c55e;
}

.priority-nav-link:hover {
  background-color: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  border-left-color: #16a34a;
}

.priority-nav-link.active {
  background-color: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  border-left-color: #16a34a;
}

.priority-badge {
  display: inline-block;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 1.5rem;
  border-top: 2px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f9fafb;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  margin: 0;
}

.user-role {
  font-size: 0.8rem;
  color: #6b7280;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-logout {
  background: #fff5f5;
  color: #dc2626;
  border: 1px solid #fee2e2;
  border-radius: 6px;
  padding: 0.5rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.btn-logout:hover {
  background: #fecaca;
  border-color: #fca5a5;
  color: #991b1b;
}

/* Sidebar Overlay (Mobile) */
.sidebar-overlay {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1044;
}

/* Adjust main content for desktop sidebar */
@media (min-width: 992px) {
  :global(body) {
    --sidebar-width: 280px;
  }
}
</style>
