<template>
  <div style="background: green; color: white; padding: 50px; text-align: center;">
    <h1>TEST VIEW IS WORKING!</h1>
    <p>If you see this, routing works!</p>
    <p>User: {{ authStore.user?.username || 'No user' }}</p>
    <p>Is Authenticated: {{ authStore.isAuthenticated }}</p>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>