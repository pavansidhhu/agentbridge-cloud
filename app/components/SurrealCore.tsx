'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export default function SurrealCore() {
  const groupRef = useRef<THREE.Group>(null);
  
  const mousePos = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      targetRotation.current.x = (mousePos.current.y * Math.PI) / 8;
      targetRotation.current.y = (mousePos.current.x * Math.PI) / 8;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      const idleY = state.clock.elapsedTime * 0.15;
      const idleX = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;

      groupRef.current.rotation.x += (targetRotation.current.x + idleX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (targetRotation.current.y + idleY - groupRef.current.rotation.y) * 0.05;
    }
  });

  // Soft, Dreamy Materials
  const dreamGlass = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#E2E8F0", // Ice Blue / Silver
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.9,
    ior: 1.2,
    thickness: 2.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  }), []);

  const liquidSilver = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#C0C0C0", // Liquid Silver
    metalness: 1,
    roughness: 0.3,
    envMapIntensity: 2
  }), []);

  const deepNavy = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#0B132B", // Deep Navy
    metalness: 0.8,
    roughness: 0.2,
  }), []);

  return (
    <group ref={groupRef} scale={1.8}>
      {/* Central Dream Sphere */}
      <mesh material={dreamGlass}>
        <sphereGeometry args={[1.2, 64, 64]} />
      </mesh>
      
      {/* Organic Wrapping Torus Knot */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh material={liquidSilver} rotation={[Math.PI / 4, 0, 0]}>
          <torusKnotGeometry args={[1.4, 0.08, 128, 32]} />
        </mesh>
      </Float>

      {/* Outer Delicate Ring */}
      <mesh material={deepNavy} rotation={[-Math.PI / 6, Math.PI / 6, 0]}>
        <torusGeometry args={[2.2, 0.02, 32, 100]} />
      </mesh>

      {/* Floating Petals/Abstract Shapes */}
      {Array.from({ length: 12 }).map((_, i) => (
        <Float key={i} speed={1.5} rotationIntensity={1} floatIntensity={2} position={[
          Math.cos((i / 12) * Math.PI * 2) * (2 + Math.random()),
          Math.sin(i * Math.PI * 1.5) * 2,
          Math.sin((i / 12) * Math.PI * 2) * (2 + Math.random())
        ]}>
          <mesh material={i % 3 === 0 ? liquidSilver : dreamGlass} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
            <sphereGeometry args={[0.15 + Math.random() * 0.1, 32, 32]} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}
