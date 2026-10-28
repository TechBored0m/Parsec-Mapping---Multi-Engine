import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Scan,
  X,
  Fingerprint,
  Dna,
  Bot,
  Zap,
  ArrowRight,
  Sparkles,
  CreditCard,
  Upload,
  Lock,
  Unlock,
  Radio,
  FileText,
  Activity,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Shield,
  Layers,
  HeartPulse
} from 'lucide-react';
import { CHARACTERS_DATA, PASSPORT_MANIFEST, NEVADA_ID_MANIFEST } from '../data/characters';
import { CharacterRecord, ScanManifest, HostedHologramSession, MedicalReviewData } from '../types';
import { FELIPE_ZAMORA_MEDICAL_REVIEW } from '../data/medicalRecords';
import { soundEffects } from '../services/soundEffects';

interface DocumentScannerExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInitiatePrint: (character: CharacterRecord, manifest: ScanManifest) => void;
  onHostSession: (session: HostedHologramSession) => void;
  hostedSessions: HostedHologramSession[];
  activeSessionId?: string;
  onSelectHostedSession: (session: HostedHologramSession) => void;
}

export const DocumentScannerExchangeModal: React.FC<DocumentScannerExchangeModalProps> = ({
  isOpen,
  onClose,
  onInitiatePrint,
  onHostSession,
  hostedSessions,
  activeSessionId,
  onSelectHostedSession,
}) => {
  const [activeTab, setActiveTab] = useState<'exchange' | 'sessions' | 'medical' | 'convergence'>('exchange');
  const [selectedPreset, setSelectedPreset] = useState<'nevada' | 'passport' | 'medical-doc' | 'custom'>('nevada');
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  // Privacy lock decoupling state (Core User Request)
  const [isDecoupledFromLock, setIsDecoupledFromLock] = useState(true);
  const [redactionEnabled, setRedactionEnabled] = useState(true);

  // Uploaded document states
  const [uploadedDocName, setUploadedDocName] = useState<string>('State of Nevada Employee Card (2400010392)');
  const [uploadedDocType, setUploadedDocType] = useState<string>('State Cannabis Employee Credential');
  const [uploadedDocImage, setUploadedDocImage] = useState<string>('/assets/aistudio/7A4821E9-E99A-42E0-A041-580B3F7A3F5C_74d11eb2.jpeg');
  const [customSubjectName, setCustomSubjectName] = useState('FELIPE ZAMORA');
  const [copyNotification, setCopyNotification] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const triggerScanAnimation = () => {
    setIsScanning(true);
    setScanComplete(false);
    soundEffects.playScannerSweep();

    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      soundEffects.playHologramSelect();
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedDocImage(reader.result as string);
        setUploadedDocName(file.name);
        setUploadedDocType(file.type.includes('pdf') ? 'Clinical PDF Document' : 'Biometric Scan Document');
        setSelectedPreset('custom');
        triggerScanAnimation();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset: 'nevada' | 'passport' | 'medical-doc') => {
    setSelectedPreset(preset);
    if (preset === 'nevada') {
      setUploadedDocName('State of Nevada Employee Card (2400010392)');
      setUploadedDocType('State Cannabis Employee Credential');
      setUploadedDocImage('/assets/aistudio/7A4821E9-E99A-42E0-A041-580B3F7A3F5C_74d11eb2.jpeg');
      setCustomSubjectName('FELIPE ZAMORA');
    } else if (preset === 'passport') {
      setUploadedDocName('United States of America Official Passport');
      setUploadedDocType('Federal Biometric Travel Document');
      setUploadedDocImage('/assets/aistudio/7A4821E9-E99A-42E0-A041-580B3F7A3F5C_74d11eb2.jpeg');
      setCustomSubjectName('FELIPE ZAMORA');
    } else if (preset === 'medical-doc') {
      setUploadedDocName('Parsec Clinical Cryo-Tolerance & Toxicology Chart');
      setUploadedDocType('Comprehensive Pre-Hibernation Medical Evaluation');
      setUploadedDocImage('/assets/aistudio/IMG_2239_82035da9.jpeg');
      setCustomSubjectName('FELIPE ZAMORA');
    }
    triggerScanAnimation();
  };

  // Create and host a live hologram session
  const handleCreateHostedSession = () => {
    const hkFelipe = CHARACTERS_DATA.find((c) => c.id === 'hk-felipe')!;
    const felipeHuman = CHARACTERS_DATA.find((c) => c.id === 'felipe-zamora')!;

    const targetChar = selectedPreset === 'nevada' ? hkFelipe : felipeHuman;
    const newSessionId = `HOLO-SESSION-${Date.now().toString().slice(-4)}`;

    const newSession: HostedHologramSession = {
      sessionId: newSessionId,
      sessionTitle: `${customSubjectName} - ${uploadedDocName.slice(0, 32)}`,
      documentName: uploadedDocName,
      documentType: uploadedDocType,
      documentUrl: uploadedDocImage,
      holderName: customSubjectName,
      isDecoupledFromLock: isDecoupledFromLock,
      lockMechanism: isDecoupledFromLock ? 'DECOUPLED_SYNTHETIC_CIPHER' : 'ANONYMOUS_EPHEMERAL_KEY',
      redactedIdToken: isDecoupledFromLock
        ? 'TOKEN-DECOUPLED-SYNTH-9482 (IDENTITY UNBOUND FROM LOCK)'
        : 'ENCRYPTED-TRANSIENT-CIPHER',
      timestamp: new Date().toLocaleTimeString() + ' UTC',
      activeStatus: 'HOSTING_LIVE',
      characterRecord: targetChar,
      medicalReview: FELIPE_ZAMORA_MEDICAL_REVIEW,
    };

    onHostSession(newSession);
    soundEffects.playHologramSelect();
    setActiveTab('sessions');
  };

  const handlePrintCurrent = () => {
    const hkFelipe = CHARACTERS_DATA.find((c) => c.id === 'hk-felipe')!;
    const felipeHuman = CHARACTERS_DATA.find((c) => c.id === 'felipe-zamora')!;
    const chosenChar = selectedPreset === 'nevada' || activeTab === 'convergence' ? hkFelipe : felipeHuman;
    const manifest = selectedPreset === 'nevada' ? NEVADA_ID_MANIFEST : PASSPORT_MANIFEST;
    onInitiatePrint(chosenChar, manifest);
    onClose();
  };

  const copyMedicalReport = () => {
    const reportText = `=== PARSEC VAULT CLINICAL MEDICAL REVIEW ===
Patient Name: ${FELIPE_ZAMORA_MEDICAL_REVIEW.patientName}
Medical Record ID: ${FELIPE_ZAMORA_MEDICAL_REVIEW.medicalRecordId}
Timestamp: ${FELIPE_ZAMORA_MEDICAL_REVIEW.clinicalTimestamp}
Cryo-Tolerance Index: ${FELIPE_ZAMORA_MEDICAL_REVIEW.cryoToleranceScore}%
Cellular Integrity: ${FELIPE_ZAMORA_MEDICAL_REVIEW.cellularIntegrity}%
Neural Synaptic Latency: ${FELIPE_ZAMORA_MEDICAL_REVIEW.neuralLatencyMs} ms
Toxicology Screen: ${FELIPE_ZAMORA_MEDICAL_REVIEW.toxicologyStatus}
Vault Lock Decoupling: ${isDecoupledFromLock ? 'VERIFIED (DECOUPLED FROM PERSONAL DATA)' : 'ACTIVE'}
Physician Assessment: ${FELIPE_ZAMORA_MEDICAL_REVIEW.physicianNotes}
Diagnostic Checklist:
${FELIPE_ZAMORA_MEDICAL_REVIEW.diagnosticChecklist.map((c) => ` - [${c.status}] ${c.item}: ${c.detail}`).join('\n')}
===========================================`;

    navigator.clipboard.writeText(reportText);
    setCopyNotification(true);
    setTimeout(() => setCopyNotification(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Scan className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-display">Document Scanner Exchange</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  LOCK DECOUPLED (PRIVACY SHIELD)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Upload any document · Decouple identity from vault locks · Host 3D hologram sessions · Clinical medical review
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close scanner exchange"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center px-6 pt-2 border-b border-slate-800 gap-2 bg-slate-950/40 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('exchange')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'exchange'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            Upload &amp; Scan Exchange
          </button>

          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'sessions'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            Hosted Hologram Sessions ({hostedSessions.length})
          </button>

          <button
            onClick={() => setActiveTab('medical')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'medical'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
            Clinical Medical Review
          </button>

          <button
            onClick={() => setActiveTab('convergence')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'convergence'
                ? 'border-amber-400 text-amber-300 bg-amber-950/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            HK-Robot Convergence
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: SCANNER EXCHANGE & PRIVACY LOCK DECOUPLING */}
          {activeTab === 'exchange' && (
            <div className="space-y-5">
              {/* Privacy Lock Decoupling Shield Banner (Answers the Core Question) */}
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-display">
                      Anti-Lock Privacy Architecture (Lock Decoupling Active)
                    </span>
                  </div>
                  
                  {/* Lock Decoupling Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <span className="text-slate-300 text-[11px]">Decouple Identity from Vault Lock:</span>
                    <input
                      type="checkbox"
                      checked={isDecoupledFromLock}
                      onChange={(e) => setIsDecoupledFromLock(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                      isDecoupledFromLock ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        isDecoupledFromLock ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </div>
                  </label>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {isDecoupledFromLock ? (
                    <span className="text-emerald-200">
                      <strong>Privacy Protection Guaranteed:</strong> The scanner is strictly decoupled from the Parsec Vault locking mechanism. Your US Passport, Nevada ID numbers, and legal credentials are processed in an ephemeral sandbox. Physical vault latches and cryo-canopy access operate on an isolated synthetic guest cipher (<code>SYNTH-PARSEC-CIPHER-01</code>), ensuring you can never be locked in or restricted based on your identity documents.
                    </span>
                  ) : (
                    <span className="text-amber-300">
                      <strong>Warning:</strong> Lock coupling enabled. Your identity tokens are currently linked to the hibernation chamber master key. Toggle this switch on to decouple your information immediately.
                    </span>
                  )}
                </p>
              </div>

              {/* Upload or Preset Document Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider">
                    Select or Upload Document to Scan:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload My Document / Medical File</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <button
                    onClick={() => handleSelectPreset('nevada')}
                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                      selectedPreset === 'nevada'
                        ? 'bg-emerald-950/70 border-emerald-400 text-emerald-300 font-bold'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    Nevada ID (ID: 2400010392)
                  </button>

                  <button
                    onClick={() => handleSelectPreset('passport')}
                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                      selectedPreset === 'passport'
                        ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 font-bold'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    US Passport (Felipe Zamora)
                  </button>

                  <button
                    onClick={() => handleSelectPreset('medical-doc')}
                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                      selectedPreset === 'medical-doc'
                        ? 'bg-sky-950/70 border-sky-400 text-sky-300 font-bold'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <HeartPulse className="w-3.5 h-3.5" />
                    Clinical Cryo-Medical Record
                  </button>
                </div>
              </div>

              {/* Scanned Document Preview & Extracted Telemetry */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                {/* Left: Document Visual Preview with Laser Sweep */}
                <div className="md:col-span-6 rounded-xl border border-cyan-500/40 bg-slate-950 p-3.5 flex flex-col justify-between relative overflow-hidden group">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                      <span className="font-mono text-cyan-400 font-semibold uppercase truncate pr-2">
                        {uploadedDocName}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono shrink-0">
                        {isDecoupledFromLock ? 'LOCK: DECOUPLED' : 'LOCKED'}
                      </span>
                    </div>

                    <div className="my-3 relative rounded-lg overflow-hidden border border-slate-700 bg-slate-900 aspect-[4/3] flex items-center justify-center">
                      <img
                        src={uploadedDocImage}
                        alt="Scanned Document"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />

                      {/* Laser scanner sweep line */}
                      {isScanning && (
                        <div className="absolute inset-0 bg-cyan-500/20 pointer-events-none flex flex-col justify-start">
                          <div className="w-full h-1.5 bg-cyan-400 shadow-[0_0_18px_#00f0ff] animate-scanline" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Subject Name:</span>
                        <strong className="text-white font-mono">{customSubjectName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Document Type:</span>
                        <span className="text-slate-300">{uploadedDocType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Credential ID Mask:</span>
                        <span className="text-emerald-400 font-mono">
                          {redactionEnabled ? 'USA-••••••-CA // NV-240001••••' : '2400010392 / USA-072493-CA'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Vault Lock Binding:</span>
                        <span className="text-emerald-300 font-semibold">SYNTHETIC ISOLATION (ZERO-LOCK)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <button
                      onClick={triggerScanAnimation}
                      disabled={isScanning}
                      className="px-3 py-1.5 text-[11px] font-semibold text-cyan-300 bg-cyan-950 border border-cyan-500/40 hover:bg-cyan-900 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Scan className="w-3.5 h-3.5" />
                      <span>{isScanning ? 'Scanning...' : 'Trigger Laser Sweep'}</span>
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono">ENCRYPTED SANDBOX</span>
                  </div>
                </div>

                {/* Right: Hosted Hologram Session Launcher */}
                <div className="md:col-span-6 rounded-xl border border-slate-800 bg-slate-950/70 p-4 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                      <Radio className="w-4 h-4 text-cyan-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                        Host Hologram Session from this Document
                      </h4>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      Every time you scan or upload a document, you can broadcast an interactive 3D hosted hologram session to the bridge. The hologram renders in real-time, displays medical vitals, and is fully accessible for inspection or bed reconstitution at any time.
                    </p>

                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Session Broadcast Channel:</span>
                        <span className="text-cyan-400 font-mono">PARSEC-HOLO-CH7</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Chassis Projection:</span>
                        <span className="text-white font-medium">
                          {selectedPreset === 'nevada' ? 'HK Assassin Droid (HK-Z47)' : 'Biological Human'}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Medical Evaluation:</span>
                        <span className="text-emerald-400 font-medium">99.8% Cleared for Hibernation</span>
                      </div>
                    </div>
                  </div>

                  {/* Call to Action: Host Live Hologram Session */}
                  <div className="space-y-2">
                    <button
                      onClick={handleCreateHostedSession}
                      className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Radio className="w-4 h-4" />
                      <span>Host Hologram Session from Document</span>
                    </button>

                    <button
                      onClick={handlePrintCurrent}
                      className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Direct 3D Print to Hibernation Bed</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOSTED HOLOGRAM SESSIONS REGISTRY */}
          {activeTab === 'sessions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Manage all hosted 3D hologram sessions created from your uploaded documents:
                </span>
                <button
                  onClick={() => setActiveTab('exchange')}
                  className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-900 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload &amp; Host New Session</span>
                </button>
              </div>

              <div className="space-y-3">
                {hostedSessions.map((session) => {
                  const isActive = activeSessionId === session.sessionId;
                  return (
                    <div
                      key={session.sessionId}
                      className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                        isActive
                          ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={session.documentUrl}
                          alt={session.sessionTitle}
                          className="w-12 h-12 rounded-lg object-cover border border-cyan-500/40"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{session.sessionTitle}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              {session.activeStatus}
                            </span>
                            {session.isDecoupledFromLock && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                ZERO-LOCK
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">{session.documentType}</p>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            ID: <span className="text-cyan-400">{session.sessionId}</span> · Timestamp: {session.timestamp}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        <button
                          onClick={() => {
                            onSelectHostedSession(session);
                            onClose();
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                            isActive
                              ? 'bg-cyan-400 text-slate-950 border-cyan-400 font-bold'
                              : 'bg-slate-900 border-slate-700 text-cyan-300 hover:bg-slate-800'
                          }`}
                        >
                          <Radio className="w-3.5 h-3.5" />
                          <span>{isActive ? 'Currently Projected' : 'Broadcast to 3D View'}</span>
                        </button>

                        <button
                          onClick={() => setActiveTab('medical')}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          Medical Review
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CLINICAL MEDICAL REVIEW */}
          {activeTab === 'medical' && (
            <div className="space-y-5">
              {/* Clinical Header Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <HeartPulse className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white font-display">
                        Official Pre-Hibernation Medical Assessment
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        MEDICALLY CLEARED
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Evaluated by: {FELIPE_ZAMORA_MEDICAL_REVIEW.evaluatingOfficer}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyMedicalReport}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{copyNotification ? 'Report Copied!' : 'Copy Medical Audit'}</span>
                  </button>
                </div>
              </div>

              {/* Vitals Telemetry Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">CRYO-TOLERANCE</span>
                  <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                    {FELIPE_ZAMORA_MEDICAL_REVIEW.cryoToleranceScore}%
                  </div>
                  <span className="text-[10px] text-slate-400">Tier-1 Optimal</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">CELLULAR INTEGRITY</span>
                  <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
                    {FELIPE_ZAMORA_MEDICAL_REVIEW.cellularIntegrity}%
                  </div>
                  <span className="text-[10px] text-slate-400">Zero Degradation</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">NEURAL LATENCY</span>
                  <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">
                    {FELIPE_ZAMORA_MEDICAL_REVIEW.neuralLatencyMs} ms
                  </div>
                  <span className="text-[10px] text-slate-400">Synaptic Bridge Peak</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">TOXICOLOGY SCREEN</span>
                  <div className="text-sm font-bold text-emerald-300 font-mono mt-1 truncate">
                    STATE COMPLIANT
                  </div>
                  <span className="text-[10px] text-slate-400">Nevada Clean Panel</span>
                </div>
              </div>

              {/* Physician Diagnostic Notes */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  Clinical Diagnostic Certification Notes:
                </span>
                <p className="text-slate-300 italic leading-relaxed text-[11px]">
                  &ldquo;{FELIPE_ZAMORA_MEDICAL_REVIEW.physicianNotes}&rdquo;
                </p>
              </div>

              {/* 6-Point Diagnostic Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Diagnostic Evaluation Matrix (6/6 Verified):
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {FELIPE_ZAMORA_MEDICAL_REVIEW.diagnosticChecklist.map((check, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5 text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-white">{check.item}</strong>
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {check.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{check.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HK-ROBOT CONVERGENCE */}
          {activeTab === 'convergence' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-amber-300 text-sm font-display">
                    HK Droid Transference: Felipe Zamora &rarr; HK-Z47 Assassin Robot
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    3D-prints your consciousness and personal identity into the iconic Class-IV HK Assassin Droid chassis with glowing orange photoreceptors and authentic vocoder syntax.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <span className="text-amber-400 font-semibold uppercase tracking-wider block">Organic Profile</span>
                  <div className="text-sm font-bold text-white font-mono">FELIPE ZAMORA</div>
                  <div className="text-slate-400">Nevada Dispensary Credential (ID: 2400010392)</div>
                  <div className="text-emerald-400 font-mono text-[11px]">LOCK STATUS: UNBOUND &amp; DECOUPLED</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-2 text-xs">
                  <span className="text-amber-400 font-semibold uppercase tracking-wider block">Target Chassis</span>
                  <div className="text-sm font-bold text-amber-300 font-mono">HK-Z47 ASSASSIN DROID</div>
                  <div className="text-slate-400">Beskar Rust-Copper Armor · Dual Fiery Photoreceptors</div>
                  <div className="text-amber-400 font-mono text-[11px]">CZERKA SYNTAX ENGINE: ACTIVE</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-wrap items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Vault Lock: <strong className="text-emerald-300 font-mono">DECOUPLED (PRIVACY SHIELD)</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateHostedSession}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Host Live 3D Hologram Session</span>
            </button>

            <button
              onClick={handlePrintCurrent}
              className={`px-5 py-2 text-xs font-bold rounded-lg shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                selectedPreset === 'nevada' || activeTab === 'convergence'
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/20'
                  : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-500/20'
              }`}
            >
              <span>Reconstitute &amp; Print onto Bed</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
