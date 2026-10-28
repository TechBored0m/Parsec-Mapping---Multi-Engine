import { CharacterRecord, VehicleClass, VehicleSpec } from '../types';

export interface VehiclePresetTemplate {
  name: string;
  subtitle: string;
  origin: string;
  classification: string;
  vehicleClass: VehicleClass;
  image: string;
  manufacturer: string;
  propulsion: string;
  hyperdriveRating: string;
  primaryWeapons: string;
  shieldRating: string;
  crewCapacity: number;
  maxSublightSpeed: string;
  hullColor: string;
  glowColor: string;
  description: string;
  awakeningSpeech: string;
}

export const PRESET_VEHICLES: VehiclePresetTemplate[] = [
  {
    name: 'N-1 Starfighter (Beskar Chrome)',
    subtitle: 'Modified Nubian Snub-Fighter / Din Djarin Custom',
    origin: 'Naboo / Peli Motto Repair Bay (Tatooine)',
    classification: 'High-Velocity Custom Interceptor',
    vehicleClass: 'starfighter',
    image: '/assets/aistudio/IMG_3232_be0cc95c.jpeg',
    manufacturer: 'Theed Palace Space Vessel Engineering (Modified)',
    propulsion: 'Twin J-type Duralumin Sublight Engines + Turbonic Boost',
    hyperdriveRating: 'Class 0.7 Custom Monolithic Core',
    primaryWeapons: 'Dual Proton Torpedo Launchers + Twin Blaster Cannons',
    shieldRating: 'Military-Grade Deflector Array (980 SBD)',
    crewCapacity: 1,
    maxSublightSpeed: '1,350 km/h (Atmospheric) / 85 MGLT',
    hullColor: '#cbd5e1',
    glowColor: '#00f0ff',
    description: 'Stripped of yellow paint to bare chromium-silver Beskar alloy. Fitted with a custom turbonic turbopower boost and astromech droid dome converted for a young foundling.',
    awakeningSpeech: '[N-1 Starfighter Avionics: Sublight thrust matrix initialized. Turbonic booster pressurized. Hyperdrive spooling. Ready for hyperspace escape vector.]',
  },
  {
    name: 'Razor Crest Gunship (ST-70)',
    subtitle: 'Pre-Empire Military Surplus Gunship',
    origin: 'Outer Rim / Bounty Hunter Guild Registry',
    classification: 'Armored Patrol Craft / Carbonite Cell Carrier',
    vehicleClass: 'freighter',
    image: '/assets/aistudio/IMG_3232_be0cc95c.jpeg',
    manufacturer: 'Universal Defense Transport Systems',
    propulsion: 'Dual Sublight Ion Turbines with Lateral Maneuvering Jets',
    hyperdriveRating: 'Class 1.0 Military Grade',
    primaryWeapons: 'Twin Chin-Mounted Heavy Laser Cannons',
    shieldRating: 'Heavy Durasteel Reinforced Hull + Deflectors',
    crewCapacity: 3,
    maxSublightSpeed: '950 km/h / 65 MGLT',
    hullColor: '#78716c',
    glowColor: '#f59e0b',
    description: 'Rugged pre-Imperial gunship utilized for outer-rim patrol and tracking bounties. Equipped with an onboard carbon-freezing chamber and sleeping quarters.',
    awakeningSpeech: '[Razor Crest Navicomputer: Dual ion engines firing. Carbon-freezing array standby. Tracking fob link established. Awaiting pilot throttle input.]',
  },
  {
    name: 'Tarisian Swoop Speeder',
    subtitle: 'Sector-4 Championship High-G Racing Craft',
    origin: 'Upper Taris Undercity / Old Republic Arena',
    classification: 'Atmospheric Repulsorlift Swoop Racer',
    vehicleClass: 'speeder',
    image: '/assets/aistudio/IMG_2239_82035da9.jpeg',
    manufacturer: 'Czerka Motors Custom Racing Prototype',
    propulsion: 'High-Combustion Turbine + Dual Repulsorlift Skids',
    hyperdriveRating: 'None (Sub-Orbital Atmospheric Only)',
    primaryWeapons: 'None (Civilian / Illegal Afterburners Installed)',
    shieldRating: 'Light Inertial Damper Fairing',
    crewCapacity: 1,
    maxSublightSpeed: '680 km/h (Sea-Level Repulsor Glide)',
    hullColor: '#ea580c',
    glowColor: '#ff4400',
    description: 'Stripped-down aerodynamic engine block with handle controls. Built for extreme acceleration and death-defying turns in the lower-city swoop tracks of Taris.',
    awakeningSpeech: '[Swoop Engine Igniter: Turbine compressor spinning up to 34,000 RPM. Repulsorlift skids level. Afterburners primed for the starting grid!]',
  },
  {
    name: 'Constellation Frontier Exploration Rover',
    subtitle: 'Autonomous Surface Reconnaissance Vehicle',
    origin: 'Jemison / Constellation Lodge Hangar',
    classification: 'Planetary 6-Wheel All-Terrain Explorer',
    vehicleClass: 'rover',
    image: '/assets/aistudio/IMG_2697_06c9fc4d.jpeg',
    manufacturer: 'Stroud-Eklund Aerospace & Ground Exploration',
    propulsion: 'Hex-Wheel Independent Electric Hub Motors + Cold-Gas Jump Thrusters',
    hyperdriveRating: 'None (Surface Deployment Vehicle)',
    primaryWeapons: 'High-Energy Mining Laser & Geological Core Drill',
    shieldRating: 'Pressurized Micrometeorite Thermal Insulation',
    crewCapacity: 2,
    maxSublightSpeed: '110 km/h (Extreme Low-Gravity Terrain)',
    hullColor: '#f8fafc',
    glowColor: '#6366f1',
    description: 'High-durability all-terrain rover built to cross airless lunar surfaces, planetary crags, and gravitational anomaly sites with onboard geological telemetry.',
    awakeningSpeech: '[Rover Telemetry Core: Hex-wheel drive active. Ground-penetrating radar scanning bedrock. Environmental life support hermetically sealed.]',
  },
];

export function buildVehicleRecord(
  template: VehiclePresetTemplate,
  existingCount: number
): CharacterRecord {
  const vehicleId = `vehicle-${template.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;

  // Place newly added vehicles on alternating side pedestals
  const side = existingCount % 2 === 0 ? 6 : -6;
  const zPosition = -4 - Math.floor(existingCount / 2) * 3.5;

  const vehicleSpec: VehicleSpec = {
    vehicleClass: template.vehicleClass,
    manufacturer: template.manufacturer,
    propulsion: template.propulsion,
    hyperdriveRating: template.hyperdriveRating,
    primaryWeapons: template.primaryWeapons,
    shieldRating: template.shieldRating,
    crewCapacity: template.crewCapacity,
    maxSublightSpeed: template.maxSublightSpeed,
    hullColor: template.hullColor,
    glowColor: template.glowColor,
  };

  return {
    id: vehicleId,
    name: template.name,
    subtitle: template.subtitle,
    category: 'Vessel/Tech',
    chassisType: 'human', // Uses assembly bed sintering
    image: template.image,
    origin: template.origin,
    classification: template.classification,
    bioHash: `VESSEL-RIG-${Math.floor(Math.random() * 899999 + 100000)}`,
    cryoCompatibility: 100.0,
    description: template.description,
    awakeningSpeech: template.awakeningSpeech,
    awakeningSubtext: 'The aerospace vessel avionics ignite with high-frequency thruster whine as status telemetry pulses across the vault assembly bed.',
    voicePitch: 0.75,
    voiceRate: 1.1,
    vehicleSpec,
    dialogueTree: [
      {
        question: `Run full pre-flight diagnostic on ${template.name}.`,
        answer: `Avionics Report: Sublight engines at 100% nominal. Shield generators holding 100% capacity. Propulsion: ${template.propulsion}. Systems green for launch!`
      },
      {
        question: 'Verify weapon payloads and navigation computer.',
        answer: `Armament Status: ${template.primaryWeapons || 'Unarmed Scientific Scout'}. Hyperdrive rating: ${template.hyperdriveRating || 'Sub-orbital'}. Navicomputer synchronized with Parsec Gateway.`
      }
    ],
    pedestalPosition: [side, 0, zPosition],
  };
}
