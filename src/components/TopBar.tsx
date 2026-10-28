import React from 'react';
import { Scan, ShieldCheck, HeartPulse, Radio, Rocket, Sliders } from 'lucide-react';
import { VaultCameraMode } from '../types';

interface TopBarProps {
  onOpenScanner: () => void;
  onOpenArchives: () => void;
  onOpenSchematics: () => void;
  onOpenMedicalReview: () => void;
  onOpenHostedSessions: () => void;
  onOpenSeedModal: () => void;
  onOpenHangar?: () => void;
  onOpenHudConfig?: () => void;
  onSetCameraMode: (mode: VaultCameraMode) => void;
  hostedSessionsCount: number;
  vehiclesCount?: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenScanner,
  onOpenArchives,
  onOpenMedicalReview,
  onOpenHostedSessions,
  onOpenSeedModal,
  onOpenHangar,
  onOpenHudConfig,
  onSetCameraMode,
  hostedSessionsCount,
  vehiclesCount = 0,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between gap-4 px-6 py-3.5 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      {/* Zone 1: Single text element wordmark + Lock Decoupling Badge */}
      <div className="flex items-center gap-3">
        <div
          onClick={() => onSetCameraMode('bridge')}
          className="text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0 font-display cursor-pointer flex items-center gap-2"
        >
          <span className="text-cyan-400">PARSEC</span>
          <span>AEROSPACE VAULT</span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] text-emerald-300 font-mono">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>LOCK: DECOUPLED (PRIVACY SECURED)</span>
        </div>
      </div>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-300">
        <button
          onClick={() => onSetCameraMode('bridge')}
          className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Hologram Bridge
        </button>
        <button
          onClick={() => onSetCameraMode('bed')}
          className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Bio-Print Bed
        </button>
        {onOpenHangar && (
          <button
            onClick={onOpenHangar}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 text-amber-300"
          >
            <Rocket className="w-3.5 h-3.5 text-amber-400" />
            <span>Aerospace Hangar ({vehiclesCount})</span>
          </button>
        )}
        <button
          onClick={onOpenScanner}
          className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1"
        >
          <span>Scanner Exchange</span>
        </button>
        <button
          onClick={onOpenHostedSessions}
          className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 text-cyan-300"
        >
          <Radio className="w-3 h-3 text-cyan-400" />
          <span>Hosted Sessions ({hostedSessionsCount})</span>
        </button>
        <button
          onClick={onOpenMedicalReview}
          className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 text-emerald-300"
        >
          <HeartPulse className="w-3 h-3 text-emerald-400" />
          <span>Medical Review</span>
        </button>
        <button
          onClick={onOpenSeedModal}
          className="hover:text-purple-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 text-purple-300"
        >
          <span>Seed Engine &amp; Saves</span>
        </button>
        <button
          onClick={onOpenArchives}
          className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Archives
        </button>
      </nav>

      {/* Zone 3: Actions - HUD Config & Scan */}
      <div className="flex items-center gap-2.5 shrink-0">
        {onOpenHudConfig && (
          <button
            onClick={onOpenHudConfig}
            className="p-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            title="Configure HUD"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">HUD Config</span>
          </button>
        )}
        <button
          onClick={onOpenScanner}
          className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:brightness-110 rounded-xl shadow-lg shadow-cyan-500/20 transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <Scan className="w-3.5 h-3.5" />
          <span>Scan Document Exchange</span>
        </button>
      </div>
    </header>
  );
};
