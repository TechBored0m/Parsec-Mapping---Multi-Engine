import React, { useState } from 'react';
import { ShieldCheck, Scan, X, Fingerprint, Dna, Bot, Zap, ArrowRight, Sparkles, CreditCard } from 'lucide-react';
import { CHARACTERS_DATA, PASSPORT_MANIFEST, NEVADA_ID_MANIFEST } from '../data/characters';
import { CharacterRecord, ScanManifest } from '../types';
import { soundEffects } from '../services/soundEffects';

interface PassportScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInitiatePrint: (character: CharacterRecord, manifest: ScanManifest) => void;
}

export const PassportScannerModal: React.FC<PassportScannerModalProps> = ({
  isOpen,
  onClose,
  onInitiatePrint,
}) => {
  const [activeTab, setActiveTab] = useState<'convergence' | 'passport' | 'archive' | 'custom'>('convergence');
  const [selectedCredential, setSelectedCredential] = useState<'nevada' | 'passport'>('nevada');
  const [selectedArchiveId, setSelectedArchiveId] = useState<string>('hk-felipe');
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  // Custom data input fields
  const [customName, setCustomName] = useState('Alex Vance');
  const [customOrigin, setCustomOrigin] = useState('Earth Orbital Station');
  const [customRole, setCustomRole] = useState('Aerospace Cryptographer');

  if (!isOpen) return null;

  const triggerScanAnimation = () => {
    setIsScanning(true);
    setScanComplete(false);
    soundEffects.playScannerSweep();

    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      soundEffects.playRobotServo();
    }, 1400);
  };

  const handlePrintSubmit = () => {
    if (activeTab === 'convergence') {
      const hkFelipe = CHARACTERS_DATA.find((c) => c.id === 'hk-felipe')!;
      const manifest = selectedCredential === 'nevada' ? NEVADA_ID_MANIFEST : PASSPORT_MANIFEST;
      onInitiatePrint(hkFelipe, manifest);
    } else if (activeTab === 'passport') {
      const felipeRecord = CHARACTERS_DATA.find((c) => c.id === 'felipe-zamora')!;
      onInitiatePrint(felipeRecord, PASSPORT_MANIFEST);
    } else if (activeTab === 'archive') {
      const chosen = CHARACTERS_DATA.find((c) => c.id === selectedArchiveId) || CHARACTERS_DATA[0];
      const archiveManifest: ScanManifest = {
        documentType: 'GALACTIC RECONSTITUTION ARCHIVE',
        holderName: chosen.name.toUpperCase(),
        surname: chosen.name.split(' ').pop() || chosen.name,
        givenNames: chosen.name.split(' ')[0] || chosen.name,
        nationality: chosen.origin,
        dateOfBirth: 'ANCIENT ARCHIVE',
        placeOfBirth: chosen.origin,
        issueDate: 'CYBER-ERA',
        expirationDate: 'PERPETUAL',
        photoUrl: chosen.image,
        targetChassis: chosen.chassisType,
        status: 'Ready For Print',
      };
      onInitiatePrint(chosen, archiveManifest);
    } else {
      const customChar: CharacterRecord = {
        id: `custom-${Date.now()}`,
        name: customName,
        subtitle: customRole,
        category: 'Passenger',
        chassisType: 'human',
        image: '/assets/aistudio/7A4821E9-E99A-42E0-A041-580B3F7A3F5C_74d11eb2.jpeg',
        origin: customOrigin,
        classification: 'Homo Sapiens / Custom Biometric Synthesizer',
        bioHash: `CUSTOM-DNA-${Math.floor(Math.random() * 900000 + 100000)}`,
        cryoCompatibility: 98.9,
        description: `Custom reconstituted subject registered to the Parsec Aerospace Vault.`,
        awakeningSpeech: `...Where... where am I? What happened? The last thing I remember was ${customOrigin}... is this the Parsec Hibernation Gate?!`,
        awakeningSubtext: 'The newly printed subject takes their first breath of filtered air and glances at the observation catwalk.',
        voicePitch: 1.0,
        voiceRate: 1.0,
        dialogueTree: [
          {
            question: 'You are safe. Your biometric blueprint was printed onto this hibernation bed.',
            answer: `Printed onto a bed?! I can feel the cellular cohesion settling in... Thank you for restoring my consciousness.`
          }
        ],
        pedestalPosition: [0, 0, 8]
      };

      const customManifest: ScanManifest = {
        documentType: 'CUSTOM BIOMETRIC MANIFEST',
        holderName: customName.toUpperCase(),
        surname: customName.split(' ').pop() || customName,
        givenNames: customName.split(' ')[0] || customName,
        nationality: customOrigin,
        dateOfBirth: '2026.10',
        placeOfBirth: customOrigin,
        issueDate: 'OCTOBER 2026',
        expirationDate: '2036.10',
        photoUrl: '/assets/aistudio/7A4821E9-E99A-42E0-A041-580B3F7A3F5C_74d11eb2.jpeg',
        targetChassis: 'human',
        status: 'Ready For Print',
      };

      onInitiatePrint(customChar, customManifest);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Bot className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">HK Droid Forge &amp; Biometric Scanner</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Cybernetic Convergence</span>
                <span>·</span>
                <span>Felipe Zamora Neural Imprint</span>
                <span>·</span>
                <span>HK-Z47 Assassin Chassis</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center px-6 pt-3 border-b border-slate-800 gap-2 bg-slate-950/40 overflow-x-auto">
          <button
            onClick={() => setActiveTab('convergence')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'convergence'
                ? 'border-amber-400 text-amber-300 bg-amber-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            HK Convergence: Print Me as the Robot
          </button>

          <button
            onClick={() => setActiveTab('passport')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'passport'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Human Reconstitution (US Passport)
          </button>

          <button
            onClick={() => setActiveTab('archive')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'archive'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Dna className="w-4 h-4 text-cyan-400" />
            Galactic Vault Records
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'custom'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Fingerprint className="w-4 h-4 text-cyan-400" />
            Manual Biometric Ingest
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'convergence' && (
            <div className="space-y-6">
              {/* Convergence Banner */}
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-amber-300 text-sm font-display">
                    Cybernetic Neural Transference Protocol: Felipe Zamora &rarr; HK Assassin Droid
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    This protocol transfers your personal identification, facial geometry, and neural memories directly into a Class-IV HK-Series Hunter-Killer Droid chassis. The laser gantry will 3D print the rust-copper armor and pneumatic servos on the bed, where you awaken to discover you are the robot!
                  </p>
                </div>
              </div>

              {/* Credential Selector */}
              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">Select Source ID:</span>
                <button
                  onClick={() => setSelectedCredential('nevada')}
                  className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                    selectedCredential === 'nevada'
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300 font-bold'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  State of Nevada Employee Card (ID: 2400010392)
                </button>

                <button
                  onClick={() => setSelectedCredential('passport')}
                  className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                    selectedCredential === 'passport'
                      ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  US Passport (Felipe Zamora)
                </button>
              </div>

              {/* Side-by-side Dual Scan Matrix: Human ID + HK-47 Chassis */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                {/* Left Card: Felipe's Scanned Credential */}
                <div className="md:col-span-5 rounded-xl border border-emerald-500/40 bg-slate-950 p-3.5 flex flex-col justify-between relative overflow-hidden group">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase">
                        {selectedCredential === 'nevada' ? 'NEVADA DISPENSARY BADGE' : 'US PASSPORT BIOMETRICS'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">ENCRYPTED TOKEN</span>
                    </div>

                    <div className="my-3 relative rounded-lg overflow-hidden border border-slate-700 bg-slate-900 aspect-[4/3] flex items-center justify-center">
                      <img
                        src="/assets/aistudio/7A4821E9-E99A-42E0-A041-580B3F7A3F5C_74d11eb2.jpeg"
                        alt="Felipe Zamora Identity Photo"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {isScanning && (
                        <div className="absolute inset-0 bg-emerald-500/20 flex flex-col justify-start">
                          <div className="w-full h-1 bg-emerald-400 shadow-[0_0_12px_#10b981] animate-scanline" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Subject Name:</span>
                        <strong className="text-white font-mono">FELIPE ZAMORA</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Jurisdiction:</span>
                        <span className="text-slate-200">
                          {selectedCredential === 'nevada' ? 'State of Nevada' : 'United States of America'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Credential ID:</span>
                        <span className="text-emerald-400 font-mono">
                          {selectedCredential === 'nevada' ? '2400010392' : 'USA-072493-CA'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Category:</span>
                        <span className="text-slate-300">
                          {selectedCredential === 'nevada' ? 'Cannabis Dispensary' : 'Global Citizen'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-emerald-400 font-mono">
                    NEURAL ENCEPHALOGRAM: 100% SYNCHRONIZED
                  </div>
                </div>

                {/* Center Transition Flow Icon */}
                <div className="md:col-span-2 flex flex-col items-center justify-center gap-2 py-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shadow-[0_0_15px_#f59e0b]">
                    <Zap className="w-5 h-5 animate-pulse" />
                  </div>
                  <span className="text-[10px] text-amber-300 font-mono font-bold uppercase text-center">
                    CYBERNETIC MERGE
                  </span>
                  <div className="hidden md:block w-0.5 h-12 bg-gradient-to-b from-amber-400 to-transparent" />
                </div>

                {/* Right Card: HK Assassin Droid Target Chassis */}
                <div className="md:col-span-5 rounded-xl border border-amber-500/40 bg-slate-950 p-3.5 flex flex-col justify-between relative overflow-hidden group">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-[11px] font-mono text-amber-400 font-semibold uppercase">
                        TARGET: HK-Z47 CHASSIS
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono">CZERKA SPEC</span>
                    </div>

                    <div className="my-3 relative rounded-lg overflow-hidden border border-slate-700 bg-slate-900 aspect-[4/3] flex items-center justify-center">
                      <img
                        src="/assets/aistudio/IMG_2239_82035da9.jpeg"
                        alt="HK-47 Assassin Droid Chassis"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {isScanning && (
                        <div className="absolute inset-0 bg-amber-500/20 flex flex-col justify-start">
                          <div className="w-full h-1 bg-amber-400 shadow-[0_0_12px_#f59e0b] animate-scanline" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Chassis Model:</span>
                        <strong className="text-amber-300 font-mono">HK-Z47 / Hunter-Killer</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Armor Plating:</span>
                        <span className="text-slate-200">Rust-Copper Beskar Alloy</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Photoreceptors:</span>
                        <span className="text-amber-400 font-mono">Dual Fiery Orange Slits</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Vocoder Mode:</span>
                        <span className="text-slate-300">HK Syntax (Query/Statement)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-amber-400 font-mono">
                    COMBAT PROTOCOLS: FULLY PRIMED
                  </div>
                </div>
              </div>

              {/* Preview Awakening Transmission */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
                <div className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <Bot className="w-4 h-4" />
                  <span>Awakened Transmission Preview as HK-Felipe:</span>
                </div>
                <p className="italic text-white text-[13px] leading-relaxed">
                  &ldquo;...Audio vocoder online. Query: Where... where am I? What happened? Statement: My organic memory registers as Felipe Zamora from Nevada and California... but my sensory telemetry indicates I am encased in a heavy-duty HK-Series Assassin Droid chassis! Exclamation: Look at these pneumatic copper hands! Did you just 3D-print me as an HK robot?!&rdquo;
                </p>
              </div>
            </div>
          )}

          {activeTab === 'passport' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-6 relative rounded-xl overflow-hidden border border-cyan-500/40 bg-slate-950 shadow-inner group">
                <div className="relative aspect-[3/4] w-full max-h-[380px] overflow-hidden flex items-center justify-center">
                  <img
                    src="/assets/aistudio/7A4821E9-E99A-42E0-A041-580B3F7A3F5C_74d11eb2.jpeg"
                    alt="Official US Passport Felipe Zamora"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {isScanning && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-start">
                      <div className="w-full h-1.5 bg-cyan-400 shadow-[0_0_18px_#00f0ff] animate-scanline" />
                      <div className="absolute inset-0 bg-cyan-500/15" />
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    <span className="text-white font-medium">Document ID:</span> USA-P&lt;USAZAMORA
                  </div>
                  <button
                    onClick={triggerScanAnimation}
                    disabled={isScanning}
                    className="px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950 border border-cyan-500/40 hover:bg-cyan-900 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Scan className="w-3.5 h-3.5" />
                    {isScanning ? 'Scanning...' : 'Trigger Laser Sweep'}
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Extracted Biometric Token</span>
                    <span className="text-xs text-emerald-400 font-mono">CRYPTOGRAPHIC PASS</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-slate-400">Surname</div>
                      <div className="font-semibold text-white text-sm">ZAMORA</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Given Names</div>
                      <div className="font-semibold text-white text-sm">FELIPE</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Nationality</div>
                      <div className="text-slate-200">UNITED STATES OF AMERICA</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Date of Birth</div>
                      <div className="text-slate-200 font-mono">24 Apr 1993</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Place of Birth</div>
                      <div className="text-slate-200">CALIFORNIA, U.S.A.</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Chassis Mode</div>
                      <div className="text-cyan-400 font-bold font-mono">Biological Human</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'archive' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                Select any stored galactic entity from the Hologram Bridge archives:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {CHARACTERS_DATA.map((char) => (
                  <div
                    key={char.id}
                    onClick={() => {
                      setSelectedArchiveId(char.id);
                      soundEffects.playHologramSelect();
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                      selectedArchiveId === char.id
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-md'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={char.image}
                      alt={char.name}
                      className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="overflow-hidden">
                      <div className="text-xs font-semibold text-white truncate">{char.name}</div>
                      <div className="text-[11px] text-cyan-400 truncate">{char.subtitle}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">{char.origin}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4 max-w-lg mx-auto">
              <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                <Fingerprint className="w-4 h-4" />
                Input Custom Biometric Manifest
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Subject Full Name</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                    placeholder="Enter name..."
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Origin / Home Sector</label>
                  <input
                    type="text"
                    value={customOrigin}
                    onChange={(e) => setCustomOrigin(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                    placeholder="e.g. Earth Orbital Station"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Classification / Role</label>
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                    placeholder="e.g. Deep Space Navigator"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/70">
          <div className="text-xs text-slate-400">
            {activeTab === 'convergence' ? (
              <span className="text-amber-400 font-medium">Target: Reconstitute as HK-Felipe (HK-Z47 Droid Chassis)</span>
            ) : (
              <span>Destination: <span className="text-cyan-400 font-medium">Chamber Bed 01</span></span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={triggerScanAnimation}
              disabled={isScanning}
              className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>{isScanning ? 'Scanning...' : 'Laser Scan'}</span>
            </button>

            <button
              onClick={handlePrintSubmit}
              className={`px-5 py-2.5 text-xs font-semibold rounded-lg shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'convergence'
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/20'
                  : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-500/20'
              }`}
            >
              <span>{activeTab === 'convergence' ? 'Execute HK-Robot Print onto Bed' : 'Execute 3D Print to Bed'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
