import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PMVikas.css';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const STATUS_COLORS = {
  'Completed': '#10b981',
  'In Progress': '#f59e0b',
  'Planned': '#3b82f6',
};

const learningTags = ['Embedded Systems','Arduino','IoT Sensors','Electronics','Networking','Hardware Prototyping'];
const steps = ['Selected','Electronics & Networking','Arduino Programming','Hardware Projects','Completion (Aug 2026)'];

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year, month) { return new Date(year, month, 1).getDay(); }

function formatDateLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${WEEKDAYS[d.getDay()].toUpperCase()}, ${MONTHS[d.getMonth()].toUpperCase()} ${d.getDate()}, ${d.getFullYear()}`;
}

// Pencil icon (inline SVG — no external dependency needed)
const IconEdit = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

// Trash icon (inline SVG)
const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

export default function PMVikas() {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  // ── Admin state: persisted in sessionStorage ──
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('pmvikas_admin') === 'true';
  });
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginPwd, setLoginPwd] = useState('');
  const [loginShake, setLoginShake] = useState(false);

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [activities, setActivities] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [activityTitle, setActivityTitle] = useState('');
  const [activityDesc, setActivityDesc] = useState('');
  const [activityStatus, setActivityStatus] = useState('Completed');
  const [toast, setToast] = useState(null);

  // Per-card delete confirmation: stores the date of the card pending delete
  const [confirmDeleteDate, setConfirmDeleteDate] = useState(null);

  const fetchActivities = useCallback(async () => {
    try {
      const res = await fetch('/api/activity');
      if (res.ok) {
        const data = await res.json();
        const map = {};
        data.forEach(d => { map[d.date] = d; });
        setActivities(map);
      }
    } catch {}
  }, []);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ── Admin login (sessionStorage) ──
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

  // ── Admin logout ──
  const handleLogout = () => {
    sessionStorage.removeItem('pmvikas_admin');
    setIsAdmin(false);
  };

  // ── Open edit modal for a card (pre-filled) ──
  const openEditModal = (entry) => {
    setSelectedDate(entry.date);
    setActivityTitle(entry.title || '');
    setActivityDesc(entry.activity || '');
    setActivityStatus(entry.status || 'Completed');
    setActivityModalOpen(true);
  };

  // ── Day click ──
  const handleDayClick = (dateStr) => {
    if (!dateStr) return;
    setSelectedDate(dateStr);
    if (isAdmin) {
      const ex = activities[dateStr];
      setActivityTitle(ex?.title || '');
      setActivityDesc(ex?.activity || '');
      setActivityStatus(ex?.status || 'Completed');
      setActivityModalOpen(true);
    } else if (activities[dateStr]) {
      const el = document.getElementById(`act-${dateStr}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // ── Save activity ──
  const saveActivity = async () => {
    if (!activityTitle.trim()) return;
    const allKeys = Object.keys(activities).sort();
    const isExisting = allKeys.includes(selectedDate);
    const dayNum = isExisting ? allKeys.indexOf(selectedDate) + 1 : allKeys.length + 1;
    const payload = { date: selectedDate, title: activityTitle, activity: activityDesc, status: activityStatus, dayNum };
    setActivities(prev => ({ ...prev, [selectedDate]: payload }));
    setActivityModalOpen(false);
    try {
      await fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      showToast(isExisting ? '✅ Activity updated successfully' : '✅ Activity saved successfully');
    } catch { showToast('✅ Saved locally'); }
  };

  // ── Delete activity (used by inline confirm) ──
  const deleteActivity = async (dateStr) => {
    setActivities(prev => { const n = { ...prev }; delete n[dateStr]; return n; });
    setConfirmDeleteDate(null);
    try {
      await fetch(`/api/activity?date=${dateStr}`, { method: 'DELETE' });
      showToast('🗑️ Activity deleted');
    } catch { showToast('🗑️ Cleared locally'); }
  };

  // ── Calendar grid ──
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  // Sorted activity cards (newest first for layout display)
  const sortedActivities = Object.values(activities).sort((a, b) => b.date.localeCompare(a.date));

  // Chronologically sorted (oldest first) to assign correct day numbers based on earliest date
  const chronologicalActivities = Object.values(activities).sort((a, b) => a.date.localeCompare(b.date));
  const dayNumbers = {};
  chronologicalActivities.forEach((entry, index) => {
    dayNumbers[entry.date] = index + 1;
  });

  return (
    <div className="page-container pmv-page">

      {/* ── TWO PANEL LAYOUT ── */}
      <div className="pmv-panels">

        {/* ── LEFT PANEL ── */}
        <motion.div
          className="pmv-panel pmv-left glass-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="section-eyebrow">PROGRAM</div>
          <h1 className="pmv-title">PM-VIKAS · IIIT Kottayam</h1>
          <h3 className="pmv-subtitle">IoT Assistant Internship Program</h3>
          <p className="pmv-description">
            PM-VIKAS (Pradhan Mantri Vishwakarma Kaushal Samman) is a Government of India initiative.
            IIIT-Kottayam runs an offline IoT-focused internship track covering: Electronics fundamentals,
            Embedded systems, Networking, Arduino programming, and hardware project development.
          </p>

          <div className="progress-steps">
            {steps.map((step, i) => (
              <div key={i} className="progress-step">
                <div className={`step-circle ${i <= 2 ? 'done' : ''}`}>{i + 1}</div>
                <div className="step-label">{step}</div>
                {i < steps.length - 1 && <div className={`step-connector ${i < 2 ? 'done' : ''}`} />}
              </div>
            ))}
          </div>

          <div className="skill-pills" style={{ marginTop: '20px' }}>
            {learningTags.map(tag => <span key={tag} className="skill-pill">{tag}</span>)}
          </div>
        </motion.div>

        {/* ── RIGHT PANEL: Calendar ── */}
        <motion.div
          className="pmv-panel pmv-right glass-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true }}
        >
          {/* Card header */}
          <div className="cal-card-header">
            <h2 className="cal-title">Daily Activity Log</h2>
            {isAdmin ? (
              <div className="admin-status-row">
                <div className="admin-active-badge"><span className="pulse-dot" />ADMIN ACTIVE</div>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <button className="admin-login-btn" onClick={() => setLoginModalOpen(true)}>🔐 Admin Login</button>
            )}
          </div>

          {isAdmin && <div className="admin-hint-text">Click any day to log an activity</div>}

          {/* Legend */}
          <div className="cal-legend">
            {Object.entries(STATUS_COLORS).map(([s, c]) => (
              <span key={s} className="cal-legend-item">
                <span className="cal-dot" style={{ background: c }} /> {s}
              </span>
            ))}
          </div>

          {/* Month nav */}
          <div className="cal-nav-row">
            <button onClick={prevMonth} className="cal-nav-btn">‹</button>
            <span className="cal-month-label">{MONTHS[currentMonth]} {currentYear}</span>
            <button onClick={nextMonth} className="cal-nav-btn">›</button>
          </div>

          {/* Calendar grid */}
          <div className="cal-grid">
            {DAYS_SHORT.map(d => (
              <div key={d} className="cal-day-header">{d}</div>
            ))}
            {days.map((day, i) => {
              const dateStr = day
                ? `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                : null;
              const entry = dateStr ? activities[dateStr] : null;
              const isToday = dateStr === todayStr;
              return (
                <div
                  key={i}
                  className={`cal-cell ${day ? 'active-cell' : ''} ${isToday ? 'today-cell' : ''} ${selectedDate === dateStr ? 'selected-cell' : ''}`}
                  onClick={() => day && handleDayClick(dateStr)}
                >
                  {day && <span className="cal-day-num">{day}</span>}
                  {entry && <span className="cal-indicator" style={{ background: STATUS_COLORS[entry.status] || '#888' }} />}
                </div>
              );
            })}
          </div>

          {/* Activity cards list */}
          {sortedActivities.length > 0 && (
            <div className="activity-cards-scroll">
              {sortedActivities.map((entry, idx) => (
                <div key={entry.date} id={`act-${entry.date}`} className="activity-card-wrapper">
                  <div className="activity-card-date">{formatDateLabel(entry.date)}</div>
                  <div className="activity-card" style={{ position: 'relative' }}>
                    {/* Admin edit/delete buttons — only in admin mode */}
                    {isAdmin && (
                      <div className="act-admin-btns">
                        <button
                          className="act-btn act-btn-edit"
                          title="Edit"
                          onClick={() => openEditModal(entry)}
                        >
                          <IconEdit />
                        </button>
                        <button
                          className="act-btn act-btn-delete"
                          title="Delete"
                          onClick={() => setConfirmDeleteDate(confirmDeleteDate === entry.date ? null : entry.date)}
                        >
                          <IconTrash />
                        </button>
                      </div>
                    )}
                    <div className="act-left-line">
                      <div className="act-circle" style={{ background: STATUS_COLORS[entry.status] }} />
                      <div className="act-vline" />
                    </div>
                    <div className="act-body" style={{ paddingRight: isAdmin ? '70px' : '0' }}>
                      <div className="act-title">
                        Day {String(dayNumbers[entry.date] || 1).padStart(2, '0')}: {entry.title || 'Activity'}
                      </div>
                      {entry.activity && <div className="act-desc">{entry.activity}</div>}
                    </div>
                  </div>
                  {/* Inline delete confirmation */}
                  {confirmDeleteDate === entry.date && (
                    <div className="act-delete-confirm">
                      <span>Are you sure?</span>
                      <button className="act-confirm-yes" onClick={() => deleteActivity(entry.date)}>Yes, Delete</button>
                      <button className="act-confirm-cancel" onClick={() => setConfirmDeleteDate(null)}>Cancel</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── LOCAL ADMIN LOGIN MODAL ── */}
      <AnimatePresence>
        {loginModalOpen && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLoginModalOpen(false)}>
            <motion.div className="modal-box glass-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <h3 className="modal-date">Admin Access</h3>
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

      {/* ── ACTIVITY LOG / EDIT MODAL (admin) ── */}
      <AnimatePresence>
        {activityModalOpen && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActivityModalOpen(false)}>
            <motion.div className="modal-box glass-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <h3 className="modal-date">{selectedDate ? formatDateLabel(selectedDate) : ''}</h3>
              <label className="modal-label">Activity Title</label>
              <input
                type="text"
                className="modal-input"
                placeholder="e.g. Introduction to IoT & Ecosystem"
                value={activityTitle}
                onChange={e => setActivityTitle(e.target.value)}
              />
              <label className="modal-label">What did you work on today?</label>
              <textarea
                className="modal-textarea"
                value={activityDesc}
                onChange={e => setActivityDesc(e.target.value)}
                placeholder="Describe your activity..."
                rows={4}
              />
              <label className="modal-label">Status</label>
              <select className="modal-select" value={activityStatus} onChange={e => setActivityStatus(e.target.value)}>
                <option>Completed</option>
                <option>In Progress</option>
                <option>Planned</option>
              </select>
              <div className="modal-actions">
                <button className="btn btn-gradient" onClick={saveActivity}>Save Activity</button>
                <button className="btn btn-ghost" onClick={() => setActivityModalOpen(false)}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div className="toast" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
