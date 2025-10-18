<template>
  <div id="app">
    <!-- Sidebar - shown when authenticated -->
    <SidebarComponent v-if="authStore.isAuthenticated" />

    <!-- Main content area -->
    <main class="main-content" :class="{ 'with-sidebar': authStore.isAuthenticated, 'without-sidebar': !authStore.isAuthenticated }">
      <div class="content-wrapper">
        <router-view />
      </div>
    </main>

    <footer class="medical-footer">
      <div class="container medical-container">
        <div class="row align-items-center">
          <div class="col-md-6">
            <p class="mb-0">
              <i class="bi bi-hospital-fill me-2"></i>
              © 2025 MedicalApp Pro - Professional Healthcare Management
            </p>
          </div>
          <div class="col-md-6 text-md-end">
            <small class="text-muted">
              <i class="bi bi-shield-fill-check me-1"></i>
              Secure • HIPAA Compliant • Professional Grade
            </small>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
import SidebarComponent from './components/SidebarComponent.vue'

const authStore = useAuthStore()
</script>

<style>
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.main-content {
  flex: 1;
  padding: 0;
  min-height: calc(100vh - 140px); /* Account for footer */
  transition: margin-left 0.3s ease;
}

/* Desktop - shift content right to accommodate sidebar */
@media (min-width: 992px) {
  .main-content.with-sidebar {
    margin-left: 280px; /* Sidebar width */
  }
}

/* Mobile - add top margin for the top bar */
@media (max-width: 991.98px) {
  .main-content.with-sidebar {
    margin-top: 60px; /* Mobile top bar height */
  }
}

.main-content.without-sidebar {
  min-height: 100vh; /* Full height when no sidebar */
}

.content-wrapper {
  width: 100%;
  min-height: 500px; /* Ensure some minimum height */
}

/* Footer Styling */
.medical-footer {
  background: var(--bg-tertiary);
  border-top: 1px solid var(--bg-accent);
  padding: 2rem 0;
  margin-top: auto;
  color: var(--text-secondary);
  transition: margin-left 0.3s ease;
}

@media (min-width: 992px) {
  .medical-footer {
    margin-left: 280px; /* Match sidebar width */
  }
}

.medical-footer .btn-outline-primary {
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
}

/* Page Transitions */
@keyframes fadeIn {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.router-view {
  animation: fadeIn 0.3s ease-out;
}
</style>