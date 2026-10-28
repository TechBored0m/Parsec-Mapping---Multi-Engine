import React, { useState } from 'react';
import { X, Layers, ExternalLink, Play, Sparkles } from 'lucide-react';
import { CHARACTERS_DATA } from '../data/characters';
import { CharacterRecord } from '../types';

interface VaultArchivesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAndPrint: (char: CharacterRecord) => void;
  initialTab?: 'archives' | 'schematics';
}

export const VaultArchivesModal: React.FC<VaultArchivesModalProps> = ({
  isOpen,
  onClose,
  onSelectAndPrint,
  initialTab = 'archives',
}) => {
  const [tab, setTab] = useState<'archives' | 'schematics'>(initialTab);

  if (!isOpen) return null;

  const schematics = [
    {
      title: 'Parsec Arrival & Hibernation Gate',
      source: 'cite: FAMILY TRUST / Sector 4A-Z',
      image: '/assets/aistudio/IMG_2294_4b8ead27.jpeg',
      description:
        'Arrival Gate Station L-6, featuring gate assembly, calibration matrix, manifest status holograph, and cryogenic arrival beds resting on geological stratum layers.',
    },
    {
      title: 'G-EDA Upgrade: OEM Design & Print Node',
      source: 'ISO-Space 7-4 Lab Specification',
      image: '/assets/aistudio/IMG_1974_1151e8d1.jpeg',
      description:
        'Containment enclosure with ID-7 Inertial Dampener Array, PTFE electrical insulation layer, aerogel ceramic thermal shielding, and heavy braided sync ports.',
    },
    {
      title: 'MQ-28 Ghost Bat Autonomous Wingman (In-Flight Launch)',
      source: 'Airpower Teaming System Flight Test',
      image: '/assets/aistudio/IMG_1869_56efc90a.jpeg',
      description:
        'Autonomous aerospace strike platform launching medium-range ordnance during high-altitude supersonic test sortie.',
    },
    {
      title: 'MQ-28 Ghost Bat Autonomous Aircraft (Tarmac)',
      source: 'Aerospace Fleet Verification',
      image: '/assets/aistudio/IMG_1868_b4234411.jpeg',
      description:
        'Stealth uncrewed combat aerial vehicle on runway tarmac displaying faceted radar-absorbent chine and canted vertical stabilizers.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">Aerospace Vault Database &amp; Schematics</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>9 Holographic Entities</span>
                <span>·</span>
                <span>Parsec Gate Blueprint</span>
                <span>·</span>
                <span>Biometric Manifest Repository</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center px-6 pt-3 border-b border-slate-800 gap-2 bg-slate-950/40">
          <button
            onClick={() => setTab('archives')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
              tab === 'archives'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Galactic Character Archives ({CHARACTERS_DATA.length})
          </button>
          <button
            onClick={() => setTab('schematics')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
              tab === 'schematics'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Aerospace Vault Schematics ({schematics.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {tab === 'archives' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CHARACTERS_DATA.map((char) => (
                <div
                  key={char.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden flex flex-col group hover:border-cyan-500/40 transition-all"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src={char.image}
                      alt={char.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-950/80 border border-slate-700 text-cyan-300">
                      {char.category}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-bold text-white text-sm font-display">{char.name}</h3>
                      <div className="text-xs text-cyan-400 font-medium mb-1">{char.subtitle}</div>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {char.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <div className="text-[11px] text-slate-400">
                        Cryo Fit: <span className="text-emerald-400 font-mono font-bold">{char.cryoCompatibility}%</span>
                      </div>
                      <button
                        onClick={() => {
                          onSelectAndPrint(char);
                          onClose();
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Print to Bed</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'schematics' && (
            <div className="space-y-6">
              {schematics.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 grid grid-cols-1 md:grid-cols-12 gap-5 items-center"
                >
                  <div className="md:col-span-5 rounded-lg overflow-hidden border border-slate-700 bg-black aspect-[16/10]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="md:col-span-7 space-y-2">
                    <div className="text-[11px] font-mono text-cyan-400 uppercase">{item.source}</div>
                    <h3 className="text-base font-bold text-white font-display">{item.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                    <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
                      <span>Integrated into Parsec 3D Vault Engine</span>
                      <span>·</span>
                      <span className="text-emerald-400">Archival Status: Synchronized</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-950/70 text-xs text-slate-400">
          <span>Parsec Arrival &amp; Hibernation Gate — Sector 4A-Z</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
