import React, { useState } from 'react';
import {
  Rocket,
  Plus,
  Check,
  Shield,
  Zap,
  Gauge,
  Navigation,
  X,
  Compass,
  Sparkles,
  ArrowRight,
  Sliders,
  Radio
} from 'lucide-react';
import { CharacterRecord, VehicleClass, VehicleSpec } from '../types';
import { PRESET_VEHICLES, buildVehicleRecord, VehiclePresetTemplate } from '../data/vehiclePresets';
import { soundEffects } from '../services/soundEffects';

interface VehicleHangarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVehicle: (newVehicle: CharacterRecord) => void;
  existingVehiclesCount: number;
  onSelectAndFocus: (vehicle: CharacterRecord) => void;
  activeVehicles: CharacterRecord[];
}

export const VehicleHangarModal: React.FC<VehicleHangarModalProps> = ({
  isOpen,
  onClose,
  onAddVehicle,
  existingVehiclesCount,
  onSelectAndFocus,
  activeVehicles,
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'forge' | 'active'>('catalog');

  // Custom Vehicle Forge Form
  const [customName, setCustomName] = useState('N-1 Starfighter (Beskar Chrome)');
  const [customClass, setCustomClass] = useState<VehicleClass>('starfighter');
  const [customManufacturer, setCustomManufacturer] = useState('Theed Palace / Custom Mandalorian Forge');
  const [customOrigin, setCustomOrigin] = useState('Naboo / Tatooine Outer Rim');
  const [customPropulsion, setCustomPropulsion] = useState('Twin J-type Sublight Engines + Turbonic Boost');
  const [customHyperdrive, setCustomHyperdrive] = useState('Class 0.7 Custom Core');
  const [customWeapons, setCustomWeapons] = useState('Twin Blaster Cannons + Proton Torpedoes');
  const [customShields, setCustomShields] = useState('Deflector Array (980 SBD)');
  const [customHullColor, setCustomHullColor] = useState('#cbd5e1');
  const [customGlowColor, setCustomGlowColor] = useState('#00f0ff');
  const [customDescription, setCustomDescription] = useState('Custom high-velocity starfighter stripped to bare chromium Beskar alloy with foundling observation dome.');

  if (!isOpen) return null;

  const handleAddPreset = (template: VehiclePresetTemplate) => {
    const newRecord = buildVehicleRecord(template, existingVehiclesCount);
    onAddVehicle(newRecord);
    soundEffects.playHologramSelect();
    onSelectAndFocus(newRecord);
    onClose();
  };

  const handleForgeCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const template: VehiclePresetTemplate = {
      name: customName,
      subtitle: `${customClass.toUpperCase()} / ${customManufacturer}`,
      origin: customOrigin,
      classification: `${customClass.toUpperCase()} Class Aerospace Vessel`,
      vehicleClass: customClass,
      image: '/assets/aistudio/IMG_3232_be0cc95c.jpeg',
      manufacturer: customManufacturer,
      propulsion: customPropulsion,
      hyperdriveRating: customHyperdrive,
      primaryWeapons: customWeapons,
      shieldRating: customShields,
      crewCapacity: 1,
      maxSublightSpeed: '1,200 km/h / 80 MGLT',
      hullColor: customHullColor,
      glowColor: customGlowColor,
      description: customDescription,
      awakeningSpeech: `[${customName} Avionics Core: Sublight thrusters online. Hyperdrive spooling to 100%. Deflector shields energized. Ready for launch!]`,
    };

    const newRecord = buildVehicleRecord(template, existingVehiclesCount);
    onAddVehicle(newRecord);
    soundEffects.playHologramSelect();
    onSelectAndFocus(newRecord);
    onClose();
  };

  const deployedVehicles = activeVehicles.filter(
    (c) => c.category === 'Vessel/Tech' || !!c.vehicleSpec
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/75">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-display">Aerospace Vehicle Hangar &amp; Shipyard</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {deployedVehicles.length} VESSELS IN VAULT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Deploy Starfighters, Freighters, Swoop Speeders, and Planetary Rovers into 3D Hologram Bridge
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
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'catalog'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Rocket className="w-3.5 h-3.5 text-cyan-400" />
            Vessel Catalog ({PRESET_VEHICLES.length} Available)
          </button>

          <button
            onClick={() => setActiveTab('forge')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'forge'
                ? 'border-amber-400 text-amber-300 bg-amber-950/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            Forge Custom Vehicle
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'active'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            Deployed in Vault ({deployedVehicles.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* TAB 1: VEHICLE CATALOG */}
          {activeTab === 'catalog' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Select any iconic vessel to deploy onto the 3D Hologram Bridge or assemble onto the Cryo-Bed:
                </span>
                <span className="text-cyan-400 font-mono text-[11px]">
                  ALL VESSELS SINTERABLE
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PRESET_VEHICLES.map((vehicle) => {
                  const alreadyDeployed = activeVehicles.some((v) => v.name === vehicle.name);
                  return (
                    <div
                      key={vehicle.name}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white font-display">{vehicle.name}</h4>
                              <span className="text-[10px] px-2 py-0.5 rounded font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                {vehicle.vehicleClass}
                              </span>
                            </div>
                            <p className="text-[11px] text-cyan-400 font-mono">{vehicle.manufacturer}</p>
                          </div>

                          <div
                            className="w-4 h-4 rounded-full border border-slate-700 shrink-0"
                            style={{ backgroundColor: vehicle.hullColor }}
                            title="Hull Finish"
                          />
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed text-[11px]">
                          {vehicle.description}
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                          <div>
                            <span className="text-slate-400 block text-[9px]">PROPULSION</span>
                            <span className="text-slate-200 truncate block">{vehicle.propulsion}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px]">ARMAMENT</span>
                            <span className="text-slate-200 truncate block">{vehicle.primaryWeapons}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {vehicle.maxSublightSpeed}
                        </span>

                        <button
                          onClick={() => handleAddPreset(vehicle)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            alreadyDeployed
                              ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 hover:bg-slate-700'
                              : 'bg-gradient-to-r from-cyan-400 to-sky-300 text-slate-950 shadow-md shadow-cyan-500/20 hover:brightness-110'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{alreadyDeployed ? 'Focus in 3D' : 'Deploy to 3D Bridge'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOM VEHICLE FORGE */}
          {activeTab === 'forge' && (
            <form onSubmit={handleForgeCustom} className="space-y-4 max-w-2xl mx-auto">
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 block">Custom Aerospace Vehicle Specifications</strong>
                  <span className="text-slate-300 text-[11px]">
                    Configure your vessel’s silhouette class, propulsion system, armament, and finishes. When forged, it spawns directly into the 3D vault with full holographic telemetry!
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Vehicle / Starship Name</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                    placeholder="e.g. Incom T-65B X-Wing"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Vehicle Class / 3D Silhouette</label>
                  <select
                    value={customClass}
                    onChange={(e) => setCustomClass(e.target.value as VehicleClass)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400 capitalize"
                  >
                    <option value="starfighter">Starfighter / Interceptor (Needle Hull &amp; Wing Nacelles)</option>
                    <option value="freighter">Light Freighter / Gunship (Heavy Armored Hull)</option>
                    <option value="speeder">Repulsor Swoop Speeder (Low-Slung Racing Chassis)</option>
                    <option value="rover">Planetary Rover (6-Wheel All-Terrain Explorer)</option>
                    <option value="stealth-drone">Stealth Wingman Drone (Supersonic Diamond Wedge)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Manufacturer / Builder</label>
                  <input
                    type="text"
                    value={customManufacturer}
                    onChange={(e) => setCustomManufacturer(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                    placeholder="e.g. Corellian Engineering Corporation"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Origin Sector / System</label>
                  <input
                    type="text"
                    value={customOrigin}
                    onChange={(e) => setCustomOrigin(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                    placeholder="e.g. Kuat Drive Yards"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Propulsion &amp; Engines</label>
                  <input
                    type="text"
                    value={customPropulsion}
                    onChange={(e) => setCustomPropulsion(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                    placeholder="e.g. Quad Fusial Ion Turbines"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Hyperdrive Rating</label>
                  <input
                    type="text"
                    value={customHyperdrive}
                    onChange={(e) => setCustomHyperdrive(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                    placeholder="e.g. Class 1.0 (Backup Class 8.0)"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Primary Armament</label>
                  <input
                    type="text"
                    value={customWeapons}
                    onChange={(e) => setCustomWeapons(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                    placeholder="e.g. 4 Taim &amp; Bak Laser Cannons"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Deflector Shields / Armor</label>
                  <input
                    type="text"
                    value={customShields}
                    onChange={(e) => setCustomShields(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                    placeholder="e.g. Chempat Deflector Array"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 text-xs">Vessel Lore &amp; Description</label>
                <textarea
                  rows={2}
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all cursor-pointer"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Forge &amp; Deploy Vehicle to 3D Vault</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: ACTIVE DEPLOYED VESSELS */}
          {activeTab === 'active' && (
            <div className="space-y-4">
              <span className="text-slate-400 text-xs">
                Vessels currently rendered on the 3D Hologram Bridge pedestals:
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {deployedVehicles.map((v) => (
                  <div
                    key={v.id}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-white">{v.name}</strong>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {v.vehicleSpec?.vehicleClass || 'VESSEL'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{v.subtitle}</p>
                    </div>

                    <button
                      onClick={() => {
                        onSelectAndFocus(v);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <span>Focus 3D View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/80 text-xs">
          <span className="text-slate-400">
            Total Hangar Registry: <strong className="text-white">{deployedVehicles.length} Active</strong>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
