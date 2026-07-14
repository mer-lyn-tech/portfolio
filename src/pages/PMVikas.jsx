import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PMVikas.css';
import {
  isWorkingDay,
  getTotalWorkingDays,
  INTERNSHIP_START,
  INTERNSHIP_END,
  INTERNSHIP_TOTAL_DAYS,
} from '../utils/workingDays';

// ── Constants ──
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const ALL_STATUSES = ['Completed', 'In Progress', 'Planned', 'Absent', 'Leave'];

const STATUS_COLORS = {
  'Completed':   '#00e5ff',
  'In Progress': '#f59e0b',
  'Planned':     '#3b82f6',
  'Absent':      '#f87171',
  'Leave':       '#f87171',
};
const STATUS_PILL_BG = {
  'Completed':   'rgba(0, 229, 255, 0.15)',
  'In Progress': 'rgba(245, 158, 11, 0.15)',
  'Planned':     'rgba(59, 130, 246, 0.15)',
  'Absent':      'rgba(248, 113, 113, 0.15)',
  'Leave':       'rgba(248, 113, 113, 0.15)',
};
const STATUS_TEXT_COLOR = {
  'Completed':   '#00e5ff',
  'In Progress': '#fbbf24',
  'Planned':     '#60a5fa',
  'Absent':      '#f87171',
  'Leave':       '#f87171',
};

const isLeaveStatus = (s) => s === 'Absent' || s === 'Leave';

// ── Calendar helpers ──
function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year, month) { return new Date(year, month, 1).getDay(); }

function formatDateLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
function formatDateUppercase(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${WEEKDAYS[d.getDay()].toUpperCase()}, ${MONTHS[d.getMonth()].toUpperCase()} ${d.getDate()}, ${d.getFullYear()}`;
}

// Within-24-hours check for "NEW" badge
function isNew(dateStr) {
  const now = Date.now();
  const d = new Date(dateStr + 'T00:00:00').getTime();
  return (now - d) < 24 * 60 * 60 * 1000;
}

// ── SVG Small Ring Component ──
const RING_R = 29;
const RING_CIRC = 2 * Math.PI * RING_R; // ≈ 182.2

function StatRing({ pct, color, value }) {
  const targetOffset = RING_CIRC * (1 - Math.min(pct / 100, 1));
  return (
    <div className="stat-ring-wrapper">
      <svg width="70" height="70" viewBox="0 0 70 70">
        <circle cx="35" cy="35" r={RING_R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
        <motion.circle
          cx="35" cy="35" r={RING_R} fill="none"
          stroke={color} strokeWidth="6" strokeLinecap="round"
          transform="rotate(-90 35 35)"
          strokeDasharray={RING_CIRC}
          initial={{ strokeDashoffset: RING_CIRC }}
          animate={{ strokeDashoffset: targetOffset }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </svg>
      <div className="stat-ring-inner">
        <span className="stat-ring-num">{value}</span>
      </div>
    </div>
  );
}

// ── Icon SVGs ──
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
const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// Detect local vs production
const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';

// Total working days for leave tracker denominator
const TOTAL_WORKING_DAYS = getTotalWorkingDays(INTERNSHIP_START, INTERNSHIP_END);

export default function PMVikas() {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const formattedTodayDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  }).format(today);

  // Admin
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('pmvikas_admin') === 'true');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginPwd, setLoginPwd] = useState('');
  const [loginShake, setLoginShake] = useState(false);

  // Calendar navigation
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  // Activities map: date → entry
  const [activities, setActivities] = useState({});
  // Side panel selected date
  const [panelDate, setPanelDate] = useState(null);

  // Loading / error
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);
  const [saving, setSaving] = useState(false);

  // Activity modal
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [activityTitle, setActivityTitle] = useState('');
  const [activityDesc, setActivityDesc] = useState('');
  const [activityStatus, setActivityStatus] = useState('Completed');

  // Toast
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState('success');

  // Delete confirm
  const [confirmDeleteDate, setConfirmDeleteDate] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast(msg); setToastType(type);
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch from DB ──
  const fetchAllActivities = useCallback(async () => {
    setLoading(true);
    setDbError(false);
    try {
      const res = await fetch(`${API_BASE}/api/activity`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Bad response');
      const map = {};
      data.forEach(d => { if (d && d.date) map[d.date] = d; });
      setActivities(map);
    } catch (err) {
      console.error('Fetch error:', err.message);
      setDbError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAllActivities(); }, [fetchAllActivities]);

  // ── Auth ──
  const handleLoginAttempt = () => {
    if (loginPwd === 'merlyn2024') {
      sessionStorage.setItem('pmvikas_admin', 'true');
      setIsAdmin(true); setLoginModalOpen(false); setLoginPwd('');
    } else {
      setLoginShake(true); setTimeout(() => setLoginShake(false), 500);
    }
  };
  const handleLogout = () => { sessionStorage.removeItem('pmvikas_admin'); setIsAdmin(false); };

  // ── Calendar day click ──
  const handleDayClick = (dateStr) => {
    if (!dateStr) return;
    const d = new Date(dateStr + 'T00:00:00');
    if (!isWorkingDay(d)) return; // non-working day: do nothing
    const existing = activities[dateStr];
    if (existing) {
      setPanelDate(dateStr); // show in side panel
    } else if (isAdmin) {
      setSelectedDate(dateStr);
      setActivityTitle(''); setActivityDesc(''); setActivityStatus('Completed');
      setActivityModalOpen(true);
    }
  };

  // ── Edit ──
  const openEditModal = (entry) => {
    setSelectedDate(entry.date);
    setActivityTitle(entry.title || '');
    setActivityDesc(entry.activity || '');
    setActivityStatus(entry.status || 'Completed');
    setActivityModalOpen(true);
  };

  // ── Save ──
  const saveActivity = async () => {
    if (!activityTitle.trim() || !selectedDate) return;
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
      const rd = await res.json();
      if (!res.ok) throw new Error(rd.error || `HTTP ${res.status}`);
      await fetchAllActivities();
      setActivityModalOpen(false);
      showToast(isExisting ? '✅ Activity updated' : '✅ Activity saved', 'success');
    } catch (err) {
      showToast(`❌ Failed to save: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──
  const deleteActivity = async (dateStr) => {
    setConfirmDeleteDate(null);
    try {
      const res = await fetch(`${API_BASE}/api/activity?date=${dateStr}`, { method: 'DELETE' });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || `HTTP ${res.status}`); }
      if (panelDate === dateStr) setPanelDate(null);
      await fetchAllActivities();
      showToast('🗑️ Activity deleted', 'success');
    } catch (err) {
      showToast(`❌ Failed to delete: ${err.message}`, 'error');
    }
  };

  // ── Computed values ──
  const chronologicalActivities = Object.values(activities).sort((a, b) => a.date.localeCompare(b.date));
  const dayNumbers = {};
  chronologicalActivities.forEach((e, i) => { dayNumbers[e.date] = i + 1; });
  const sortedActivities = [...chronologicalActivities];

  const totalLogged = sortedActivities.length;
  const completedCount = sortedActivities.filter(a => a.status === 'Completed').length;
  const leaveCount = sortedActivities.filter(a => isLeaveStatus(a.status)).length;
  const daysRemaining = Math.max(0, INTERNSHIP_TOTAL_DAYS - totalLogged);

  const completedPct = Math.round((completedCount / INTERNSHIP_TOTAL_DAYS) * 100);
  const remainingPct = Math.round((daysRemaining / INTERNSHIP_TOTAL_DAYS) * 100);
  const leavePct = Math.round((leaveCount / TOTAL_WORKING_DAYS) * 100);

  // Latest entry for side panel default state
  const latestEntry = sortedActivities.length > 0 ? sortedActivities[sortedActivities.length - 1] : null;
  const panelEntry = panelDate ? activities[panelDate] : latestEntry;

  // ── Calendar cells ──
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

  // ── Render ──
  return (
    <div className="page-container pmv-dashboard">

      {/* WELCOME HEADER */}
      <motion.div
        className="pmv-welcome-banner glass-card"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
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

      {/* DB ERROR BANNER */}
      {dbError && !loading && (
        <div className="db-error-banner">
          ⚠️ Could not load activities from database. Check your internet connection and refresh.
          <button className="retry-btn" onClick={fetchAllActivities}>Retry</button>
        </div>
      )}

      {/* STAT CARDS ROW — rings replace progress bars */}
      <div className="pmv-stats-row">
        {/* Card 1: Days Completed */}
        <motion.div className="pmv-stat-card glass-card accent-cyan-border"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <div className="stat-card-inner">
            <div className="stat-card-left">
              <span className="card-icon cyan-bg">✅</span>
              <div className="card-label">Days Completed</div>
              <div className="card-subtext">Completed {completedPct}%</div>
            </div>
            <StatRing pct={completedPct} color="#00e5ff" value={completedCount} />
          </div>
        </motion.div>

        {/* Card 2: Days Remaining */}
        <motion.div className="pmv-stat-card glass-card accent-purple-border"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <div className="stat-card-inner">
            <div className="stat-card-left">
              <span className="card-icon purple-bg">📅</span>
              <div className="card-label">Days Remaining</div>
              <div className="card-subtext">out of {INTERNSHIP_TOTAL_DAYS} working days</div>
            </div>
            <StatRing pct={remainingPct} color="#a78bfa" value={daysRemaining} />
          </div>
        </motion.div>

        {/* Card 3: Leave Tracker */}
        <motion.div className="pmv-stat-card glass-card accent-coral-border"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <div className="stat-card-inner">
            <div className="stat-card-left">
              <span className="card-icon coral-bg">🏖️</span>
              <div className="card-label">Leave Taken</div>
              <div className="card-subtext">{leaveCount} of {TOTAL_WORKING_DAYS} working days</div>
            </div>
            <StatRing pct={leavePct} color="#f87171" value={leaveCount} />
          </div>
        </motion.div>
      </div>

      {/* CALENDAR + SIDE PANEL ROW */}
      <div className="pmv-cal-row">

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
              if (!day) return <div key={idx} className="grid-body-cell empty-cell" />;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const cellDate = new Date(dateStr + 'T00:00:00');
              const working = isWorkingDay(cellDate);
              const entry = activities[dateStr];
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === panelDate;
              return (
                <div
                  key={idx}
                  className={[
                    'grid-body-cell',
                    working ? 'clickable-cell' : 'off-day-cell',
                    isToday ? 'today-highlight' : '',
                    isSelected ? 'selected-cell' : '',
                  ].join(' ')}
                  onClick={() => working && handleDayClick(dateStr)}
                >
                  <span className="day-number">{day}</span>
                  {!working && <span className="off-label">Off</span>}
                  {entry && working && (
                    <span className="activity-status-dot" style={{ background: STATUS_COLORS[entry.status] || '#888' }} />
                  )}
                </div>
              );
            })}
          </div>
          {isAdmin && <p className="calendar-hint">Click any working date to log an activity</p>}
        </div>

        {/* Side Panel */}
        <div className="pmv-side-panel glass-card">
          <AnimatePresence mode="wait">
            {panelDate && activities[panelDate] ? (
              // STATE B — activity detail
              <motion.div
                key="detail"
                className="panel-content"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="panel-header-row">
                  <span className="panel-header-label">Activity Detail</span>
                  <button className="panel-close-btn" onClick={() => setPanelDate(null)}><IconX /></button>
                </div>
                <span className="panel-date-str">{formatDateUppercase(panelDate)}</span>
                <div className="panel-badges-row">
                  <span className="day-badge-pill">Day {String(dayNumbers[panelDate] || 1).padStart(2, '0')}</span>
                  <span className="status-badge" style={{ background: STATUS_PILL_BG[activities[panelDate].status] || 'rgba(255,255,255,0.08)', color: STATUS_TEXT_COLOR[activities[panelDate].status] || '#fff' }}>
                    {activities[panelDate].status}
                  </span>
                </div>
                <h3 className="panel-activity-title">{activities[panelDate].title || 'IoT Training Activity'}</h3>
                {isLeaveStatus(activities[panelDate].status) ? (
                  <div className="panel-leave-banner">🏖️ Leave / Absent Day</div>
                ) : (
                  <p className="panel-activity-desc">{activities[panelDate].activity}</p>
                )}
                <hr className="panel-divider" />
                {isAdmin && (
                  <div className="panel-admin-actions">
                    <button className="panel-edit-btn" onClick={() => openEditModal(activities[panelDate])}>
                      <IconEdit /> Edit
                    </button>
                    <button className="panel-delete-btn" onClick={() => setConfirmDeleteDate(panelDate)}>
                      <IconTrash /> Delete
                    </button>
                  </div>
                )}
                {/* Inline delete confirm inside panel */}
                {confirmDeleteDate === panelDate && (
                  <div className="panel-confirm-row">
                    <span>Delete this entry?</span>
                    <button className="confirm-yes-btn" onClick={() => deleteActivity(panelDate)}>Yes, Delete</button>
                    <button className="confirm-no-btn" onClick={() => setConfirmDeleteDate(null)}>Cancel</button>
                  </div>
                )}
              </motion.div>
            ) : latestEntry ? (
              // STATE A — latest update
              <motion.div
                key="latest"
                className="panel-content"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="panel-header-label">Latest Update</span>
                <span className="panel-date-str">LATEST · {formatDateUppercase(latestEntry.date)}</span>
                <div className="panel-badges-row">
                  <span className="day-badge-pill">Day {String(dayNumbers[latestEntry.date] || 1).padStart(2, '0')}</span>
                  <span className="status-badge" style={{ background: STATUS_PILL_BG[latestEntry.status] || 'rgba(255,255,255,0.08)', color: STATUS_TEXT_COLOR[latestEntry.status] || '#fff' }}>
                    {latestEntry.status}
                  </span>
                </div>
                <h3 className="panel-activity-title">{latestEntry.title || 'IoT Training Activity'}</h3>
                {isLeaveStatus(latestEntry.status) ? (
                  <div className="panel-leave-banner">🏖️ Leave / Absent Day</div>
                ) : (
                  <p className="panel-activity-desc">{latestEntry.activity}</p>
                )}
                <hr className="panel-divider" />
                <span className="panel-updated-at">Last updated {formatDateLabel(latestEntry.date)}</span>
              </motion.div>
            ) : (
              // STATE A — empty
              <motion.div
                key="empty"
                className="panel-content panel-empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="panel-header-label">Latest Update</span>
                <div className="panel-empty-icon">📋</div>
                <p className="panel-empty-text">No activities logged yet.</p>
                <p className="panel-empty-sub">Login as admin to add your first entry.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* ACTIVITY TIMELINE — full width below calendar row */}
      <div className="pmv-full-timeline">
        <div className="full-timeline-header">
          <h2 className="col-title">Activity Timeline</h2>
          <span className="timeline-count-badge">{totalLogged} {totalLogged === 1 ? 'Activity' : 'Activities'}</span>
        </div>

        {loading ? (
          <div className="loading-state glass-card">
            <div className="loading-spinner" />
            <p>Loading activities from database...</p>
          </div>
        ) : sortedActivities.length === 0 ? (
          <div className="tl-empty glass-card">
            <div className="empty-icon">📅</div>
            <h4 className="empty-title">Your internship journey starts here.</h4>
            <p className="empty-desc">Add your first activity to begin tracking.</p>
          </div>
        ) : (
          <div className="tl-list">
            {sortedActivities.map((entry, index) => {
              const dayNum = dayNumbers[entry.date] || 1;
              const dayLabel = `D${String(dayNum).padStart(2, '0')}`;
              const dotColor = STATUS_COLORS[entry.status] || '#888';
              const isLeave = isLeaveStatus(entry.status);
              const showNew = isNew(entry.date);
              return (
                <motion.div
                  key={entry.date}
                  id={`act-${entry.date}`}
                  className="tl-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  {/* Timeline dot */}
                  <div className="tl-dot" style={{ background: dotColor, boxShadow: `0 0 6px ${dotColor}` }} />

                  {/* Day badge */}
                  <div className="tl-day-col">
                    <span className="tl-day-badge" style={{
                      background: `${dotColor}18`,
                      border: `1px solid ${dotColor}4D`,
                      color: dotColor,
                    }}>{dayLabel}</span>
                  </div>

                  {/* Content */}
                  <div className="tl-content-col">
                    <div className="tl-top-row">
                      <span className="tl-title">{entry.title || 'IoT Training Activity'}</span>
                      <span className="tl-date-str">{formatDateLabel(entry.date)}</span>
                    </div>
                    {isLeave ? (
                      <span className="tl-leave-text">🏖️ Leave / Absent Day</span>
                    ) : (
                      <p className="tl-desc">{entry.activity}</p>
                    )}
                  </div>

                  {/* Right: status + admin actions */}
                  <div className="tl-right-col">
                    <span className="status-badge" style={{ background: STATUS_PILL_BG[entry.status] || 'rgba(255,255,255,0.08)', color: STATUS_TEXT_COLOR[entry.status] || '#fff' }}>
                      {entry.status}
                    </span>
                    {isAdmin && (
                      <div className="tl-admin-btns">
                        <button className="overlay-btn btn-edit" onClick={() => openEditModal(entry)}><IconEdit /></button>
                        <button className="overlay-btn btn-delete" onClick={() => setConfirmDeleteDate(confirmDeleteDate === entry.date ? null : entry.date)}><IconTrash /></button>
                      </div>
                    )}
                  </div>

                  {showNew && <span className="tl-new-badge">NEW</span>}

                  {/* Inline delete confirm */}
                  {confirmDeleteDate === entry.date && (
                    <div className="inline-delete-box">
                      <span>Delete this entry?</span>
                      <button className="confirm-yes-btn" onClick={() => deleteActivity(entry.date)}>Yes, Delete</button>
                      <button className="confirm-no-btn" onClick={() => setConfirmDeleteDate(null)}>Cancel</button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* PROGRAM INFO PILLS */}
      <div className="pmv-program-info-row">
        <span className="info-glass-pill">🏫 IIIT Kottayam</span>
        <span className="info-glass-pill">📅 June 2026 – August 2026</span>
        <span className="info-glass-pill">🔌 IoT &amp; Embedded Systems</span>
        <span className="info-glass-pill">🎓 PM-VIKAS Program</span>
      </div>

      {/* LOGIN MODAL */}
      <AnimatePresence>
        {loginModalOpen && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLoginModalOpen(false)}>
            <motion.div className="modal-box glass-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <h3 className="modal-title">Admin Access</h3>
              <label className="modal-label">Password</label>
              <input
                type="password" placeholder="Enter password..."
                value={loginPwd} onChange={e => setLoginPwd(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLoginAttempt()}
                className={`modal-input${loginShake ? ' shake' : ''}`} autoFocus
              />
              <div className="modal-actions">
                <button className="btn btn-gradient" onClick={handleLoginAttempt}>Login</button>
                <button className="btn btn-ghost" onClick={() => setLoginModalOpen(false)}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ACTIVITY ADD / EDIT MODAL */}
      <AnimatePresence>
        {activityModalOpen && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !saving && setActivityModalOpen(false)}>
            <motion.div className="modal-box glass-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <h3 className="modal-title">{selectedDate ? formatDateLabel(selectedDate) : ''}</h3>
              <label className="modal-label">Activity Title</label>
              <input type="text" className="modal-input" placeholder="e.g. Introduction to IoT &amp; Ecosystem"
                value={activityTitle} onChange={e => setActivityTitle(e.target.value)} disabled={saving} />
              <label className="modal-label">What did you work on today?</label>
              <textarea className="modal-textarea" value={activityDesc}
                onChange={e => setActivityDesc(e.target.value)}
                placeholder="Describe your activity..." rows={4} disabled={saving} />
              <label className="modal-label">Status</label>
              <select className="modal-select" value={activityStatus}
                onChange={e => setActivityStatus(e.target.value)} disabled={saving}>
                {ALL_STATUSES.map(s => <option key={s}>{s}</option>)}
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

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div className={`toast ${toastType === 'error' ? 'toast-error' : ''}`}
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
