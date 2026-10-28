import React, { useState } from 'react';
import { Camera, ChevronDown, ChevronUp, Volume2, VolumeX, Shield, Play, Eye, EyeOff, Focus, Rocket, Sliders } from 'lucide-react';
import { CHARACTERS_DATA } from '../data/characters';
import { CharacterRecord, PrintPhase, VaultCameraMode } from '../types';
import { soundEffects } from '../services/soundEffects';

interface BottomDockProps {
  selectedCharacter: CharacterRecord;
  onSelectCharacter: (char: CharacterRecord) => void;
  characters?: CharacterRecord[];
  cameraMode: VaultCameraMode;
  onSetCameraMode: (mode: VaultCameraMode) => void;
  printPhase: PrintPhase;
  onTriggerPrint: () => void;
  isCanopyOpen: boolean;
  onToggleCanopy: () => void;
  onOpenScanner: () => void;
  onOpenHangar?: () => void;
  onOpenHudConfig?: () => void;
  showFloorLabels: boolean;
  onToggleFloorLabels: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  selectedCharacter,
  onSelectCharacter,
  characters,
  cameraMode,
  onSetCameraMode,
  printPhase,
  onTriggerPrint,
  isCanopyOpen,
  onToggleCanopy,
  onOpenScanner,
  onOpenHangar,
  onOpenHudConfig,
  showFloorLabels,
  onToggleFloorLabels,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    soundEffects.setMuted(nextState);
  };

  const cameraOptions: { id: VaultCameraMode; label: string }[] = [
    { id: 'bridge', label: 'Hologram Bridge' },
    { id: 'focus', label: 'Hologram Focus' },
    { id: 'bed', label: 'Bio-Print Bed' },
    { id: 'terminal', label: 'Terminal Dock' },
    { id: 'overview', label: 'Overview' },
  ];

  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 w-[94vw] max-w-[940px] ${
        isCollapsed ? 'translate-y-[calc(100%-36px)]' : 'translate-y-0'
      }`}
    >
      {/* Collapse/Expand Tab Header */}
      <div className="flex justify-center">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="px-4 py-1.5 text-[11px] font-medium text-slate-400 hover:text-white bg-slate-900/90 hover:bg-slate-800 border-t border-x border-slate-800 rounded-t-xl backdrop-blur-md shadow-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Show Vault Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cinema Mode (Clear 3D View)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Glassmorphic Dock Container */}
      <div className="p-3 rounded-2xl bg-slate-950/85 border border-slate-800 shadow-2xl backdrop-blur-md space-y-2.5">
        {/* Top Strip: Quick Character Gallery & Primary Action */}
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Subject:</span>
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-2.5 py-1.5 rounded-xl">
              <img
                src={selectedCharacter.image}
                alt={selectedCharacter.name}
                className="w-7 h-7 rounded-lg object-cover border border-cyan-400/50"
                referrerPolicy="no-referrer"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-white leading-tight">{selectedCharacter.name}</div>
                <div className="text-[10px] text-cyan-400 font-mono leading-tight">{selectedCharacter.origin}</div>
              </div>
            </div>
          </div>

          {/* Quick subject select thumbnails */}
          <div className="flex items-center gap-1.5 shrink-0 max-w-[340px] overflow-x-auto scrollbar-none py-0.5">
            {(characters && characters.length > 0 ? characters : CHARACTERS_DATA).map((char) => (
              <button
                key={char.id}
                onClick={() => {
                  onSelectCharacter(char);
                  soundEffects.playHologramSelect();
                }}
                className={`w-8 h-8 rounded-lg overflow-hidden border transition-all cursor-pointer shrink-0 ${
                  selectedCharacter.id === char.id
                    ? 'border-cyan-400 ring-2 ring-cyan-500/30 scale-105'
                    : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                }`}
                title={char.name}
              >
                <img
                  src={char.image}
                  alt={char.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>

          {/* Print / Reconstitute Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onTriggerPrint}
              disabled={printPhase !== 'idle' && printPhase !== 'awakened'}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 ${
                selectedCharacter.chassisType === 'hk-cyborg' || selectedCharacter.chassisType === 'hk-droid'
                  ? 'text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 shadow-amber-500/25 hover:brightness-110'
                  : selectedCharacter.vehicleSpec
                  ? 'text-slate-950 bg-gradient-to-r from-indigo-300 via-sky-300 to-cyan-300 shadow-indigo-500/25 hover:brightness-110'
                  : 'text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 shadow-cyan-500/25 hover:brightness-110'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>
                {selectedCharacter.chassisType === 'hk-cyborg'
                  ? 'Print Felipe as HK Robot'
                  : selectedCharacter.vehicleSpec
                  ? `Fabricate ${selectedCharacter.name.split(' ')[0]} on Bed`
                  : `Print ${selectedCharacter.name.split(' ')[0]} to Bed`}
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Strip: Camera Modes, Floor Labels Toggle, Cryo Canopy, Mute */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800/80 text-xs">
          {/* Camera View Mode Pills */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <Camera className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
            {cameraOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onSetCameraMode(opt.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  cameraMode === opt.id
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Aerospace Hangar / Add Vehicle Shortcut */}
            {onOpenHangar && (
              <button
                onClick={onOpenHangar}
                className="px-2.5 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300 hover:bg-amber-900/50 transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
                title="Open Aerospace Vehicle Hangar"
              >
                <Rocket className="w-3.5 h-3.5 text-amber-400" />
                <span>+ Vehicles</span>
              </button>
            )}

            {/* HUD Config Shortcut */}
            {onOpenHudConfig && (
              <button
                onClick={onOpenHudConfig}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
                title="Configure HUD Elements"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>HUD</span>
              </button>
            )}

            {/* Toggle Floor In-Scene Labels */}
            <button
              onClick={onToggleFloorLabels}
              className={`px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer text-xs ${
                showFloorLabels
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
              }`}
              title="Toggle floor-level text plaques"
            >
              {showFloorLabels ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-amber-400" />}
              <span>{showFloorLabels ? 'Floor Tags' : 'Clean Stage'}</span>
            </button>

            {/* Canopy Toggle */}
            <button
              onClick={onToggleCanopy}
              className={`px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer text-xs ${
                isCanopyOpen
                  ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{isCanopyOpen ? 'Canopy Open' : 'Canopy Sealed'}</span>
            </button>

            {/* Manifest Scanner Shortcut */}
            <button
              onClick={onOpenScanner}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer text-xs"
            >
              Scan Passport
            </button>

            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
