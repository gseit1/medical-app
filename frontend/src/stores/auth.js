import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const isAuthenticated = computed(() => !!token.value)
  const isNurse = computed(() => user.value?.role === 'nurse')
  const isPatient = computed(() => user.value?.role === 'patient')

  // Initialize from localStorage
  const initializeAuth = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
    }
  }

  // Login
  const login = async (username, password) => {
    loading.value = true
    error.value = null
    
    try {
      console.log('Auth store: Sending login request...')
      const response = await api.post('/auth/login', { username, password })
      
      console.log('Auth store: Login response:', response.data)
      
      token.value = response.data.token
      user.value = response.data.user
      
      // Store in localStorage
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      console.log('Auth store: Login successful, user:', user.value)
      return true
    } catch (err) {
      console.error('Auth store: Login error:', err)
      console.error('Auth store: Error response:', err.response?.data)
      error.value = err.response?.data?.message || 'Σφάλμα σύνδεσης. Παρακαλώ ελέγξτε τα στοιχεία σας.'
      return false
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // Initialize on store creation
  initializeAuth()

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isNurse,
    isPatient,
    login,
    logout,
    initializeAuth
  }
})
