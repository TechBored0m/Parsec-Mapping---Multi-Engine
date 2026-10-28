/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { VaultCanvas } from './components/VaultCanvas';
import { TopBar } from './components/TopBar';
import { BottomDock } from './components/BottomDock';
import { HologramDetailCard } from './components/HologramDetailCard';
import { DocumentScannerExchangeModal } from './components/DocumentScannerExchangeModal';
import { EnvironmentSeedModal } from './components/EnvironmentSeedModal';
import { SessionRecorderBar } from './components/SessionRecorderBar';
import { BioPrintOverlay } from './components/BioPrintOverlay';
import { AwakenedDialogueModal } from './components/AwakenedDialogueModal';
import { VaultArchivesModal } from './components/VaultArchivesModal';
import { HudConfigModal, DEFAULT_HUD_CONFIG } from './components/HudConfigModal';
import { VehicleHangarModal } from './components/VehicleHangarModal';
import { CHARACTERS_DATA, PASSPORT_MANIFEST } from './data/characters';
import { FELIPE_ZAMORA_MEDICAL_REVIEW } from './data/medicalRecords';
import {
  CharacterRecord,
  PrintPhase,
  ScanManifest,
  VaultCameraMode,
  HostedHologramSession,
  GameEnvironmentTheme,
  HologramSaveFile,
  HudConfig,
} from './types';
import { soundEffects } from './services/soundEffects';

const INITIAL_HOSTED_SESSIONS: HostedHologramSession[] = [
  {
    sessionId: 'HOLO-SESSION-HK-Z47',
    sessionTitle: 'Felipe Zamora - HK Droid Transference',
    documentName: 'State of Nevada Cannabis Employee Card (2400010392)',
    documentType: 'Official State Credential & Neural Mapping',
    documentUrl: '/assets/aistudio/7A4821E9-E99A-42E0-A041-580B3F7A3F5C_74d11eb2.jpeg',
    holderName: 'FELIPE ZAMORA',
    isDecoupledFromLock: true,
    lockMechanism: 'DECOUPLED_SYNTHETIC_CIPHER',
    redactedIdToken: 'NV-240001•••• // SYNTH-CIPHER-01',
    timestamp: '2026-10-28 06:19:10 UTC',
    activeStatus: 'HOSTING_LIVE',
    characterRecord: CHARACTERS_DATA.find((c) => c.id === 'hk-felipe') || CHARACTERS_DATA[0],
    medicalReview: FELIPE_ZAMORA_MEDICAL_REVIEW,
  },
  {
    sessionId: 'HOLO-SESSION-PASSPORT',
    sessionTitle: 'Felipe Zamora - Biological Human Archive',
    documentName: 'United States Official Passport (California)',
    documentType: 'Federal Biometric Travel Document',
    documentUrl: '/assets/aistudio/7A4821E9-E99A-42E0-A041-580B3F7A3F5C_74d11eb2.jpeg',
    holderName: 'FELIPE ZAMORA',
    isDecoupledFromLock: true,
    lockMechanism: 'DECOUPLED_SYNTHETIC_CIPHER',
    redactedIdToken: 'USA-••••••••-CA // SYNTH-CIPHER-02',
    timestamp: '2026-10-28 06:19:10 UTC',
    activeStatus: 'STANDBY',
    characterRecord: CHARACTERS_DATA.find((c) => c.id === 'felipe-zamora') || CHARACTERS_DATA[0],
    medicalReview: FELIPE_ZAMORA_MEDICAL_REVIEW,
  },
];

const INITIAL_SAVE_FILES: HologramSaveFile[] = [
  {
    saveId: 'SAVE-HK47-CZERKA',
    saveTitle: 'Felipe Zamora HK-Z47 Transference Snapshot',
    saveTimestamp: '2026-10-28 06:19:10 UTC',
    sessionElapsedSeconds: 312,
    environmentTheme: 'kotor-ebon-hawk',
    documentTitle: 'State of Nevada Cannabis Employee Card (2400010392)',
    subjectName: 'HK-Felipe (HK-Z47)',
    chassisType: 'hk-cyborg',
    cryoCompatibility: 99.8,
    isDecoupledFromLock: true,
    lockCipherToken: 'SYNTH-CIPHER-CZERKA-01',
    academicSessionNotes: 'Session-scoped neural mapping: 400 GHz logic core verified. Lock decoupled: zero identity keys bound to vault latch.',
    recordedTelemetry: {
      sinteringProgress: 100,
      thermalKelvin: 310.2,
      hydraulicPsi: 3500,
      neuralLatencyMs: 1.4,
    },
  },
  {
    saveId: 'SAVE-MANDO-NEVARRO',
    saveTitle: 'Mandalorian Beskar Foundry Baseline',
    saveTimestamp: '2026-10-28 06:05:00 UTC',
    sessionElapsedSeconds: 185,
    environmentTheme: 'mando-forge',
    documentTitle: 'The Mandalorian Beskar Photogrammetric Scan',
    subjectName: 'Din Djarin & Bo-Katan',
    chassisType: 'human',
    cryoCompatibility: 99.4,
    isDecoupledFromLock: true,
    lockCipherToken: 'SYNTH-CIPHER-BESKAR-99',
    academicSessionNotes: 'Volumetric photogrammetric mesh with non-manifold free edges. ACES Filmic lighting balanced.',
    recordedTelemetry: {
      sinteringProgress: 85,
      thermalKelvin: 312.4,
      hydraulicPsi: 0,
      neuralLatencyMs: 2.1,
    },
  },
];

export default function App() {
  const [characters, setCharacters] = useState<CharacterRecord[]>(CHARACTERS_DATA);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterRecord>(CHARACTERS_DATA[0]);
  const [hudConfig, setHudConfig] = useState<HudConfig>(DEFAULT_HUD_CONFIG);
  const [isHudModalOpen, setIsHudModalOpen] = useState<boolean>(false);
  const [isHangarModalOpen, setIsHangarModalOpen] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<VaultCameraMode>('bridge');
  const [printPhase, setPrintPhase] = useState<PrintPhase>('idle');
  const [printProgress, setPrintProgress] = useState<number>(0);
  const [isCanopyOpen, setIsCanopyOpen] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isArchivesOpen, setIsArchivesOpen] = useState<boolean>(false);
  const [isSeedModalOpen, setIsSeedModalOpen] = useState<boolean>(false);
  const [archiveInitialTab, setArchiveInitialTab] = useState<'archives' | 'schematics'>('archives');
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(false);
  const [, setActiveManifest] = useState<ScanManifest>(PASSPORT_MANIFEST);

  // Dynamic Game Environment Seeding & Perpetual Session Timer
  const [activeTheme, setActiveTheme] = useState<GameEnvironmentTheme>('parsec-vault');
  const [sessionElapsedSeconds, setSessionElapsedSeconds] = useState<number>(0);
  const [saveFiles, setSaveFiles] = useState<HologramSaveFile[]>(INITIAL_SAVE_FILES);
  const [justRecorded, setJustRecorded] = useState<boolean>(false);

  // Hosted Hologram Sessions State
  const [hostedSessions, setHostedSessions] = useState<HostedHologramSession[]>(INITIAL_HOSTED_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState<string>(INITIAL_HOSTED_SESSIONS[0].sessionId);

  const printIntervalRef = useRef<number | null>(null);

  const handleAddVehicle = (newVehicle: CharacterRecord) => {
    setCharacters((prev) => [newVehicle, ...prev]);
    setSelectedCharacter(newVehicle);
    setCameraMode('focus');
    soundEffects.playHologramSelect();
  };

  // Perpetual Session Timer Loop (counts seconds perpetually during the session)
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Clean interval on unmount
  useEffect(() => {
    return () => {
      if (printIntervalRef.current) clearInterval(printIntervalRef.current);
    };
  }, []);

  // Main 3D Bio-Reconstitution Print Sequence
  const initiatePrintSequence = (character: CharacterRecord, manifest?: ScanManifest) => {
    if (printIntervalRef.current) clearInterval(printIntervalRef.current);

    // Starting a new scan perpetually resets the session state and timer
    setSessionElapsedSeconds(0);

    setSelectedCharacter(character);
    if (manifest) setActiveManifest(manifest);

    // Move camera smoothly to the Bed
    setCameraMode('bed');
    setIsCanopyOpen(false);
    setIsDialogueOpen(false);
    setPrintPhase('scanning');
    setPrintProgress(0);

    soundEffects.playScannerSweep();

    let currentStep = 0;
    const totalSteps = 100;
    const stepDuration = 55; // ~5.5s full sequence

    printIntervalRef.current = window.setInterval(() => {
      currentStep += 1;
      setPrintProgress(currentStep);

      // Sound triggers at key phase thresholds
      if (currentStep === 25) {
        setPrintPhase('synthesizing');
      }

      if (currentStep > 25 && currentStep < 80 && currentStep % 8 === 0) {
        soundEffects.playBioPrintBeam();
      }

      if (currentStep === 80) {
        setPrintPhase('venting');
        setIsCanopyOpen(true);
        soundEffects.playSteamRelease();
      }

      if (currentStep === 90) {
        if (character.chassisType === 'hk-cyborg' || character.chassisType === 'hk-droid') {
          soundEffects.playRobotServo();
        } else {
          soundEffects.playHeartbeat();
        }
      }

      if (currentStep >= totalSteps) {
        if (printIntervalRef.current) clearInterval(printIntervalRef.current);
        setPrintPhase('awakened');
        setIsDialogueOpen(true);
      }
    }, stepDuration);
  };

  const handleCancelPrint = () => {
    if (printIntervalRef.current) clearInterval(printIntervalRef.current);
    setPrintPhase('idle');
    setPrintProgress(0);
  };

  const handleResetBed = () => {
    if (printIntervalRef.current) clearInterval(printIntervalRef.current);
    setPrintPhase('idle');
    setPrintProgress(0);
    setIsCanopyOpen(false);
    setIsDialogueOpen(false);
  };

  // Add a newly hosted hologram session (resets session timer to 0 on new scan)
  const handleHostNewSession = (newSession: HostedHologramSession) => {
    setSessionElapsedSeconds(0); // New scan resets session perpetual timer
    setHostedSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.sessionId);
    setSelectedCharacter(newSession.characterRecord);
    setCameraMode('focus');
  };

  const handleSelectHostedSession = (session: HostedHologramSession) => {
    setActiveSessionId(session.sessionId);
    setSelectedCharacter(session.characterRecord);
    setCameraMode('focus');
    soundEffects.playHologramSelect();
  };

  // Record Save File Generator
  const handleRecordSaveFile = (notes?: string) => {
    const newSave: HologramSaveFile = {
      saveId: `SAVE-${Date.now().toString().slice(-4)}`,
      saveTitle: notes ? notes.slice(0, 32) : `${selectedCharacter.name} Session Record`,
      saveTimestamp: new Date().toLocaleTimeString() + ' UTC',
      sessionElapsedSeconds,
      environmentTheme: activeTheme,
      documentTitle: 'Scanned Manifest & Biometric Hologram Token',
      subjectName: selectedCharacter.name,
      chassisType: selectedCharacter.chassisType,
      cryoCompatibility: selectedCharacter.cryoCompatibility,
      isDecoupledFromLock: true,
      lockCipherToken: `SYNTH-CIPHER-${Math.floor(Math.random() * 8999 + 1000)}`,
      academicSessionNotes: notes || `Session recorded under ${activeTheme} seed. Holographic transform & telemetry saved.`,
      recordedTelemetry: {
        sinteringProgress: printProgress,
        thermalKelvin: 310.15,
        hydraulicPsi: selectedCharacter.chassisType !== 'human' ? 3500 : 0,
        neuralLatencyMs: 1.4,
      },
    };
    setSaveFiles((prev) => [newSave, ...prev]);
    setJustRecorded(true);
    soundEffects.playHologramSelect();
    setTimeout(() => setJustRecorded(false), 2500);
  };

  const handleLoadSaveFile = (saveFile: HologramSaveFile) => {
    setActiveTheme(saveFile.environmentTheme);
    const found = characters.find((c) =>
      c.name.toLowerCase().includes(saveFile.subjectName.toLowerCase().split(' ')[0])
    );
    if (found) setSelectedCharacter(found);
    setCameraMode('focus');
    soundEffects.playHologramSelect();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 select-none">
      {/* 3D WebGL Aerospace Vault Viewport with Dynamic Theme Seeding */}
      <div className="absolute inset-0 z-0">
        <VaultCanvas
          characters={characters}
          selectedCharacter={selectedCharacter}
          onSelectCharacter={(char) => {
            setSelectedCharacter(char);
            soundEffects.playHologramSelect();
          }}
          cameraMode={cameraMode}
          printPhase={printPhase}
          printProgress={printProgress}
          isCanopyOpen={isCanopyOpen}
          onCanopyToggle={() => setIsCanopyOpen(!isCanopyOpen)}
          showFloorLabels={hudConfig.showFloorLabels}
          theme={activeTheme}
        />
      </div>

      {/* Top Navigation Bar (Configurable HUD Visibility) */}
      {hudConfig.showTopBar && (
        <TopBar
          onOpenScanner={() => setIsScannerOpen(true)}
          onOpenArchives={() => {
            setArchiveInitialTab('archives');
            setIsArchivesOpen(true);
          }}
          onOpenSchematics={() => {
            setArchiveInitialTab('schematics');
            setIsArchivesOpen(true);
          }}
          onOpenMedicalReview={() => setIsScannerOpen(true)}
          onOpenHostedSessions={() => setIsScannerOpen(true)}
          onOpenSeedModal={() => setIsSeedModalOpen(true)}
          onOpenHangar={() => setIsHangarModalOpen(true)}
          onOpenHudConfig={() => setIsHudModalOpen(true)}
          onSetCameraMode={setCameraMode}
          hostedSessionsCount={hostedSessions.length}
          vehiclesCount={characters.filter((c) => !!c.vehicleSpec).length}
        />
      )}

      {/* Floating Session Recorder & Perpetual Timer HUD (Configurable HUD Visibility) */}
      {hudConfig.showSessionBar && (
        <SessionRecorderBar
          sessionElapsedSeconds={sessionElapsedSeconds}
          activeTheme={activeTheme}
          onOpenSeedModal={() => setIsSeedModalOpen(true)}
          onQuickRecord={() => handleRecordSaveFile()}
          justRecorded={justRecorded}
        />
      )}

      {/* Active Subject Hologram Dossier (Positioned cleanly on top-right, away from 3D model) */}
      {hudConfig.showDossierCard && printPhase !== 'synthesizing' && printPhase !== 'venting' && !isDialogueOpen && (
        <HologramDetailCard
          character={selectedCharacter}
          cameraMode={cameraMode}
          onSetCameraMode={setCameraMode}
          onTriggerPrint={(char) => initiatePrintSequence(char)}
          printPhase={printPhase}
          showFloorLabels={hudConfig.showFloorLabels}
          onToggleFloorLabels={() =>
            setHudConfig((prev) => ({ ...prev, showFloorLabels: !prev.showFloorLabels }))
          }
        />
      )}

      {/* Printing In-Progress HUD */}
      <BioPrintOverlay
        phase={printPhase}
        progress={printProgress}
        character={selectedCharacter}
        onCancel={handleCancelPrint}
      />

      {/* Subject Awakening Dialogue Bubble (Docked to bottom-right corner with Clear View toggle) */}
      <AwakenedDialogueModal
        character={selectedCharacter}
        isOpen={isDialogueOpen && printPhase === 'awakened'}
        onClose={() => setIsDialogueOpen(false)}
        onReset={handleResetBed}
      />

      {/* Collapsible Bottom Control Dock (Configurable HUD Visibility) */}
      {hudConfig.showBottomDock && (
        <BottomDock
          characters={characters}
          selectedCharacter={selectedCharacter}
          onSelectCharacter={(char) => {
            setSelectedCharacter(char);
            soundEffects.playHologramSelect();
          }}
          cameraMode={cameraMode}
          onSetCameraMode={setCameraMode}
          printPhase={printPhase}
          onTriggerPrint={() => initiatePrintSequence(selectedCharacter)}
          isCanopyOpen={isCanopyOpen}
          onToggleCanopy={() => setIsCanopyOpen(!isCanopyOpen)}
          onOpenScanner={() => setIsScannerOpen(true)}
          onOpenHangar={() => setIsHangarModalOpen(true)}
          onOpenHudConfig={() => setIsHudModalOpen(true)}
          showFloorLabels={hudConfig.showFloorLabels}
          onToggleFloorLabels={() =>
            setHudConfig((prev) => ({ ...prev, showFloorLabels: !prev.showFloorLabels }))
          }
        />
      )}

      {/* Document Scanner Exchange with Privacy Lock Decoupling & Medical Review */}
      <DocumentScannerExchangeModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onInitiatePrint={(char, manifest) => initiatePrintSequence(char, manifest)}
        onHostSession={handleHostNewSession}
        hostedSessions={hostedSessions}
        activeSessionId={activeSessionId}
        onSelectHostedSession={handleSelectHostedSession}
      />

      {/* Rendering Engine Environment Seeding, Compatibility & Save Files Modal */}
      <EnvironmentSeedModal
        isOpen={isSeedModalOpen}
        onClose={() => setIsSeedModalOpen(false)}
        activeTheme={activeTheme}
        onSelectTheme={setActiveTheme}
        sessionElapsedSeconds={sessionElapsedSeconds}
        onResetSession={() => setSessionElapsedSeconds(0)}
        saveFiles={saveFiles}
        onRecordSaveFile={handleRecordSaveFile}
        onLoadSaveFile={handleLoadSaveFile}
        selectedCharacter={selectedCharacter}
      />

      {/* Aerospace Vehicle Hangar Modal (Catalog & Custom Forge) */}
      <VehicleHangarModal
        isOpen={isHangarModalOpen}
        onClose={() => setIsHangarModalOpen(false)}
        onAddVehicle={handleAddVehicle}
        existingVehiclesCount={characters.filter((c) => !!c.vehicleSpec).length}
        onSelectAndFocus={(veh) => {
          setSelectedCharacter(veh);
          setCameraMode('focus');
        }}
        activeVehicles={characters.filter((c) => !!c.vehicleSpec)}
      />

      {/* Configurable HUD Settings Modal */}
      <HudConfigModal
        isOpen={isHudModalOpen}
        onClose={() => setIsHudModalOpen(false)}
        config={hudConfig}
        onChangeConfig={setHudConfig}
        onResetToDefaults={() => setHudConfig(DEFAULT_HUD_CONFIG)}
      />

      {/* Vault Archives & Schematics Modal */}
      <VaultArchivesModal
        isOpen={isArchivesOpen}
        onClose={() => setIsArchivesOpen(false)}
        onSelectAndPrint={(char) => initiatePrintSequence(char)}
        initialTab={archiveInitialTab}
      />
    </div>
  );
}
