import { MedicalReviewData } from '../types';

export const FELIPE_ZAMORA_MEDICAL_REVIEW: MedicalReviewData = {
  patientName: 'FELIPE ZAMORA',
  medicalRecordId: 'MED-CRYO-930424-USA',
  cryoToleranceScore: 99.8,
  cellularIntegrity: 99.4,
  neuralLatencyMs: 1.4,
  toxicologyStatus: 'STATE CLEAN PANEL / COMPLIANT',
  chassisSuitability: 'CLEARED FOR HUMAN BIOPRINT & HK-Z47 DROID CHASSIS',
  evaluatingOfficer: 'Dr. T. Vance, MD / 2-1B Parsec Medical Protocol Officer',
  clinicalTimestamp: 'OCTOBER 28, 2026 - 06:19:10 UTC',
  physicianNotes:
    'Comprehensive pre-hibernation clinical examination complete. Patient vitals, neural synaptic fidelity, and DNA cellular integrity remain in the 99th percentile. Lock decoupling confirmed: personal biometric data has been severed from vault containment latches, ensuring privacy and non-retention. Patient is medically authorized for either organic bio-reconstitution or cybernetic transfer into the Class-IV HK chassis.',
  diagnosticChecklist: [
    {
      item: 'Cranial Synaptic Cohesion',
      category: 'Neural',
      status: 'OPTIMAL',
      detail: 'EEG mapping shows 99.4% stability with zero memory packet degradation.',
    },
    {
      item: 'Cellular DNA Replication Index',
      category: 'Cellular',
      status: 'CLEARED',
      detail: 'Nanite binding compatibility at 99.8% across somatic cellular lines.',
    },
    {
      item: 'Cardiovascular & Hydraulic Baseline',
      category: 'Vital',
      status: 'OPTIMAL',
      detail: 'Resting pulse 68 bpm / Hydraulic servo pressure rating: 3500 PSI.',
    },
    {
      item: 'Nevada State Dispensary Compliance Screen',
      category: 'Toxicology',
      status: 'PASSED',
      detail: 'Full panel toxicology: Clean metabolic clearance. Non-hostile biomarkers verified.',
    },
    {
      item: 'Vault Lock Decoupling & Privacy Seal',
      category: 'Chassis',
      status: 'CLEARED',
      detail: 'Zero personal data bound to vault lock mechanisms. Ephemeral synthetic cipher active.',
    },
    {
      item: 'HK-Series Cybernetic Integration',
      category: 'Chassis',
      status: 'OPTIMAL',
      detail: 'Czerka neuro-transference bridge test passed with 1.4ms response latency.',
    },
  ],
};

export const DEFAULT_HOSTED_SESSION_TEMPLATE = {
  sessionTitle: 'Felipe Zamora - Parsec Hibernation & HK Convergence',
  documentName: 'US Passport & Nevada Employee Credential (2400010392)',
  documentType: 'Official Government Credential & Biometric Scan',
  documentUrl: '/assets/aistudio/7A4821E9-E99A-42E0-A041-580B3F7A3F5C_74d11eb2.jpeg',
  holderName: 'FELIPE ZAMORA',
  isDecoupledFromLock: true,
  lockMechanism: 'DECOUPLED_SYNTHETIC_CIPHER' as const,
  redactedIdToken: 'USA-••••••••-CA // NV-240001••••',
  timestamp: '2026-10-28 06:19:10 UTC',
  activeStatus: 'HOSTING_LIVE' as const,
};
