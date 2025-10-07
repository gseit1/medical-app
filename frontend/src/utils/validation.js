// Validation utilities for Greek AMKA and AFM

/**
 * Validate Greek AMKA (Αριθμός Μητρώου Κοινωνικής Ασφάλισης)
 * AMKA should be exactly 11 digits
 * Format: DDMMYYXXXX where:
 * - DD: Day of birth (01-31)
 * - MM: Month of birth (01-12)
 * - YY: Year of birth (00-99)
 * - XXXXX: Sequential number
 */
export const validateAMKA = (amka) => {
  // Remove any spaces or dashes
  const cleanAMKA = String(amka).replace(/[\s-]/g, '')
  
  // Check if it's exactly 11 digits
  if (!/^\d{11}$/.test(cleanAMKA)) {
    return {
      valid: false,
      message: 'Το Α.Μ.Κ.Α πρέπει να αποτελείται από 11 ψηφία'
    }
  }
  
  // Extract date parts
  const day = parseInt(cleanAMKA.substring(0, 2))
  const month = parseInt(cleanAMKA.substring(2, 4))
  const year = parseInt(cleanAMKA.substring(4, 6))
  
  // Basic validation of date components
  if (day < 1 || day > 31) {
    return {
      valid: false,
      message: 'Μη έγκυρη ημέρα γέννησης στο Α.Μ.Κ.Α'
    }
  }
  
  if (month < 1 || month > 12) {
    return {
      valid: false,
      message: 'Μη έγκυρος μήνας γέννησης στο Α.Μ.Κ.Α'
    }
  }
  
  // Calculate check digit (Luhn algorithm variation)
  const checkDigit = calculateAMKACheckDigit(cleanAMKA.substring(0, 10))
  const lastDigit = parseInt(cleanAMKA.charAt(10))
  
  if (checkDigit !== lastDigit) {
    return {
      valid: false,
      message: 'Μη έγκυρο Α.Μ.Κ.Α (λάθος ψηφίο ελέγχου)'
    }
  }
  
  return {
    valid: true,
    message: 'Έγκυρο Α.Μ.Κ.Α'
  }
}

/**
 * Calculate AMKA check digit
 */
const calculateAMKACheckDigit = (amkaWithoutCheck) => {
  let sum = 0
  for (let i = 0; i < amkaWithoutCheck.length; i++) {
    const digit = parseInt(amkaWithoutCheck.charAt(i))
    const multiplier = (i % 2 === 0) ? 1 : 2
    const product = digit * multiplier
    sum += (product > 9) ? (product - 9) : product
  }
  return (10 - (sum % 10)) % 10
}

/**
 * Validate Greek AFM (Αριθμός Φορολογικού Μητρώου)
 * AFM should be exactly 9 digits
 * The last digit is a check digit calculated from the first 8
 */
export const validateAFM = (afm) => {
  // Remove any spaces or dashes
  const cleanAFM = String(afm).replace(/[\s-]/g, '')
  
  // Check if it's exactly 9 digits
  if (!/^\d{9}$/.test(cleanAFM)) {
    return {
      valid: false,
      message: 'Το Α.Φ.Μ πρέπει να αποτελείται από 9 ψηφία'
    }
  }
  
  // Calculate check digit
  const checkDigit = calculateAFMCheckDigit(cleanAFM.substring(0, 8))
  const lastDigit = parseInt(cleanAFM.charAt(8))
  
  if (checkDigit !== lastDigit) {
    return {
      valid: false,
      message: 'Μη έγκυρο Α.Φ.Μ (λάθος ψηφίο ελέγχου)'
    }
  }
  
  return {
    valid: true,
    message: 'Έγκυρο Α.Φ.Μ'
  }
}

/**
 * Calculate AFM check digit
 * Algorithm: Each digit is multiplied by 2^(8-position), sum is taken modulo 11, and result is check digit
 */
const calculateAFMCheckDigit = (afmWithoutCheck) => {
  let sum = 0
  for (let i = 0; i < 8; i++) {
    const digit = parseInt(afmWithoutCheck.charAt(i))
    const power = Math.pow(2, 8 - i)
    sum += digit * power
  }
  const remainder = sum % 11
  return remainder % 10
}

/**
 * Format AMKA for display (adds spaces for readability)
 */
export const formatAMKA = (amka) => {
  const clean = String(amka).replace(/[\s-]/g, '')
  if (clean.length === 11) {
    return `${clean.substring(0, 6)} ${clean.substring(6)}`
  }
  return amka
}

/**
 * Format AFM for display
 */
export const formatAFM = (afm) => {
  const clean = String(afm).replace(/[\s-]/g, '')
  if (clean.length === 9) {
    return `${clean.substring(0, 3)} ${clean.substring(3, 6)} ${clean.substring(6)}`
  }
  return afm
}
