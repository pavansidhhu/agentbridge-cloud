'use client';

import Link from 'next/link';
import { sendGAEvent } from '@next/third-parties/google';
import RobotAvatar from './components/RobotAvatar';
import { motion } from 'framer-motion';

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
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: 'spring' as const, stiffness: 70, damping: 14 }
  }
} as const;

export default function Home() {
  return (
    <motion.div 
      className="container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <section className="hero hero-split">

        {/* Left: Text Content */}
        <motion.div className="hero-text" variants={itemVariants}>
          <motion.div className="badge" variants={itemVariants}>
            <span className="badge-dot"></span>
            Now Available — V1.0.0
          </motion.div>
          
          <motion.h1 className="hero-title" variants={itemVariants}>
            Local Gemini <span>Automation Bridge</span>
          </motion.h1>
          
          <motion.p className="hero-subtitle" variants={itemVariants}>
            Supercharge your desktop automations. Bridge PyQt interface, local Playwright browsers, and Gemini API capabilities in one seamless workflow.
          </motion.p>
          
          <motion.div 
            className="btn-group" 
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
            variants={itemVariants}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/download"
                className="btn btn-primary"
                onClick={() => sendGAEvent({ event: 'button_click', value: 'hero_download_nav' })}
              >
                Download Desktop App
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <a 
                href="https://yogarathinam.github.io/AgentBridge/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary"
              >
                Live Demo / Docs
              </a>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} style={{ opacity: 0.8 }}>
              <Link href="/privacy" className="btn btn-secondary">
                Privacy Policy
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right: 3D Robot Agent */}
        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 50, damping: 15, delay: 0.2 }}
        >
          <RobotAvatar />
        </motion.div>

      </section>

      <section className="features-section">
        <motion.div 
          className="section-header" 
          style={{ marginBottom: '4rem', textAlign: 'center' }}
          variants={itemVariants}
        >
          <h2 className="section-title">Engineered for Desktop Automation</h2>
          <p className="section-subtitle">Powerful tools running locally on your hardware</p>
        </motion.div>

        <div className="features">
          <motion.div 
            className="card"
            variants={cardVariants}
            whileHover={{ y: -6 }}
          >
            <div className="card-icon" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%)', color: 'white' }}>🔑</div>
            <h3 className="card-title">Persistent Gemini Sessions</h3>
            <p className="card-desc">
              Keep your Gemini web interface session active and logged in securely. Perform continuous automated queries without session timeout.
            </p>
          </motion.div>

          <motion.div 
            className="card"
            variants={cardVariants}
            whileHover={{ y: -6 }}
          >
            <div className="card-icon" style={{ color: 'var(--accent-secondary)' }}>⚡</div>
            <h3 className="card-title">Local WebSocket API</h3>
            <p className="card-desc">
              A high-speed WebSocket bridge connecting your custom python scripts or third-party applications to the automation runner instantly.
            </p>
          </motion.div>

          <motion.div 
            className="card"
            variants={cardVariants}
            whileHover={{ y: -6 }}
          >
            <div className="card-icon" style={{ color: 'var(--accent)' }}>🖥️</div>
            <h3 className="card-title">Desktop Control Panel</h3>
            <p className="card-desc">
              A premium PyQt-powered interface to manage script execution, configure database endpoints, and monitor logs in real-time.
            </p>
          </motion.div>

          <motion.div 
            className="card"
            variants={cardVariants}
            whileHover={{ y: -6 }}
          >
            <div className="card-icon" style={{ background: 'linear-gradient(135deg, var(--accent-secondary) 0%, var(--accent) 100%)', color: 'white' }}>🤖</div>
            <h3 className="card-title">Playwright Automation</h3>
            <p className="card-desc">
              A robust web browser automation engine designed to execute complex tasks, bypass standard challenges, and report status efficiently.
            </p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
