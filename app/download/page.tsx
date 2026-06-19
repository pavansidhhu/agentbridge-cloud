'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const DOWNLOAD_URL = 'https://github.com/yourusername/agentbridge/releases/latest';

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
    <div className="container" style={{ paddingBottom: '6rem' }}>
      <div className="download-card card">
        <div className="badge">
          <span className="badge-dot"></span>
          Latest Stable Release
        </div>

        <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Get <span>AgentBridge</span>
        </h1>

        <p className="hero-subtitle" style={{ fontSize: '1.1rem', marginBottom: '2.5rem' }}>
          Download the latest version of AgentBridge Desktop client for local browser control.
        </p>

        <div className="btn-group" style={{ flexDirection: 'column', gap: '0.75rem' }}>
          <a
            href={DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ minWidth: '250px' }}
          >
            ↓ &nbsp;Download for {os}
          </a>
          <span className="platform-info">
            Compatible with Windows 10/11, macOS 11+, and modern Linux distributions.
          </span>
        </div>
      </div>

      <div className="install-guide">
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '3rem' }}>
          <h2 className="section-title">Quick Start Installation Guide</h2>
          <p className="section-subtitle">Follow these simple steps to get AgentBridge up and running in minutes</p>
        </div>

        <div className="guide-step">
          <div className="step-num">1</div>
          <div className="step-content">
            <h3>Download the Executable</h3>
            <p>Click the download button above to retrieve the installation bundle suitable for your operating system.</p>
          </div>
        </div>

        <div className="guide-step">
          <div className="step-num">2</div>
          <div className="step-content">
            <h3>Run the Installer</h3>
            <p>Launch the downloaded file. Windows users may need to click &quot;More info&quot; and then &quot;Run anyway&quot; if prompted by SmartScreen, as the app is built locally.</p>
          </div>
        </div>

        <div className="guide-step">
          <div className="step-num">3</div>
          <div className="step-content">
            <h3>Launch and Connect Google Login</h3>
            <p>Start AgentBridge Desktop. In the application control panel, click &quot;Start Gemini Worker&quot;. Sign in to your Google Account through the secure automation browser window that opens.</p>
          </div>
        </div>

        <div className="guide-step">
          <div className="step-num">4</div>
          <div className="step-content">
            <h3>Start Automating</h3>
            <p>Once registered, AgentBridge will verify your configuration with the cloud backend and boot up your local WebSocket server on port 8000. You are ready to issue commands!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
