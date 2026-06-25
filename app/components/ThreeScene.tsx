'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera, ContactShadows, OrbitControls } from '@react-three/drei';
import SurrealCore from './SurrealCore';
import { useState, useEffect } from 'react';

export default function ThreeScene() {
  const [eventSource, setEventSource] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setEventSource(document.body);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
      <Canvas dpr={[1, 2]} shadows eventSource={eventSource || undefined} eventPrefix="client">
        <PerspectiveCamera makeDefault position={[0, 2, 12]} fov={45} />
        
        {/* Cool Luxury Lighting */}
        <ambientLight intensity={0.2} color="#0B132B" />
        <spotLight position={[10, 15, 10]} angle={0.4} penumbra={1} intensity={1.5} color="#E2E8F0" castShadow />
        <spotLight position={[-10, 5, -10]} angle={0.5} penumbra={1} intensity={1.5} color="#A1B0C4" />
        <pointLight position={[0, -5, 5]} intensity={0.8} color="#1C2541" />
        
        {/* Environment for glossy reflections */}
        <Environment preset="city" />

        <SurrealCore />

        <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.8} far={10} color="#000000" position={[0, -3, 0]} />

        {/* Controls */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
          maxPolarAngle={Math.PI / 2 + 0.1}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}
