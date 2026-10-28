import React, { useState } from 'react';
import { Eye, Focus, Play, Sparkles, Bot, ChevronRight, ChevronLeft, ShieldAlert } from 'lucide-react';
import { CharacterRecord, PrintPhase, VaultCameraMode } from '../types';

interface HologramDetailCardProps {
  character: CharacterRecord;
  cameraMode: VaultCameraMode;
  onSetCameraMode: (mode: VaultCameraMode) => void;
  onTriggerPrint: (character: CharacterRecord) => void;
  printPhase: PrintPhase;
  showFloorLabels: boolean;
  onToggleFloorLabels: () => void;
}

export const HologramDetailCard: React.FC<HologramDetailCardProps> = ({
  character,
  cameraMode,
  onSetCameraMode,
  onTriggerPrint,
  printPhase,
  showFloorLabels,
  onToggleFloorLabels,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const isRobot = character.chassisType === 'hk-cyborg' || character.chassisType === 'hk-droid';
  const isFocused = cameraMode === 'focus';

  return (
    <div className="fixed top-20 right-5 z-30 transition-all duration-300">
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 shadow-xl backdrop-blur-md text-xs text-slate-200 transition-colors cursor-pointer group"
          title="Expand Subject Dossier"
        >
          <ChevronLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-semibold">{character.name}</span>
          <span className="text-[10px] text-cyan-400 font-mono">Dossier</span>
        </button>
      ) : (
        <div className="w-80 md:w-88 p-4 rounded-2xl bg-slate-950/85 border border-slate-800 shadow-2xl backdrop-blur-md space-y-3.5 text-slate-200">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-11 h-11 rounded-lg object-cover border border-cyan-400/50 shadow-md"
                  referrerPolicy="no-referrer"
                />
                {isRobot && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border border-slate-950 flex items-center justify-center text-slate-950">
                    <Bot className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight font-display">{character.name}</h4>
                <p className="text-[11px] text-cyan-400 font-mono">{character.origin}</p>
              </div>
            </div>

            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
              title="Minimize Dossier (Unobstructed View)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Subtitle & Classification */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{character.subtitle}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                isRobot
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
              }`}
            >
              {character.category}
            </span>
          </div>

          {/* Lore / Description */}
          <p className="text-xs text-slate-300 leading-relaxed max-h-24 overflow-y-auto pr-1 scrollbar-thin">
            {character.description}
          </p>

          {/* Biometric Telemetry */}
          <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800/60 text-[11px] font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">CHASSIS TYPE:</span>
              <span className="text-white font-semibold">{character.chassisType.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">CRYO INDEX:</span>
              <span className="text-emerald-400 font-semibold">{character.cryoCompatibility}% COMPATIBLE</span>
            </div>
          </div>

          {/* Unobstructed View Controls */}
          <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
            {/* Focus Camera Toggle */}
            <button
              onClick={() => onSetCameraMode(isFocused ? 'bridge' : 'focus')}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                isFocused
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
              }`}
            >
              <Focus className="w-3.5 h-3.5" />
              <span>{isFocused ? 'Exit Focus' : 'Focus Hologram'}</span>
            </button>

            {/* Toggle Floor Labels */}
            <button
              onClick={onToggleFloorLabels}
              className={`py-1.5 px-2.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 cursor-pointer ${
                showFloorLabels
                  ? 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  : 'bg-amber-950/30 text-amber-300 border-amber-500/40'
              }`}
              title="Toggle floor-projected hologram labels"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showFloorLabels ? 'Hide Labels' : 'Show Labels'}</span>
            </button>
          </div>

          {/* Print Trigger */}
          <button
            onClick={() => onTriggerPrint(character)}
            disabled={printPhase !== 'idle' && printPhase !== 'awakened'}
            className={`w-full py-2 px-3 text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 ${
              isRobot
                ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 hover:brightness-110 shadow-amber-500/20'
                : 'bg-gradient-to-r from-cyan-400 to-sky-300 text-slate-950 hover:brightness-110 shadow-cyan-500/20'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>
              {character.chassisType === 'hk-cyborg'
                ? 'Print Felipe as HK Robot'
                : `Synthesize ${character.name.split(' ')[0]} onto Bed`}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
