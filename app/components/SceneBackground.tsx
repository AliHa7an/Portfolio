"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

/* ─── Particle field (unchanged) ─────────────────────────────── */
function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const { positions, colors } = useMemo(() => {
    const count = 1800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#ff7a45"),
      new THREE.Color("#ffd166"),
      new THREE.Color("#8a73ff"),
    ];
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const c = palette[i % palette.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.04;
    ref.current.rotation.x += delta * 0.012;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        sizeAttenuation
        transparent
        opacity={isDark ? 0.85 : 0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ─── React atom — 3 orbital rings ───────────────────────────── */
function ReactAtom({
  position,
  color,
  scale = 1,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  speed?: number;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime * speed;
    group.current.rotation.y = t * 0.28;
    group.current.rotation.x = Math.sin(t * 0.18) * 0.25;
    group.current.position.x = position[0] + Math.sin(t * 0.42) * 0.5;
    group.current.position.y = position[1] + Math.cos(t * 0.55) * 0.5;
    group.current.position.z = position[2];
  });

  // Shared ring args: [radius, tube, radialSeg, tubularSeg]
  const ring: [number, number, number, number] = [1, 0.025, 6, 80];

  return (
    <group ref={group} scale={scale}>
      {/* Orbit 1 — flat */}
      <mesh scale={[1.55, 1, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={ring} />
        <meshBasicMaterial color={color} transparent opacity={0.3} wireframe />
      </mesh>
      {/* Orbit 2 — tilted +60° */}
      <mesh scale={[1.55, 1, 1]} rotation={[Math.PI / 2, 0, Math.PI / 3]}>
        <torusGeometry args={ring} />
        <meshBasicMaterial color={color} transparent opacity={0.3} wireframe />
      </mesh>
      {/* Orbit 3 — tilted −60° */}
      <mesh scale={[1.55, 1, 1]} rotation={[Math.PI / 2, 0, -Math.PI / 3]}>
        <torusGeometry args={ring} />
        <meshBasicMaterial color={color} transparent opacity={0.3} wireframe />
      </mesh>
      {/* Nucleus */}
      <mesh>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

/* ─── Torus knot — algorithm complexity ──────────────────────── */
function TorusKnot({
  position,
  color,
  scale = 1,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    ref.current.position.x = position[0] + Math.sin(t * 0.38) * 0.5;
    ref.current.position.y = position[1] + Math.cos(t * 0.52) * 0.5;
    ref.current.position.z = position[2];
    ref.current.rotation.x += 0.004 * speed;
    ref.current.rotation.y += 0.006 * speed;
    ref.current.rotation.z += 0.002 * speed;
  });

  return (
    <mesh ref={ref} scale={scale}>
      {/* radius, tube, tubularSegments, radialSegments, p, q */}
      <torusKnotGeometry args={[1, 0.22, 120, 10, 2, 3]} />
      <meshBasicMaterial color={color} transparent opacity={0.17} wireframe />
    </mesh>
  );
}

/* ─── Grid cube — data structure / voxel space ───────────────── */
function GridCube({
  position,
  color,
  scale = 1,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    ref.current.position.x = position[0] + Math.cos(t * 0.44) * 0.45;
    ref.current.position.y = position[1] + Math.sin(t * 0.6) * 0.45;
    ref.current.position.z = position[2];
    ref.current.rotation.x += 0.003 * speed;
    ref.current.rotation.y += 0.005 * speed;
    ref.current.rotation.z += 0.0015 * speed;
  });

  return (
    <mesh ref={ref} scale={scale}>
      {/* Subdivided 5×5×5 — shows a grid/matrix pattern on each face */}
      <boxGeometry args={[2, 2, 2, 5, 5, 5]} />
      <meshBasicMaterial color={color} transparent opacity={0.14} wireframe />
    </mesh>
  );
}

/* ─── Scene ───────────────────────────────────────────────────── */
export default function SceneBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      {/* Soft radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 50% at 50% 0%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 70%), radial-gradient(60% 40% at 100% 80%, color-mix(in oklab, var(--accent-3) 12%, transparent), transparent 70%), radial-gradient(60% 40% at 0% 100%, color-mix(in oklab, var(--accent-2) 10%, transparent), transparent 70%)",
        }}
      />
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.18] dark:opacity-[0.22]"
        style={{
          backgroundImage:
            "linear-gradient(var(--line-strong) 1px, transparent 1px), linear-gradient(90deg, var(--line-strong) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at 50% 30%, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 30%, black 30%, transparent 75%)",
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ParticleField />
        {/* React atom — left, accent orange */}
        <ReactAtom position={[-4, 1.5, -2]} color="#ff7a45" scale={1.4} speed={0.55} />
        {/* Torus knot — right, accent purple */}
        <TorusKnot position={[4.5, -0.5, -3]} color="#8a73ff" scale={1.1} speed={0.7} />
        {/* Grid cube — top right, accent yellow */}
        <GridCube position={[2.5, 3, -4]} color="#ffd166" scale={0.95} speed={0.5} />
      </Canvas>
    </div>
  );
}
