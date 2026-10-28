import React from 'react';
import { Sliders, X, Eye, EyeOff, Layout, Sparkles, Check, RotateCcw, Monitor, Shield } from 'lucide-react';
import { HudConfig } from '../types';

interface HudConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: HudConfig;
  onChangeConfig: (newConfig: HudConfig) => void;
  onResetToDefaults: () => void;
}

export const DEFAULT_HUD_CONFIG: HudConfig = {
  showTopBar: true,
  showBottomDock: true,
  showSessionBar: true,
  showDossierCard: true,
  showFloorLabels: true,
  showTelemetryOverlay: true,
  hudDensity: 'standard',
  hudOpacity: 0.88,
  accentTheme: 'cyan',
};

export const HudConfigModal: React.FC<HudConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
  onResetToDefaults,
}) => {
  if (!isOpen) return null;

  const toggleField = (field: keyof HudConfig) => {
    onChangeConfig({
      ...config,
      [field]: !config[field],
    });
  };

  const applyPreset = (preset: 'default' | 'zen' | 'hangar' | 'clinical') => {
    if (preset === 'default') {
      onChangeConfig({ ...DEFAULT_HUD_CONFIG });
    } else if (preset === 'zen') {
      onChangeConfig({
        ...config,
        showTopBar: false,
        showBottomDock: true,
        showSessionBar: false,
        showDossierCard: false,
        showFloorLabels: false,
        showTelemetryOverlay: false,
        hudDensity: 'minimal',
        hudOpacity: 0.75,
      });
    } else if (preset === 'hangar') {
      onChangeConfig({
        ...config,
        showTopBar: true,
        showBottomDock: true,
        showSessionBar: true,
        showDossierCard: true,
        showFloorLabels: true,
        showTelemetryOverlay: true,
        hudDensity: 'compact',
        hudOpacity: 0.92,
        accentTheme: 'amber',
      });
    } else if (preset === 'clinical') {
      onChangeConfig({
        ...config,
        showTopBar: true,
        showBottomDock: true,
        showSessionBar: true,
        showDossierCard: true,
        showFloorLabels: true,
        showTelemetryOverlay: true,
        hudDensity: 'standard',
        hudOpacity: 0.95,
        accentTheme: 'emerald',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display">Configure Aerospace Vault HUD</h3>
              <p className="text-[11px] text-slate-400">Customize visibility, density, opacity, and color accents</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          
          {/* Preset Layouts */}
          <div className="space-y-2">
            <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">
              Quick HUD Layout Presets:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => applyPreset('default')}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-400 text-left transition-colors cursor-pointer"
              >
                <strong className="text-white block text-[11px]">Full Tactical</strong>
                <span className="text-[10px] text-slate-400">All tools visible</span>
              </button>

              <button
                onClick={() => applyPreset('zen')}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-400 text-left transition-colors cursor-pointer"
              >
                <strong className="text-white block text-[11px]">Cinema / Zen</strong>
                <span className="text-[10px] text-slate-400">Max 3D viewing</span>
              </button>

              <button
                onClick={() => applyPreset('hangar')}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400 text-left transition-colors cursor-pointer"
              >
                <strong className="text-amber-300 block text-[11px]">Flight Hangar</strong>
                <span className="text-[10px] text-slate-400">Vehicle focused</span>
              </button>

              <button
                onClick={() => applyPreset('clinical')}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-400 text-left transition-colors cursor-pointer"
              >
                <strong className="text-emerald-300 block text-[11px]">Clinical Med</strong>
                <span className="text-[10px] text-slate-400">Telemetry focus</span>
              </button>
            </div>
          </div>

          {/* Component Visibility Toggles */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800">
            <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">
              Interface Elements Visibility:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { key: 'showTopBar', label: 'Top Navigation Bar' },
                { key: 'showBottomDock', label: 'Bottom Control Dock' },
                { key: 'showSessionBar', label: 'Perpetual Scan Timer HUD' },
                { key: 'showDossierCard', label: 'Hologram Dossier Card' },
                { key: 'showFloorLabels', label: 'In-Scene 3D Floor Tags' },
                { key: 'showTelemetryOverlay', label: 'Vitals & Telemetry Badges' },
              ].map((item) => {
                const isEnabled = !!config[item.key as keyof HudConfig];
                return (
                  <label
                    key={item.key}
                    className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="text-slate-300 text-[11px]">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => toggleField(item.key as keyof HudConfig)}
                      className="sr-only"
                    />
                    <div
                      className={`w-8 h-4.5 rounded-full transition-colors p-0.5 ${
                        isEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                          isEnabled ? 'translate-x-3.5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* HUD Density & Opacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            {/* Density */}
            <div className="space-y-1.5">
              <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">
                Interface Density:
              </span>
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['compact', 'standard', 'minimal'] as const).map((density) => (
                  <button
                    key={density}
                    onClick={() => onChangeConfig({ ...config, hudDensity: density })}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-semibold capitalize transition-colors cursor-pointer ${
                      config.hudDensity === density
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {density}
                  </button>
                ))}
              </div>
            </div>

            {/* Opacity Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">HUD Opacity:</span>
                <span className="text-cyan-400 font-mono">{Math.round(config.hudOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.0"
                step="0.05"
                value={config.hudOpacity}
                onChange={(e) => onChangeConfig({ ...config, hudOpacity: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          {/* Accent Color Palette */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">
              HUD Color Accent:
            </span>
            <div className="flex items-center gap-2">
              {[
                { id: 'cyan', label: 'Cyan Cyber', color: '#00f0ff' },
                { id: 'amber', label: 'Old Republic Amber', color: '#f59e0b' },
                { id: 'emerald', label: 'Medical Emerald', color: '#10b981' },
                { id: 'purple', label: 'Grav-Singularity Purple', color: '#a855f7' },
                { id: 'rose', label: 'Sith Crimson', color: '#f43f5e' },
              ].map((accent) => (
                <button
                  key={accent.id}
                  onClick={() => onChangeConfig({ ...config, accentTheme: accent.id as any })}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition-all cursor-pointer ${
                    config.accentTheme === accent.id
                      ? 'border-white bg-slate-800 text-white font-bold'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: accent.color }}
                  />
                  <span>{accent.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/80 text-xs">
          <button
            onClick={onResetToDefaults}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
