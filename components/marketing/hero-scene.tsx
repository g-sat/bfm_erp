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
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.7}>
      <mesh position={position} rotation={rotation} scale={scale}>
        <boxGeometry args={[1.4, 1.05, 0.08]} />
        <meshStandardMaterial
          color={color}
          metalness={0.55}
          roughness={0.22}
          emissive={color === "#e10600" ? "#e10600" : "#111"}
          emissiveIntensity={color === "#e10600" ? 0.25 : 0.05}
        />
      </mesh>
      <mesh position={[position[0], position[1], position[2] + 0.06]} rotation={rotation} scale={scale}>
        <planeGeometry args={[1.15, 0.8]} />
        <meshStandardMaterial color="#1a0a0a" metalness={0.2} roughness={0.45} />
      </mesh>
    </Float>
  );
}

function OrbitRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.18;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2.4, 0.2, 0]}>
      <torusGeometry args={[2.2, 0.02, 16, 140]} />
      <meshStandardMaterial
        color="#e10600"
        emissive="#e10600"
        emissiveIntensity={0.65}
        metalness={0.7}
        roughness={0.15}
      />
    </mesh>
  );
}

function Particles() {
  const points = useMemo(() => {
    const arr = new Float32Array(240);
    for (let i = 0; i < 80; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 7;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return arr;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.06;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#ff4d45" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#0a0505"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 3]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-2, 1, 2]} intensity={1.4} color="#e10600" />
      <OrbitRing />
      <Frame position={[-0.9, 0.35, 0.2]} rotation={[0.18, 0.45, -0.12]} color="#111111" scale={0.95} />
      <Frame position={[0.85, -0.15, -0.1]} rotation={[-0.2, -0.55, 0.08]} color="#e10600" scale={1.05} />
      <Frame position={[0.1, 0.85, -0.4]} rotation={[0.35, 0.15, 0.2]} color="#1a1a1a" scale={0.7} />
      <Float speed={2} floatIntensity={1}>
        <mesh position={[1.55, 0.95, 0.4]}>
          <icosahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial color="#e10600" emissive="#e10600" emissiveIntensity={0.5} metalness={0.6} roughness={0.15} />
        </mesh>
      </Float>
      <Float speed={1.6} floatIntensity={0.8}>
        <mesh position={[-1.5, -0.7, 0.3]} rotation={[0.4, 0.2, 0.1]}>
          <octahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.25} />
        </mesh>
      </Float>
      <Particles />
      <ContactShadows position={[0, -1.45, 0]} opacity={0.45} scale={9} blur={2.8} far={4} color="#e10600" />
      <Environment preset="night" />
    </>
  );
}

export function HeroScene() {
  return (
    <div className="relative h-full min-h-[280px] w-full overflow-hidden bg-[#0a0505]">
      <Canvas camera={{ position: [0, 0.35, 5.2], fov: 38 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
        <Scene />
      </Canvas>
    </div>
  );
}
