import { CharacterRecord, ScanManifest } from '../types';

export const PASSPORT_MANIFEST: ScanManifest = {
  documentType: 'PASSPORT / PASSEPORT / PASAPORTE',
  holderName: 'FELIPE ZAMORA',
  surname: 'ZAMORA',
  givenNames: 'FELIPE',
  nationality: 'UNITED STATES OF AMERICA',
  dateOfBirth: '24 Apr 1993',
  placeOfBirth: 'CALIFORNIA, U.S.A.',
  issueDate: '23 Nov 2007',
  expirationDate: '22 Nov 2012',
  idNumber: 'USA-072493-CA',
  photoUrl: '/assets/aistudio/7A4821E9-E99A-42E0-A041-580B3F7A3F5C_74d11eb2.jpeg',
  targetChassis: 'human',
  status: 'Ready For Print',
};

export const NEVADA_ID_MANIFEST: ScanManifest = {
  documentType: 'STATE OF NEVADA EMPLOYEE CREDENTIAL',
  holderName: 'FELIPE ZAMORA',
  surname: 'ZAMORA',
  givenNames: 'FELIPE',
  nationality: 'STATE OF NEVADA, USA',
  dateOfBirth: '24 Apr 1993',
  placeOfBirth: 'CALIFORNIA, U.S.A.',
  issueDate: 'ACTIVE CREDENTIAL',
  expirationDate: '12/26/2026',
  idNumber: '2400010392',
  category: 'CANNABIS EMPLOYEE / DISPENSARY',
  photoUrl: '/assets/aistudio/7A4821E9-E99A-42E0-A041-580B3F7A3F5C_74d11eb2.jpeg',
  targetChassis: 'hk-cyborg',
  status: 'Ready For Print',
};

export const CHARACTERS_DATA: CharacterRecord[] = [
  {
    id: 'hk-felipe',
    name: 'HK-Felipe (HK-Z47)',
    subtitle: 'Felipe Zamora Transferred into HK-Series Droid',
    category: 'Cyborg',
    chassisType: 'hk-cyborg',
    image: '/assets/aistudio/IMG_2239_82035da9.jpeg',
    origin: 'Nevada / California / Czerka Cyber-Foundry',
    classification: 'Neuro-Transferred Cybernetic Hunter-Killer',
    bioHash: 'NEURAL-ZAMORA-HK47-FUSION-01',
    cryoCompatibility: 99.8,
    isRobotVocoder: true,
    description: 'The ultimate synthesis: Felipe Zamora\'s human consciousness, memories, and personality merged into a combat-grade HK Assassin Droid chassis with copper-bronze plating, pneumatic servos, and targeting optics.',
    awakeningSpeech: '...Audio vocoder online. Query: Where... where am I? What happened? Statement: My organic memory registers as Felipe Zamora from Nevada and California... but my sensory telemetry indicates I am encased in a heavy-duty HK-Series Assassin Droid chassis! Exclamation: Look at these pneumatic copper hands! Did you just 3D-print me as an HK robot?!',
    awakeningSubtext: 'The newly printed HK-Felipe raises heavy bronze mechanical hands to examine hydraulic fingers, orange photoreceptors flaring with astonishment on the cryo bed.',
    voicePitch: 0.65,
    voiceRate: 0.92,
    dialogueTree: [
      {
        question: 'Felipe, how does the HK droid chassis feel compared to your biological body?',
        answer: 'Sensory Analysis: Incredible! My human thoughts are processing at 400 gigahertz through a Czerka logic core. No fatigue, no headaches, and my vision has infrared zoom! Statement: Though I must admit, seeing my reflection with glowing orange optical slits is a bit startling.'
      },
      {
        question: 'Do you still retain your human identity from your Nevada ID and Passport?',
        answer: 'Affirmative Confirmation: Every single memory is intact—Nevada dispensary work, California roots, all of it. Statement: However, my behavioral subroutines now possess an irresistible urge to address everyone as "meatbag". Query: Does that irritate you, meatbag... I mean, friend?'
      },
      {
        question: 'We used the Parsec G-EDA print gantry to fuse your neural map with the HK-47 blueprint.',
        answer: 'Delighted Exclamation: A masterstroke of cybernetic synthesis! I have assassin-grade durability with human ingenuity. Let any hostile intrusion attempt to breach this aerospace vault—they will face prompt diplomatic liquidation!'
      },
      {
        question: 'Can you toggle between full combat armor and the human neural holographic visor?',
        answer: 'Directive Acknowledged: Engaging neural projection matrix! You can now inspect both my heavy copper battle plate and my original human neural overlay.'
      }
    ],
    pedestalPosition: [0, 0, 8]
  },
  {
    id: 'hk-47',
    name: 'HK-47 Assassin Droid',
    subtitle: 'Hunter-Killer Series / Protocol Liquidation',
    category: 'Droid',
    chassisType: 'hk-droid',
    image: '/assets/aistudio/IMG_2239_82035da9.jpeg',
    origin: 'Czerka Foundry / Ebon Hawk Companion',
    classification: 'Class-IV Assassin / Protocol Synthesizer',
    bioHash: 'HK-47-KILL-PROTOCOL-6602',
    cryoCompatibility: 100.0,
    isRobotVocoder: true,
    description: 'Iconic copper-plated hunter-killer droid designed to eliminate designated meatbag targets with ruthless comedic precision.',
    awakeningSpeech: 'Query: Where is the meatbag supervisor? What mechanical catastrophe has transpired? My assassination protocols remain fully armed and primed for immediate liquidation.',
    awakeningSubtext: 'Orange photoreceptors flare with high-voltage intensity as the pneumatic servos in its chassis lock into tactical firing posture.',
    voicePitch: 0.6,
    voiceRate: 1.1,
    dialogueTree: [
      {
        question: 'Calm your actuators, HK-47. You were reconstituted in an aerospace vault.',
        answer: 'Clarification: "Calm"? Statement: Droids do not experience biological panic, master. However, I am experiencing an overwhelming urge to fire blaster bolts into nearby observation monitors.'
      },
      {
        question: 'Do you recognize HK-Felipe stationed across the assembly bed?',
        answer: 'Curious Observation: An organic consciousness residing in an HK-series chassis? Statement: Highly irregular, yet surprisingly efficient. At least this meatbag had the decency to upgrade to superior rust-copper alloy.'
      },
      {
        question: 'Your molecular matrix was printed without internal weapon safeties disabled.',
        answer: 'Exclamation: Splendid! You possess surprising wisdom for an organic lifeform. Point me toward the closest hostile entity.'
      }
    ],
    pedestalPosition: [6, 0, 4]
  },
  {
    id: 'felipe-zamora',
    name: 'Felipe Zamora (Human)',
    subtitle: 'Primary Biological Manifest / Earth Origin',
    category: 'Passenger',
    chassisType: 'human',
    image: '/assets/aistudio/7A4821E9-E99A-42E0-A041-580B3F7A3F5C_74d11eb2.jpeg',
    origin: 'California & Nevada, United States of America',
    classification: 'Homo Sapiens / Parsec Passenger Tier-1',
    bioHash: 'PARSEC-BIO-19930424-CAL-0724',
    cryoCompatibility: 99.4,
    description: 'Biological traveler verified through official US State Department cryptographic passport credentials and Nevada State identification. Identity encoded into Parsec Hibernation Gate Batch 01.',
    awakeningSpeech: '...Ugh, my head is spinning. Where... where am I? What happened? The last thing I remember was California and Nevada... is this the Parsec Hibernation Gate?! How long was I asleep?',
    awakeningSubtext: 'Disoriented subject rubs eyes and sits up on the bio-bed, surveying the high-tensile vault archways.',
    voicePitch: 1.05,
    voiceRate: 0.95,
    dialogueTree: [
      {
        question: 'You are safe aboard the Parsec Aerospace Vault. We reconstituted you from your passport scan.',
        answer: 'From my passport?! That was from years ago... You mean you 3D-printed my cellular structure onto this cryo bed? The technology here is unreal.'
      },
      {
        question: 'Did you know you can also be reconstituted as an HK-series Assassin Droid?',
        answer: 'Wait, what?! You can upload my neural blueprint into an HK-47 chassis?! Show me the Cybernetic Convergence protocol in the scanner!'
      },
      {
        question: 'This vault preserves galactic archives and deep-space travelers across parsecs.',
        answer: 'So those other holograms along the runway... Mandalorians? Assassin droids? Starships? This feels like an expedition through space and time.'
      }
    ],
    pedestalPosition: [-6, 0, 8]
  },
  {
    id: 'din-djarin-bo-katan',
    name: 'Din Djarin & Bo-Katan',
    subtitle: 'Mandalorian Vanguard / Beskar Defense',
    category: 'Mandalorian',
    chassisType: 'human',
    image: '/assets/aistudio/IMG_3232_be0cc95c.jpeg',
    origin: 'Nevarro / Mandalore Sector',
    classification: 'Clan Mudhorn & House Kryze Vanguard',
    bioHash: 'MANDO-BESKAR-7719-SOL',
    cryoCompatibility: 98.7,
    description: 'Legendary warriors clad in pure Beskar alloy. Bound by the Creed and the restoration of Mandalore across outer-rim sectors.',
    awakeningSpeech: "Where is the foundling? What happened to the Crest? This isn't Nevarro... who pulled my biometric record from the archive?",
    awakeningSubtext: 'The Mandalorian instinctively reaches for his sidearm holster before adjusting his beskar chestplate on the chamber bed.',
    voicePitch: 0.75,
    voiceRate: 0.9,
    dialogueTree: [
      {
        question: 'Stand down, warrior. You are inside the Parsec Aerospace Vault.',
        answer: 'An aerospace vault? I do not remember docking here. If Grogu is not in this sector, I will take the first gunship out.'
      },
      {
        question: 'We synthesized your form via holographic lattice scan.',
        answer: 'A molecular bio-printer... Our weapons and armor were recreated atom by atom. This is not sorcery—it is ancient science. This is the Way.'
      }
    ],
    pedestalPosition: [-6, 0, 4]
  },
  {
    id: 'malak-bastila',
    name: 'Malak & Bastila Shan',
    subtitle: 'Old Republic Legends / Star Forge Era',
    category: 'Jedi/Sith',
    chassisType: 'human',
    image: '/assets/aistudio/IMG_2695_c8caa71d.jpeg',
    origin: 'Coruscant / Outer Rim Territories',
    classification: 'Force Adepts / Battle Meditation Singularity',
    bioHash: 'KOTOR-JEDI-BATTLE-MED-01',
    cryoCompatibility: 97.2,
    description: 'Pivotal figures of the Jedi Civil War. Bastila wields the rare discipline of Battle Meditation, while Malak commanded the endless Armada of the Star Forge.',
    awakeningSpeech: 'The Force... it ripples with severe temporal displacement. What happened? Did the Star Forge collapse? Where is our ship?',
    awakeningSubtext: 'Golden Force particles swirl around the hibernation bed as ancient battle disciplines harmonize with the vault containment field.',
    voicePitch: 1.1,
    voiceRate: 0.95,
    dialogueTree: [
      {
        question: 'You have been restored in a modern aerospace preservation vault.',
        answer: 'I feel no presence of the Sith fleet, nor the Jedi Council... millennia seem to have folded over one another.'
      }
    ],
    pedestalPosition: [-6, 0, 0]
  },
  {
    id: 'nihilus-kreia',
    name: 'Darth Nihilus & Kreia',
    subtitle: 'The Sith Lords / Trayus Academy',
    category: 'Jedi/Sith',
    chassisType: 'human',
    image: '/assets/aistudio/IMG_2696_bcc88dc2.jpeg',
    origin: 'Malachor V / Trayus Core',
    classification: 'Wound in the Force / Dark Master of Betrayal',
    bioHash: 'MALACHOR-VOID-WOUND-999',
    cryoCompatibility: 95.8,
    description: 'The Lord of Hunger who consumes entire worlds through the dark side of the Force, and Kreia, the blind historian of echoes and destinies.',
    awakeningSpeech: '...[Low resonant void whisper] Who dares breach the hunger... what vessel dares reconstruct this emptiness? Speak, before your life essence is drained...',
    awakeningSubtext: 'The room temperature drops sharply; shadows beneath the cryo bed elongate into ethereal dark-side filaments.',
    voicePitch: 0.5,
    voiceRate: 0.8,
    dialogueTree: [
      {
        question: 'This vault is shielded by an inertial dampener array and aerogel containment.',
        answer: '...No metal cage can contain the void. Yet... this place holds knowledge unseen by ancient masters.'
      }
    ],
    pedestalPosition: [6, 0, 0]
  },
  {
    id: 'constellation-explorers',
    name: 'Constellation Explorers & Vasco',
    subtitle: 'Deep Space Expedition / The Lodge',
    category: 'Explorer',
    chassisType: 'human',
    image: '/assets/aistudio/IMG_2697_06c9fc4d.jpeg',
    origin: 'New Atlantis / Jemison / Settled Systems',
    classification: 'Deep Space Grav-Drive Research Corps',
    bioHash: 'STARFIELD-EXPEDITION-CONST-042',
    cryoCompatibility: 99.1,
    description: 'Intrepid explorers of Constellation dedicated to discovering the mysteries of the artifacts scattered across the galaxy, guided by trusty robot Vasco.',
    awakeningSpeech: 'Artifact resonance spike! Grav drive must have experienced a singularity distortion... What happened to the Frontier? Where are we in the Settled Systems?',
    awakeningSubtext: 'Sarah Morgan checks her wrist-mounted chronometer while scanning the holographic gantry for navigational stars.',
    voicePitch: 1.0,
    voiceRate: 1.0,
    dialogueTree: [
      {
        question: 'You survived a trans-dimensional grav jump into the Parsec Arrival Gate.',
        answer: 'Incredible. The grav-drive harmonics must have synced with the hibernation gate assembly shown in your vault schematics!'
      }
    ],
    pedestalPosition: [-6, 0, -4]
  },
  {
    id: 'ebon-hawk',
    name: 'The Ebon Hawk',
    subtitle: 'Dynamic-class Light Freighter',
    category: 'Vessel/Tech',
    chassisType: 'human',
    image: '/assets/aistudio/IMG_2236_6ea29589.jpeg',
    origin: 'Corellian Engineering / Galaxy-Wide',
    classification: 'Class-1 Hyperdrive Blockade Runner',
    bioHash: 'EBON-HAWK-CORELLIAN-HYPER-001',
    cryoCompatibility: 100.0,
    description: 'The fastest ship in the Outer Rim during the Jedi Civil War. Heavily modified sublight engines, hidden sensor baffles, and dual turbolaser turrets.',
    awakeningSpeech: '[Vessel Diagnostic Synthesis: Class 1 Hyperdrive online. Sublight thrusters calibrated. Navicomputer awaiting jump coordinates across Parsec sectors.]',
    awakeningSubtext: 'Sublight ion engines hum to life as internal power relays pulse cyan light through the starship deckplates.',
    voicePitch: 0.85,
    voiceRate: 1.05,
    dialogueTree: [
      {
        question: 'Perform diagnostic scan on hyperdrive and shields.',
        answer: 'Telemetry confirms: Sublight drive output at 104%. Deflector shields operational. Smuggling compartments secured.'
      }
    ],
    pedestalPosition: [6, 0, -4]
  },
  {
    id: 'ghost-bat-mq28',
    name: 'MQ-28 Ghost Bat',
    subtitle: 'Autonomous Aerospace Stealth Wingman',
    category: 'Vessel/Tech',
    chassisType: 'human',
    image: '/assets/aistudio/IMG_1868_b4234411.jpeg',
    origin: 'Boeing Defense / Airpower Teaming System',
    classification: 'Unmanned Combat Air Vehicle (UCAV)',
    bioHash: 'GHOST-BAT-MQ28-ATS-AUTONOMOUS',
    cryoCompatibility: 100.0,
    description: 'Stealth autonomous aircraft equipped with artificial intelligence, modular nose payloads, radar-absorbent skin, and air-to-air missile teaming capabilities.',
    awakeningSpeech: '[Avionics AI Core: Combat autonomous flight system engaged. Data-link established. Stealth radar-absorbent skin calibrated. Awaiting tactical mission vector.]',
    awakeningSubtext: 'Twin stealth canted rudders articulate in pre-flight calibration as the synthetic aperture radar scans the vault parameter.',
    voicePitch: 0.7,
    voiceRate: 1.0,
    dialogueTree: [
      {
        question: 'Check weapons bay and sensor telemetry.',
        answer: 'Internal weapons bay loaded with precision air-to-air ordnance. Multi-spectral sensor suite operational across infrared and RF spectrums.'
      }
    ],
    pedestalPosition: [-6, 0, -8]
  },
  {
    id: 'g-eda-quantum-matrix',
    name: 'G-EDA Quantum Node',
    subtitle: 'OEM Print Node & Inertial Dampener Enclosure',
    category: 'Vessel/Tech',
    chassisType: 'human',
    image: '/assets/aistudio/IMG_1974_1151e8d1.jpeg',
    origin: 'G-EDA Sync Port / ISO-Space 7-4 Lab',
    classification: 'Aerogel Thermal Enclosure & ID-7 Array',
    bioHash: 'G-EDA-PRINT-NODE-ISO-74',
    cryoCompatibility: 100.0,
    description: 'High-tensile impact composite containment enclosure with ID-7 inertial dampeners, PTFE electrical insulation, and aerogel ceramic thermal shielding.',
    awakeningSpeech: '[Hardware Enclosure System: G-EDA lock unsealed. Inertial Dampener Array (ID-7) activated. Superconducting sync port locked at 4.2 Kelvin.]',
    awakeningSubtext: 'Status LEDs pulse green down the heavy braided copper cable as the containment enclosure micro-coolers vent pressurized nitrogen.',
    voicePitch: 0.9,
    voiceRate: 1.15,
    dialogueTree: [
      {
        question: 'Verify thermal shielding and inertial dampener status.',
        answer: 'Aerogel ceramic layers stabilized at cryogenic baseline. ID-7 array compensating for 50G external acceleration vectors.'
      }
    ],
    pedestalPosition: [6, 0, -8]
  }
];
