"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Frame({
  position,
  rotation,
  scale = 1,
  color = "#e10600",
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color?: string;
}) {
  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.6}>
      <mesh position={position} rotation={rotation} scale={scale}>
        <boxGeometry args={[1.4, 1.05, 0.08]} />
        <meshStandardMaterial color={color} metalness={0.35} roughness={0.28} />
      </mesh>
      <mesh position={[position[0], position[1], position[2] + 0.06]} rotation={rotation} scale={scale}>
        <planeGeometry args={[1.15, 0.8]} />
        <meshStandardMaterial color="#fff5f4" metalness={0.05} roughness={0.55} />
      </mesh>
    </Float>
  );
}

function OrbitRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.15;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2.4, 0.2, 0]}>
      <torusGeometry args={[2.15, 0.018, 16, 120]} />
      <meshStandardMaterial color="#e10600" emissive="#e10600" emissiveIntensity={0.35} metalness={0.6} roughness={0.2} />
    </mesh>
  );
}

function Particles() {
  const points = useMemo(() => {
    const arr = new Float32Array(180);
    for (let i = 0; i < 60; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 4;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    return arr;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.05;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#e10600" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 6, 3]} intensity={1.15} color="#ffffff" />
      <directionalLight position={[-3, 2, -2]} intensity={0.35} color="#ffb3ad" />
      <OrbitRing />
      <Frame position={[-0.9, 0.35, 0.2]} rotation={[0.18, 0.45, -0.12]} color="#0a0a0a" scale={0.95} />
      <Frame position={[0.85, -0.15, -0.1]} rotation={[-0.2, -0.55, 0.08]} color="#e10600" scale={1.05} />
      <Frame position={[0.1, 0.85, -0.4]} rotation={[0.35, 0.15, 0.2]} color="#1a1a1a" scale={0.7} />
      <Float speed={2} floatIntensity={0.9}>
        <mesh position={[1.55, 0.95, 0.4]}>
          <icosahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial color="#e10600" metalness={0.55} roughness={0.2} />
        </mesh>
      </Float>
      <Float speed={1.6} floatIntensity={0.7}>
        <mesh position={[-1.5, -0.7, 0.3]} rotation={[0.4, 0.2, 0.1]}>
          <octahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.4} roughness={0.3} />
        </mesh>
      </Float>
      <Particles />
      <ContactShadows position={[0, -1.45, 0]} opacity={0.28} scale={8} blur={2.6} far={4} />
      <Environment preset="city" />
    </>
  );
}

export function HeroScene() {
  return (
    <div className="relative h-full min-h-[280px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#fff1f0] via-white to-[#f5f5f5]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(225,6,0,0.12),transparent_55%)]" />
      <Canvas
        camera={{ position: [0, 0.35, 5.2], fov: 38 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
