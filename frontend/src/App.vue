<template>
  <div id="app">
    <!-- Use the new navbar component only when authenticated -->
    <NavbarComponent v-if="authStore.isAuthenticated" />

    <!-- Main content area -->
    <main class="main-content" :class="{ 'with-navbar': authStore.isAuthenticated, 'without-navbar': !authStore.isAuthenticated }">
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
import NavbarComponent from './components/NavbarComponent.vue'

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
}

.main-content.with-navbar {
  margin-top: 0; /* Navbar is positioned relative, no need for top margin */
}

.main-content.without-navbar {
  min-height: 100vh; /* Full height when no navbar */
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