'use client';

import { useEffect, useRef } from 'react';

export default function RobotAvatar() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sceneRef.current) return;
      const { innerWidth, innerHeight } = window;
      const rx = ((e.clientY / innerHeight) - 0.5) * -16;
      const ry = ((e.clientX / innerWidth) - 0.5) * 16;
      sceneRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="rbt-container">
      {/* Ambient background glow */}
      <div className="rbt-ambient" />

      {/* 3D Scene */}
      <div className="rbt-scene" ref={sceneRef}>
        <div className="rbt-float">

          {/* Orbiting Ring 1 — cyan */}
          <div className="rbt-ring rbt-ring-1">
            <div className="rbt-ring-dot rbt-ring-dot-1" />
          </div>

          {/* Orbiting Ring 2 — purple */}
          <div className="rbt-ring rbt-ring-2">
            <div className="rbt-ring-dot rbt-ring-dot-2" />
          </div>

          {/* Robot Head */}
          <div className="rbt-head-outer">
            {/* Glowing octagonal border */}
            <div className="rbt-head-border" />
            {/* Dark fill */}
            <div className="rbt-head-fill">

              {/* Antenna */}
              <div className="rbt-antenna">
                <div className="rbt-antenna-glow" />
              </div>

              {/* Top status bar */}
              <div className="rbt-topbar">
                <span className="rbt-led rbt-led-green" />
                <div className="rbt-topbar-line" />
                <span className="rbt-led rbt-led-cyan" />
              </div>

              {/* Visor with Eyes */}
              <div className="rbt-visor">
                <div className="rbt-eye rbt-eye-l" />
                <div className="rbt-eye rbt-eye-r" />
                <div className="rbt-scan-line" />
              </div>

              {/* Chin / mouth panel */}
              <div className="rbt-chin">
                <div className="rbt-chin-bar" />
                <div className="rbt-chin-bar rbt-chin-bar--sm" />
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
