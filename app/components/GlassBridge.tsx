'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Html, Sphere, Box, Text, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export default function GlassBridge() {
  const bridgeRef = useRef<THREE.Group>(null);
  
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (bridgeRef.current) {
      // Gentle parallax effect tracking the mouse
      bridgeRef.current.rotation.y = THREE.MathUtils.lerp(bridgeRef.current.rotation.y, (mouse.x * Math.PI) / 10, 0.05);
      bridgeRef.current.rotation.x = THREE.MathUtils.lerp(bridgeRef.current.rotation.x, -(mouse.y * Math.PI) / 20, 0.05);
    }
  });
  
  // Create a curved path for the bridge
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-10, -2, -5),
      new THREE.Vector3(-5, 0, -2),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(5, 0, -2),
      new THREE.Vector3(10, -2, -5)
    ]);
  }, []);

  const tubeGeometry = useMemo(() => new THREE.TubeGeometry(curve, 64, 2, 8, false), [curve]);

  return (
    <group ref={bridgeRef}>
      {/* Background Sparkles / Particles */}
      <Sparkles count={200} scale={15} size={2} speed={0.2} opacity={0.3} color="#00ffcc" />

      {/* Main Glass Bridge */}
      <mesh geometry={tubeGeometry} position={[0, -1, -2]}>
        <MeshTransmissionMaterial 
          thickness={0.5} 
          roughness={0.1} 
          transmission={0.95} 
          ior={1.5} 
          color="#ffffff"
          clearcoat={1}
        />
      </mesh>

      {/* Circuit Pathways (Glowing Lines) */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
        <group position={[0, -0.5, 0]}>
          <mesh position={[-3, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 8, 8]} />
            <meshStandardMaterial color="#ff7a00" emissive="#ff7a00" emissiveIntensity={2} />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.02, 0.02, 4, 8]} />
            <meshStandardMaterial color="#ff7a00" emissive="#ff7a00" emissiveIntensity={2} />
          </mesh>
          <mesh position={[3, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <cylinderGeometry args={[0.02, 0.02, 4, 8]} />
            <meshStandardMaterial color="#ff7a00" emissive="#ff7a00" emissiveIntensity={2} />
          </mesh>
        </group>
      </Float>

      {/* Glowing Neural Network Cube */}
      <Float speed={3} rotationIntensity={1} floatIntensity={1}>
        <group position={[0, 1.5, 0]}>
          <Box args={[1.5, 1.5, 1.5]}>
            <meshStandardMaterial color="#00d8ff" wireframe />
          </Box>
          <Box args={[1, 1, 1]}>
            <meshStandardMaterial color="#00d8ff" emissive="#00d8ff" emissiveIntensity={1} transparent opacity={0.6} />
          </Box>
          <Html position={[0, -1.2, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
            <div className="glass-label">Gemini API Orchestrator</div>
          </Html>
        </group>
      </Float>

      {/* Metallic World Map (Stylized wireframe sphere) */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        <group position={[-4, 1, -1]}>
          <Sphere args={[1, 32, 32]}>
            <meshStandardMaterial color="#b8c6db" metalness={0.9} roughness={0.1} wireframe />
          </Sphere>
          <Html position={[0, -1.2, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
            <div className="glass-label">Modular PyQt Designers</div>
          </Html>
        </group>
      </Float>

      {/* Sleek Hardware Module */}
      <Float speed={2.5} rotationIntensity={0.4} floatIntensity={1}>
        <group position={[4, 0.8, 1]}>
          <Box args={[2, 0.5, 1.5]}>
            <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
          </Box>
          <Html position={[0, -0.6, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
            <div className="glass-label">Distributed Playwright Cloud</div>
          </Html>
        </group>
      </Float>
    </group>
  );
}
