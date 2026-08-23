'use client';

import { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber';
import { Environment, ContactShadows, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/**
 * ════════════════════════════════════════════════════════════════
 * G FORCE TYRES — HYPER-REALISTIC MOTORSPORT BURNOUT 3D EXPERIENCE
 *
 * References:
 * - Michelin Pilot Sport Cup 2 / Pirelli P-Zero Corsa
 * - BMW M Competition Forged V-Spoke Monoblock Wheels
 * - Carbon-Ceramic 400mm Drilled Brakes with 6-Piston Caliper
 * - Volumetric Drift Smoke & Burnout Particle Vortices
 * ════════════════════════════════════════════════════════════════
 */

/** Procedural Ultra-Detailed Velvet Sidewall & Asymmetric Cup 2 Tread Maps */
function useMotorsportTextures() {
  return useMemo(() => {
    // 1. TREAD NORMAL & BUMP MAP (1024x1024)
    const tCanvas = document.createElement('canvas');
    tCanvas.width = 1024;
    tCanvas.height = 1024;
    const tCtx = tCanvas.getContext('2d');

    if (tCtx) {
      // Base normal (128, 128, 255)
      tCtx.fillStyle = '#8080ff';
      tCtx.fillRect(0, 0, 1024, 1024);

      // 4 Asymmetrical Deep Evacuation Grooves
      const grooves = [
        { pos: 0.22, width: 32, depth: '#3030c0' },
        { pos: 0.42, width: 38, depth: '#2828b8' },
        { pos: 0.64, width: 36, depth: '#2828b8' },
        { pos: 0.82, width: 28, depth: '#3535c8' },
      ];

      grooves.forEach((g) => {
        tCtx.fillStyle = g.depth;
        tCtx.fillRect(1024 * g.pos - g.width / 2, 0, g.width, 1024);
        // Beveled edges
        tCtx.fillStyle = '#5050e0';
        tCtx.fillRect(1024 * g.pos - g.width / 2 - 4, 0, 4, 1024);
        tCtx.fillStyle = '#a0a0ff';
        tCtx.fillRect(1024 * g.pos + g.width / 2, 0, 4, 1024);
      });

      // Outer Massive Grip Shoulder Blocks (Track Cup 2 Spec)
      const blockHeight = 44;
      for (let y = 0; y < 1024; y += blockHeight) {
        // Left Track Shoulder
        tCtx.fillStyle = '#a8a8ff';
        tCtx.fillRect(0, y + 4, 1024 * 0.16, blockHeight - 8);
        tCtx.fillStyle = '#4040cc';
        tCtx.fillRect(0, y, 1024 * 0.16, 4);

        // Right Outer Shoulder
        tCtx.fillStyle = '#a8a8ff';
        tCtx.fillRect(1024 * 0.86, y + 4, 1024 * 0.14, blockHeight - 8);
        tCtx.fillStyle = '#4040cc';
        tCtx.fillRect(1024 * 0.86, y, 1024 * 0.14, 4);

        // Diagonal Center Evacuation Sipes
        tCtx.save();
        tCtx.translate(1024 * 0.32, y + 16);
        tCtx.rotate(-0.35);
        tCtx.fillStyle = '#5050d0';
        tCtx.fillRect(-40, -4, 90, 8);
        tCtx.restore();

        tCtx.save();
        tCtx.translate(1024 * 0.74, y + 16);
        tCtx.rotate(0.32);
        tCtx.fillStyle = '#5050d0';
        tCtx.fillRect(-45, -4, 90, 8);
        tCtx.restore();
      }

      // Micro-texture Rubber Grain
      const imgData = tCtx.getImageData(0, 0, 1024, 1024);
      for (let i = 0; i < imgData.data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 12;
        imgData.data[i] = Math.min(255, Math.max(0, imgData.data[i] + noise));
        imgData.data[i + 1] = Math.min(255, Math.max(0, imgData.data[i + 1] + noise));
      }
      tCtx.putImageData(imgData, 0, 0);
    }

    // 2. SIDEWALL EMBOSSED VELVET TEXTURE (1024x1024)
    const swCanvas = document.createElement('canvas');
    swCanvas.width = 1024;
    swCanvas.height = 1024;
    const swCtx = swCanvas.getContext('2d');

    if (swCtx) {
      swCtx.fillStyle = '#141414';
      swCtx.fillRect(0, 0, 1024, 1024);

      const center = 512;

      // Concentric velvet texture rings
      swCtx.strokeStyle = '#222222';
      swCtx.lineWidth = 1.5;
      for (let r = 320; r < 480; r += 3) {
        swCtx.beginPath();
        swCtx.arc(center, center, r, 0, Math.PI * 2);
        swCtx.stroke();
      }

      // Radial embossed text: G FORCE PERFORMANCE
      swCtx.save();
      swCtx.translate(center, center);
      swCtx.font = 'bold 36px "Inter", "Arial Black", sans-serif';
      swCtx.fillStyle = '#3a3a3a';
      swCtx.textAlign = 'center';
      swCtx.textBaseline = 'middle';

      const topText = 'G FORCE RACING · PILOT SPORT';
      for (let i = 0; i < topText.length; i++) {
        const char = topText[i];
        const angle = -Math.PI / 2 + (i - topText.length / 2) * 0.08;
        swCtx.save();
        swCtx.rotate(angle);
        swCtx.fillText(char, 0, -400);
        swCtx.restore();
      }

      const bottomText = '285/30 ZR20 · EXTRA LOAD · TUBELESS';
      for (let i = 0; i < bottomText.length; i++) {
        const char = bottomText[i];
        const angle = Math.PI / 2 + (i - bottomText.length / 2) * 0.07;
        swCtx.save();
        swCtx.rotate(angle);
        swCtx.fillText(char, 0, 410);
        swCtx.restore();
      }
      swCtx.restore();
    }

    // 3. CARBON CERAMIC ROTOR MAP (512x512)
    const rCanvas = document.createElement('canvas');
    rCanvas.width = 512;
    rCanvas.height = 512;
    const rCtx = rCanvas.getContext('2d');

    if (rCtx) {
      rCtx.fillStyle = '#383b40'; // Carbon ceramic dark grey
      rCtx.fillRect(0, 0, 512, 512);

      const center = 256;
      // Concentric composite fiber grain
      for (let r = 90; r < 240; r += 1.5) {
        const shade = Math.floor(45 + Math.random() * 25);
        rCtx.strokeStyle = `rgb(${shade},${shade + 2},${shade + 5})`;
        rCtx.beginPath();
        rCtx.arc(center, center, r, 0, Math.PI * 2);
        rCtx.stroke();
      }

      // Curved spiral cooling vent slots
      rCtx.fillStyle = '#0a0a0c';
      for (let arm = 0; arm < 16; arm++) {
        const baseAngle = (arm / 16) * Math.PI * 2;
        for (let step = 0; step < 5; step++) {
          const r = 120 + step * 22;
          const a = baseAngle + (step * 0.08);
          const x = center + Math.cos(a) * r;
          const y = center + Math.sin(a) * r;
          rCtx.beginPath();
          rCtx.arc(x, y, 3.5, 0, Math.PI * 2);
          rCtx.fill();
        }
      }
    }

    const treadTex = new THREE.CanvasTexture(tCanvas);
    treadTex.wrapS = treadTex.wrapT = THREE.RepeatWrapping;
    treadTex.repeat.set(16, 1);

    const sidewallTex = new THREE.CanvasTexture(swCanvas);
    const rotorTex = new THREE.CanvasTexture(rCanvas);

    return { treadTex, sidewallTex, rotorTex };
  }, []);
}

/** 3D Realistic Burnout Smoke Simulation using Instanced Puff Particles */
function BurnoutSmoke({ spinningFast }: { spinningFast: boolean }) {
  const count = 45;
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: (Math.random() - 0.5) * 1.8,
      y: -1.4 - Math.random() * 0.4,
      z: -0.8 - Math.random() * 1.4,
      scale: 0.3 + Math.random() * 0.5,
      maxScale: 1.8 + Math.random() * 1.4,
      speedY: 0.8 + Math.random() * 1.2,
      speedZ: -0.6 - Math.random() * 1.0,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 1.2,
      opacity: 0.15 + Math.random() * 0.25,
      age: Math.random() * 2.0,
      life: 2.2 + Math.random() * 1.5,
    }));
  }, [count]);

  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Soft billowing smoke material
  const smokeMat = useMemo(() => {
    // Procedural soft cloud alpha texture
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(230, 240, 255, 0.9)');
      grad.addColorStop(0.4, 'rgba(180, 210, 240, 0.4)');
      grad.addColorStop(0.7, 'rgba(120, 160, 200, 0.15)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
    }
    const tex = new THREE.CanvasTexture(c);

    return new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.NormalBlending,
      color: new THREE.Color('#94C8F0'),
    });
  }, []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const speedMultiplier = spinningFast ? 1.8 : 0.85;

    particles.forEach((p, i) => {
      p.age += delta * speedMultiplier;
      if (p.age >= p.life) {
        // Reset puff at the contact patch
        p.age = 0;
        p.x = (Math.random() - 0.5) * 1.4;
        p.y = -1.45 + (Math.random() - 0.5) * 0.2;
        p.z = -0.4 - Math.random() * 0.6;
        p.rot = Math.random() * Math.PI * 2;
      }

      const progress = p.age / p.life;
      const currentScale = p.scale + progress * (p.maxScale - p.scale);
      const currentY = p.y + progress * p.speedY * 1.6;
      const currentZ = p.z + progress * p.speedZ * 1.2;
      const currentX = p.x + Math.sin(progress * 4 + i) * 0.45;
      p.rot += p.rotSpeed * delta;

      dummy.position.set(currentX, currentY, currentZ);
      dummy.scale.set(currentScale, currentScale, currentScale);
      dummy.rotation.set(0, 0, p.rot);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, smokeMat, count]} />
  );
}

/** Complete Realistic Wheel & Brake Assembly */
function HighPerformanceWheel({ onHover, isHovered }: { onHover: (hovered: boolean) => void; isHovered: boolean }) {
  const wheelRef = useRef<THREE.Group>(null);
  const rotorRef = useRef<THREE.Mesh>(null);
  const { treadTex, sidewallTex, rotorTex } = useMotorsportTextures();

  // Premium Shaders & Materials
  const mats = useMemo(() => {
    // Ultra-Matte High-Traction Compound Rubber
    const treadRubber = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#161616'),
      roughness: 0.85,
      metalness: 0.05,
      normalMap: treadTex,
      normalScale: new THREE.Vector2(1.2, 1.2),
    });

    // Sidewall with Embossed Brand Lettering & Velvet Sheen
    const sidewallRubber = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#111111'),
      map: sidewallTex,
      roughness: 0.65,
      metalness: 0.08,
      envMapIntensity: 1.2,
    });

    // Forged Satin Matte Gunmetal BMW M-Style Wheel
    const forgedMAlloy = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#22252A'),
      roughness: 0.15,
      metalness: 0.95,
      envMapIntensity: 3.2,
    });

    // Diamond Machined High-Gloss Outer Bevels
    const diamondCut = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#EAF0F6'),
      roughness: 0.04,
      metalness: 0.98,
      envMapIntensity: 4.0,
    });

    // Carbon-Ceramic Drilled 400mm Brake Disc
    const carbonRotor = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#4A4E54'),
      map: rotorTex,
      roughness: 0.32,
      metalness: 0.82,
      envMapIntensity: 2.2,
    });

    // Monobloc Brembo 6-Piston Caliper in G Force Electric Cyan/Sky Blue
    const skyBlueCaliper = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#38BDF8'),
      roughness: 0.18,
      metalness: 0.75,
      envMapIntensity: 2.8,
    });

    // Titanium Hardware
    const titanium = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#444850'),
      roughness: 0.25,
      metalness: 0.95,
    });

    // Glowing Inner Brake Rotor Core (Heat Glow during burnouts)
    const heatGlow = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#FF3300'),
      transparent: true,
      opacity: 0.6,
    });

    return { treadRubber, sidewallRubber, forgedMAlloy, diamondCut, carbonRotor, skyBlueCaliper, titanium, heatGlow };
  }, [treadTex, sidewallTex, rotorTex]);

  // 5 Sculpted Y-Spoke Pairs (10 spokes with milled weight-reduction channels)
  const spokeAngles = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => (i / 5) * Math.PI * 2);
  }, []);

  useFrame((state, delta) => {
    const g = wheelRef.current;
    if (!g) return;

    // Dynamic rotation speed (spins faster on hover / burnout)
    const spinSpeed = isHovered ? delta * 3.8 : delta * 0.65;
    g.rotation.z -= spinSpeed;

    // Mouse parallax tilt
    const targetTiltX = state.pointer.y * 0.22;
    const targetTiltY = state.pointer.x * 0.28 - 0.22;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetTiltX, 0.06);
    g.parent!.rotation.y = THREE.MathUtils.lerp(g.parent!.rotation.y, targetTiltY, 0.06);
  });

  return (
    <group
      onPointerOver={() => onHover(true)}
      onPointerOut={() => onHover(false)}
    >
      <group ref={wheelRef}>
        {/* ══════════ TYRE TREAD & CARCASS ══════════ */}
        {/* Wide Contact Patch Crown */}
        <mesh material={mats.treadRubber} castShadow receiveShadow>
          <cylinderGeometry args={[1.42, 1.42, 0.78, 96, 1, true]} />
        </mesh>

        {/* Aggressive Square Track Shoulders */}
        {[0.39, -0.39].map((z) => (
          <mesh key={`shoulder-${z}`} position={[0, 0, z]} material={mats.treadRubber}>
            <torusGeometry args={[1.34, 0.09, 28, 96]} />
          </mesh>
        ))}

        {/* Embossed Sidewall Velvet Discs */}
        {[0.37, -0.37].map((z) => (
          <mesh key={`sw-${z}`} position={[0, 0, z]} material={mats.sidewallRubber}>
            <ringGeometry args={[0.92, 1.38, 96]} />
          </mesh>
        ))}

        {/* Bead Lock Retention Lip */}
        {[0.35, -0.35].map((z) => (
          <mesh key={`bead-${z}`} position={[0, 0, z]} material={mats.sidewallRubber}>
            <torusGeometry args={[0.93, 0.025, 16, 96]} />
          </mesh>
        ))}

        {/* ══════════ FORGED ALLOY WHEEL (BMW M COMPETITION SPEC) ══════════ */}
        {/* Deep Concave Barrel */}
        <mesh material={mats.forgedMAlloy} castShadow>
          <cylinderGeometry args={[0.92, 0.92, 0.72, 80, 1, true]} />
        </mesh>

        {/* Diamond Cut Outer Stepped Lip */}
        <mesh position={[0, 0, 0.36]} material={mats.diamondCut}>
          <torusGeometry args={[0.915, 0.028, 20, 80]} />
        </mesh>
        <mesh position={[0, 0, 0.28]} material={mats.forgedMAlloy}>
          <ringGeometry args={[0.82, 0.92, 80]} />
        </mesh>

        {/* 5-Twin V-Spoke Array with Milled Pocket Cavities */}
        {spokeAngles.map((baseAngle, i) => (
          <group key={`m-spoke-${i}`}>
            {[-0.09, 0.09].map((offset, j) => {
              const angle = baseAngle + offset;
              return (
                <group key={`sub-spoke-${i}-${j}`}>
                  {/* Main Spoke Blade */}
                  <mesh
                    position={[Math.cos(angle) * 0.48, Math.sin(angle) * 0.48, 0.31]}
                    rotation={[0, 0, angle - Math.PI / 2]}
                    material={mats.forgedMAlloy}
                    castShadow
                  >
                    <boxGeometry args={[0.08, 0.78, 0.06]} />
                  </mesh>
                  {/* Diamond Cut Machined Face Chamfer */}
                  <mesh
                    position={[Math.cos(angle) * 0.48, Math.sin(angle) * 0.48, 0.342]}
                    rotation={[0, 0, angle - Math.PI / 2]}
                    material={mats.diamondCut}
                  >
                    <boxGeometry args={[0.04, 0.76, 0.01]} />
                  </mesh>
                </group>
              );
            })}

            {/* Milled Outer V-Bridge */}
            <mesh
              position={[Math.cos(baseAngle) * 0.68, Math.sin(baseAngle) * 0.68, 0.32]}
              rotation={[0, 0, baseAngle - Math.PI / 2]}
              material={mats.diamondCut}
            >
              <boxGeometry args={[0.18, 0.07, 0.035]} />
            </mesh>
          </group>
        ))}

        {/* Concave Centre Hub & Lug Bolt Well */}
        <mesh position={[0, 0, 0.28]} material={mats.forgedMAlloy}>
          <cylinderGeometry args={[0.28, 0.28, 0.09, 48]} />
        </mesh>

        {/* Centre Wheel Cap with G Force Motorsport Colors */}
        <mesh position={[0, 0, 0.34]} material={mats.diamondCut}>
          <cylinderGeometry args={[0.14, 0.14, 0.04, 32]} />
        </mesh>
        <mesh position={[0, 0, 0.362]} material={mats.skyBlueCaliper}>
          <cylinderGeometry args={[0.09, 0.09, 0.008, 32]} />
        </mesh>

        {/* 5 Titanium Wheel Lug Studs */}
        {spokeAngles.map((angle, i) => (
          <mesh
            key={`lug-${i}`}
            position={[Math.cos(angle) * 0.20, Math.sin(angle) * 0.20, 0.33]}
            rotation={[Math.PI / 2, 0, 0]}
            material={mats.titanium}
          >
            <cylinderGeometry args={[0.028, 0.028, 0.035, 6]} />
          </mesh>
        ))}

        {/* Motorsport Air Valve Stem */}
        <mesh position={[0.78, 0.36, 0.33]} rotation={[0.4, 0, -0.6]} material={mats.diamondCut}>
          <cylinderGeometry args={[0.015, 0.015, 0.09, 12]} />
        </mesh>

        {/* ══════════ CARBON-CERAMIC 400MM BRAKES ══════════ */}
        {/* Drilled Ceramic Composite Rotor */}
        <mesh ref={rotorRef} position={[0, 0, 0.12]} material={mats.carbonRotor} receiveShadow>
          <cylinderGeometry args={[0.78, 0.78, 0.035, 64]} />
        </mesh>

        {/* Internal Vane Heat Glow (Active during high speed burnout) */}
        {isHovered && (
          <mesh position={[0, 0, 0.12]} material={mats.heatGlow}>
            <torusGeometry args={[0.55, 0.08, 16, 48]} />
          </mesh>
        )}

        {/* Lightweight Billet Aluminium Brake Bell / Hat */}
        <mesh position={[0, 0, 0.15]} material={mats.titanium}>
          <cylinderGeometry args={[0.34, 0.36, 0.06, 32]} />
        </mesh>

        {/* 6-Piston Monobloc Sky Blue Racing Caliper */}
        <group position={[-0.56, 0.44, 0.18]} rotation={[0, 0, 0.68]}>
          <mesh material={mats.skyBlueCaliper} castShadow>
            <boxGeometry args={[0.26, 0.58, 0.14]} />
          </mesh>
          {/* Caliper Bleed Screws & Hardware */}
          {[-0.18, 0, 0.18].map((y) => (
            <mesh key={`piston-${y}`} position={[0.09, y, 0.04]} rotation={[0, Math.PI / 2, 0]} material={mats.titanium}>
              <cylinderGeometry args={[0.045, 0.045, 0.06, 16]} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

/** Dramatic Studio Lighting */
function MotorsportStudioLights({ isHovered }: { isHovered: boolean }) {
  return (
    <>
      {/* Dark Ambient Atmosphere */}
      <ambientLight color="#0B1218" intensity={0.7} />

      {/* Main Overhead Studio Daylight Spot */}
      <directionalLight
        color="#F0F6FF"
        intensity={3.2}
        position={[6, 10, 5]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* High-Contrast Rim Backlight */}
      <directionalLight
        color="#D0E8FF"
        intensity={4.0}
        position={[-6, 4, -4]}
      />

      {/* G Force Sky Blue Neon Rim Glow (Pulses when drifting/burnout) */}
      <pointLight
        color="#38BDF8"
        intensity={isHovered ? 65 : 42}
        position={[-4.2, 1.8, 3.8]}
        distance={18}
      />

      {/* Golden Friction Heat Glow from Ground */}
      <pointLight
        color={isHovered ? '#FF4500' : '#FFA028'}
        intensity={isHovered ? 25 : 14}
        position={[1.5, -3.2, 2]}
        distance={12}
      />

      {/* Specular Tread Highlight */}
      <spotLight
        color="#FFFFFF"
        intensity={6}
        position={[0, 7, 2.5]}
        angle={0.55}
        penumbra={0.8}
      />
    </>
  );
}

function useCanRender3D() {
  const [canRender, setCanRender] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const canvas = document.createElement('canvas');
      const gl = !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
      setCanRender(gl && !reduced);
    } catch {
      setCanRender(true);
    }
  }, []);

  return canRender;
}

export default function TyreScene({ className }: { className?: string }) {
  const canRender = useCanRender3D();
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (canRender === false) {
    return (
      <div className={`flex h-full w-full items-center justify-center ${className}`}>
        <div className="h-56 w-56 sm:h-64 sm:w-64 rounded-full border-[24px] sm:border-[28px] border-surface-4 shadow-2xl" />
      </div>
    );
  }

  return (
    <div
      className={`relative cursor-grab active:cursor-grabbing select-none ${className}`}
      style={{ touchAction: 'pan-y' }}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Interactive Hint */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 pointer-events-none flex items-center gap-2 bg-surface-2/90 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded border border-line text-[10px] sm:text-[11px] text-ink-2 shadow-lg">
        <span className="h-2 w-2 rounded-full bg-brand animate-ping" />
        <span>{isMobile ? 'Touch & spin for burnout smoke' : 'Hover or drag to spin & trigger burnout smoke'}</span>
      </div>

      <Canvas
        dpr={[1, Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio : 2)]}
        camera={{
          fov: isMobile ? 42 : 36,
          position: [0, isMobile ? 0.05 : 0.12, isMobile ? 4.9 : 4.4],
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        shadows
      >
        <Suspense fallback={null}>
          <MotorsportStudioLights isHovered={isHovered} />

          {/* Dynamic Burnout Smoke Vortices */}
          <BurnoutSmoke spinningFast={isHovered} />

          {/* Glowing Friction Track Sparkles */}
          <Sparkles
            count={isHovered ? (isMobile ? 25 : 40) : (isMobile ? 8 : 15)}
            scale={[3, 1.5, 3]}
            position={[0, -1.2, -0.5]}
            size={isHovered ? 3.5 : 2}
            speed={isHovered ? 3 : 1}
            color="#38BDF8"
          />

          <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.2}>
            <group rotation={[0.12, isMobile ? -0.15 : -0.25, 0]}>
              <HighPerformanceWheel onHover={setIsHovered} isHovered={isHovered} />
            </group>
          </Float>

          {/* Realistic Ground Contact Shadow */}
          <ContactShadows
            position={[0, -1.74, 0]}
            opacity={0.7}
            scale={9.0}
            blur={2.2}
            far={4.8}
            color="#000000"
          />

          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
