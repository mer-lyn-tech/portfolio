import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PMVikas.css';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const STATUS_COLORS = {
  'Completed': '#00e5ff',
  'In Progress': '#f59e0b',
  'Planned': '#3b82f6',
};
const STATUS_PILL_BG = {
  'Completed': 'rgba(0, 229, 255, 0.15)',
  'In Progress': 'rgba(245, 158, 11, 0.15)',
  'Planned': 'rgba(59, 130, 246, 0.15)',
};
const STATUS_TEXT_COLOR = {
  'Completed': '#00e5ff',
  'In Progress': '#fbbf24',
  'Planned': '#60a5fa',
};

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year, month) { return new Date(year, month, 1).getDay(); }

function formatDateLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

function CountUpNumber({ value }) {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    const end = parseInt(value, 10) || 0;
    if (end <= 0) { setDisplayValue(0); return; }
    const duration = 800;
    const startTime = performance.now();
    function updateNumber(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress);
      setDisplayValue(Math.floor(easeProgress * end));
      if (progress < 1) requestAnimationFrame(updateNumber);
    }
    requestAnimationFrame(updateNumber);
  }, [value]);
  return <>{displayValue}</>;
}

// Detect local dev vs production
const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';

export default function PMVikas() {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const formattedTodayDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  }).format(today);

  // Admin state — persisted in sessionStorage
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('pmvikas_admin') === 'true');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginPwd, setLoginPwd] = useState('');
  const [loginShake, setLoginShake] = useState(false);

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  // Activities as a date→entry map
  const [activities, setActivities] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  // Loading / error state
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);
  const [saving, setSaving] = useState(false);

  // Activity modal
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [activityTitle, setActivityTitle] = useState('');
  const [activityDesc, setActivityDesc] = useState('');
  const [activityStatus, setActivityStatus] = useState('Completed');

  // Toast
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState('success'); // 'success' | 'error'

  // Delete confirm
  const [confirmDeleteDate, setConfirmDeleteDate] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(null), 3500);
  };

  // ── STEP 3: Always re-fetch from DB, never update state directly ──
  const fetchAllActivities = useCallback(async () => {
    setLoading(true);
    setDbError(false);
    try {
      const res = await fetch(`${API_BASE}/api/activity`);
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Unexpected response format');
      const map = {};
      data.forEach(d => { if (d && d.date) map[d.date] = d; });
      setActivities(map);
      setDbError(false);
    } catch (err) {
      console.error('Failed to load activities from API:', err.message);
      setDbError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllActivities();
  }, [fetchAllActivities]);

  const handleLoginAttempt = () => {
    if (loginPwd === 'merlyn2024') {
      sessionStorage.setItem('pmvikas_admin', 'true');
      setIsAdmin(true);
      setLoginModalOpen(false);
      setLoginPwd('');
    } else {
      setLoginShake(true);
      setTimeout(() => setLoginShake(false), 500);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('pmvikas_admin');
    setIsAdmin(false);
  };

  const handleDayClick = (dateStr) => {
    if (!dateStr) return;
    setSelectedDate(dateStr);
    const existing = activities[dateStr];
    if (existing) {
      const el = document.getElementById(`act-${dateStr}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (isAdmin) {
      setActivityTitle('');
      setActivityDesc('');
      setActivityStatus('Completed');
      setActivityModalOpen(true);
    }
  };

  const openEditModal = (entry) => {
    setSelectedDate(entry.date);
    setActivityTitle(entry.title || '');
    setActivityDesc(entry.activity || '');
    setActivityStatus(entry.status || 'Completed');
    setActivityModalOpen(true);
  };

  // ── STEP 3: Save — POST then ALWAYS re-fetch ──
  const saveActivity = async () => {
    if (!activityTitle.trim()) return;
    if (!selectedDate) return;

    // Compute dayNum from current chronological order
    const allKeys = Object.keys(activities).sort();
    const isExisting = allKeys.includes(selectedDate);
    const dayNum = isExisting ? allKeys.indexOf(selectedDate) + 1 : allKeys.length + 1;
    const payload = { date: selectedDate, title: activityTitle, activity: activityDesc, status: activityStatus, dayNum };

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.error || `HTTP ${res.status}`);
      }
      // ALWAYS re-fetch to confirm what's in the database
      await fetchAllActivities();
      setActivityModalOpen(false);
      showToast(isExisting ? '✅ Activity updated successfully' : '✅ Activity saved successfully', 'success');
    } catch (err) {
      console.error('Save error:', err.message);
      // Keep modal open so user doesn't lose input
      showToast(`❌ Failed to save activity: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── STEP 3: Delete — DELETE then ALWAYS re-fetch ──
  const deleteActivity = async (dateStr) => {
    setConfirmDeleteDate(null);
    try {
      const res = await fetch(`${API_BASE}/api/activity?date=${dateStr}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      // ALWAYS re-fetch to confirm database state
      await fetchAllActivities();
      showToast('🗑️ Activity deleted', 'success');
    } catch (err) {
      console.error('Delete error:', err.message);
      showToast(`❌ Failed to delete: ${err.message}`, 'error');
    }
  };

  // Chronological day numbering
  const chronologicalActivities = Object.values(activities).sort((a, b) => a.date.localeCompare(b.date));
  const dayNumbers = {};
  chronologicalActivities.forEach((entry, index) => { dayNumbers[entry.date] = index + 1; });
  const sortedActivities = [...chronologicalActivities];

  // Stats
  const totalLogged = sortedActivities.length;
  const completedCount = sortedActivities.filter(a => a.status === 'Completed').length;
  const daysRemaining = Math.max(0, 45 - totalLogged);
  const completedPct = Math.round((completedCount / 45) * 100);
  const remainingPct = Math.round((daysRemaining / 45) * 100);
  const loggedPct = Math.round((totalLogged / 45) * 100);

  // Calendar
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  return (
    <div className="page-container pmv-dashboard">

      {/* ── WELCOME HEADER ── */}
      <motion.div
        className="pmv-welcome-banner glass-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="welcome-left">
          <h1 className="welcome-title">Welcome back, Merlyn! 👋</h1>
          <p className="welcome-subtitle">PM-VIKAS IoT Internship · IIIT Kottayam · 45 Days Program</p>
        </div>
        <div className="welcome-right">
          <span className="welcome-date">{formattedTodayDate}</span>
          <div className="welcome-admin-box">
            {isAdmin ? (
              <div className="admin-status-badge">
                <span className="active-dot" /> ADMIN ACTIVE
                <button className="dashboard-logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <button className="dashboard-login-btn" onClick={() => setLoginModalOpen(true)}>🔐 Admin Login</button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── STEP 4: DB ERROR BANNER ── */}
      {dbError && !loading && (
        <div className="db-error-banner">
          ⚠️ Could not load activities from database. Check your internet connection and refresh the page.
          <button className="retry-btn" onClick={fetchAllActivities}>Retry</button>
        </div>
      )}

      {/* ── STAT CARDS ── */}
      <div className="pmv-stats-row">
        <motion.div className="pmv-stat-card glass-card accent-cyan-border" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <div className="card-top">
            <span className="card-icon cyan-bg">✅</span>
            <div className="card-numeric"><CountUpNumber value={completedCount} /></div>
          </div>
          <div className="card-label">Days Completed</div>
          <div className="card-progress-container">
            <motion.div className="card-progress-bar cyan-bar" initial={{ width: 0 }} animate={{ width: `${completedPct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
          </div>
          <div className="card-subtext">Completed {completedPct}%</div>
        </motion.div>

        <motion.div className="pmv-stat-card glass-card accent-purple-border" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <div className="card-top">
            <span className="card-icon purple-bg">📅</span>
            <div className="card-numeric"><CountUpNumber value={daysRemaining} /></div>
          </div>
          <div className="card-label">Days Remaining</div>
          <div className="card-progress-container">
            <motion.div className="card-progress-bar purple-bar" initial={{ width: 0 }} animate={{ width: `${remainingPct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
          </div>
          <div className="card-subtext">out of 45 days total</div>
        </motion.div>

        <motion.div className="pmv-stat-card glass-card accent-teal-border" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <div className="card-top">
            <span className="card-icon teal-bg">📝</span>
            <div className="card-numeric"><CountUpNumber value={totalLogged} /></div>
          </div>
          <div className="card-label">Activities Logged</div>
          <div className="card-progress-container">
            <motion.div className="card-progress-bar teal-bar" initial={{ width: 0 }} animate={{ width: `${loggedPct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
          </div>
          <div className="card-subtext">{loggedPct}% of internship tracked</div>
        </motion.div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="pmv-main-layout">

        {/* LEFT: Activity Timeline */}
        <div className="pmv-timeline-col">
          <div className="col-header">
            <h2 className="col-title">Activity Log</h2>
            <p className="col-subtitle">Your daily internship journey</p>
          </div>

          <div className="pmv-timeline-list">
            {loading ? (
              <div className="loading-state glass-card">
                <div className="loading-spinner" />
                <p>Loading activities from database...</p>
              </div>
            ) : (
              <AnimatePresence>
                {sortedActivities.length > 0 ? (
                  sortedActivities.map((entry, index) => {
                    const dayNum = dayNumbers[entry.date] || 1;
                    const dayLabel = `D${String(dayNum).padStart(2, '0')}`;
                    return (
                      <motion.div
                        key={entry.date}
                        id={`act-${entry.date}`}
                        className="pmv-timeline-card glass-card"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <div className="card-left-badge">
                          <span className="day-badge-pill">{dayLabel}</span>
                        </div>
                        <div className="card-middle-content">
                          <h4 className="activity-title">{entry.title || 'IoT Training Activity'}</h4>
                          <span className="activity-date">{formatDateLabel(entry.date)}</span>
                          <p className="activity-desc">{entry.activity}</p>
                        </div>
                        <div className="card-right-status">
                          <span className="status-badge" style={{ background: STATUS_PILL_BG[entry.status] || 'rgba(255,255,255,0.08)', color: STATUS_TEXT_COLOR[entry.status] || '#fff' }}>
                            {entry.status}
                          </span>
                          {isAdmin && (
                            <div className="admin-actions-overlay">
                              <button className="overlay-btn btn-edit" title="Edit Entry" onClick={() => openEditModal(entry)}><IconEdit /></button>
                              <button className="overlay-btn btn-delete" title="Delete Entry" onClick={() => setConfirmDeleteDate(confirmDeleteDate === entry.date ? null : entry.date)}><IconTrash /></button>
                            </div>
                          )}
                        </div>
                        {confirmDeleteDate === entry.date && (
                          <div className="inline-delete-box">
                            <span>Delete this entry?</span>
                            <button className="confirm-yes-btn" onClick={() => deleteActivity(entry.date)}>Yes, Delete</button>
                            <button className="confirm-no-btn" onClick={() => setConfirmDeleteDate(null)}>Cancel</button>
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="empty-state-card glass-card">
                    <div className="empty-icon">📂</div>
                    <h4 className="empty-title">No activities logged yet</h4>
                    <p className="empty-desc">
                      {dbError
                        ? 'Database not connected. Check Vercel environment variables.'
                        : 'Login as admin and click a date on the calendar to add your first entry.'}
                    </p>
                  </div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* RIGHT: Calendar + Progress Ring */}
        <div className="pmv-widgets-col">

          {/* Mini Calendar */}
          <div className="widget-box mini-calendar-card glass-card">
            <div className="calendar-nav-row">
              <button onClick={prevMonth} className="cal-arrow-btn">‹</button>
              <h3 className="calendar-month-title">{MONTHS[currentMonth]} {currentYear}</h3>
              <button onClick={nextMonth} className="cal-arrow-btn">›</button>
            </div>
            <div className="calendar-grid-header">
              {DAYS_SHORT.map(d => <span key={d} className="grid-header-cell">{d}</span>)}
            </div>
            <div className="calendar-grid-body">
              {calendarCells.map((day, idx) => {
                const dateStr = day
                  ? `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  : null;
                const entry = dateStr ? activities[dateStr] : null;
                const isToday = dateStr === todayStr;
                return (
                  <div
                    key={idx}
                    className={`grid-body-cell ${day ? 'clickable-cell' : 'empty-cell'} ${isToday ? 'today-highlight' : ''}`}
                    onClick={() => day && handleDayClick(dateStr)}
                  >
                    {day && <span className="day-number">{day}</span>}
                    {entry && <span className="activity-status-dot" style={{ background: STATUS_COLORS[entry.status] || '#888' }} />}
                  </div>
                );
              })}
            </div>
            {isAdmin && (
              <p className="calendar-hint">Click any date to log an activity</p>
            )}
          </div>

          {/* Progress Ring */}
          <div className="widget-box progress-ring-card glass-card">
            <h3 className="progress-ring-title">Internship Progress</h3>
            <div className="progress-ring-wrapper">
              <svg width="150" height="150" viewBox="0 0 150 150" className="progress-ring-svg">
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00e5ff" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
                <circle cx="75" cy="75" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                <motion.circle
                  cx="75" cy="75" r="60" fill="none"
                  stroke="url(#ringGrad)" strokeWidth="10" strokeLinecap="round"
                  transform="rotate(-90 75 75)"
                  initial={{ strokeDashoffset: 377 }}
                  animate={{ strokeDashoffset: 377 - (377 * (totalLogged / 45)) }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  strokeDasharray="377"
                />
              </svg>
              <div className="progress-ring-text">
                <div className="ring-number"><CountUpNumber value={totalLogged} /></div>
                <div className="ring-label">Days Logged</div>
              </div>
            </div>
            <p className="progress-ring-footer">45 Day IoT Internship · IIIT Kottayam</p>
          </div>

        </div>
      </div>

      {/* ── PROGRAM INFO PILLS ── */}
      <div className="pmv-program-info-row">
        <span className="info-glass-pill">🏫 IIIT Kottayam</span>
        <span className="info-glass-pill">📅 June 2026 – August 2026</span>
        <span className="info-glass-pill">🔌 IoT &amp; Embedded Systems</span>
        <span className="info-glass-pill">🎓 PM-VIKAS Program</span>
      </div>

      {/* ── LOGIN MODAL ── */}
      <AnimatePresence>
        {loginModalOpen && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLoginModalOpen(false)}>
            <motion.div className="modal-box glass-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <h3 className="modal-title">Admin Access</h3>
              <label className="modal-label">Password</label>
              <input
                type="password"
                placeholder="Enter password..."
                value={loginPwd}
                onChange={e => setLoginPwd(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLoginAttempt()}
                className={`modal-input${loginShake ? ' shake' : ''}`}
                autoFocus
              />
              <div className="modal-actions">
                <button className="btn btn-gradient" onClick={handleLoginAttempt}>Login</button>
                <button className="btn btn-ghost" onClick={() => setLoginModalOpen(false)}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ACTIVITY LOG / EDIT MODAL ── */}
      <AnimatePresence>
        {activityModalOpen && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !saving && setActivityModalOpen(false)}>
            <motion.div className="modal-box glass-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <h3 className="modal-title">{selectedDate ? formatDateLabel(selectedDate) : ''}</h3>
              <label className="modal-label">Activity Title</label>
              <input
                type="text"
                className="modal-input"
                placeholder="e.g. Introduction to IoT &amp; Ecosystem"
                value={activityTitle}
                onChange={e => setActivityTitle(e.target.value)}
                disabled={saving}
              />
              <label className="modal-label">What did you work on today?</label>
              <textarea
                className="modal-textarea"
                value={activityDesc}
                onChange={e => setActivityDesc(e.target.value)}
                placeholder="Describe your activity..."
                rows={4}
                disabled={saving}
              />
              <label className="modal-label">Status</label>
              <select className="modal-select" value={activityStatus} onChange={e => setActivityStatus(e.target.value)} disabled={saving}>
                <option>Completed</option>
                <option>In Progress</option>
                <option>Planned</option>
              </select>
              <div className="modal-actions">
                <button className="btn btn-gradient" onClick={saveActivity} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Activity'}
                </button>
                <button className="btn btn-ghost" onClick={() => setActivityModalOpen(false)} disabled={saving}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOAST ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`toast ${toastType === 'error' ? 'toast-error' : ''}`}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
