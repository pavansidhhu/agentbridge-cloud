'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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
    <motion.div 
      className="container" 
      style={{ paddingBottom: '6rem', paddingTop: '4rem' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="card" style={{ maxWidth: '580px', margin: '0 auto', textAlign: 'left' }}>
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={styles.successState}
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 10 }}
                style={styles.successIcon}
              >
                ✓
              </motion.div>
              <h2 className="section-title" style={{ marginBottom: '1rem', textAlign: 'center' }}>Thank You!</h2>
              <p className="section-subtitle" style={{ textAlign: 'center', marginBottom: '2.5rem', maxWidth: '400px' }}>
                Your feedback has been successfully submitted. We appreciate your input!
              </p>
              <div style={{ textAlign: 'center' }}>
                <motion.button 
                  onClick={() => setStatus('idle')}
                  className="btn btn-secondary"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Submit another response
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <div style={styles.icon}>📝</div>
                <h1 className="section-title" style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>User Feedback</h1>
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
                    onFocus={e => {
                      e.target.style.borderColor = 'var(--accent)';
                      e.target.style.boxShadow = '0 0 0 4px var(--accent-glow)';
                      e.target.style.background = 'var(--surface)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'var(--border-color)';
                      e.target.style.boxShadow = 'var(--shadow-sm)';
                      e.target.style.background = 'var(--background)';
                    }}
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
                    style={{ ...styles.input, minHeight: '160px', resize: 'vertical' }}
                    onFocus={e => {
                      e.target.style.borderColor = 'var(--accent)';
                      e.target.style.boxShadow = '0 0 0 4px var(--accent-glow)';
                      e.target.style.background = 'var(--surface)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'var(--border-color)';
                      e.target.style.boxShadow = 'var(--shadow-sm)';
                      e.target.style.background = 'var(--background)';
                    }}
                  />
                </div>

                {errorMsg && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={styles.errorBox}
                  >
                    ⚠ {errorMsg}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ width: '100%', marginTop: '1rem', opacity: status === 'loading' ? 0.7 : 1 }}
                >
                  {status === 'loading' ? '⟳ Submitting...' : 'Submit Feedback'}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
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
    fontSize: '0.85rem',
    fontWeight: '600',
    fontFamily: 'var(--font-heading)',
    color: 'var(--text-secondary)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    background: 'var(--background)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '0.9rem 1.15rem',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: 'var(--shadow-sm)',
  },
  errorBox: {
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '10px',
    padding: '0.8rem 1.1rem',
    color: '#ef4444',
    fontSize: '0.9rem',
  },
  successState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem 0',
  },
  successIcon: {
    width: '76px',
    height: '76px',
    background: 'linear-gradient(135deg, #10b981, #06b6d4)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.25rem',
    color: 'white',
    boxShadow: '0 8px 25px rgba(16,185,129,0.3)',
    marginBottom: '1.5rem',
  },
};
