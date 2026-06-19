'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>A</div>
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
              onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={e => Object.assign(e.target.style, styles.input)}
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
              onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={e => Object.assign(e.target.style, styles.input)}
            />
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>⚠</span> {error}
            </div>
          )}

          <button
            id="admin-login-btn"
            type="submit"
            disabled={loading}
            style={loading ? { ...styles.btn, ...styles.btnLoading } : styles.btn}
          >
            {loading ? (
              <span style={styles.spinner}>⟳</span>
            ) : (
              '→  Sign In'
            )}
          </button>
        </form>

        <p style={styles.hint}>🔒 Admin access only</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#07070b',
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
    background: 'radial-gradient(circle, rgba(79,70,229,0.35) 0%, transparent 70%)',
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
    background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  card: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '420px',
    background: 'rgba(18, 18, 29, 0.75)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '3rem 2.5rem',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
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
    background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '900',
    fontSize: '1rem',
  },
  logoText: {
    fontSize: '1.3rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #f8fafc, #06b6d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: '0.5rem',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '0.95rem',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#94a3b8',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  input: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '0.8rem 1rem',
    color: '#f8fafc',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    width: '100%',
  },
  inputFocus: {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(79,70,229,0.5)',
    borderRadius: '10px',
    padding: '0.8rem 1rem',
    color: '#f8fafc',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    width: '100%',
    boxShadow: '0 0 0 3px rgba(79,70,229,0.15)',
  },
  errorBox: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#fca5a5',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  errorIcon: {
    fontSize: '1rem',
  },
  btn: {
    background: 'linear-gradient(135deg, #4f46e5, #3b82f6)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '0.9rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    marginTop: '0.5rem',
    boxShadow: '0 4px 20px rgba(79,70,229,0.4)',
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
    color: '#334155',
    fontSize: '0.8rem',
    marginTop: '1.5rem',
  },
};
