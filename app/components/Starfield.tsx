'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Layered stars for parallax
    const stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];

    const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < 150; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.5,
          speed: Math.random() * 0.5 + 0.1, // speeds vary for parallax
          opacity: Math.random(),
        });
      }
    };

    const mouse = { x: width / 2, y: height / 2 };
    const targetMouse = { x: width / 2, y: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initStars();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Smoothly interpolate mouse position
      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;

      // Calculate center offset
      const offsetX = (mouse.x - width / 2) * 0.1;
      const offsetY = (mouse.y - height / 2) * 0.1;

      const currentTheme = theme === 'system' ? systemTheme : theme;
      const isDark = currentTheme === 'dark';

      stars.forEach((star) => {
        ctx.fillStyle = isDark 
          ? `rgba(226, 232, 240, ${star.opacity * 0.8})` // Ice blue / Silver
          : `rgba(161, 176, 196, ${star.opacity * 0.8})`; // Cool grey
          
        ctx.beginPath();
        // Add subtle horizontal drift
        star.x += Math.sin(Date.now() * 0.001 + star.y) * 0.2 * star.speed;

        const xPos = star.x - offsetX * star.speed;
        const yPos = star.y - offsetY * star.speed;
        
        ctx.arc(xPos, yPos, star.size * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Move star downwards very gently
        star.y += star.speed * 0.2;

        // Reset if offscreen
        if (star.y - offsetY * star.speed > height) {
          star.y = -50;
          star.x = Math.random() * width;
        } else if (star.y - offsetY * star.speed < -50) {
          star.y = height + 50;
          star.x = Math.random() * width;
        }
        
        if (star.x - offsetX * star.speed > width + 50) {
          star.x = -50;
        } else if (star.x - offsetX * star.speed < -50) {
          star.x = width + 50;
        }

        // Smooth Twinkle effect
        star.opacity += (Math.random() - 0.5) * 0.02;
        star.opacity = Math.max(0.05, Math.min(0.6, star.opacity));
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, systemTheme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -2, // Behind the animated nebulas (-1)
      }}
    />
  );
}
