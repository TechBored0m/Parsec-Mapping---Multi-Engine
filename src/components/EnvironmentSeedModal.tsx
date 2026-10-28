import React, { useState } from 'react';
import {
  Palette,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BookOpen,
  Save,
  Download,
  RotateCcw,
  Sparkles,
  Layers,
  Cpu,
  Clock,
  Radio,
  X,
  FileCheck,
  Disc,
  Play
} from 'lucide-react';
import { GameEnvironmentTheme, CompatibilityCheckResult, HologramSaveFile, CharacterRecord } from '../types';
import { THEME_CONFIGS, COMPATIBILITY_DATABASE, ACADEMIC_CURRICULUM_TOPICS } from '../data/gameThemes';
import { soundEffects } from '../services/soundEffects';

interface EnvironmentSeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTheme: GameEnvironmentTheme;
  onSelectTheme: (theme: GameEnvironmentTheme) => void;
  sessionElapsedSeconds: number;
  onResetSession: () => void;
  saveFiles: HologramSaveFile[];
  onRecordSaveFile: (notes?: string) => void;
  onLoadSaveFile: (saveFile: HologramSaveFile) => void;
  selectedCharacter: CharacterRecord;
}

export const EnvironmentSeedModal: React.FC<EnvironmentSeedModalProps> = ({
  isOpen,
  onClose,
  activeTheme,
  onSelectTheme,
  sessionElapsedSeconds,
  onResetSession,
  saveFiles,
  onRecordSaveFile,
  onLoadSaveFile,
  selectedCharacter,
}) => {
  const [activeTab, setActiveTab] = useState<'themes' | 'compatibility' | 'academic' | 'saves'>('themes');
  const [selectedScanId, setSelectedScanId] = useState<string>(COMPATIBILITY_DATABASE[0].scanId);
  const [customSaveNotes, setCustomSaveNotes] = useState('');
  const [justRecorded, setJustRecorded] = useState(false);

  if (!isOpen) return null;

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRecord = () => {
    onRecordSaveFile(customSaveNotes);
    setJustRecorded(true);
    setCustomSaveNotes('');
    soundEffects.playHologramSelect();
    setTimeout(() => setJustRecorded(false), 3000);
  };

  const selectedScan = COMPATIBILITY_DATABASE.find((s) => s.scanId === selectedScanId) || COMPATIBILITY_DATABASE[0];

  const downloadSaveFile = (file: HologramSaveFile) => {
    const blob = new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.saveId}-${file.subjectName.replace(/\s+/g, '_')}.parsec-save.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-950/75">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-display">
                  Rendering Engine Seeding &amp; Academic Compatibility
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  SESSION-BOUND
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Seed game environments · Academic compatibility analyzer · Perpetual session records &amp; save files
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center px-6 pt-2 border-b border-slate-800 gap-2 bg-slate-950/40 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('themes')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'themes'
                ? 'border-purple-400 text-purple-300 bg-purple-950/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-purple-400" />
            Seed Environment ({Object.keys(THEME_CONFIGS).length} Themes)
          </button>

          <button
            onClick={() => setActiveTab('compatibility')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'compatibility'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Disc className="w-3.5 h-3.5 text-cyan-400" />
            Game Compatibility Analyzer
          </button>

          <button
            onClick={() => setActiveTab('academic')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'academic'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            Academic Curriculum
          </button>

          <button
            onClick={() => setActiveTab('saves')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'saves'
                ? 'border-amber-400 text-amber-300 bg-amber-950/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            Perpetual Scans &amp; Save Files ({saveFiles.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: GAME ENVIRONMENT SEEDING */}
          {activeTab === 'themes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Select a game universe seed to re-render the 3D vault lighting, conduits, fog, and materials:
                </span>
                <span className="text-purple-400 font-mono text-[11px]">
                  ACTIVE SEED: {THEME_CONFIGS[activeTheme].name}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {(Object.keys(THEME_CONFIGS) as GameEnvironmentTheme[]).map((themeKey) => {
                  const theme = THEME_CONFIGS[themeKey];
                  const isActive = activeTheme === themeKey;
                  return (
                    <div
                      key={theme.id}
                      onClick={() => {
                        onSelectTheme(themeKey);
                        soundEffects.playHologramSelect();
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isActive
                          ? 'bg-purple-950/40 border-purple-400 shadow-lg shadow-purple-500/15 ring-1 ring-purple-400'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white font-display">{theme.name}</h4>
                          {isActive && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-purple-500 text-slate-950">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-purple-300 font-mono">{theme.universe}</p>
                        <p className="text-[11px] text-slate-400 leading-snug">{theme.description}</p>
                      </div>

                      {/* Swatch palette visualizer */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">Engine Palette:</span>
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-3.5 h-3.5 rounded-full border border-slate-700"
                            style={{ backgroundColor: `#${theme.keyLightColor.toString(16).padStart(6, '0')}` }}
                            title="Key Light"
                          />
                          <div
                            className="w-3.5 h-3.5 rounded-full border border-slate-700"
                            style={{ backgroundColor: `#${theme.trenchColor.toString(16).padStart(6, '0')}` }}
                            title="Trench Energy Conduit"
                          />
                          <div
                            className="w-3.5 h-3.5 rounded-full border border-slate-700"
                            style={{ backgroundColor: `#${theme.rimColor.toString(16).padStart(6, '0')}` }}
                            title="Rim Lighting"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: GAME & DOCUMENT COMPATIBILITY ANALYZER */}
          {activeTab === 'compatibility' && (
            <div className="space-y-5">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-start gap-2.5">
                <Disc className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-semibold text-white">Academic Compatibility Inspection Engine</div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Select any scanned game format, ROM, or biometric document below to inspect whether it is mathematically and physically compatible with the 3D rendering pipeline and cryo-printing bed. If incompatible, the engine provides an in-depth academic explanation detailing why it failed.
                  </p>
                </div>
              </div>

              {/* Scan Selector Chips */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {COMPATIBILITY_DATABASE.map((item) => (
                  <button
                    key={item.scanId}
                    onClick={() => {
                      setSelectedScanId(item.scanId);
                      soundEffects.playScannerSweep();
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-2 transition-all cursor-pointer ${
                      selectedScanId === item.scanId
                        ? 'bg-slate-800 border-cyan-400 text-white font-semibold shadow'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item.isCompatible ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <span className="truncate max-w-[200px]">{item.sourceTitle}</span>
                  </button>
                ))}
              </div>

              {/* Detailed Academic Analysis Card */}
              <div className={`p-4 rounded-xl border space-y-4 ${
                selectedScan.isCompatible
                  ? 'bg-slate-950/90 border-emerald-500/40'
                  : 'bg-slate-950/90 border-rose-500/40'
              }`}>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    {selectedScan.isCompatible ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-400" />
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white">{selectedScan.sourceTitle}</h4>
                      <p className="text-[11px] text-slate-400">{selectedScan.mediaType}</p>
                    </div>
                  </div>

                  <span className={`text-xs px-2.5 py-1 rounded font-mono font-bold border ${
                    selectedScan.isCompatible
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}>
                    {selectedScan.isCompatible ? 'COMPATIBLE TO SEED' : selectedScan.failureCode || 'INCOMPATIBLE'}
                  </span>
                </div>

                {/* Academic In-Depth Explanation (Core User Request) */}
                <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs">
                  <span className={`font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5 ${
                    selectedScan.isCompatible ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    <BookOpen className="w-3.5 h-3.5" />
                    Academic Architectural Diagnosis:
                  </span>
                  <p className="text-slate-200 leading-relaxed text-[11px]">
                    {selectedScan.academicDiagnosis}
                  </p>
                </div>

                {/* Technical Specs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-[11px] font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">PIPELINE</span>
                    <span className="text-white truncate block">{selectedScan.technicalSpecs.pipeline}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">VERTEX FORMAT</span>
                    <span className="text-white truncate block">{selectedScan.technicalSpecs.vertexFormat}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">SHADER MODEL</span>
                    <span className="text-white truncate block">{selectedScan.technicalSpecs.shaderModel}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">RESONANCE FREQUENCY</span>
                    <span className="text-cyan-400 block">{selectedScan.technicalSpecs.cryoResonanceGhz} GHz</span>
                  </div>
                </div>

                {/* Remediation Pathway */}
                <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800/80 text-xs">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Remediation Pathway:</span>
                  <span className="text-slate-300 text-[11px]">{selectedScan.remediationPath}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACADEMIC CURRICULUM (Session-Bound Learning) */}
          {activeTab === 'academic' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 text-xs space-y-1">
                <div className="font-bold text-emerald-300 font-display">
                  Session-Scoped Academic Curriculum
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  This academic syllabus is dynamically provisioned per session. It provides university-grade instruction on photogrammetry, PBR lighting, lock decoupling, and cybernetic convergence. Information resets when a new session is initialized.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {ACADEMIC_CURRICULUM_TOPICS.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs"
                  >
                    <h4 className="text-xs font-bold text-white font-display">{topic.title}</h4>
                    <p className="text-[11px] text-cyan-400 font-mono">{topic.abstract}</p>
                    <p className="text-[11px] text-slate-300 leading-relaxed pt-1 border-t border-slate-800/80">
                      {topic.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PERPETUAL SCANS & SAVE FILE GENERATOR (RECORD BUTTON) */}
          {activeTab === 'saves' && (
            <div className="space-y-5">
              {/* Perpetual Session Status Bar */}
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-display">
                      Perpetual Scanner Loop: Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Documents are scanned perpetually per session. A new scan resets the session while preserving recorded save files.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono">SESSION TIMER</span>
                    <span className="text-base font-bold text-amber-400 font-mono">
                      {formatTimer(sessionElapsedSeconds)}
                    </span>
                  </div>

                  <button
                    onClick={onResetSession}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                    title="Reset Session Timer and Clear Transient Cache"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Record / Save State Generator (Core User Request) */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Save className="w-4 h-4 text-amber-400" />
                    Record &amp; Generate Save File Information (Hologram Snapshot)
                  </span>
                  {justRecorded && (
                    <span className="text-[11px] text-emerald-400 font-bold font-mono">
                      ✓ SESSION SNAPSHOT RECORDED!
                    </span>
                  )}
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Clicking record captures a complete cryptographic snapshot of your current hologram scan context: active game seed ({THEME_CONFIGS[activeTheme].name}), subject ({selectedCharacter.name}), biometric telemetries, and decoupled privacy token.
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customSaveNotes}
                    onChange={(e) => setCustomSaveNotes(e.target.value)}
                    placeholder="Optional notes for this save record (e.g. Felipe HK Convergence Session 01)..."
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={handleRecord}
                    className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Disc className="w-3.5 h-3.5 fill-current text-slate-950" />
                    <span>Record Save File</span>
                  </button>
                </div>
              </div>

              {/* Recorded Save Files List */}
              <div className="space-y-2.5">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Vault Save File Library ({saveFiles.length} Records):
                </span>

                {saveFiles.length === 0 ? (
                  <div className="p-6 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-400">
                    No save records created yet. Click &quot;Record Save File&quot; above to capture your first session snapshot.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {saveFiles.map((save) => (
                      <div
                        key={save.saveId}
                        className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <strong className="text-white">{save.saveTitle}</strong>
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {save.saveId}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            Subject: <span className="text-cyan-400">{save.subjectName}</span> · Seed: {save.environmentTheme} · Elapsed: {formatTimer(save.sessionElapsedSeconds)}
                          </div>
                          {save.academicSessionNotes && (
                            <p className="text-[11px] text-slate-300 italic">{save.academicSessionNotes}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => {
                              onLoadSaveFile(save);
                              onClose();
                            }}
                            className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Load State</span>
                          </button>

                          <button
                            onClick={() => downloadSaveFile(save)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-md bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                            title="Download .parsec-save.json"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/80 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Theme: <strong className="text-white font-medium">{THEME_CONFIGS[activeTheme].name}</strong></span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Close &amp; Return to Vault
          </button>
        </div>

      </div>
    </div>
  );
};
