'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { sendGAEvent } from '@next/third-parties/google';
import { motion } from 'framer-motion';

const DOWNLOAD_URL = 'https://github.com/Yogarathinam/agentbridge/releases/latest';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring' as const, stiffness: 80, damping: 15 }
  }
} as const;

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 70, damping: 14 }
  }
} as const;

export default function Download() {
  const [os, setOs] = useState('Windows');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const platform = window.navigator.platform.toLowerCase();
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (platform.includes('mac') || userAgent.includes('mac')) {
        setOs('macOS');
      } else if (platform.includes('linux') || userAgent.includes('linux')) {
        setOs('Linux');
      } else {
        setOs('Windows');
      }
    }
  }, []);

  return (
    <motion.div 
      className="container" 
      style={{ paddingBottom: '6rem', paddingTop: '3rem' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="download-card card" 
        style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 5rem auto' }}
        variants={cardVariants}
        whileHover={{ y: -4 }}
      >
        <div className="badge">
          <span className="badge-dot"></span>
          Latest Stable Release
        </div>

        <h1 className="hero-title" style={{ fontSize: '3.25rem', marginBottom: '1.25rem' }}>
          Get <span>AgentBridge</span>
        </h1>

        <p className="hero-subtitle" style={{ fontSize: '1.15rem', marginBottom: '2.5rem' }}>
          Download the latest version of AgentBridge Desktop client for local browser control.
        </p>

        <div className="btn-group" style={{ flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <a
              href={DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ minWidth: '280px', padding: '1rem 2.25rem', fontSize: '1.05rem' }}
              onClick={() => sendGAEvent({ event: 'button_click', value: `download_${os.toLowerCase()}` })}
            >
              ↓ &nbsp;Download for {os}
            </a>
          </motion.div>
          <span className="platform-info" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Compatible with Windows 10/11, macOS 11+, and modern Linux distributions.
          </span>
        </div>
      </motion.div>

      <div className="install-guide">
        <motion.div 
          className="section-header" 
          style={{ textAlign: 'left', marginBottom: '4rem' }}
          variants={itemVariants}
        >
          <h2 className="section-title" style={{ fontSize: '2.25rem' }}>Quick Start Installation Guide</h2>
          <p className="section-subtitle">Follow these simple steps to get AgentBridge up and running in minutes</p>
        </motion.div>

        <motion.div className="guide-step" variants={itemVariants}>
          <div className="step-num">1</div>
          <div className="step-content">
            <h3>Download the Executable</h3>
            <p>Click the download button above to retrieve the installation bundle suitable for your operating system.</p>
          </div>
        </motion.div>

        <motion.div className="guide-step" variants={itemVariants}>
          <div className="step-num">2</div>
          <div className="step-content">
            <h3>Run the Installer</h3>
            <p>Launch the downloaded file. Windows users may need to click &quot;More info&quot; and then &quot;Run anyway&quot; if prompted by SmartScreen, as the app is built locally.</p>
          </div>
        </motion.div>

        <motion.div className="guide-step" variants={itemVariants}>
          <div className="step-num">3</div>
          <div className="step-content">
            <h3>Launch and Connect Google Login</h3>
            <p>Start AgentBridge Desktop. In the application control panel, click &quot;Start Gemini Worker&quot;. Sign in to your Google Account through the secure automation browser window that opens.</p>
          </div>
        </motion.div>

        <motion.div className="guide-step" variants={itemVariants}>
          <div className="step-num">4</div>
          <div className="step-content">
            <h3>Start Automating</h3>
            <p>Once registered, AgentBridge will verify your configuration with the cloud backend and boot up your local WebSocket server on port 8000. You are ready to issue commands!</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
