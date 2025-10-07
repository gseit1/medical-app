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

    <main class="container-fluid py-4">
      <router-view />
    </main>

    <footer class="footer mt-auto py-3 bg-light" v-if="authStore.isAuthenticated">
      <div class="container text-center">
        <span class="text-muted">© 2025 Ιατρική Εφαρμογή - Medical Application</span>
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

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>
