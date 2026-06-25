'use client';

import Link from 'next/link';
import { sendGAEvent } from '@next/third-parties/google';
import { motion } from 'framer-motion';
import Image from 'next/image';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } }
} as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="hero">
        {/* Hero background with logo watermark */}
        <div className="hero-bg">
          {/* Actual logo as massive background watermark */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <Image
              src="/logo-bg.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover', opacity: 0.25 }}
            />
          </div>

          {/* Red radial glow behind logo */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(204,0,0,0.08) 0%, transparent 70%)',
            zIndex: 1
          }} />

          {/* Cinematic gradient overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, #000 0%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.6) 100%)',
            zIndex: 2
          }} />
        </div>

        <motion.div
          className="hero-content"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-eyebrow" variants={fadeUp}>
            AgentBridge — V1.0.0
          </motion.div>

          <motion.h1 className="hero-title" variants={fadeUp}>
            Local Automation<br />
            <span>Bridge</span>
          </motion.h1>

          <motion.div
            variants={fadeUp}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}
          >
            <Link
              href="/download"
              className="btn btn-primary"
              onClick={() => sendGAEvent({ event: 'button_click', value: 'hero_download' })}
            >
              Download App
            </Link>
            <a
              href="https://yogarathinam.github.io/AgentBridge/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              Explore Docs
            </a>
          </motion.div>

          <div className="hero-scroll">
            <div className="hero-scroll-bar" />
            <span className="hero-scroll-text">Scroll</span>
          </div>
        </motion.div>
      </section>

      {/* ===== SPLIT FEATURE 1: Playwright ===== */}
      <motion.section
        className="split-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={stagger}
      >
        <div className="split-visual">
          <Image
            src="/feature-playwright.webp"
            alt="Playwright Automation"
            fill
            sizes="(max-width: 991px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
          />
          <div className="split-visual-overlay" />
        </div>
        <div className="split-content">
          <motion.p className="split-eyebrow" variants={fadeUp}>
            Browser Automation
          </motion.p>
          <motion.h2 className="split-title" variants={fadeUp}>
            Playwright<br />Automation
          </motion.h2>
          <motion.p className="split-desc" variants={fadeUp}>
            A sophisticated engine that navigates complex web tasks with precision. Execute automations, capture data, and report results — all running locally on your hardware.
          </motion.p>
          <motion.ul className="feature-list" variants={fadeUp}>
            <li className="feature-item">
              <p className="feature-name">Engine</p>
              <p className="feature-text">Microsoft Playwright — Fast, Reliable, Cross-Browser</p>
            </li>
            <li className="feature-item">
              <p className="feature-name">Architecture</p>
              <p className="feature-text">Fully local. No cloud exposure. Your data stays on-device.</p>
            </li>
            <li className="feature-item">
              <p className="feature-name">Control</p>
              <p className="feature-text">Trigger, pause, and monitor via WebSocket or desktop panel.</p>
            </li>
          </motion.ul>
          <motion.div variants={fadeUp}>
            <Link href="/download" className="btn btn-primary">
              Get Started
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* ===== SPLIT FEATURE 2: Desktop Control ===== */}
      <motion.section
        className="split-section reverse"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={stagger}
      >
        <div className="split-visual">
          <Image
            src="/feature-control.webp"
            alt="Desktop Control Panel"
            fill
            sizes="(max-width: 991px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
          />
          <div className="split-visual-overlay" />
        </div>
        <div className="split-content light">
          <motion.p className="split-eyebrow" variants={fadeUp}>
            Command Center
          </motion.p>
          <motion.h2 className="split-title" variants={fadeUp} style={{ color: '#000' }}>
            Desktop<br />Control Panel
          </motion.h2>
          <motion.p className="split-desc" variants={fadeUp} style={{ color: '#555' }}>
            A premium PyQt-powered interface that gives you complete mastery over your automation scripts, database endpoints, and real-time execution logs.
          </motion.p>
          <motion.ul className="feature-list" variants={fadeUp}>
            <li className="feature-item light-border">
              <p className="feature-name light-text">Interface</p>
              <p className="feature-text dark-text">Premium PyQt5 desktop application with dark/light UI.</p>
            </li>
            <li className="feature-item light-border">
              <p className="feature-name light-text">Live Monitoring</p>
              <p className="feature-text dark-text">Real-time log streaming, task status & session tracking.</p>
            </li>
            <li className="feature-item light-border">
              <p className="feature-name light-text">Configuration</p>
              <p className="feature-text dark-text">Manage MongoDB endpoints, API keys, and script settings.</p>
            </li>
          </motion.ul>
          <motion.div variants={fadeUp}>
            <Link href="/download" className="btn btn-dark">
              Download Now
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* ===== RED BANNER: Gemini Sessions ===== */}
      <motion.section
        className="banner-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className="container" style={{ maxWidth: 900 }}>
          <motion.p className="banner-eyebrow" variants={fadeUp}>
            Always On
          </motion.p>
          <motion.h2 className="banner-title" variants={fadeUp}>
            Persistent<br />Gemini Sessions
          </motion.h2>
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.75)',
              maxWidth: 560,
              margin: '0 auto 2.5rem',
              lineHeight: 1.7,
              fontWeight: 300
            }}
          >
            Keep your Gemini web interface session active and logged in around the clock. Perform continuous automated queries without session timeouts or re-authentication.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link href="/download" className="btn" style={{ background: '#fff', color: '#cc0000', fontWeight: 700 }}>
              Download Desktop App
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* ===== CARD GRID: Features ===== */}
      <motion.div
        className="card-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        {/* Card 1 — WebSocket API */}
        <motion.div
          className="feature-card"
          variants={fadeUp}
          style={{ background: '#0d0d0d' }}
        >
          <div
            className="feature-card-bg"
            style={{
              background: 'radial-gradient(ellipse at 30% 50%, rgba(204,0,0,0.15) 0%, transparent 60%), linear-gradient(135deg, #111 0%, #000 100%)',
              inset: 0,
              position: 'absolute'
            }}
          />
          <div className="feature-card-gradient" />
          <div className="feature-card-content">
            <p className="feature-card-tag">API</p>
            <h3 className="feature-card-title">Local<br />WebSocket</h3>
            <p className="feature-card-text">
              A high-speed WebSocket bridge connecting your Python scripts and third-party apps to the automation engine in real time.
            </p>
            <a
              href="https://yogarathinam.github.io/AgentBridge/"
              target="_blank"
              rel="noopener noreferrer"
              className="feature-card-link"
            >
              Explore Docs →
            </a>
          </div>
        </motion.div>

        {/* Card 2 — Privacy */}
        <motion.div
          className="feature-card"
          variants={fadeUp}
          style={{ background: '#111' }}
        >
          <div
            className="feature-card-bg"
            style={{
              background: 'radial-gradient(ellipse at 70% 50%, rgba(255,255,255,0.04) 0%, transparent 60%), linear-gradient(135deg, #1a1a1a 0%, #000 100%)',
              inset: 0,
              position: 'absolute'
            }}
          />
          <div className="feature-card-gradient" />
          <div className="feature-card-content">
            <p className="feature-card-tag">Privacy</p>
            <h3 className="feature-card-title">100%<br />On-Device</h3>
            <p className="feature-card-text">
              Zero cloud dependency. Every script, session, and configuration stays strictly on your local hardware. Full sovereignty over your data.
            </p>
            <Link href="/privacy" className="feature-card-link">
              Privacy Policy →
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
