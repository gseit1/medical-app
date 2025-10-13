const { MedicalInstruction, Patient } = require('../models');

// Helper function to parse medication details from description
const parseMedicationDetails = (description) => {
  // Extract medication name (everything before dosage or first comma)
  const medicationMatch = description.match(/^([^,]+)/);
  const medication = medicationMatch ? medicationMatch[1].trim() : description;
  
  // Extract dosage (numbers followed by mg, g, ml, etc.)
  const dosageMatch = description.match(/(\d+[\s]*(?:mg|g|ml|mcg|μg|units?))/i);
  const dosage = dosageMatch ? dosageMatch[1] : 'N/A';
  
  // Extract frequency (S: pattern)
  const frequencyMatch = description.match(/S:\s*([^-]+)/);
  const frequency = frequencyMatch ? frequencyMatch[1].trim() : 'N/A';
  
  return { medication, dosage, frequency };
};

// Verify barcode for a specific patient
const verifyBarcode = async (req, res) => {
  try {
    const { patientId, barcode } = req.body;

    console.log('=== BARCODE VERIFICATION ===');
    console.log('Patient ID:', patientId);
    console.log('Barcode:', barcode);

    if (!patientId || !barcode) {
      return res.status(400).json({ 
        success: false,
        verified: false,
        message: '❌ Λείπουν απαραίτητα στοιχεία' 
      });
    }

    // Check if barcode exists for this patient
    const instruction = await MedicalInstruction.findOne({
      patient_id: patientId,
      barcode: barcode
    });

    console.log('Instruction found:', instruction ? 'Yes' : 'No');

    if (!instruction) {
      // Check if barcode exists for a different patient
      const otherInstruction = await MedicalInstruction.findOne({ barcode: barcode });

      if (otherInstruction) {
        return res.json({
          success: false,
          verified: false,
          message: '❌ Το barcode ανήκει σε άλλον ασθενή!'
        });
      }

      return res.json({
        success: false,
        verified: false,
        message: '❌ Το barcode δεν βρέθηκε!'
      });
    }

    // Success - barcode matches this patient
    res.json({
      success: true,
      verified: true,
      message: '✅ Το φάρμακο είναι σωστό για αυτόν τον ασθενή!',
      instruction: {
        id: instruction._id,
        description: instruction.description,
        barcode: instruction.barcode,
        status: instruction.status,
        patient_id: instruction.patient_id
      }
    });

  } catch (error) {
    console.error('Error verifying barcode:', error);
    res.status(500).json({ 
      success: false,
      verified: false,
      message: '❌ Σφάλμα κατά την επαλήθευση' 
    });
  }
};

// Verify barcode by instruction ID (for URL-based verification)
const verifyBarcodeById = async (req, res) => {
  try {
    const { patientId, instructionId } = req.body;

    console.log('=== BARCODE VERIFICATION BY ID ===');
    console.log('Patient ID:', patientId);
    console.log('Instruction ID:', instructionId);

    if (!patientId || !instructionId) {
      return res.status(400).json({ 
        success: false,
        verified: false,
        message: '❌ Λείπουν απαραίτητα στοιχεία' 
      });
    }

    // Find the specific instruction
    const instruction = await MedicalInstruction.findOne({
      _id: instructionId,
      patient_id: patientId
    });

    console.log('Instruction found:', instruction ? 'Yes' : 'No');
    if (instruction) {
      console.log('Instruction:', {
        id: instruction._id,
        description: instruction.description,
        barcode: instruction.barcode,
        status: instruction.status,
        patient_id: instruction.patient_id
      });
    }

    if (!instruction) {
      return res.json({
        success: false,
        verified: false,
        message: '❌ Η οδηγία δεν βρέθηκε'
      });
    }

    // Check if instruction is already completed
    if (instruction.status === 'Completed') {
      return res.json({
        success: false,
        verified: false,
        alreadyCompleted: true,
        message: '❌ Η οδηγία έχει εκτελεστεί',
        instruction: {
          id: instruction._id,
          description: instruction.description,
          barcode: instruction.barcode,
          status: instruction.status,
          patient_id: instruction.patient_id
        }
      });
    }

    // Success - instruction exists and is valid
    res.json({
      success: true,
      verified: true,
      message: '✅ Το φάρμακο είναι σωστό για αυτόν τον ασθενή!',
      instruction: {
        id: instruction._id,
        description: instruction.description,
        barcode: instruction.barcode,
        status: instruction.status,
        patient_id: instruction.patient_id
      }
    });

  } catch (error) {
    console.error('Error verifying barcode by ID:', error);
    res.status(500).json({ 
      success: false,
      verified: false,
      message: '❌ Σφάλμα κατά την επαλήθευση' 
    });
  }
};

// Safety verification - Check if scanned barcode matches patient's prescribed medication
const verifySafety = async (req, res) => {
  try {
    const { patientId, barcode } = req.body;

    console.log('=== SAFETY VERIFICATION ===');
    console.log('Patient ID:', patientId);
    console.log('Barcode:', barcode);

    if (!patientId || !barcode) {
      return res.status(400).json({ 
        success: false,
        verified: false,
        safetyError: true,
        message: 'Λείπουν απαραίτητα στοιχεία για την επαλήθευση' 
      });
    }

    // Get patient information
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        verified: false,
        safetyError: true,
        message: 'Ο ασθενής δεν βρέθηκε'
      });
    }

    // Check if barcode exists for this specific patient
    const instruction = await MedicalInstruction.findOne({
      patient_id: patientId,
      barcode: barcode
    });

    console.log('Patient instructions found:', instruction ? 'Yes' : 'No');

    if (!instruction) {
      // Check if this barcode belongs to a different patient
      const otherInstruction = await MedicalInstruction.findOne({ barcode }).populate('patient_id');

      if (otherInstruction) {
        // DANGER: Medication belongs to different patient
        return res.json({
          success: false,
          verified: false,
          safetyError: true,
          safetyCheck: 'FAIL_WRONG_PATIENT',
          alertType: 'WRONG_PATIENT',
          message: `🚨 ΚΙΝΔΥΝΟΣ - Αυτό το φάρμακο ανήκει σε άλλον ασθενή: ${otherInstruction.patient_id.full_name}`,
          wrongPatient: {
            id: otherInstruction.patient_id._id,
            name: otherInstruction.patient_id.full_name,
            medication: otherInstruction.description
          }
        });
      }

      // Medication not found in system
      return res.json({
        success: false,
        verified: false,
        safetyError: true,
        safetyCheck: 'FAIL_NOT_FOUND',
        alertType: 'NOT_FOUND',
        message: '❌ ΑΓΝΩΣΤΟ ΦΑΡΜΑΚΟ - Το barcode δεν βρέθηκε στο σύστημα'
      });
    }

    // ========================
    // CLINICAL SCENARIO CHECKS
    // ========================

    const description = instruction.description.toLowerCase();
    const patientHistory = (patient.medical_history || '').toLowerCase();
    const medicationDetails = parseMedicationDetails(instruction.description);
    const alerts = [];

    // Scenario 1: Drug Interaction (Klaricid + Lipitor → Rhabdomyolysis)
    if (description.includes('klaricid') || description.includes('κλαριθρομυκίνη')) {
      // Check if patient is also taking Lipitor/Atorvastatin
      const otherMeds = await MedicalInstruction.find({ patient_id: patientId });
      const hasLipitor = otherMeds.some(med => 
        med.description.toLowerCase().includes('lipitor') || 
        med.description.toLowerCase().includes('ατορβαστατίνη')
      );
      
      if (hasLipitor) {
        return res.json({
          success: false,
          verified: false,
          safetyError: true,
          safetyCheck: 'FAIL_DRUG_INTERACTION',
          alertType: 'DRUG_INTERACTION',
          severity: 'CRITICAL',
          message: '🚨 ΑΝΤΕΝΔΕΙΞΗ ΣΥΝΧΟΡΗΓΗΣΗΣ',
          details: 'Η συνχορήγηση Klaricid (Κλαριθρομυκίνη) και Lipitor (Ατορβαστατίνη) προκαλεί ΡΑΒΔΟΜΥΟΛΥΣΗ',
          recommendation: 'Είτε διακόπτεται προσωρινά η Ατορβαστατίνη για όλη τη διάρκεια της αντιβιοτικής αγωγής, είτε αντικαθίσταται η Κλαριθρομυκίνη με άλλο αντιβιοτικό (π.χ., Αζιθρομυκίνη).',
          instruction: {
            id: instruction._id,
            description: instruction.description,
            medication_name: medicationDetails.medication,
            dosage: medicationDetails.dosage,
            frequency: medicationDetails.frequency,
            barcode: instruction.barcode,
            status: instruction.status
          }
        });
      }
    }

    // Scenario 3: Penicillin Allergy (Tazocin contains Penicillin)
    if ((description.includes('tazocin') || description.includes('πιπερακιλλίνη')) && 
        patientHistory.includes('πενικιλίνη')) {
      return res.json({
        success: false,
        verified: false,
        safetyError: true,
        safetyCheck: 'FAIL_ALLERGY',
        alertType: 'ALLERGY',
        severity: 'CRITICAL',
        message: '🚨 ΑΛΛΕΡΓΙΑ ΣΤΗΝ ΠΕΝΙΚΙΛΙΝΗ',
        details: 'Ο ασθενής έχει αλλεργία στην Πενικιλίνη. ΜΗΝ χορηγήσετε Tazocin!',
        recommendation: 'Κίνδυνος αναφυλακτικής αντίδρασης. Εναλλακτικά χορηγήστε Meropenem (Μεροπενέμη).',
        instruction: {
          id: instruction._id,
          description: instruction.description,
          medication_name: medicationDetails.medication,
          dosage: medicationDetails.dosage,
          frequency: medicationDetails.frequency,
          barcode: instruction.barcode,
          status: instruction.status
        }
      });
    }

    // Scenario 4: Duplicate Medication (Already administered today)
    if (description.includes('innohep') || description.includes('ηπαρίνη')) {
      // Check if already completed today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const administeredToday = await MedicalInstruction.findOne({
        patient_id: patientId,
        barcode: barcode,
        status: 'Completed',
        completed_at: { $gte: today }
      });
      
      if (administeredToday) {
        return res.json({
          success: false,
          verified: false,
          safetyError: true,
          safetyCheck: 'FAIL_DUPLICATE',
          alertType: 'DUPLICATE',
          severity: 'HIGH',
          message: '🚨 ΦΑΡΜΑΚΟ ΗΔΗ ΧΟΡΗΓΗΘΗΚΕ',
          details: 'Το φάρμακο έχει ήδη χορηγηθεί για σήμερα.',
          recommendation: 'Είστε σίγουρος ότι θέλετε να συνεχίσετε;',
          instruction: {
            id: instruction._id,
            description: instruction.description,
            medication_name: medicationDetails.medication,
            dosage: medicationDetails.dosage,
            frequency: medicationDetails.frequency,
            barcode: instruction.barcode,
            status: instruction.status
          }
        });
      }
    }

    // Scenario 5: Wrong Medication Scan (Actrapid for Type 1 Diabetes - simulated wrong scan)
    // This scenario simulates when a nurse scans Actrapid but it wasn't the intended medication
    if ((description.includes('actrapid') || description.includes('ινσουλίνη actrapid')) && 
        patientHistory.includes('διαβήτης τύπου 1')) {
      // Simulate wrong medication scenario (e.g., should have been Heparin but scanned Insulin)
      return res.json({
        success: false,
        verified: false,
        safetyError: true,
        safetyCheck: 'FAIL_WRONG_MEDICATION',
        alertType: 'WRONG_MEDICATION',
        severity: 'HIGH',
        message: '🚨 ΜΗ ΑΝΤΙΣΤΟΙΧΙΑ ΦΑΡΜΑΚΟΥ',
        details: 'ΠΡΟΣΟΧΗ! Το σαρωμένο φάρμακο (Actrapid) δεν αντιστοιχεί στην τρέχουσα εντολή του ιατρού.',
        recommendation: 'Επικοινωνήστε με τον θεράποντα ιατρό για επιβεβαίωση. Η εντολή αναμενόταν για άλλο φάρμακο.',
        instruction: {
          id: instruction._id,
          description: instruction.description,
          medication_name: medicationDetails.medication,
          dosage: medicationDetails.dosage,
          frequency: medicationDetails.frequency,
          barcode: instruction.barcode,
          status: instruction.status
        }
      });
    }

    // Scenario 6: Overdose Error (40mg exceeds maximum 20mg)
    if (description.includes('amlodipine') && description.includes('40mg')) {
      return res.json({
        success: false,
        verified: false,
        safetyError: true,
        safetyCheck: 'FAIL_OVERDOSE',
        alertType: 'OVERDOSE',
        severity: 'CRITICAL',
        message: '🚨 ΣΦΑΛΜΑ ΣΩΣΤΗΣ ΔΟΣΗΣ',
        details: 'ΠΡΟΣΟΧΗ! Η εντολή του ιατρού (40mg) υπερβαίνει τη μέγιστη ημερήσια δόση (20mg) ή τη μέγιστη δόση συνταγογράφησης (5mg).',
        recommendation: 'Επικοινωνήστε άμεσα με τον ιατρό πριν τη χορήγηση.',
        instruction: {
          id: instruction._id,
          description: instruction.description,
          medication_name: medicationDetails.medication,
          dosage: medicationDetails.dosage,
          frequency: medicationDetails.frequency,
          barcode: instruction.barcode,
          status: instruction.status
        }
      });
    }

    // Scenario 7: Wrong Timing (Outside ±1h safety window)
    if (description.includes('glucophage') || description.includes('μετφορμίνη')) {
      const currentHour = new Date().getHours();
      const scheduledTimes = [8, 20]; // 08:00 and 20:00
      
      const isWithinWindow = scheduledTimes.some(scheduledHour => {
        return Math.abs(currentHour - scheduledHour) <= 1;
      });
      
      if (!isWithinWindow) {
        return res.json({
          success: false,
          verified: false,
          safetyError: true,
          safetyCheck: 'FAIL_WRONG_TIME',
          alertType: 'WRONG_TIME',
          severity: 'MEDIUM',
          message: '🚨 ΣΦΑΛΜΑ ΣΩΣΤΟΥ ΧΡΟΝΟΥ',
          details: 'Η προγραμματισμένη χορήγηση είναι για τις 08:00 και 20:00. Χορηγείτε εκτός του παραθύρου ασφαλείας (±1h).',
          recommendation: 'Επικοινωνήστε με τον ιατρό για επιβεβαίωση.',
          instruction: {
            id: instruction._id,
            description: instruction.description,
            medication_name: medicationDetails.medication,
            dosage: medicationDetails.dosage,
            frequency: medicationDetails.frequency,
            barcode: instruction.barcode,
            status: instruction.status
          }
        });
      }
    }

    // Scenario 8: Wrong Route (Oral vs IV)
    if (description.includes('ciprofloxacin') && description.includes('p.o.')) {
      // This is a simplified check - in real scenario, we'd check against the actual scanned medication form
      // For demo purposes, we'll trigger this if it's between certain hours
      const shouldTriggerAlert = Math.random() > 0.5; // 50% chance for demo
      
      if (shouldTriggerAlert) {
        return res.json({
          success: false,
          verified: false,
          safetyError: true,
          safetyCheck: 'FAIL_WRONG_ROUTE',
          alertType: 'WRONG_ROUTE',
          severity: 'HIGH',
          message: '🚨 ΣΦΑΛΜΑ ΣΩΣΤΗΣ ΟΔΟΥ ΧΟΡΗΓΗΣΗΣ',
          details: 'ΑΝΤΕΝΔΕΙΞΗ ΟΔΟΥ: Η εντολή είναι για χορήγηση P.O. (από το στόμα). Το σαρωμένο σκεύασμα προορίζεται για IV (ενδοφλέβια) χορήγηση.',
          recommendation: 'Ελέγξτε την εντολή και το σκεύασμα.',
          instruction: {
            id: instruction._id,
            description: instruction.description,
            medication_name: medicationDetails.medication,
            dosage: medicationDetails.dosage,
            frequency: medicationDetails.frequency,
            barcode: instruction.barcode,
            status: instruction.status
          }
        });
      }
    }

    // SUCCESS: All safety checks passed
    return res.json({
      success: true,
      verified: true,
      safetyCheck: 'PASS',
      alertType: 'SAFE',
      message: '✅ ΣΩΣΤΟ ΦΑΡΜΑΚΟ - Ασφαλής για χορήγηση',
      details: 'Όλοι οι έλεγχοι ασφαλείας πέρασαν επιτυχώς.',
      instruction: {
        id: instruction._id,
        description: instruction.description,
        medication_name: medicationDetails.medication,
        dosage: medicationDetails.dosage,
        frequency: medicationDetails.frequency,
        barcode: instruction.barcode,
        status: instruction.status,
        completed_at: instruction.completed_at,
        patient_id: instruction.patient_id
      },
      patient: {
        id: patient._id,
        name: patient.full_name,
        amka: patient.amka
      }
    });

  } catch (error) {
    console.error('Error in safety verification:', error);
    res.status(500).json({ 
      success: false,
      verified: false,
      safetyError: true,
      message: '⚠️ ΣΦΑΛΜΑ ΣΥΣΤΗΜΑΤΟΣ - Επικοινωνήστε με την τεχνική υποστήριξη'
    });
  }
};

// Mark instruction as completed
const completeInstruction = async (req, res) => {
  try {
    const instructionId = req.params.id;

    // First check if instruction exists and is not already completed
    const instruction = await MedicalInstruction.findById(instructionId);

    if (!instruction) {
      return res.status(404).json({ message: 'Instruction not found' });
    }

    if (instruction.status === 'Completed') {
      return res.status(400).json({ 
        message: 'Η οδηγία έχει ήδη εκτελεστεί',
        alreadyCompleted: true
      });
    }

    // Update instruction status
    const updatedInstruction = await MedicalInstruction.findByIdAndUpdate(
      instructionId,
      { 
        status: 'Completed',
        completed_at: new Date()
      },
      { new: true }
    );

    if (!updatedInstruction) {
      return res.status(400).json({ 
        message: 'Η οδηγία δεν μπορεί να ολοκληρωθεί',
        alreadyCompleted: true
      });
    }

    res.json({
      message: 'Η οδηγία σημειώθηκε ως ολοκληρωμένη',
      instructionId: instructionId,
      success: true
    });

  } catch (error) {
    console.error('Error completing instruction:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Instruction not found' });
    }
    res.status(500).json({ message: 'Server error completing instruction' });
  }
};

// Get all instructions for a patient
const getInstructionsByPatient = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    const instructions = await MedicalInstruction.find({ patient_id: patientId })
      .sort({ createdAt: -1 });

    const formattedInstructions = instructions.map(inst => ({
      id: inst._id,
      description: inst.description,
      barcode: inst.barcode,
      status: inst.status,
      created_at: inst.createdAt,
      completed_at: inst.completed_at
    }));

    res.json(formattedInstructions);
  } catch (error) {
    console.error('Error fetching instructions:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid patient ID' });
    }
    res.status(500).json({ message: 'Server error fetching instructions' });
  }
};

// Create new instruction
const createInstruction = async (req, res) => {
  try {
    const { patient_id, description, barcode } = req.body;

    if (!patient_id || !description || !barcode) {
      return res.status(400).json({ message: 'Patient ID, description, and barcode are required' });
    }

    const newInstruction = new MedicalInstruction({
      patient_id,
      description,
      barcode
    });

    const savedInstruction = await newInstruction.save();

    res.status(201).json({
      message: 'Medical instruction created successfully',
      instructionId: savedInstruction._id
    });

  } catch (error) {
    console.error('Error creating instruction:', error);
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ message: 'Barcode already exists' });
    }
    res.status(500).json({ message: 'Server error creating instruction' });
  }
};

// Check if medication is already completed for a patient
const checkMedicationCompleted = async (req, res) => {
  try {
    const { barcode, patientId } = req.body;

    console.log('=== CHECKING MEDICATION COMPLETION ===');
    console.log('Patient ID:', patientId);
    console.log('Barcode:', barcode);

    if (!patientId || !barcode) {
      return res.status(400).json({ 
        completed: false,
        message: '❌ Λείπουν απαραίτητα στοιχεία' 
      });
    }

    // Find the instruction for this patient and barcode
    const instruction = await MedicalInstruction.findOne({
      patient_id: patientId,
      barcode: barcode
    });

    if (!instruction) {
      // Barcode not found for this patient
      return res.json({
        completed: false,
        message: 'Barcode not found for this patient'
      });
    }

    // Check if already completed
    const isCompleted = instruction.status === 'Completed';
    
    console.log('Medication completed:', isCompleted);
    console.log('Current status:', instruction.status);

    res.json({
      completed: isCompleted,
      instruction: {
        id: instruction._id,
        medication_name: instruction.medication_name,
        dosage: instruction.dosage,
        frequency: instruction.frequency,
        status: instruction.status,
        completed_at: instruction.completed_at,
        description: instruction.description
      }
    });

  } catch (error) {
    console.error('Error checking medication completion:', error);
    res.status(500).json({ 
      completed: false,
      message: 'Server error checking medication completion' 
    });
  }
};

// Reset all medication instructions to Pending status (for testing)
const resetAllMedicationsStatus = async (req, res) => {
  try {
    console.log('=== RESETTING ALL MEDICATIONS TO PENDING ===');
    
    // Reset all instructions to Pending status and clear completed_at
    const result = await MedicalInstruction.updateMany(
      {}, // Empty filter = update all documents
      { 
        $set: { 
          status: 'Pending',
          completed_at: null 
        } 
      }
    );

    console.log(`Reset ${result.modifiedCount} medication instructions to Pending status`);

    res.json({
      success: true,
      message: `✅ Successfully reset ${result.modifiedCount} medications to Pending status`,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });

  } catch (error) {
    console.error('Error resetting medication statuses:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error resetting medication statuses' 
    });
  }
};

module.exports = {
  verifyBarcode,
  verifyBarcodeById,
  verifySafety,
  completeInstruction,
  getInstructionsByPatient,
  createInstruction,
  checkMedicationCompleted,
  resetAllMedicationsStatus
};