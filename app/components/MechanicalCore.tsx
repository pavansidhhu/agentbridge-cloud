'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html, Sphere, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

export default function MechanicalCore() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create some mechanical-looking materials
  const goldMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#C5A059",
    metalness: 1,
    roughness: 0.2,
    envMapIntensity: 2
  }), []);

  const steelMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#E0E0E0",
    metalness: 0.9,
    roughness: 0.4,
    envMapIntensity: 1.5
  }), []);
  
  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.95,
    ior: 1.5,
    thickness: 0.5,
    clearcoat: 1
  }), []);

  const mousePos = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to +1
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
      // Add elegant idle animation
      const idleY = state.clock.elapsedTime * 0.2;
      const idleX = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

      // Smoothly interpolate current rotation to target rotation + idle
      groupRef.current.rotation.x += (targetRotation.current.x + idleX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (targetRotation.current.y + idleY - groupRef.current.rotation.y) * 0.05;
    }
  });

  return (
    <group ref={groupRef} scale={1.5}>
      {/* Central Glass Core */}
      <mesh material={glassMaterial}>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>
      
      {/* Inner Mechanical Parts */}
      <group>
        <mesh material={goldMaterial}>
          <cylinderGeometry args={[0.5, 0.5, 2.5, 32]} />
        </mesh>
        
        {/* Outer Ring 1 */}
        <mesh material={steelMaterial} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.05, 16, 100]} />
        </mesh>

        {/* Outer Ring 2 */}
        <mesh material={goldMaterial} rotation={[0, Math.PI / 4, 0]}>
          <torusGeometry args={[1.8, 0.02, 16, 100]} />
        </mesh>

        {/* Floating Mechanical Shards */}
        {Array.from({ length: 8 }).map((_, i) => (
          <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={1} position={[
            Math.cos((i / 8) * Math.PI * 2) * 2.5,
            Math.sin(i * Math.PI) * 1.5,
            Math.sin((i / 8) * Math.PI * 2) * 2.5
          ]}>
            <mesh material={i % 2 === 0 ? steelMaterial : goldMaterial} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
              <boxGeometry args={[0.2, 0.8, 0.05]} />
            </mesh>
          </Float>
        ))}
      </group>
    </group>
  );
}
