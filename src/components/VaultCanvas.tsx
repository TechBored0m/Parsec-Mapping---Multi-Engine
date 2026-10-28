import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { CHARACTERS_DATA } from '../data/characters';
import { THEME_CONFIGS } from '../data/gameThemes';
import { CharacterRecord, PrintPhase, VaultCameraMode, GameEnvironmentTheme } from '../types';

interface VaultCanvasProps {
  selectedCharacter: CharacterRecord;
  onSelectCharacter: (char: CharacterRecord) => void;
  cameraMode: VaultCameraMode;
  printPhase: PrintPhase;
  printProgress: number; // 0 to 100
  isCanopyOpen: boolean;
  onCanopyToggle: () => void;
  characters?: CharacterRecord[];
  showFloorLabels?: boolean;
  theme?: GameEnvironmentTheme;
}

export const VaultCanvas: React.FC<VaultCanvasProps> = ({
  selectedCharacter,
  onSelectCharacter,
  characters,
  cameraMode,
  printPhase,
  printProgress,
  isCanopyOpen,
  showFloorLabels = true,
  theme = 'parsec-vault',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // References to animated 3D parts
  const laserGantryRef = useRef<THREE.Group | null>(null);
  const laserBeamRef = useRef<THREE.Mesh | null>(null);
  const cryoCanopyRef = useRef<THREE.Group | null>(null);

  // Human Subject references
  const humanGroupRef = useRef<THREE.Group | null>(null);
  const humanUpperTorsoRef = useRef<THREE.Group | null>(null);
  const humanHeadRef = useRef<THREE.Group | null>(null);

  // HK Robot Subject references
  const hkGroupRef = useRef<THREE.Group | null>(null);
  const hkUpperTorsoRef = useRef<THREE.Group | null>(null);
  const hkHeadRef = useRef<THREE.Group | null>(null);
  const hkLeftArmRef = useRef<THREE.Group | null>(null);
  const hkRightArmRef = useRef<THREE.Group | null>(null);
  const hkEyesMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const hkNeuralVisorRef = useRef<THREE.Group | null>(null);

  const particlesRef = useRef<THREE.Points | null>(null);
  const particleMatRef = useRef<THREE.PointsMaterial | null>(null);
  const hologramsGroupRef = useRef<THREE.Group | null>(null);
  const scanRingsRef = useRef<THREE.Mesh[]>([]);
  const steamEmitterRef = useRef<THREE.Points | null>(null);

  // Dynamic Theme Environment Refs
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const rimLightRef = useRef<THREE.PointLight | null>(null);
  const floorMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const trenchMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const archMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const archGlowMatRef = useRef<THREE.MeshBasicMaterial | null>(null);

  const activeModeRef = useRef<VaultCameraMode>(cameraMode);
  activeModeRef.current = cameraMode;

  const currentProgressRef = useRef<number>(printProgress);
  currentProgressRef.current = printProgress;

  const currentPhaseRef = useRef<PrintPhase>(printPhase);
  currentPhaseRef.current = printPhase;

  const canopyOpenRef = useRef<boolean>(isCanopyOpen);
  canopyOpenRef.current = isCanopyOpen;

  const selectedCharRef = useRef<CharacterRecord>(selectedCharacter);
  selectedCharRef.current = selectedCharacter;

  const showFloorLabelsRef = useRef<boolean>(showFloorLabels);
  showFloorLabelsRef.current = showFloorLabels;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL guard
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Scene & Renderer setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x050811);
    scene.fog = new THREE.FogExp2(0x050811, 0.032);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 3.5, 14);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. Studio Environment Map (PMREMGenerator + RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 + 0.04;
    controls.minDistance = 1.5;
    controls.maxDistance = 35;
    controls.target.set(0, 1.4, 0);
    controlsRef.current = controls;

    // 5. Lighting Rig (Warm key light, Cool hemisphere fill, Intense rim cyan/amber)
    const keyLight = new THREE.DirectionalLight(0xfff2df, 2.3);
    keyLight.position.set(7, 12, 9);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x090d16, 1.4);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const rimLight = new THREE.PointLight(0x00f0ff, 3.8, 28);
    rimLight.position.set(0, 6.5, -6);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // Bed spotlight for awakening dramatic focus
    const bedSpot = new THREE.SpotLight(0x38bdf8, 4.0, 14, Math.PI / 5, 0.4);
    bedSpot.position.set(0, 7.0, 1.5);
    bedSpot.target.position.set(0, 0.88, 1.5);
    scene.add(bedSpot);
    scene.add(bedSpot.target);

    // Contact shadow floor helper
    const contactShadowGeo = new THREE.PlaneGeometry(16, 26);
    const contactShadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(contactShadowGeo, contactShadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.01;
    scene.add(contactShadow);

    // ==========================================
    // 6. BUILD PROCEDURAL AEROSPACE VAULT CHAMBER
    // ==========================================
    const vaultGroup = new THREE.Group();
    scene.add(vaultGroup);

    // Floor metallic grid
    const floorGeo = new THREE.PlaneGeometry(38, 46, 38, 46);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0b1120,
      roughness: 0.4,
      metalness: 0.88,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = !isSoftwareGl;
    vaultGroup.add(floor);
    floorMatRef.current = floorMat;

    // Glowing energy trenches on floor
    const trenchMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    trenchMatRef.current = trenchMat;
    for (let x = -8; x <= 8; x += 4) {
      if (x === 0) continue;
      const trench = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 38), trenchMat);
      trench.position.set(x, 0.02, 0);
      vaultGroup.add(trench);
    }

    // Aerospace Vault Archway Ribs
    const archMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.45,
      metalness: 0.85,
    });
    archMatRef.current = archMat;
    const archGlowMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    archGlowMatRef.current = archGlowMat;

    for (let z = -16; z <= 16; z += 6.5) {
      const arch = new THREE.Group();
      arch.position.set(0, 0, z);

      const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 8, 0.8), archMat);
      leftPillar.position.set(-11, 4, 0);
      arch.add(leftPillar);

      const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 8, 0.8), archMat);
      rightPillar.position.set(11, 4, 0);
      arch.add(rightPillar);

      const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(22.8, 0.9, 0.8), archMat);
      crossBeam.position.set(0, 8, 0);
      arch.add(crossBeam);

      const braceGeo = new THREE.BoxGeometry(0.5, 2.5, 0.7);
      const braceLeft = new THREE.Mesh(braceGeo, archMat);
      braceLeft.position.set(-9.8, 7.0, 0);
      braceLeft.rotation.z = -Math.PI / 4;
      arch.add(braceLeft);

      const braceRight = new THREE.Mesh(braceGeo, archMat);
      braceRight.position.set(9.8, 7.0, 0);
      braceRight.rotation.z = Math.PI / 4;
      arch.add(braceRight);

      const strip = new THREE.Mesh(new THREE.BoxGeometry(21, 0.06, 0.82), archGlowMat);
      strip.position.set(0, 7.5, 0);
      arch.add(strip);

      vaultGroup.add(arch);
    }

    // ==========================================
    // 7. ELEVATED HOLOGRAM BRIDGE RUNWAY
    // ==========================================
    const bridgeGroup = new THREE.Group();
    scene.add(bridgeGroup);

    const bridgeDeckMat = new THREE.MeshPhysicalMaterial({
      color: 0x090e18,
      roughness: 0.25,
      metalness: 0.9,
      clearcoat: 0.5,
    });
    const bridgeDeck = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.25, 28), bridgeDeckMat);
    bridgeDeck.position.set(0, 0.125, 0);
    bridgeDeck.receiveShadow = !isSoftwareGl;
    bridgeGroup.add(bridgeDeck);

    const railMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const railLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 28), railMat);
    railLeft.position.set(-2.15, 0.25, 0);
    bridgeGroup.add(railLeft);

    const railRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 28), railMat);
    railRight.position.set(2.15, 0.25, 0);
    bridgeGroup.add(railRight);

    // ==========================================
    // 8. UNCLUTTERED HOLOGRAPHIC CHARACTER PEDESTALS
    // (NO OVERHEAD BILLBOARDS COLLIDING WITH THE MODELS!)
    // ==========================================
    const hologramsGroup = new THREE.Group();
    scene.add(hologramsGroup);
    hologramsGroupRef.current = hologramsGroup;

    const interactivePedestals: { mesh: THREE.Object3D; character: CharacterRecord }[] = [];
    const scanRingsList: THREE.Mesh[] = [];

    const activeCatalog = characters && characters.length > 0 ? characters : CHARACTERS_DATA;

    activeCatalog.forEach((char) => {
      const [px, , pz] = char.pedestalPosition;
      const pedestalGroup = new THREE.Group();
      pedestalGroup.position.set(px, 0, pz);
      pedestalGroup.userData = { characterId: char.id, charName: char.name };

      // Base cylinder
      const baseGeo = new THREE.CylinderGeometry(0.95, 1.15, 0.42, 28);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.92,
        roughness: 0.28,
      });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.21;
      base.receiveShadow = !isSoftwareGl;
      pedestalGroup.add(base);

      // Emitter disc lens
      const emitterDiscMat = new THREE.MeshBasicMaterial({
        color:
          char.chassisType === 'hk-cyborg' || char.chassisType === 'hk-droid'
            ? 0xff5500
            : char.vehicleSpec
            ? 0x6366f1
            : 0x00f0ff,
      });
      const emitterDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.05, 24), emitterDiscMat);
      emitterDisc.position.y = 0.42;
      pedestalGroup.add(emitterDisc);

      // Glowing outer ring on pedestal edge
      const ringGeo = new THREE.RingGeometry(0.65, 0.92, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: char.vehicleSpec ? 0x818cf8 : 0x00f0ff,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.43;
      pedestalGroup.add(ring);

      // Floor-Projected Circular Text Disc (Ground-level only, never floating in the air!)
      const floorLabelDisc = createPedestalFloorLabel(char.name, char.classification);
      floorLabelDisc.position.set(0, 0.44, 0);
      floorLabelDisc.name = 'floorLabel';
      pedestalGroup.add(floorLabelDisc);

      // Soft vertical holographic column of light
      const beamGeo = new THREE.CylinderGeometry(0.7, 0.9, 2.8, 24, 1, true);
      const beamMat = new THREE.MeshBasicMaterial({
        color:
          char.chassisType === 'hk-cyborg' || char.chassisType === 'hk-droid'
            ? 0xff6600
            : char.vehicleSpec
            ? 0x818cf8
            : 0x00e5ff,
        transparent: true,
        opacity: 0.09,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.y = 1.7;
      pedestalGroup.add(beam);

      // Moving animated holographic scan ring
      const scanRingGeo = new THREE.RingGeometry(0.48, 0.58, 24);
      const scanRingMat = new THREE.MeshBasicMaterial({
        color: char.vehicleSpec ? 0xa5b4fc : 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
      });
      const scanRing = new THREE.Mesh(scanRingGeo, scanRingMat);
      scanRing.rotation.x = -Math.PI / 2;
      scanRing.position.y = 0.5;
      scanRing.userData = { initialY: 0.5, speed: 0.7 + Math.random() * 0.3 };
      pedestalGroup.add(scanRing);
      scanRingsList.push(scanRing);

      // Rich procedural 3D Hologram Figure (No blocking text overhead!)
      const hologramModel = createDetailedHologramFigure(char.id, char);
      hologramModel.position.y = 1.35;
      pedestalGroup.add(hologramModel);

      // Transparent interactive hit box for raycasting clicks
      const hitBoxGeo = new THREE.BoxGeometry(2.2, 3.4, 2.2);
      const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
      hitBox.position.y = 1.7;
      pedestalGroup.add(hitBox);

      interactivePedestals.push({ mesh: hitBox, character: char });
      hologramsGroup.add(pedestalGroup);
    });
    scanRingsRef.current = scanRingsList;

    // ==========================================
    // 9. THE PARSEC HIBERNATION & BIO-PRINT BED
    // ==========================================
    const bedSystem = new THREE.Group();
    bedSystem.position.set(0, 0, 1.5);
    scene.add(bedSystem);

    const bedBaseGeo = new THREE.BoxGeometry(2.2, 0.7, 3.8);
    const bedBaseMat = new THREE.MeshStandardMaterial({
      color: 0x182234,
      metalness: 0.85,
      roughness: 0.35,
    });
    const bedBase = new THREE.Mesh(bedBaseGeo, bedBaseMat);
    bedBase.position.y = 0.35;
    bedBase.castShadow = !isSoftwareGl;
    bedBase.receiveShadow = !isSoftwareGl;
    bedSystem.add(bedBase);

    // Copper thermal conduction fins
    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      metalness: 0.95,
      roughness: 0.2,
    });
    for (let zOffset = -1.5; zOffset <= 1.5; zOffset += 0.5) {
      const finLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.35), copperMat);
      finLeft.position.set(-1.12, 0.35, zOffset);
      bedSystem.add(finLeft);

      const finRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.35), copperMat);
      finRight.position.set(1.12, 0.35, zOffset);
      bedSystem.add(finRight);
    }

    const mattressGeo = new THREE.BoxGeometry(1.6, 0.25, 3.2);
    const mattressMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.6,
      metalness: 0.2,
    });
    const mattress = new THREE.Mesh(mattressGeo, mattressMat);
    mattress.position.y = 0.75;
    bedSystem.add(mattress);

    const pillowGeo = new THREE.BoxGeometry(1.2, 0.15, 0.6);
    const pillow = new THREE.Mesh(pillowGeo, mattressMat);
    pillow.position.set(0, 0.88, -1.1);
    bedSystem.add(pillow);

    const ledStripMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const ledStrip = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.04, 0.08), ledStripMat);
    ledStrip.position.set(0, 0.82, -1.65);
    bedSystem.add(ledStrip);

    // Bed Cryo-Canopy Glass Shield
    const cryoCanopyGroup = new THREE.Group();
    cryoCanopyGroup.position.set(0, 0.88, 0);

    const glassGeo = new THREE.CylinderGeometry(0.88, 0.88, 3.2, 24, 1, false, 0, Math.PI);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: isSoftwareGl ? 0.35 : 0.6,
      transmission: isSoftwareGl ? 0 : 0.88,
      roughness: 0.1,
      metalness: 0.15,
      ior: 1.5,
      depthWrite: false,
    });
    const canopyGlass = new THREE.Mesh(glassGeo, glassMat);
    canopyGlass.rotation.z = Math.PI / 2;
    canopyGlass.rotation.y = -Math.PI / 2;
    canopyGlass.position.y = 0.1;
    cryoCanopyGroup.add(canopyGlass);

    const canopyFrameMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.8,
      roughness: 0.3,
    });
    const canopyRimFront = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.04, 8, 24, Math.PI), canopyFrameMat);
    canopyRimFront.position.set(0, 0.1, 1.6);
    cryoCanopyGroup.add(canopyRimFront);

    const canopyRimBack = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.04, 8, 24, Math.PI), canopyFrameMat);
    canopyRimBack.position.set(0, 0.1, -1.6);
    cryoCanopyGroup.add(canopyRimBack);

    bedSystem.add(cryoCanopyGroup);
    cryoCanopyRef.current = cryoCanopyGroup;

    // ==========================================
    // 10A. HUMAN SUBJECT (On Bed)
    // ==========================================
    const humanGroup = new THREE.Group();
    humanGroup.position.set(0, 0.88, 0);
    bedSystem.add(humanGroup);
    humanGroupRef.current = humanGroup;

    const lowerBody = new THREE.Group();
    const legsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.3 });
    const leftLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 1.1, 4, 12), legsMat);
    leftLeg.rotation.x = Math.PI / 2;
    leftLeg.position.set(-0.25, 0.12, 0.65);
    lowerBody.add(leftLeg);

    const rightLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 1.1, 4, 12), legsMat);
    rightLeg.rotation.x = Math.PI / 2;
    rightLeg.position.set(0.25, 0.12, 0.65);
    lowerBody.add(rightLeg);
    humanGroup.add(lowerBody);

    const humanUpperTorsoPivot = new THREE.Group();
    humanUpperTorsoPivot.position.set(0, 0.12, 0.1);
    humanGroup.add(humanUpperTorsoPivot);
    humanUpperTorsoRef.current = humanUpperTorsoPivot;

    const chestMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.45, metalness: 0.3 });
    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 0.75), chestMat);
    chest.position.set(0, 0.08, -0.38);
    humanUpperTorsoPivot.add(chest);

    const armMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.4 });
    const leftArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.8, 4, 8), armMat);
    leftArm.rotation.x = Math.PI / 2;
    leftArm.position.set(-0.38, 0.06, -0.35);
    humanUpperTorsoPivot.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.8, 4, 8), armMat);
    rightArm.rotation.x = Math.PI / 2;
    rightArm.position.set(0.38, 0.06, -0.35);
    humanUpperTorsoPivot.add(rightArm);

    const humanHeadPivot = new THREE.Group();
    humanHeadPivot.position.set(0, 0.08, -0.85);
    humanUpperTorsoPivot.add(humanHeadPivot);
    humanHeadRef.current = humanHeadPivot;

    const headMat = new THREE.MeshStandardMaterial({ color: 0xf1c27d, roughness: 0.6, metalness: 0.1 });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), headMat);
    head.scale.set(1, 1.15, 1);
    humanHeadPivot.add(head);

    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.8 });
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.19, 14, 14), hairMat);
    hair.position.set(0, 0.04, -0.02);
    hair.scale.set(0.98, 1.1, 0.98);
    humanHeadPivot.add(hair);

    const humanEyeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const humanLeftEye = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), humanEyeMat);
    humanLeftEye.position.set(-0.06, 0.06, 0.16);
    humanHeadPivot.add(humanLeftEye);

    const humanRightEye = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), humanEyeMat);
    humanRightEye.position.set(0.06, 0.06, 0.16);
    humanHeadPivot.add(humanRightEye);

    // ==========================================
    // 10B. HK-SERIES ASSASSIN DROID SUBJECT (On Bed)
    // (Used for HK-47 and HK-Felipe Cyborg)
    // ==========================================
    const hkGroup = new THREE.Group();
    hkGroup.position.set(0, 0.88, 0);
    bedSystem.add(hkGroup);
    hkGroupRef.current = hkGroup;

    const hkBronzeMat = new THREE.MeshStandardMaterial({
      color: 0xaa5424, // Rust-copper weathered bronze
      metalness: 0.92,
      roughness: 0.32,
    });
    const hkDarkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      metalness: 0.95,
      roughness: 0.25,
    });
    const hkEyesMat = new THREE.MeshBasicMaterial({ color: 0xff4400 });
    hkEyesMatRef.current = hkEyesMat;

    // HK Lower Body & Armored Legs
    const hkLowerBody = new THREE.Group();
    const hkPelvis = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.24, 0.3), hkBronzeMat);
    hkPelvis.position.set(0, 0.12, 0.1);
    hkLowerBody.add(hkPelvis);

    const createHkLeg = (xPos: number) => {
      const legGroup = new THREE.Group();
      legGroup.position.set(xPos, 0.12, 0.25);

      const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 0.65), hkBronzeMat);
      thigh.position.set(0, 0, 0.32);
      legGroup.add(thigh);

      const knee = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.2, 12), hkDarkMetalMat);
      knee.rotation.z = Math.PI / 2;
      knee.position.set(0, 0, 0.68);
      legGroup.add(knee);

      const shin = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.15, 0.65), hkBronzeMat);
      shin.position.set(0, 0, 1.05);
      legGroup.add(shin);

      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.25), hkDarkMetalMat);
      foot.position.set(0, -0.02, 1.4);
      legGroup.add(foot);

      return legGroup;
    };

    hkLowerBody.add(createHkLeg(-0.25));
    hkLowerBody.add(createHkLeg(0.25));
    hkGroup.add(hkLowerBody);

    // HK Upper Torso (Articulates upward upon awakening)
    const hkUpperTorsoPivot = new THREE.Group();
    hkUpperTorsoPivot.position.set(0, 0.12, 0.1);
    hkGroup.add(hkUpperTorsoPivot);
    hkUpperTorsoRef.current = hkUpperTorsoPivot;

    for (let s = 0; s < 3; s++) {
      const vert = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 12), hkDarkMetalMat);
      vert.position.set(0, 0.04, -0.08 - s * 0.1);
      hkUpperTorsoPivot.add(vert);
    }

    const hkChest = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.26, 0.55), hkBronzeMat);
    hkChest.position.set(0, 0.12, -0.42);
    hkUpperTorsoPivot.add(hkChest);

    const hkChestCore = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.28, 0.42), hkDarkMetalMat);
    hkChestCore.position.set(0, 0.13, -0.42);
    hkUpperTorsoPivot.add(hkChestCore);

    // Left Arm Pivot & Assembly
    const hkLeftArmPivot = new THREE.Group();
    hkLeftArmPivot.position.set(-0.42, 0.12, -0.42);
    hkUpperTorsoPivot.add(hkLeftArmPivot);
    hkLeftArmRef.current = hkLeftArmPivot;

    const hkLeftShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), hkBronzeMat);
    hkLeftArmPivot.add(hkLeftShoulder);

    const hkLeftBicep = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.45, 10), hkDarkMetalMat);
    hkLeftBicep.rotation.x = Math.PI / 2;
    hkLeftBicep.position.set(0, 0, 0.25);
    hkLeftArmPivot.add(hkLeftBicep);

    const hkLeftForearm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.42), hkBronzeMat);
    hkLeftForearm.position.set(0, 0, 0.65);
    hkLeftArmPivot.add(hkLeftForearm);

    const hkLeftHand = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.14), hkDarkMetalMat);
    hkLeftHand.position.set(0, 0, 0.9);
    hkLeftArmPivot.add(hkLeftHand);

    // Right Arm Pivot & Assembly
    const hkRightArmPivot = new THREE.Group();
    hkRightArmPivot.position.set(0.42, 0.12, -0.42);
    hkUpperTorsoPivot.add(hkRightArmPivot);
    hkRightArmRef.current = hkRightArmPivot;

    const hkRightShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), hkBronzeMat);
    hkRightArmPivot.add(hkRightShoulder);

    const hkRightBicep = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.45, 10), hkDarkMetalMat);
    hkRightBicep.rotation.x = Math.PI / 2;
    hkRightBicep.position.set(0, 0, 0.25);
    hkRightArmPivot.add(hkRightBicep);

    const hkRightForearm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.42), hkBronzeMat);
    hkRightForearm.position.set(0, 0, 0.65);
    hkRightArmPivot.add(hkRightForearm);

    const hkRightHand = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.14), hkDarkMetalMat);
    hkRightHand.position.set(0, 0, 0.9);
    hkRightArmPivot.add(hkRightHand);

    // HK Head Pivot & Angular Assassin Helmet
    const hkHeadPivot = new THREE.Group();
    hkHeadPivot.position.set(0, 0.14, -0.78);
    hkUpperTorsoPivot.add(hkHeadPivot);
    hkHeadRef.current = hkHeadPivot;

    const hkCranium = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.45, 6), hkBronzeMat);
    hkCranium.rotation.x = Math.PI / 1.3;
    hkHeadPivot.add(hkCranium);

    const hkBrow = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 0.22), hkBronzeMat);
    hkBrow.position.set(0, 0.06, 0.08);
    hkHeadPivot.add(hkBrow);

    const hkVocoder = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.12), hkDarkMetalMat);
    hkVocoder.position.set(0, -0.04, 0.15);
    hkHeadPivot.add(hkVocoder);

    const hkLeftEye = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.025, 0.04), hkEyesMat);
    hkLeftEye.position.set(-0.08, 0.06, 0.2);
    hkLeftEye.rotation.z = -0.15;
    hkHeadPivot.add(hkLeftEye);

    const hkRightEye = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.025, 0.04), hkEyesMat);
    hkRightEye.position.set(0.08, 0.06, 0.2);
    hkRightEye.rotation.z = 0.15;
    hkHeadPivot.add(hkRightEye);

    const hkAntenna = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.25, 6), hkDarkMetalMat);
    hkAntenna.position.set(0.14, 0.18, -0.08);
    hkHeadPivot.add(hkAntenna);

    // Sleek rotating cybernetic holographic reticle (without any blocking text banner!)
    const neuralVisorGroup = new THREE.Group();
    neuralVisorGroup.position.set(0, 0.25, 0.05);

    const visorRingGeo = new THREE.RingGeometry(0.2, 0.32, 32);
    const visorRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const visorRing = new THREE.Mesh(visorRingGeo, visorRingMat);
    visorRing.rotation.x = -Math.PI / 3;
    neuralVisorGroup.add(visorRing);

    hkHeadPivot.add(neuralVisorGroup);
    hkNeuralVisorRef.current = neuralVisorGroup;

    // ==========================================
    // 11. OVERHEAD BIO-PRINTER GANTRY & LASER
    // ==========================================
    const gantry = new THREE.Group();
    gantry.position.set(0, 2.6, 1.5);
    scene.add(gantry);
    laserGantryRef.current = gantry;

    const gantryRailMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.9,
      roughness: 0.25,
    });
    const railX = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 0.12), gantryRailMat);
    gantry.add(railX);

    const laserCarriage = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.22, 0.45),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.2 })
    );
    gantry.add(laserCarriage);

    const laserBeamGeo = new THREE.CylinderGeometry(0.04, 0.45, 1.8, 16);
    const laserBeamMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const laserBeam = new THREE.Mesh(laserBeamGeo, laserBeamMat);
    laserBeam.position.y = -0.9;
    gantry.add(laserBeam);
    laserBeamRef.current = laserBeam;

    const printRingGeo = new THREE.RingGeometry(0.1, 0.45, 24);
    const printRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const printRing = new THREE.Mesh(printRingGeo, printRingMat);
    printRing.rotation.x = -Math.PI / 2;
    printRing.position.y = -1.78;
    gantry.add(printRing);

    // ==========================================
    // 12. AMBIENT PARTICLES & CRYO STEAM SYSTEM
    // ==========================================
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 24;
      particlePositions[i + 1] = Math.random() * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 28;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.08,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;
    particleMatRef.current = particleMat;

    const steamCount = 80;
    const steamGeo = new THREE.BufferGeometry();
    const steamPositions = new Float32Array(steamCount * 3);
    for (let i = 0; i < steamCount * 3; i += 3) {
      steamPositions[i] = (Math.random() - 0.5) * 2.0;
      steamPositions[i + 1] = 0.8 + Math.random() * 0.3;
      steamPositions[i + 2] = 1.5 + (Math.random() - 0.5) * 3.2;
    }
    steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));
    const steamMat = new THREE.PointsMaterial({
      color: 0xe0f2fe,
      size: 0.16,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
    });
    const steam = new THREE.Points(steamGeo, steamMat);
    scene.add(steam);
    steamEmitterRef.current = steam;

    // ==========================================
    // 13. RAYCASTING INTERACTION
    // ==========================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hitCandidates = interactivePedestals.map((p) => p.mesh);
      const intersects = raycaster.intersectObjects(hitCandidates, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const match = interactivePedestals.find((p) => p.mesh === hit);
        if (match) {
          onSelectCharacter(match.character);
        }
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ==========================================
    // 14. ANIMATION LOOP
    // ==========================================
    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      // Camera positions and dynamic focus target
      const currentMode = activeModeRef.current;
      const currentChar = selectedCharRef.current;

      let targetPos = new THREE.Vector3(0, 3.5, 14);
      let targetLook = new THREE.Vector3(0, 1.5, 0);

      if (currentMode === 'bed') {
        targetPos = new THREE.Vector3(0, 3.2, 4.2);
        targetLook = new THREE.Vector3(0, 1.2, 1.5);
      } else if (currentMode === 'terminal') {
        targetPos = new THREE.Vector3(-4.5, 2.5, 3);
        targetLook = new THREE.Vector3(-3.2, 1.4, 1.5);
      } else if (currentMode === 'overview') {
        targetPos = new THREE.Vector3(12, 11, 15);
        targetLook = new THREE.Vector3(0, 1.0, 0);
      } else if (currentMode === 'focus') {
        // Smooth cinematic focus view directly in front of the active hologram
        const [px, , pz] = currentChar.pedestalPosition;
        const sign = px >= 0 ? -1 : 1;
        targetPos = new THREE.Vector3(px + sign * 0.8, 1.75, pz + 2.4);
        targetLook = new THREE.Vector3(px, 1.45, pz);
      } else {
        // Bridge default view
        targetPos = new THREE.Vector3(0, 3.5, 14);
        targetLook = new THREE.Vector3(0, 1.5, 0);
      }

      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetPos.x, 3.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetPos.y, 3.5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPos.z, 3.5, delta);

      controls.target.x = THREE.MathUtils.damp(controls.target.x, targetLook.x, 3.5, delta);
      controls.target.y = THREE.MathUtils.damp(controls.target.y, targetLook.y, 3.5, delta);
      controls.target.z = THREE.MathUtils.damp(controls.target.z, targetLook.z, 3.5, delta);
      controls.update();

      // Hologram pedestal updates
      if (hologramsGroupRef.current) {
        hologramsGroupRef.current.children.forEach((pedestal, idx) => {
          const charId = pedestal.userData.characterId;
          const isSelected = currentChar.id === charId;

          // Rotate the hologram figure smoothly
          const model = pedestal.children.find((c) => c.name === 'hologramModel');
          if (model) {
            model.rotation.y = time * 0.65 + idx * 0.5;
          }

          // Active pedestal highlight
          const ringMesh = pedestal.children[2] as THREE.Mesh;
          if (ringMesh && ringMesh.material) {
            (ringMesh.material as THREE.MeshBasicMaterial).color.setHex(isSelected ? 0xffea00 : 0x00f0ff);
          }

          // Floor disc label visibility
          const floorLabel = pedestal.getObjectByName('floorLabel');
          if (floorLabel) {
            floorLabel.visible = showFloorLabelsRef.current;
          }
        });
      }

      // Animated scanning rings rising through each hologram
      scanRingsRef.current.forEach((ring) => {
        const speed = ring.userData.speed || 0.8;
        ring.position.y += delta * speed;
        if (ring.position.y > 2.8) {
          ring.position.y = 0.44;
        }
        const progressY = (ring.position.y - 0.44) / 2.36;
        const ringMat = ring.material as THREE.MeshBasicMaterial;
        ringMat.opacity = Math.sin(progressY * Math.PI) * 0.8;
      });

      // Ambient particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y = time * 0.02;
      }

      // Laser Gantry & Print Head
      const currentPhase = currentPhaseRef.current;
      const progress = currentProgressRef.current;
      const isRobotChassis = currentChar.chassisType === 'hk-cyborg' || currentChar.chassisType === 'hk-droid';

      if (laserGantryRef.current && laserBeamRef.current) {
        if (currentPhase === 'synthesizing' || currentPhase === 'scanning') {
          const sweepZ = 1.5 + Math.sin(time * 3.5) * 1.3;
          laserGantryRef.current.position.z = sweepZ;
          (laserBeamRef.current.material as THREE.MeshBasicMaterial).opacity = 0.75 + Math.sin(time * 20) * 0.15;
          printRing.position.z = -1.78;
          printRingMat.opacity = 0.8;
        } else {
          laserGantryRef.current.position.z = THREE.MathUtils.damp(laserGantryRef.current.position.z, 3.1, 4.0, delta);
          (laserBeamRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
          printRingMat.opacity = 0;
        }
      }

      // Canopy Motion
      if (cryoCanopyRef.current) {
        const targetAngle = canopyOpenRef.current || currentPhase === 'venting' || currentPhase === 'awakened' ? -Math.PI / 1.7 : 0;
        cryoCanopyRef.current.rotation.x = THREE.MathUtils.damp(cryoCanopyRef.current.rotation.x, targetAngle, 3.0, delta);
      }

      // Steam Venting
      if (steamEmitterRef.current) {
        if (currentPhase === 'venting') {
          steamMat.opacity = THREE.MathUtils.damp(steamMat.opacity, 0.7, 5.0, delta);
          const pos = steamPositions;
          for (let i = 1; i < pos.length; i += 3) {
            pos[i] += delta * 0.8;
            if (pos[i] > 2.5) pos[i] = 0.8;
          }
          steamGeo.attributes.position.needsUpdate = true;
        } else {
          steamMat.opacity = THREE.MathUtils.damp(steamMat.opacity, 0.0, 3.0, delta);
        }
      }

      // Determine active chassis group on the bed
      const activeGroup = isRobotChassis ? hkGroupRef.current : humanGroupRef.current;
      const inactiveGroup = isRobotChassis ? humanGroupRef.current : hkGroupRef.current;

      if (inactiveGroup) inactiveGroup.visible = false;

      if (activeGroup) {
        if (currentPhase === 'idle' || currentPhase === 'scanning') {
          activeGroup.visible = progress > 0;
          activeGroup.scale.setScalar(0.01);
        } else if (currentPhase === 'synthesizing') {
          activeGroup.visible = true;
          const currentScale = Math.min(1.0, Math.max(0.05, progress / 100));
          activeGroup.scale.set(1, currentScale, currentScale);
        } else if (currentPhase === 'venting' || currentPhase === 'awakened') {
          activeGroup.visible = true;
          activeGroup.scale.set(1, 1, 1);

          if (isRobotChassis) {
            // HK Robot / HK-Felipe awakening kinematics
            if (hkUpperTorsoRef.current && hkHeadRef.current && hkLeftArmRef.current && hkRightArmRef.current) {
              if (currentPhase === 'awakened') {
                hkUpperTorsoRef.current.rotation.x = THREE.MathUtils.damp(
                  hkUpperTorsoRef.current.rotation.x,
                  -Math.PI / 4.0,
                  2.2,
                  delta
                );

                const armLift = -Math.PI / 3.4 + Math.sin(time * 1.5) * 0.08;
                hkLeftArmRef.current.rotation.x = THREE.MathUtils.damp(hkLeftArmRef.current.rotation.x, armLift, 2.5, delta);
                hkRightArmRef.current.rotation.x = THREE.MathUtils.damp(hkRightArmRef.current.rotation.x, armLift, 2.5, delta);

                hkLeftArmRef.current.rotation.y = THREE.MathUtils.damp(hkLeftArmRef.current.rotation.y, 0.25, 2.0, delta);
                hkRightArmRef.current.rotation.y = THREE.MathUtils.damp(hkRightArmRef.current.rotation.y, -0.25, 2.0, delta);

                const headTurn = Math.sin(time * 1.2) * 0.45;
                hkHeadRef.current.rotation.y = THREE.MathUtils.damp(hkHeadRef.current.rotation.y, headTurn, 2.5, delta);

                if (hkEyesMatRef.current) {
                  const flare = 0.8 + Math.sin(time * 8) * 0.2;
                  hkEyesMatRef.current.color.setRGB(1.0 * flare, 0.35 * flare, 0.0);
                }

                if (hkNeuralVisorRef.current) {
                  hkNeuralVisorRef.current.visible = currentChar.chassisType === 'hk-cyborg';
                  hkNeuralVisorRef.current.rotation.z = time * 0.8;
                }
              } else {
                hkUpperTorsoRef.current.rotation.x = 0;
                hkLeftArmRef.current.rotation.x = 0;
                hkRightArmRef.current.rotation.x = 0;
                hkHeadRef.current.rotation.y = 0;
              }
            }
          } else {
            // Human subject awakening
            if (humanUpperTorsoRef.current && humanHeadRef.current) {
              if (currentPhase === 'awakened') {
                humanUpperTorsoRef.current.rotation.x = THREE.MathUtils.damp(
                  humanUpperTorsoRef.current.rotation.x,
                  -Math.PI / 4.2,
                  2.5,
                  delta
                );
                const headTurn = Math.sin(time * 1.8) * 0.35;
                humanHeadRef.current.rotation.y = THREE.MathUtils.damp(humanHeadRef.current.rotation.y, headTurn, 3.0, delta);
              } else {
                humanUpperTorsoRef.current.rotation.x = 0;
                humanHeadRef.current.rotation.y = 0;
              }
            }
          }
        }
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onSelectCharacter, characters]);

  // Dynamic Game Environment Seeding Effect
  useEffect(() => {
    const config = THEME_CONFIGS[theme || 'parsec-vault'];
    if (!config) return;

    const scene = sceneRef.current;
    if (scene) {
      scene.background = new THREE.Color(config.bgColor);
      if (scene.fog) {
        (scene.fog as THREE.FogExp2).color.setHex(config.fogColor);
        (scene.fog as THREE.FogExp2).density = config.fogDensity;
      }
    }

    if (keyLightRef.current) keyLightRef.current.color.setHex(config.keyLightColor);
    if (hemiLightRef.current) {
      hemiLightRef.current.color.setHex(config.hemiSkyColor);
      hemiLightRef.current.groundColor.setHex(config.hemiGroundColor);
    }
    if (rimLightRef.current) rimLightRef.current.color.setHex(config.rimColor);
    if (floorMatRef.current) floorMatRef.current.color.setHex(config.floorColor);
    if (trenchMatRef.current) trenchMatRef.current.color.setHex(config.trenchColor);
    if (archMatRef.current) archMatRef.current.color.setHex(config.archColor);
    if (archGlowMatRef.current) archGlowMatRef.current.color.setHex(config.archGlowColor);
    if (particleMatRef.current) particleMatRef.current.color.setHex(config.particleColor);
  }, [theme]);

  return <div ref={mountRef} className="w-full h-full relative cursor-grab active:cursor-grabbing select-none" />;
};

/**
 * Creates rich, high-fidelity procedural 3D hologram figures with luminous dual-layer materials.
 * Separated cleanly from any floating text billboards.
 */
function createDetailedHologramFigure(charId: string, charRecord?: CharacterRecord): THREE.Group {
  const group = new THREE.Group();
  group.name = 'hologramModel';

  const isHK = charId === 'hk-felipe' || charId === 'hk-47';
  const isVehicle = !!charRecord?.vehicleSpec || charRecord?.category === 'Vessel/Tech' || charRecord?.chassisType === 'vehicle';
  const vClass = charRecord?.vehicleSpec?.vehicleClass;

  // Luminous inner translucent glow material
  const holoGlowMat = new THREE.MeshStandardMaterial({
    color: isHK ? 0xd97706 : isVehicle ? 0x6366f1 : 0x06b6d4,
    emissive: isHK ? 0xb45309 : isVehicle ? 0x4338ca : 0x0284c7,
    emissiveIntensity: 0.65,
    roughness: 0.2,
    metalness: 0.8,
    transparent: true,
    opacity: 0.72,
  });

  // Sharp holographic wireframe lattice
  const holoGridMat = new THREE.MeshBasicMaterial({
    color: isHK ? 0xfbbf24 : isVehicle ? 0xa5b4fc : 0x38bdf8,
    wireframe: true,
    transparent: true,
    opacity: 0.88,
  });

  const eyeMat = new THREE.MeshBasicMaterial({
    color: isHK ? 0xff4500 : isVehicle ? 0x38bdf8 : 0x00f0ff,
  });

  if (isHK) {
    // ==========================================
    // HK DROID HOLOGRAPHIC CHASSIS (Multi-part procedural build)
    // ==========================================
    // Pelvis
    const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.2, 0.22), holoGlowMat);
    pelvis.position.y = -0.15;
    group.add(pelvis);

    // Segmented spine
    for (let i = 0; i < 3; i++) {
      const vert = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 8), holoGridMat);
      vert.position.y = -0.04 + i * 0.08;
      group.add(vert);
    }

    // Heavy angular bronze chestplate
    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.44, 0.3), holoGlowMat);
    chest.position.y = 0.24;
    group.add(chest);

    const chestGrid = new THREE.Mesh(new THREE.BoxGeometry(0.51, 0.45, 0.31), holoGridMat);
    chestGrid.position.y = 0.24;
    group.add(chestGrid);

    // Center chest vent
    const vent = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.05), eyeMat);
    vent.position.set(0, 0.24, 0.16);
    group.add(vent);

    // Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.14, 8), holoGridMat);
    neck.position.y = 0.52;
    group.add(neck);

    // Angular assassin head
    const cranium = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.38, 6), holoGlowMat);
    cranium.rotation.x = Math.PI / 1.35;
    cranium.position.set(0, 0.68, 0);
    group.add(cranium);

    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.09, 0.18), holoGlowMat);
    brow.position.set(0, 0.72, 0.06);
    group.add(brow);

    // Orange glowing photoreceptor slit eyes
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.03), eyeMat);
    eyeL.position.set(-0.07, 0.72, 0.16);
    group.add(eyeL);

    const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.03), eyeMat);
    eyeR.position.set(0.07, 0.72, 0.16);
    group.add(eyeR);

    // Antenna
    const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.22, 6), holoGridMat);
    ant.position.set(0.12, 0.88, -0.05);
    group.add(ant);

    // Arms
    const createArm = (sign: number) => {
      const armGroup = new THREE.Group();
      armGroup.position.set(sign * 0.34, 0.38, 0);

      const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), holoGlowMat);
      armGroup.add(shoulder);

      const bicep = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.35, 6), holoGridMat);
      bicep.position.set(0, -0.2, 0);
      armGroup.add(bicep);

      const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.3, 0.09), holoGlowMat);
      forearm.position.set(0, -0.5, 0.05);
      armGroup.add(forearm);

      const claw = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.1), eyeMat);
      claw.position.set(0, -0.68, 0.08);
      armGroup.add(claw);

      return armGroup;
    };
    group.add(createArm(-1));
    group.add(createArm(1));

    // Legs
    const createLeg = (sign: number) => {
      const legGroup = new THREE.Group();
      legGroup.position.set(sign * 0.18, -0.15, 0);

      const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.42, 0.13), holoGlowMat);
      thigh.position.y = -0.22;
      legGroup.add(thigh);

      const shin = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.42, 0.12), holoGridMat);
      shin.position.y = -0.62;
      legGroup.add(shin);

      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.2), holoGlowMat);
      foot.position.set(0, -0.85, 0.05);
      legGroup.add(foot);

      return legGroup;
    };
    group.add(createLeg(-1));
    group.add(createLeg(1));

  } else if (charId === 'ebon-hawk') {
    // ==========================================
    // EBON HAWK FREIGHTER HOLOGRAPHIC HULL
    // ==========================================
    const hullMat = holoGlowMat;
    const centerHull = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.85, 0.22, 16), hullMat);
    centerHull.scale.set(1.1, 0.6, 1.3);
    group.add(centerHull);

    const mandLeft = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.85), holoGridMat);
    mandLeft.position.set(-0.48, 0.02, 0.75);
    group.add(mandLeft);

    const mandRight = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.85), holoGridMat);
    mandRight.position.set(0.48, 0.02, 0.75);
    group.add(mandRight);

    const cockpitPod = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.5, 8), eyeMat);
    cockpitPod.rotation.x = Math.PI / 2;
    cockpitPod.position.set(-0.8, 0.06, 0.2);
    group.add(cockpitPod);

    const engines = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.18, 0.3), eyeMat);
    engines.position.set(0, 0.05, -0.75);
    group.add(engines);

  } else if (charId === 'ghost-bat-mq28') {
    // ==========================================
    // BOEING MQ-28 GHOST BAT STEALTH DRONE
    // ==========================================
    const fuselage = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.8, 6), holoGlowMat);
    fuselage.rotation.x = Math.PI / 2;
    group.add(fuselage);

    const wings = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.04, 0.55), holoGridMat);
    wings.position.set(0, 0, -0.2);
    group.add(wings);

    const leftFin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 0.32), eyeMat);
    leftFin.position.set(-0.38, 0.22, -0.65);
    leftFin.rotation.z = -Math.PI / 6;
    group.add(leftFin);

    const rightFin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 0.32), eyeMat);
    rightFin.position.set(0.38, 0.22, -0.65);
    rightFin.rotation.z = Math.PI / 6;
    group.add(rightFin);

  } else if (charId === 'g-eda-quantum-matrix') {
    // ==========================================
    // G-EDA ENCLOSURE & QUANTUM PRINT CORE
    // ==========================================
    const enclosure = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 0.75), holoGlowMat);
    group.add(enclosure);

    const wireShield = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.66, 0.76), holoGridMat);
    group.add(wireShield);

    const core = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 0.45), eyeMat);
    group.add(core);

  } else if (charId === 'mandalorians-mando-bocatan') {
    // ==========================================
    // MANDALORIAN DUAL WARRIOR SILHOUETTE
    // ==========================================
    // Din Djarin
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.55, 0.28), holoGlowMat);
    torso.position.set(-0.25, 0.2, 0);
    group.add(torso);

    const helm = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.32, 12), holoGlowMat);
    helm.position.set(-0.25, 0.65, 0);
    group.add(helm);

    const tVisor = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.05), eyeMat);
    tVisor.position.set(-0.25, 0.65, 0.16);
    group.add(tVisor);

    const tStem = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.14, 0.05), eyeMat);
    tStem.position.set(-0.25, 0.59, 0.16);
    group.add(tStem);

    // Bo-Katan
    const torso2 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.52, 0.24), holoGridMat);
    torso2.position.set(0.32, 0.18, -0.1);
    group.add(torso2);

    const helm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.3, 12), holoGridMat);
    helm2.position.set(0.32, 0.62, -0.1);
    group.add(helm2);

    const legs = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.65, 0.2), holoGlowMat);
    legs.position.y = -0.38;
    group.add(legs);

  } else if (charId === 'kotor-nihilus-kreia') {
    // ==========================================
    // NIHILUS & KREIA SITH LORDS
    // ==========================================
    const robe = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.2, 12), holoGlowMat);
    robe.position.y = 0.1;
    group.add(robe);

    // Nihilus white mask
    const mask = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 12), eyeMat);
    mask.scale.set(0.9, 1.2, 0.5);
    mask.position.set(0, 0.72, 0.1);
    group.add(mask);

    // Red Sith lightsaber
    const saber = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1.1, 8),
      new THREE.MeshBasicMaterial({ color: 0xff0044 })
    );
    saber.position.set(0.38, 0.45, 0.2);
    saber.rotation.z = -Math.PI / 5;
    group.add(saber);

  } else if (charId === 'kotor-malak-bastila') {
    // ==========================================
    // MALAK & BASTILA
    // ==========================================
    const malakTorso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.28), holoGlowMat);
    malakTorso.position.set(-0.25, 0.25, 0);
    group.add(malakTorso);

    const malakHead = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 12), holoGlowMat);
    malakHead.position.set(-0.25, 0.7, 0);
    group.add(malakHead);

    // Malak steel jaw
    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.1), eyeMat);
    jaw.position.set(-0.25, 0.62, 0.12);
    group.add(jaw);

    // Bastila double-bladed yellow saber
    const saberStaff = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8),
      new THREE.MeshBasicMaterial({ color: 0xfacc15 })
    );
    saberStaff.position.set(0.35, 0.4, 0);
    saberStaff.rotation.x = Math.PI / 4;
    group.add(saberStaff);

    const legs = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.22), holoGridMat);
    legs.position.y = -0.38;
    group.add(legs);

  } else if (vClass === 'starfighter' || charId.includes('starfighter') || charId.includes('n-1')) {
    // ==========================================
    // STARFIGHTER PROCEDURAL 3D AIRFRAME (N-1 Beskar Chrome Style)
    // ==========================================
    // Aerodynamic needle fuselage
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.24, 1.9, 10), holoGlowMat);
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, 0, 0.2);
    group.add(nose);

    const noseWire = new THREE.Mesh(new THREE.ConeGeometry(0.25, 1.92, 10), holoGridMat);
    noseWire.rotation.x = Math.PI / 2;
    noseWire.position.set(0, 0, 0.2);
    group.add(noseWire);

    // Bubble Canopy Cockpit
    const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), eyeMat);
    canopy.scale.set(0.85, 0.9, 1.4);
    canopy.position.set(0, 0.16, -0.15);
    group.add(canopy);

    // Foundling Dome (Astromech slot)
    const foundlingDome = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), holoGridMat);
    foundlingDome.position.set(0, 0.14, -0.6);
    group.add(foundlingDome);

    // Swept primary wings
    const wings = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.04, 0.52), holoGlowMat);
    wings.position.set(0, 0.02, -0.2);
    group.add(wings);

    const wingsWire = new THREE.Mesh(new THREE.BoxGeometry(2.42, 0.05, 0.53), holoGridMat);
    wingsWire.position.set(0, 0.02, -0.2);
    group.add(wingsWire);

    // Twin Wingtip Engine Pods
    const createNacelle = (xOffset: number) => {
      const nacelleGroup = new THREE.Group();
      nacelleGroup.position.set(xOffset, 0.02, -0.2);

      const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.95, 12), holoGlowMat);
      pod.rotation.x = Math.PI / 2;
      nacelleGroup.add(pod);

      const coneNose = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 10), holoGridMat);
      coneNose.rotation.x = -Math.PI / 2;
      coneNose.position.set(0, 0, 0.6);
      nacelleGroup.add(coneNose);

      const thrusterGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.15, 10), eyeMat);
      thrusterGlow.rotation.x = Math.PI / 2;
      thrusterGlow.position.set(0, 0, -0.52);
      nacelleGroup.add(thrusterGlow);

      return nacelleGroup;
    };
    group.add(createNacelle(-1.18));
    group.add(createNacelle(1.18));

    // Dual Forward Blaster Cannons
    const gunL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 6), holoGridMat);
    gunL.rotation.x = Math.PI / 2;
    gunL.position.set(-0.28, -0.04, 0.7);
    group.add(gunL);

    const gunR = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 6), holoGridMat);
    gunR.rotation.x = Math.PI / 2;
    gunR.position.set(0.28, -0.04, 0.7);
    group.add(gunR);

  } else if (vClass === 'freighter' || charId.includes('freighter') || charId.includes('razor') || charId.includes('crest')) {
    // ==========================================
    // ARMORED FREIGHTER / GUNSHIP (Razor Crest ST-70 Style)
    // ==========================================
    // Broad Armored Center Hull
    const mainHull = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.58, 2.0), holoGlowMat);
    mainHull.position.set(0, 0.1, 0);
    group.add(mainHull);

    const mainHullWire = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.6, 2.02), holoGridMat);
    mainHullWire.position.set(0, 0.1, 0);
    group.add(mainHullWire);

    // Forward Slanted Nose Cowling
    const noseCowl = new THREE.Mesh(new THREE.ConeGeometry(0.48, 0.75, 4), holoGlowMat);
    noseCowl.rotation.x = Math.PI / 2;
    noseCowl.rotation.y = Math.PI / 4;
    noseCowl.position.set(0, 0.08, 1.25);
    group.add(noseCowl);

    // Cockpit Transparisteel Window Band
    const cockpitBand = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 0.22), eyeMat);
    cockpitBand.position.set(0, 0.28, 0.95);
    group.add(cockpitBand);

    // Twin Massive Side Ion Turbines
    const createIonTurbine = (xPos: number) => {
      const turbineGroup = new THREE.Group();
      turbineGroup.position.set(xPos, 0.22, -0.15);

      const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.35, 1.5, 14), holoGlowMat);
      cylinder.rotation.x = Math.PI / 2;
      turbineGroup.add(cylinder);

      const intake = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.15, 14), holoGridMat);
      intake.rotation.x = Math.PI / 2;
      intake.position.set(0, 0, 0.75);
      turbineGroup.add(intake);

      const exhaustGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, 0.2, 14), eyeMat);
      exhaustGlow.rotation.x = Math.PI / 2;
      exhaustGlow.position.set(0, 0, -0.8);
      turbineGroup.add(exhaustGlow);

      return turbineGroup;
    };
    group.add(createIonTurbine(-0.85));
    group.add(createIonTurbine(0.85));

    // Chin-Mounted Heavy Laser Cannons
    const chinGunL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.5), holoGridMat);
    chinGunL.position.set(-0.35, -0.12, 1.15);
    group.add(chinGunL);

    const chinGunR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.5), holoGridMat);
    chinGunR.position.set(0.35, -0.12, 1.15);
    group.add(chinGunR);

  } else if (vClass === 'speeder' || charId.includes('speeder') || charId.includes('swoop')) {
    // ==========================================
    // TARISIAN SWOOP SPEEDER (High-G Racing Craft)
    // ==========================================
    // Central Turbine Chassis
    const turbine = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 2.1, 12), holoGlowMat);
    turbine.rotation.x = Math.PI / 2;
    turbine.position.set(0, 0, 0);
    group.add(turbine);

    const turbineWire = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.17, 2.12, 12), holoGridMat);
    turbineWire.rotation.x = Math.PI / 2;
    group.add(turbineWire);

    // Forward Outrigger Repulsorlift Skids
    const skidL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 1.1), holoGlowMat);
    skidL.position.set(-0.45, -0.1, 0.6);
    group.add(skidL);

    const skidR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 1.1), holoGlowMat);
    skidR.position.set(0.45, -0.1, 0.6);
    group.add(skidR);

    // Front Stabilizer Struts
    const strutL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6), holoGridMat);
    strutL.rotation.z = Math.PI / 4;
    strutL.position.set(-0.25, -0.05, 0.7);
    group.add(strutL);

    const strutR = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6), holoGridMat);
    strutR.rotation.z = -Math.PI / 4;
    strutR.position.set(0.25, -0.05, 0.7);
    group.add(strutR);

    // Pilot Saddle & Handlebars
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 0.45), holoGlowMat);
    seat.position.set(0, 0.18, -0.2);
    group.add(seat);

    const handlebars = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.55, 6), holoGridMat);
    handlebars.rotation.z = Math.PI / 2;
    handlebars.position.set(0, 0.32, 0.1);
    group.add(handlebars);

    // Glowing Afterburner Cone
    const afterburner = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.45, 10), eyeMat);
    afterburner.rotation.x = -Math.PI / 2;
    afterburner.position.set(0, 0, -1.2);
    group.add(afterburner);

  } else if (vClass === 'rover' || charId.includes('rover')) {
    // ==========================================
    // ALL-TERRAIN PLANETARY ROVER (6-Wheel Explorer)
    // ==========================================
    // Pressurized Scout Cabin
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.62, 1.8), holoGlowMat);
    cabin.position.set(0, 0.24, 0);
    group.add(cabin);

    const cabinWire = new THREE.Mesh(new THREE.BoxGeometry(1.07, 0.64, 1.82), holoGridMat);
    cabinWire.position.set(0, 0.24, 0);
    group.add(cabinWire);

    // Panoramic Front Windshield
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.28, 0.15), eyeMat);
    windshield.position.set(0, 0.35, 0.88);
    group.add(windshield);

    // 6 Independent All-Terrain Cylinder Wheels
    const wheelPositions = [
      [-0.68, -0.08, -0.65],
      [0.68, -0.08, -0.65],
      [-0.68, -0.08, 0],
      [0.68, -0.08, 0],
      [-0.68, -0.08, 0.65],
      [0.68, -0.08, 0.65],
    ];
    wheelPositions.forEach(([wx, wy, wz]) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.22, 14), holoGlowMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, wy, wz);
      group.add(wheel);

      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.24, 10), eyeMat);
      hub.rotation.z = Math.PI / 2;
      hub.position.set(wx, wy, wz);
      group.add(hub);
    });

    // Communication & Sensor Dish Mast
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.5, 6), holoGridMat);
    mast.position.set(-0.35, 0.72, -0.4);
    group.add(mast);

    const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.06, 0.08, 12), holoGlowMat);
    dish.rotation.x = Math.PI / 4;
    dish.position.set(-0.35, 0.95, -0.4);
    group.add(dish);

  } else {
    // Standard Humanoid Explorer / Felipe Zamora
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.58, 0.26), holoGlowMat);
    torso.position.y = 0.22;
    group.add(torso);

    const torsoWire = new THREE.Mesh(new THREE.BoxGeometry(0.49, 0.59, 0.27), holoGridMat);
    torsoWire.position.y = 0.22;
    group.add(torsoWire);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 14), holoGlowMat);
    head.position.y = 0.68;
    group.add(head);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 0.06), eyeMat);
    visor.position.set(0, 0.68, 0.16);
    group.add(visor);

    const legs = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.68, 0.22), holoGlowMat);
    legs.position.y = -0.4;
    group.add(legs);
  }

  return group;
}

/**
 * Creates a circular floor ring label projected directly on the base pedestal floor disc.
 * Never floats in the air, so the 3D hologram is 100% visible and uncluttered!
 */
function createPedestalFloorLabel(name: string, role: string): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 512, 128);

    // Glowing subtle plaque border
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, 496, 112);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name.toUpperCase(), 256, 56);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '22px monospace';
    ctx.fillText(role.slice(0, 28), 256, 96);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const geo = new THREE.PlaneGeometry(1.4, 0.38);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2.3; // Slanted towards front camera
  mesh.position.set(0, 0, 0.95); // Resting cleanly at base front edge
  return mesh;
}
