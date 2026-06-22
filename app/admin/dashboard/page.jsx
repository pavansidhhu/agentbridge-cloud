'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function isActiveToday(lastSeen) {
  if (!lastSeen) return false;
  const diff = Date.now() - new Date(lastSeen).getTime();
  return diff < 24 * 60 * 60 * 1000;
}

function getStatus(lastSeen) {
  if (!lastSeen) return { text: 'Offline', color: 'var(--text-secondary)', className: 'offline' };
  
  const diffMinutes = (Date.now() - new Date(lastSeen).getTime()) / (1000 * 60);
  
  if (diffMinutes < 3) {
    return { text: 'Online Now', color: '#10b981', className: 'online', pulse: true };
  } else if (diffMinutes < 60 * 24) {
    return { text: 'Active Today', color: '#06b6d4', className: 'active' };
  } else {
    return { text: 'Offline', color: 'var(--text-secondary)', className: 'offline' };
  }
}

// SWR Fetcher
const fetcher = async (url) => {
  const res = await fetch(url);
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to load users');
  return res.json();
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'feedback'
  const [search, setSearch] = useState('');
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  // Use SWR for instant cache loading and background revalidation
  const { data: usersData, error: usersError, isLoading: usersLoading, mutate: mutateUsers } = useSWR('/api/admin/users', fetcher, {
    onSuccess: () => setLastUpdated(new Date().toLocaleTimeString()),
    onError: (err) => {
      if (err.message === 'Unauthorized') router.push('/admin');
    },
    revalidateOnFocus: false, // Don't spam MongoDB on tab switch
  });

  const { data: feedbackData, error: feedbackError, isLoading: feedbackLoading, mutate: mutateFeedback } = useSWR('/api/admin/feedback', fetcher, {
    revalidateOnFocus: false,
  });

  const users = usersData?.users || [];
  const totalUsers = usersData?.total || 0;
  
  const feedbackList = feedbackData?.feedback || [];
  const totalFeedback = feedbackData?.total || 0;

  const fetchError = (activeTab === 'users' ? usersError?.message : feedbackError?.message) || '';

  const handleRefresh = () => {
    if (activeTab === 'users') mutateUsers();
    if (activeTab === 'feedback') mutateFeedback();
  };

  async function handleLogout() {
    setLogoutLoading(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  }

  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.version?.includes(search)
  );
  
  const filteredFeedback = feedbackList.filter(f =>
    f.email?.toLowerCase().includes(search.toLowerCase()) ||
    f.experience?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = users.filter(u => isActiveToday(u.lastSeen)).length;

  return (
    <div style={styles.page}>
      {/* Background glows */}
      <div style={styles.glowTop} />
      <div style={styles.glowBottom} />

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logoRow}>
            <div style={styles.logoIcon}>▲</div>
            <span style={styles.logoText}>AgentBridge</span>
            <span style={styles.badge}>Admin</span>
          </div>
          <motion.button
            id="admin-logout-btn"
            onClick={handleLogout}
            disabled={logoutLoading}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            style={styles.logoutBtn}
          >
            {logoutLoading ? '...' : '← Logout'}
          </motion.button>
        </div>
      </header>

      <motion.main 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={styles.main}
      >
        {/* Page title */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>User Dashboard</h1>
          <p style={styles.pageSubtitle}>All users who have registered AgentBridge</p>
        </div>

        {/* Stats row */}
        <div style={styles.statsRow}>
          <motion.div 
            whileHover={{ y: -3 }}
            style={styles.statCard}
          >
            <div style={styles.statValue}>{totalUsers}</div>
            <div style={styles.statLabel}>Total Users</div>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -3 }}
            style={{ ...styles.statCard, ...styles.statCardGreen }}
          >
            <div style={{ ...styles.statValue, color: '#10b981' }}>{activeCount}</div>
            <div style={styles.statLabel}>Active Today</div>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -3 }}
            style={{ ...styles.statCard, ...styles.statCardBlue }}
          >
            <div style={{ ...styles.statValue, color: 'var(--accent)' }}>
              {totalFeedback}
            </div>
            <div style={styles.statLabel}>Feedback Submissions</div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button 
            style={activeTab === 'users' ? styles.tabActive : styles.tab} 
            onClick={() => setActiveTab('users')}
          >
            👤 Users
          </button>
          <button 
            style={activeTab === 'feedback' ? styles.tabActive : styles.tab} 
            onClick={() => setActiveTab('feedback')}
          >
            📝 Feedback
          </button>
        </div>

        {/* Search & Refresh */}
        <div style={styles.toolbar}>
          <input
            id="admin-search"
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
            onFocus={e => {
              e.target.style.borderColor = 'var(--accent)';
              e.target.style.boxShadow = '0 0 0 4px var(--accent-glow)';
              e.target.style.background = 'var(--surface)';
            }}
            onBlur={e => {
              e.target.style.borderColor = 'var(--border-color)';
              e.target.style.boxShadow = 'var(--shadow-sm)';
              e.target.style.background = 'var(--glass-bg)';
            }}
          />
          <motion.button
            id="admin-refresh-btn"
            onClick={handleRefresh}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            style={styles.refreshBtn}
          >
            ↺ Refresh
          </motion.button>
        </div>

        {/* Error state */}
        {fetchError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.errorBox}
          >
            ⚠ {fetchError}
          </motion.div>
        )}

        {/* Table Area */}
        <div style={styles.tableWrap}>
          <AnimatePresence mode="wait">
            {(activeTab === 'users' ? usersLoading : feedbackLoading) ? (
              <motion.div 
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ padding: '0.5rem 0' }}
              >
                {[...Array(5)].map((_, idx) => (
                  <div key={idx} className="skeleton-row">
                    <div className="skeleton-box" style={{ width: '4%', height: '18px' }} />
                    <div className="skeleton-box" style={{ width: '30%', height: '18px' }} />
                    <div className="skeleton-box" style={{ width: '15%', height: '18px' }} />
                    <div className="skeleton-box" style={{ width: '20%', height: '18px' }} />
                    <div className="skeleton-box" style={{ width: '20%', height: '18px' }} />
                    <div className="skeleton-box" style={{ width: '11%', height: '18px' }} />
                  </div>
                ))}
              </motion.div>
            ) : (activeTab === 'users' ? filteredUsers : filteredFeedback).length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={styles.emptyState}
              >
                <div style={styles.emptyIcon}>{activeTab === 'users' ? '👤' : '📝'}</div>
                <p style={styles.emptyText}>
                  {search ? `No ${activeTab} match your search.` : `No ${activeTab} found.`}
                </p>
              </motion.div>
            ) : activeTab === 'users' ? (
              // Users Table
              <motion.table 
                key="users-table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={styles.table}
              >
                <thead>
                  <tr>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Version</th>
                    <th style={styles.th}>First Seen</th>
                    <th style={styles.th}>Last Seen</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, i) => {
                    const status = getStatus(user.lastSeen);
                    return (
                      <tr
                        key={user.email || i}
                        style={i % 2 === 0 ? styles.tr : styles.trAlt}
                        onMouseEnter={e => Object.assign(e.currentTarget.style, styles.trHover)}
                        onMouseLeave={e => Object.assign(e.currentTarget.style, i % 2 === 0 ? styles.tr : styles.trAlt)}
                      >
                        <td style={styles.td}>
                          <span style={styles.rowNum}>{i + 1}</span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.emailCell}>
                            <div style={styles.avatar}>
                              {(user.email?.[0] || '?').toUpperCase()}
                            </div>
                            <span style={styles.emailText}>{user.email || '—'}</span>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.versionBadge}>{user.version || '—'}</span>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.dateText}>{formatDate(user.firstSeen)}</span>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.dateText}>{formatDate(user.lastSeen)}</span>
                        </td>
                        <td style={styles.td}>
                          <span className={`status-badge ${status.className}`}>
                            {status.pulse && <span className="badge-dot" style={{ margin: 0, width: 6, height: 6 }} />}
                            {status.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </motion.table>
            ) : (
              // Feedback Table
              <motion.table 
                key="feedback-table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={styles.table}
              >
                <thead>
                  <tr>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Experience / Feedback</th>
                    <th style={styles.th}>Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFeedback.map((fb, i) => (
                    <tr
                      key={fb._id || i}
                      style={i % 2 === 0 ? styles.tr : styles.trAlt}
                      onMouseEnter={e => Object.assign(e.currentTarget.style, styles.trHover)}
                      onMouseLeave={e => Object.assign(e.currentTarget.style, i % 2 === 0 ? styles.tr : styles.trAlt)}
                    >
                      <td style={styles.td}>
                        <span style={styles.rowNum}>{i + 1}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.emailCell}>
                          <div style={styles.avatar}>
                            {(fb.email?.[0] || '?').toUpperCase()}
                          </div>
                          <span style={styles.emailText}>{fb.email || '—'}</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <p style={{ color: 'var(--text-primary)', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5, maxWidth: '480px' }}>
                          {fb.experience || '—'}
                        </p>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.dateText}>{formatDate(fb.submittedAt)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </motion.table>
            )}
          </AnimatePresence>
        </div>

        <p style={styles.footerNote}>
          Showing {activeTab === 'users' ? filteredUsers.length : filteredFeedback.length} of {activeTab === 'users' ? totalUsers : totalFeedback} records
          {lastUpdated ? ` · Last updated ${lastUpdated}` : ''}
        </p>
      </motion.main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--background)',
    color: 'var(--text-primary)',
    fontFamily: "var(--font-sans)",
    position: 'relative',
    overflow: 'hidden',
  },
  glowTop: {
    position: 'fixed',
    top: '-200px',
    left: '20%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, var(--accent-secondary-glow) 0%, transparent 70%)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  glowBottom: {
    position: 'fixed',
    bottom: '-100px',
    right: '10%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'var(--glass-bg)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border-color)',
  },
  headerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    height: '5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
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
    fontSize: '1.25rem',
    fontWeight: '800',
    fontFamily: 'var(--font-heading)',
    background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--accent-secondary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  badge: {
    background: 'var(--accent-glow)',
    border: '1px solid var(--border-glow)',
    color: 'var(--accent)',
    fontSize: '0.72rem',
    fontWeight: '700',
    padding: '0.2rem 0.6rem',
    borderRadius: '999px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-heading)',
  },
  logoutBtn: {
    background: 'var(--glass-bg)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    borderRadius: '10px',
    padding: '0.55rem 1.3rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    fontFamily: 'var(--font-heading)',
  },
  main: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 2rem 4rem',
  },
  pageHeader: {
    marginBottom: '2.5rem',
  },
  pageTitle: {
    fontSize: '2.4rem',
    fontWeight: '800',
    letterSpacing: '-0.03em',
    fontFamily: 'var(--font-heading)',
    background: 'linear-gradient(135deg, var(--text-primary) 40%, var(--accent-secondary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.4rem',
  },
  pageSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '1.05rem',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  statCard: {
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    borderRadius: '18px',
    padding: '2rem',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: 'var(--glass-shadow)',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  statCardGreen: {
    borderColor: 'rgba(16,185,129,0.15)',
    background: 'rgba(16,185,129,0.02)',
  },
  statCardBlue: {
    borderColor: 'var(--border-color)',
  },
  statValue: {
    fontSize: '2.75rem',
    fontWeight: '800',
    fontFamily: 'var(--font-heading)',
    color: 'var(--text-primary)',
    lineHeight: 1,
    marginBottom: '0.5rem',
    letterSpacing: '-0.03em',
  },
  statLabel: {
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    fontWeight: '600',
    fontFamily: 'var(--font-heading)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  tabs: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.5rem',
  },
  tab: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '1rem',
    fontWeight: '600',
    fontFamily: 'var(--font-heading)',
    padding: '0.6rem 1.25rem',
    cursor: 'pointer',
    borderRadius: '10px',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  tabActive: {
    background: 'var(--accent-glow)',
    border: '1px solid var(--border-glow)',
    color: 'var(--accent)',
    fontSize: '1rem',
    fontWeight: '600',
    fontFamily: 'var(--font-heading)',
    padding: '0.6rem 1.25rem',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  toolbar: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    background: 'var(--glass-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '0.85rem 1.25rem',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    outline: 'none',
    boxShadow: 'var(--shadow-sm)',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  refreshBtn: {
    background: 'var(--glass-bg)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    borderRadius: '12px',
    padding: '0.85rem 1.5rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    fontFamily: 'var(--font-heading)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: 'var(--shadow-sm)',
  },
  errorBox: {
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    color: '#ef4444',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
  },
  tableWrap: {
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    borderRadius: '20px',
    overflow: 'hidden',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: 'var(--glass-shadow)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.925rem',
  },
  th: {
    padding: '1.2rem 1.5rem',
    textAlign: 'left',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-heading)',
    fontWeight: '600',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    background: 'rgba(148, 163, 184, 0.03)',
    borderBottom: '1px solid var(--border-color)',
  },
  tr: {
    borderBottom: '1px solid var(--border-color)',
    transition: 'background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    background: 'transparent',
  },
  trAlt: {
    borderBottom: '1px solid var(--border-color)',
    transition: 'background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    background: 'rgba(255, 255, 255, 0.01)',
  },
  trHover: {
    background: 'rgba(148, 163, 184, 0.04)',
    borderBottom: '1px solid var(--border-color)',
    transition: 'background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  td: {
    padding: '1.25rem 1.5rem',
    verticalAlign: 'middle',
  },
  rowNum: {
    color: 'var(--text-muted)',
    fontWeight: '600',
    fontSize: '0.85rem',
  },
  emailCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '0.85rem',
    flexShrink: 0,
    boxShadow: '0 3px 8px var(--accent-glow)',
  },
  emailText: {
    color: 'var(--text-primary)',
    fontWeight: '500',
  },
  versionBadge: {
    background: 'var(--accent-glow)',
    border: '1px solid var(--border-glow)',
    color: 'var(--accent)',
    padding: '0.25rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  dateText: {
    color: 'var(--text-secondary)',
    fontSize: '0.88rem',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '5rem 2rem',
    gap: '1rem',
  },
  emptyIcon: {
    fontSize: '3rem',
    opacity: 0.4,
  },
  emptyText: {
    color: 'var(--text-secondary)',
    fontSize: '1rem',
  },
  footerNote: {
    marginTop: '1.25rem',
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
    textAlign: 'right',
  },
};
