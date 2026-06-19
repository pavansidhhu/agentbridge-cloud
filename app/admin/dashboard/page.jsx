'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

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
  if (!lastSeen) return { text: 'Offline', color: '#475569', icon: '○' };
  
  const diffMinutes = (Date.now() - new Date(lastSeen).getTime()) / (1000 * 60);
  
  if (diffMinutes < 3) {
    return { text: 'Online Now', color: '#10b981', icon: '🟢', pulse: true };
  } else if (diffMinutes < 60 * 24) {
    return { text: 'Active Today', color: '#06b6d4', icon: '🔵' };
  } else {
    return { text: 'Offline', color: '#475569', icon: '⚪' };
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
            <div style={styles.logoIcon}>A</div>
            <span style={styles.logoText}>AgentBridge</span>
            <span style={styles.badge}>Admin</span>
          </div>
          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            disabled={logoutLoading}
            style={styles.logoutBtn}
          >
            {logoutLoading ? '...' : '← Logout'}
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {/* Page title */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>User Dashboard</h1>
          <p style={styles.pageSubtitle}>All users who have registered AgentBridge</p>
        </div>

        {/* Stats row */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{totalUsers}</div>
            <div style={styles.statLabel}>Total Users</div>
          </div>
          <div style={{ ...styles.statCard, ...styles.statCardGreen }}>
            <div style={{ ...styles.statValue, color: '#10b981' }}>{activeCount}</div>
            <div style={styles.statLabel}>Active Today</div>
          </div>
          <div style={{ ...styles.statCard, ...styles.statCardBlue }}>
            <div style={{ ...styles.statValue, color: '#06b6d4' }}>
              {totalFeedback}
            </div>
            <div style={styles.statLabel}>Feedback Submissions</div>
          </div>
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
            placeholder={`🔍  Search ${activeTab}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button
            id="admin-refresh-btn"
            onClick={handleRefresh}
            style={styles.refreshBtn}
          >
            ↺ Refresh
          </button>
        </div>

        {/* Error state */}
        {fetchError && (
          <div style={styles.errorBox}>⚠ {fetchError}</div>
        )}

        {/* Table Area */}
        <div style={styles.tableWrap}>
          {(activeTab === 'users' ? usersLoading : feedbackLoading) ? (
            <div style={styles.loadingState}>
              <div style={styles.loadingSpinner}>⟳</div>
              <p style={styles.loadingText}>Loading {activeTab}...</p>
            </div>
          ) : (activeTab === 'users' ? filteredUsers : filteredFeedback).length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>{activeTab === 'users' ? '👤' : '📝'}</div>
              <p style={styles.emptyText}>
                {search ? `No ${activeTab} match your search.` : `No ${activeTab} found.`}
              </p>
            </div>
          ) : activeTab === 'users' ? (
            // Users Table
            <table style={styles.table}>
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
                        <span style={{ color: status.color, fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span className={status.pulse ? "pulse-dot" : ""}>{status.icon}</span> 
                          {status.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            // Feedback Table
            <table style={styles.table}>
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
                      <p style={{ color: '#e2e8f0', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5, maxWidth: '400px' }}>
                        {fb.experience || '—'}
                      </p>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.dateText}>{formatDate(fb.submittedAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p style={styles.footerNote}>
          Showing {activeTab === 'users' ? filteredUsers.length : filteredFeedback.length} of {activeTab === 'users' ? totalUsers : totalFeedback} records
          {lastUpdated ? ` · Last updated ${lastUpdated}` : ''}
        </p>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#07070b',
    color: '#f8fafc',
    fontFamily: "'Inter', system-ui, sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  glowTop: {
    position: 'fixed',
    top: '-200px',
    left: '20%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(79,70,229,0.3) 0%, transparent 70%)',
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
    background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(7,7,11,0.8)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  headerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem',
    height: '4.5rem',
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
    width: '30px',
    height: '30px',
    background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
    borderRadius: '7px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '900',
    fontSize: '0.9rem',
  },
  logoText: {
    fontSize: '1.2rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #f8fafc, #06b6d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  badge: {
    background: 'rgba(79,70,229,0.2)',
    border: '1px solid rgba(79,70,229,0.4)',
    color: '#a5b4fc',
    fontSize: '0.72rem',
    fontWeight: '700',
    padding: '0.2rem 0.6rem',
    borderRadius: '999px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#94a3b8',
    borderRadius: '8px',
    padding: '0.5rem 1.2rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  main: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 1.5rem 4rem',
  },
  pageHeader: {
    marginBottom: '2.5rem',
  },
  pageTitle: {
    fontSize: '2.2rem',
    fontWeight: '800',
    letterSpacing: '-0.02em',
    background: 'linear-gradient(135deg, #ffffff 40%, #94a3b8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.4rem',
  },
  pageSubtitle: {
    color: '#64748b',
    fontSize: '1rem',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  statCard: {
    background: 'rgba(18,18,29,0.7)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '14px',
    padding: '1.5rem',
    backdropFilter: 'blur(12px)',
  },
  statCardGreen: {
    borderColor: 'rgba(16,185,129,0.2)',
    background: 'rgba(16,185,129,0.05)',
  },
  statCardBlue: {
    borderColor: 'rgba(6,182,212,0.2)',
    background: 'rgba(6,182,212,0.05)',
  },
  statValue: {
    fontSize: '2.2rem',
    fontWeight: '800',
    color: '#f8fafc',
    lineHeight: 1,
    marginBottom: '0.4rem',
  },
  statLabel: {
    color: '#64748b',
    fontSize: '0.85rem',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  tabs: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    paddingBottom: '0.5rem',
  },
  tab: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    fontSize: '1.05rem',
    fontWeight: '600',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    background: 'rgba(79,70,229,0.15)',
    border: '1px solid rgba(79,70,229,0.3)',
    color: '#f8fafc',
    fontSize: '1.05rem',
    fontWeight: '600',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  toolbar: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1.25rem',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '0.75rem 1rem',
    color: '#f8fafc',
    fontSize: '0.95rem',
    outline: 'none',
  },
  refreshBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#94a3b8',
    borderRadius: '10px',
    padding: '0.75rem 1.25rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  errorBox: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '10px',
    padding: '1rem 1.25rem',
    color: '#fca5a5',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  tableWrap: {
    background: 'rgba(18,18,29,0.7)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px',
    overflow: 'hidden',
    backdropFilter: 'blur(12px)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.92rem',
  },
  th: {
    padding: '1rem 1.25rem',
    textAlign: 'left',
    color: '#64748b',
    fontWeight: '600',
    fontSize: '0.78rem',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    background: 'rgba(255,255,255,0.025)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    transition: 'background 0.15s ease',
    background: 'transparent',
  },
  trAlt: {
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    transition: 'background 0.15s ease',
    background: 'rgba(255,255,255,0.01)',
  },
  trHover: {
    background: 'rgba(79,70,229,0.07)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    transition: 'background 0.15s ease',
  },
  td: {
    padding: '1rem 1.25rem',
    verticalAlign: 'middle',
  },
  rowNum: {
    color: '#334155',
    fontWeight: '600',
    fontSize: '0.85rem',
  },
  emailCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '0.8rem',
    flexShrink: 0,
  },
  emailText: {
    color: '#e2e8f0',
    fontWeight: '500',
  },
  versionBadge: {
    background: 'rgba(79,70,229,0.15)',
    border: '1px solid rgba(79,70,229,0.25)',
    color: '#a5b4fc',
    padding: '0.2rem 0.65rem',
    borderRadius: '999px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  dateText: {
    color: '#64748b',
    fontSize: '0.88rem',
  },
  statusActive: {
    color: '#10b981',
    fontWeight: '600',
    fontSize: '0.85rem',
  },
  statusInactive: {
    color: '#475569',
    fontWeight: '500',
    fontSize: '0.85rem',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '4rem',
    gap: '1rem',
  },
  loadingSpinner: {
    fontSize: '2rem',
    color: '#4f46e5',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: '#64748b',
    fontSize: '0.95rem',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '4rem',
    gap: '1rem',
  },
  emptyIcon: {
    fontSize: '2.5rem',
    opacity: 0.4,
  },
  emptyText: {
    color: '#64748b',
    fontSize: '0.95rem',
  },
  footerNote: {
    marginTop: '1rem',
    color: '#334155',
    fontSize: '0.8rem',
    textAlign: 'right',
  },
};
