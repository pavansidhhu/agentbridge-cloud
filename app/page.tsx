'use client';

import Link from 'next/link';
import { sendGAEvent } from '@next/third-parties/google';


export default function Home() {
  return (
    <div className="container">
      <section className="hero">
        <div className="badge">
          <span className="badge-dot"></span>
          Now Available — V1.0.0
        </div>
        <h1 className="hero-title">
          Local Gemini <span>Automation Bridge</span>
        </h1>
        <p className="hero-subtitle">
          Supercharge your desktop automations. Bridge PyQt interface, local Playwright browsers, and Gemini API capabilities in one seamless workflow.
        </p>
        <div className="btn-group">
          <Link 
            href="/download" 
            className="btn btn-primary"
            onClick={() => sendGAEvent({ event: 'button_click', value: 'hero_download_nav' })}
          >
            Download Desktop App
          </Link>
          <Link href="/privacy" className="btn btn-secondary">
            Read Privacy Policy
          </Link>
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Engineered for Desktop Automation</h2>
          <p className="section-subtitle">Powerful tools running locally on your hardware</p>
        </div>

        <div className="grid">
          <div className="card">
            <div className="card-icon">🔑</div>
            <h3 className="card-title">Persistent Gemini Sessions</h3>
            <p className="card-desc">
              Keep your Gemini web interface session active and logged in securely. Perform continuous automated queries without session timeout.
            </p>
          </div>

          <div className="card">
            <div className="card-icon">⚡</div>
            <h3 className="card-title">Local WebSocket API</h3>
            <p className="card-desc">
              A high-speed WebSocket bridge connecting your custom python scripts or third-party applications to the automation runner instantly.
            </p>
          </div>

          <div className="card">
            <div className="card-icon">🖥️</div>
            <h3 className="card-title">Desktop Control Panel</h3>
            <p className="card-desc">
              A premium PyQt-powered interface to manage script execution, configure database endpoints, and monitor logs in real-time.
            </p>
          </div>

          <div className="card">
            <div className="card-icon">🤖</div>
            <h3 className="card-title">Playwright Automation</h3>
            <p className="card-desc">
              A robust web browser automation engine designed to execute complex tasks, bypass standard challenges, and report status efficiently.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
