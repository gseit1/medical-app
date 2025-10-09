<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary" v-if="authStore.isAuthenticated">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">
          <i class="bi bi-hospital"></i> Ιατρική Εφαρμογή
        </router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item" v-if="authStore.user?.role === 'nurse'">
              <router-link class="nav-link" to="/patients">
                <i class="bi bi-people"></i> Ασθενείς
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/barcodes">
                <i class="bi bi-upc-scan"></i> Barcodes
              </router-link>
            </li>
            <li class="nav-item" v-if="authStore.user?.role === 'nurse'">
              <router-link class="nav-link" to="/medication-safety">
                <i class="bi bi-shield-check"></i> Ασφαλής Χορήγηση
              </router-link>
            </li>
            <li class="nav-item" v-if="authStore.user?.role === 'patient'">
              <router-link class="nav-link" :to="`/patients/${authStore.user.patient_id}`">
                <i class="bi bi-person"></i> Το Προφίλ μου
              </router-link>
            </li>
            <li class="nav-item">
              <span class="nav-link">
                <i class="bi bi-person-circle"></i> {{ authStore.user?.username }}
                <span class="badge bg-light text-dark ms-2">
                  {{ authStore.user?.role === 'nurse' ? 'Νοσηλευτής' : 'Ασθενής' }}
                </span>
              </span>
            </li>
            <li class="nav-item">
              <button class="btn btn-outline-light btn-sm ms-2" @click="logout">
                <i class="bi bi-box-arrow-right"></i> Αποσύνδεση
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main>
      <router-view />
    </main>

    <footer class="bg-light text-center py-3 mt-5">
      <div class="container">
        <p class="text-muted mb-0">
          © 2025 Ιατρική Εφαρμογή - Medical Application
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.navbar-brand {
  font-weight: bold;
}

.nav-link {
  transition: all 0.3s ease;
}

.nav-link:hover {
  transform: translateY(-1px);
}

.router-link-active {
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
}
</style>