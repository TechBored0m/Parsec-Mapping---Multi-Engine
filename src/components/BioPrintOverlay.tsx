import React, { useState } from 'react';
import { Cpu, Activity, Flame, Bot, EyeOff, Eye } from 'lucide-react';
import { CharacterRecord, PrintPhase } from '../types';

interface BioPrintOverlayProps {
  phase: PrintPhase;
  progress: number;
  character: CharacterRecord;
  onCancel: () => void;
}

export const BioPrintOverlay: React.FC<BioPrintOverlayProps> = ({
  phase,
  progress,
  character,
  onCancel,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (phase === 'idle' || phase === 'awakened') return null;

  const isRobot = character.chassisType === 'hk-cyborg' || character.chassisType === 'hk-droid';

  const getPhaseTitle = () => {
    switch (phase) {
      case 'scanning':
        return isRobot
          ? 'NEURAL MANIFEST EXTRACTION & CZERKA BLUEPRINT INGEST'
          : 'ARCHIVAL MANIFEST INGEST & LATTICE COMPUTATION';
      case 'synthesizing':
        return isRobot
          ? '3D SINTERING HK COPPER-BRONZE ARMOR & HYDRAULIC SERVOS'
          : 'MOLECULAR 3D BIO-PRINTING ONTO HIBERNATION BED';
      case 'venting':
        return isRobot
          ? 'CHASSIS COOL-DOWN & HK VOCODER PRIMING'
          : 'CRYO-CHAMBER DEPRESSURIZATION & REANIMATION';
      default:
        return 'RECONSTITUTION ACTIVE';
    }
  };

  const getPhaseDescription = () => {
    switch (phase) {
      case 'scanning':
        return isRobot
          ? `Mapping Felipe Zamora consciousness into HK-Z47 neural logic matrix...`
          : `Extracting genomic & neural tokens for ${character.name}...`;
      case 'synthesizing':
        return isRobot
          ? `Gantry dual-laser fusing rust-copper plating, spinal vertebrae, and mechanical talons...`
          : `Gantry laser beam laying down nanite cellular strands from feet to cranial structure...`;
      case 'venting':
        return isRobot
          ? `Purging nitrogen vapor, pressurizing hydraulic servos, lighting orange photoreceptors...`
          : `Purging nitrogen vapor, warming bio-gel mattress, triggering neuro-awakening shock...`;
      default:
        return '';
    }
  };

  return (
    <div className="fixed top-18 left-1/2 -translate-x-1/2 z-30 w-full max-w-lg px-4 pointer-events-none transition-all duration-300">
      {isMinimized ? (
        <div className="flex justify-center pointer-events-auto">
          <button
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/90 hover:bg-slate-900 border border-cyan-500/50 shadow-xl backdrop-blur-md text-xs text-white transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="font-mono text-cyan-400 font-bold">{progress}%</span>
            <span>Printing {character.name.split(' ')[0]}</span>
            <Eye className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      ) : (
        <div
          className={`p-3.5 rounded-2xl shadow-2xl backdrop-blur-md pointer-events-auto space-y-2.5 border ${
            isRobot
              ? 'bg-slate-950/90 border-amber-500/50 shadow-amber-500/10'
              : 'bg-slate-950/85 border-cyan-500/40'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isRobot ? (
                <Bot className="w-4 h-4 text-amber-400" />
              ) : (
                <Cpu className="w-4 h-4 text-cyan-400" />
              )}
              <span className={`text-xs font-bold tracking-wide font-display ${
                isRobot ? 'text-amber-200' : 'text-white'
              }`}>
                {getPhaseTitle()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-bold tabular-nums ${
                isRobot ? 'text-amber-400' : 'text-cyan-400'
              }`}>
                {progress}%
              </span>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                title="Minimize HUD (Clear 3D View)"
              >
                <EyeOff className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-150 ${
                isRobot
                  ? 'bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-300 shadow-[0_0_12px_#f59e0b]'
                  : 'bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 shadow-[0_0_12px_#00f0ff]'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Status description */}
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="truncate pr-2 text-[11px]">{getPhaseDescription()}</span>
            <span className="shrink-0 text-slate-400 text-[10px] font-mono">
              {isRobot ? 'HK-Z47 BED' : 'BED-01'}
            </span>
          </div>

          {/* Telemetry Row */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Activity className={`w-3 h-3 ${isRobot ? 'text-amber-400' : 'text-cyan-400'}`} />
              <span>
                {isRobot ? 'Chassis Sinter: ' : 'Cellular Matrix: '}
                <strong className="text-white font-mono">{Math.min(100, Math.floor(progress * 1.05))}%</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>Thermal: <strong className="text-white font-mono">{(34.2 + (progress / 100) * 2.8).toFixed(1)}°C</strong></span>
            </div>

            <button
              onClick={onCancel}
              className="text-[10px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
            >
              Abort Print
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
