export type ChassisType = 'human' | 'hk-droid' | 'hk-cyborg' | 'vehicle';

export interface CharacterRecord {
  id: string;
  name: string;
  subtitle: string;
  category: 'Passenger' | 'Mandalorian' | 'Droid' | 'Jedi/Sith' | 'Explorer' | 'Vessel/Tech' | 'Cyborg' | 'Aerospace Vehicle';
  chassisType: ChassisType;
  image: string;
  origin: string;
  classification: string;
  bioHash: string;
  cryoCompatibility: number;
  description: string;
  awakeningSpeech: string;
  awakeningSubtext: string;
  voicePitch: number;
  voiceRate: number;
  isRobotVocoder?: boolean;
  dialogueTree: {
    question: string;
    answer: string;
  }[];
  vehicleSpec?: VehicleSpec;
  pedestalPosition: [number, number, number];
}

export type VehicleClass = 'starfighter' | 'freighter' | 'stealth-drone' | 'speeder' | 'rover';

export interface VehicleSpec {
  vehicleClass: VehicleClass;
  manufacturer: string;
  propulsion: string;
  hyperdriveRating?: string;
  primaryWeapons?: string;
  shieldRating?: string;
  crewCapacity: number;
  maxSublightSpeed: string;
  hullColor: string;
  glowColor: string;
}

export interface HudConfig {
  showTopBar: boolean;
  showBottomDock: boolean;
  showSessionBar: boolean;
  showDossierCard: boolean;
  showFloorLabels: boolean;
  showTelemetryOverlay: boolean;
  hudDensity: 'compact' | 'standard' | 'minimal';
  hudOpacity: number; // 0.6 to 1.0
  accentTheme: 'cyan' | 'amber' | 'emerald' | 'purple' | 'rose';
}


export type VaultCameraMode = 'bridge' | 'bed' | 'focus' | 'terminal' | 'overview';

export type PrintPhase = 'idle' | 'scanning' | 'synthesizing' | 'venting' | 'awakened';

export interface MedicalCheckItem {
  item: string;
  category: 'Vital' | 'Neural' | 'Cellular' | 'Toxicology' | 'Chassis';
  status: 'OPTIMAL' | 'PASSED' | 'CLEARED';
  detail: string;
}

export interface MedicalReviewData {
  patientName: string;
  medicalRecordId: string;
  cryoToleranceScore: number;
  cellularIntegrity: number;
  neuralLatencyMs: number;
  toxicologyStatus: string;
  chassisSuitability: string;
  physicianNotes: string;
  evaluatingOfficer: string;
  clinicalTimestamp: string;
  diagnosticChecklist: MedicalCheckItem[];
}

export interface ScanManifest {
  documentType: string;
  holderName: string;
  surname: string;
  givenNames: string;
  nationality: string;
  dateOfBirth: string;
  placeOfBirth: string;
  issueDate: string;
  expirationDate: string;
  idNumber?: string;
  category?: string;
  photoUrl: string;
  targetChassis?: ChassisType;
  status: 'Archived' | 'Ready For Print' | 'Reconstituted';
}

export interface HostedHologramSession {
  sessionId: string;
  sessionTitle: string;
  documentName: string;
  documentType: string;
  documentUrl: string;
  holderName: string;
  isDecoupledFromLock: boolean; // Protects user info from being used as the vault lock
  lockMechanism: 'DECOUPLED_SYNTHETIC_CIPHER' | 'ANONYMOUS_EPHEMERAL_KEY';
  redactedIdToken: string;
  timestamp: string;
  activeStatus: 'HOSTING_LIVE' | 'STANDBY' | 'TRANSMITTING';
  characterRecord: CharacterRecord;
  medicalReview: MedicalReviewData;
}

export type GameEnvironmentTheme =
  | 'parsec-vault'
  | 'kotor-ebon-hawk'
  | 'kotor2-sith'
  | 'mando-forge'
  | 'starfield-constellation'
  | 'ghostbat-hangar';

export interface ThemeEnvironmentConfig {
  id: GameEnvironmentTheme;
  name: string;
  universe: string;
  bgColor: number;
  fogColor: number;
  fogDensity: number;
  keyLightColor: number;
  hemiSkyColor: number;
  hemiGroundColor: number;
  rimColor: number;
  trenchColor: number;
  archColor: number;
  archGlowColor: number;
  floorColor: number;
  particleColor: number;
  ambientAudioSynth: 'cryo-hum' | 'czerka-servos' | 'sith-energy' | 'beskar-forge' | 'grav-singularity' | 'jet-subsonic';
  description: string;
}

export interface CompatibilityCheckResult {
  scanId: string;
  sourceTitle: string;
  mediaType: 'ROM / Game Binary' | '3D Model Asset' | 'Biometric Document' | 'Cryo-Manifest';
  isCompatible: boolean;
  failureCode?: string;
  academicDiagnosis: string;
  technicalSpecs: {
    pipeline: string;
    vertexFormat: string;
    shaderModel: string;
    cryoResonanceGhz: number;
  };
  remediationPath: string;
}

export interface HologramSaveFile {
  saveId: string;
  saveTitle: string;
  saveTimestamp: string;
  sessionElapsedSeconds: number;
  environmentTheme: GameEnvironmentTheme;
  documentTitle: string;
  subjectName: string;
  chassisType: ChassisType;
  cryoCompatibility: number;
  isDecoupledFromLock: boolean;
  lockCipherToken: string;
  academicSessionNotes: string;
  recordedTelemetry: {
    sinteringProgress: number;
    thermalKelvin: number;
    hydraulicPsi: number;
    neuralLatencyMs: number;
  };
}



