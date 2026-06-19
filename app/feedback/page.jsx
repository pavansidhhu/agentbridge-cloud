'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FeedbackPage() {
  const [email, setEmail] = useState('');
  const [experience, setExperience] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, experience }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setEmail('');
        setExperience('');
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  }

  return (
    <div className="container" style={{ paddingBottom: '6rem', paddingTop: '4rem' }}>
      <div className="card" style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'left' }}>
        
        {status === 'success' ? (
          <div style={styles.successState}>
            <div style={styles.successIcon}>✓</div>
            <h2 className="section-title" style={{ marginBottom: '1rem', textAlign: 'center' }}>Thank You!</h2>
            <p className="section-subtitle" style={{ textAlign: 'center', marginBottom: '2rem' }}>
              Your feedback has been successfully submitted. We appreciate your input!
            </p>
            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={() => setStatus('idle')}
                className="btn btn-secondary"
              >
                Submit another response
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={styles.icon}>📝</div>
              <h1 className="section-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>User Feedback</h1>
              <p className="section-subtitle">We would love to hear about your experience.</p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label} htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={status === 'loading'}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label} htmlFor="experience">Your Experience</label>
                <textarea
                  id="experience"
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  placeholder="Tell us what you think about AgentBridge..."
                  required
                  disabled={status === 'loading'}
                  style={{ ...styles.input, minHeight: '150px', resize: 'vertical' }}
                />
              </div>

              {errorMsg && (
                <div style={styles.errorBox}>⚠ {errorMsg}</div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem', opacity: status === 'loading' ? 0.7 : 1 }}
              >
                {status === 'loading' ? '⟳ Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  icon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.95rem',
    fontWeight: '500',
    color: 'var(--text-secondary)',
  },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '0.85rem 1rem',
    color: '#f8fafc',
    fontSize: '1rem',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  errorBox: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#fca5a5',
    fontSize: '0.88rem',
  },
  successState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem 0',
  },
  successIcon: {
    width: '72px',
    height: '72px',
    background: 'linear-gradient(135deg, #10b981, #06b6d4)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    color: 'white',
    boxShadow: '0 8px 25px rgba(16,185,129,0.4)',
    marginBottom: '1.5rem',
  },
};
