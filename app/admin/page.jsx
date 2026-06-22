'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      {/* Background glows */}
      <div style={styles.glowTop} />
      <div style={styles.glowBottom} />

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 15 }}
        style={styles.card}
      >
        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>▲</div>
          <span style={styles.logoText}>AgentBridge</span>
        </div>

        <h1 style={styles.title}>Admin Portal</h1>
        <p style={styles.subtitle}>Sign in to manage your users</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              required
              style={styles.input}
              onFocus={e => {
                Object.assign(e.target.style, styles.inputFocus);
              }}
              onBlur={e => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = 'var(--shadow-sm)';
                e.target.style.background = 'var(--background)';
              }}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              style={styles.input}
              onFocus={e => {
                Object.assign(e.target.style, styles.inputFocus);
              }}
              onBlur={e => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = 'var(--shadow-sm)';
                e.target.style.background = 'var(--background)';
              }}
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              style={styles.errorBox}
            >
              <span style={styles.errorIcon}>⚠</span> {error}
            </motion.div>
          )}

          <motion.button
            id="admin-login-btn"
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={loading ? { ...styles.btn, ...styles.btnLoading } : styles.btn}
          >
            {loading ? (
              <span style={styles.spinner}>⟳</span>
            ) : (
              '→  Sign In'
            )}
          </motion.button>
        </form>

        <p style={styles.hint}>🔒 Admin access only</p>
      </motion.div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '85vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  glowTop: {
    position: 'absolute',
    top: '-150px',
    left: '30%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, var(--accent-secondary-glow) 0%, transparent 70%)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  glowBottom: {
    position: 'absolute',
    bottom: '-100px',
    right: '20%',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  card: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '440px',
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    borderRadius: '20px',
    padding: '3rem 2.5rem',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: 'var(--glass-shadow)',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '900',
    fontSize: '0.95rem',
  },
  logoText: {
    fontSize: '1.35rem',
    fontWeight: '800',
    fontFamily: 'var(--font-heading)',
    background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--accent-secondary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  title: {
    fontSize: '1.85rem',
    fontWeight: '700',
    fontFamily: 'var(--font-heading)',
    color: 'var(--text-primary)',
    textAlign: 'center',
    marginBottom: '0.5rem',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.825rem',
    fontWeight: '600',
    fontFamily: 'var(--font-heading)',
    color: 'var(--text-secondary)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  input: {
    background: 'var(--background)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '0.85rem 1.1rem',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    width: '100%',
    boxShadow: 'var(--shadow-sm)',
  },
  inputFocus: {
    background: 'var(--surface)',
    border: '1px solid var(--accent)',
    boxShadow: '0 0 0 4px var(--accent-glow)',
  },
  errorBox: {
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '10px',
    padding: '0.8rem 1.1rem',
    color: '#ef4444',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  errorIcon: {
    fontSize: '1rem',
  },
  btn: {
    background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '0.95rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    marginTop: '0.5rem',
    boxShadow: '0 4px 15px var(--accent-glow)',
    letterSpacing: '0.02em',
  },
  btnLoading: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  spinner: {
    display: 'inline-block',
    animation: 'spin 1s linear infinite',
    fontSize: '1.2rem',
  },
  hint: {
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
    marginTop: '2rem',
  },
};
