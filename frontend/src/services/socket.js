import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

class SocketService {
  constructor() {
    this.socket = null
    this.userId = null
    this.listeners = new Map()
  }

  connect(userId) {
    if (this.socket?.connected) {
      console.log('Socket already connected')
      return
    }

    console.log('🔌 Connecting to Socket.IO server:', SOCKET_URL)
    this.userId = userId

    this.socket = io(SOCKET_URL, {
      transports: ['polling'], // Use polling only to avoid WebSocket CSP issues in production
      upgrade: false, // Disable upgrade to websocket
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      withCredentials: true,
      path: '/socket.io/'
    })

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id)
      
      // Authenticate with user ID
      if (this.userId) {
        this.socket.emit('authenticate', this.userId)
        console.log('👤 Authenticated as user:', this.userId)
      }
    })

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason)
    })

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error)
    })

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts')
      
      // Re-authenticate after reconnection
      if (this.userId) {
        this.socket.emit('authenticate', this.userId)
      }
    })

    // Set up event listeners for synchronization
    this.setupSyncListeners()
  }

  setupSyncListeners() {
    // Listen for patient selection from other devices
    this.socket.on('sync-patient-selected', (data) => {
      console.log('📱 Received patient selection from other device:', data)
      this.emit('patient-selected', data)
    })

    // Listen for medication scan from other devices
    this.socket.on('sync-medication-scanned', (data) => {
      console.log('📱 Received medication scan from other device:', data)
      this.emit('medication-scanned', data)
    })

    // Listen for medication completion from other devices
    this.socket.on('sync-medication-completed', (data) => {
      console.log('📱 Received medication completion from other device:', data)
      this.emit('medication-completed', data)
    })
  }

  // Emit patient selection event
  selectPatient(patientId, patientName) {
    if (!this.socket?.connected) {
      console.warn('Socket not connected')
      return
    }

    console.log('🎯 Broadcasting patient selection:', patientName)
    this.socket.emit('patient-selected', {
      userId: this.userId,
      patientId,
      patientName
    })
  }

  // Emit medication scan event
  scanMedication(patientId, barcode, medicationDescription) {
    if (!this.socket?.connected) {
      console.warn('Socket not connected')
      return
    }

    console.log('💊 Broadcasting medication scan:', barcode)
    this.socket.emit('medication-scanned', {
      userId: this.userId,
      patientId,
      barcode,
      medicationDescription
    })
  }

  // Emit medication completion event
  completeMedication(patientId, instructionId) {
    if (!this.socket?.connected) {
      console.warn('Socket not connected')
      return
    }

    console.log('✅ Broadcasting medication completion')
    this.socket.emit('medication-completed', {
      userId: this.userId,
      patientId,
      instructionId
    })
  }

  // Event listener management
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return
    
    const callbacks = this.listeners.get(event)
    const index = callbacks.indexOf(callback)
    if (index > -1) {
      callbacks.splice(index, 1)
    }
  }

  emit(event, data) {
    if (!this.listeners.has(event)) return
    
    this.listeners.get(event).forEach(callback => {
      callback(data)
    })
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting socket')
      this.socket.disconnect()
      this.socket = null
      this.userId = null
      this.listeners.clear()
    }
  }

  isConnected() {
    return this.socket?.connected || false
  }
}

// Export singleton instance
export default new SocketService()
