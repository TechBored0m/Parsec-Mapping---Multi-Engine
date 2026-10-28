import React from 'react';
import { Clock, Disc, Palette, Radio, ShieldCheck, Check } from 'lucide-react';
import { GameEnvironmentTheme } from '../types';
import { THEME_CONFIGS } from '../data/gameThemes';

interface SessionRecorderBarProps {
  sessionElapsedSeconds: number;
  activeTheme: GameEnvironmentTheme;
  onOpenSeedModal: () => void;
  onQuickRecord: () => void;
  justRecorded: boolean;
}

export const SessionRecorderBar: React.FC<SessionRecorderBarProps> = ({
  sessionElapsedSeconds,
  activeTheme,
  onOpenSeedModal,
  onQuickRecord,
  justRecorded,
}) => {
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const themeConfig = THEME_CONFIGS[activeTheme];

  return (
    <div className="fixed top-18 left-6 z-30 transition-all duration-300 pointer-events-auto">
      <div className="flex items-center gap-2 p-1.5 px-3 rounded-2xl bg-slate-950/85 border border-slate-800 shadow-2xl backdrop-blur-md text-xs text-slate-200">
        
        {/* Perpetual Scan Indicator */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono text-slate-300 font-semibold hidden sm:inline">
            PERPETUAL SCAN
          </span>
          <span className="text-[11px] font-mono font-bold text-amber-400 tabular-nums">
            {formatTimer(sessionElapsedSeconds)}
          </span>
        </div>

        {/* Active Theme Seed Button */}
        <button
          onClick={onOpenSeedModal}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-[11px] text-purple-300 font-medium transition-colors cursor-pointer group"
          title="Seed Rendering Engine with Game Theme"
        >
          <Palette className="w-3.5 h-3.5 text-purple-400 group-hover:rotate-45 transition-transform" />
          <span className="truncate max-w-[130px] font-mono">{themeConfig.name.split(':')[0]}</span>
        </button>

        {/* Record Save File Button */}
        <button
          onClick={onQuickRecord}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
            justRecorded
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
              : 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border-rose-500/40 hover:border-rose-400'
          }`}
          title="Record Current Hologram Session Save File"
        >
          {justRecorded ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Disc className="w-3 h-3 fill-current text-rose-400 animate-pulse" />
              <span>Record State</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
};
