import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LinkedInGallery from '../components/LinkedInGallery';
import './Achievements.css';

const tabs = ['Awards', 'Certifications', 'Leadership'];

const data = {
  Awards: [
    {
      icon: '🥉',
      title: '3rd Prize — Drishti Project Expo (2024)',
      detail: 'Project: Automated Waste Segregation System',
      org: 'Christ College of Engineering',
    },
    {
      icon: '🥉',
      title: '3rd Prize — Gesture Controlled Robot',
      detail: 'Event: Mechfest (2023)',
      org: 'Christ College of Engineering',
    },
  ],
  Certifications: [
    {
      title: 'Introduction to Data Analytics',
      platform: 'IBM · 2025',
      link: '#',
    },
    {
      title: 'Introduction to Machine Learning',
      platform: 'NPTEL · IIT Kharagpur · 2025',
      link: '#',
    },
    {
      title: 'Machine Learning Bootcamp (3-Day Intensive)',
      platform: 'ICFOSS · 2024',
      link: '#',
    },
  ],
  Leadership: [
    {
      icon: '👑',
      title: 'Secretary — CODe Community',
      subtitle: '(Community of Developers)',
      duration: '2024–2025',
      impact: 'Organised Idea Pitching Competition; volunteered at BEACHHACK\'25 national hackathon',
    },
    {
      icon: '🎓',
      title: 'Student Representative',
      subtitle: null,
      duration: '2025–2026',
      impact: 'Elected peer rep for academic coordination between students and faculty',
    },
    {
      icon: '🏭',
      title: 'Industrial Visit Coordinator',
      subtitle: null,
      duration: '2025–2026',
      impact: 'Managed educational visits to ICFOSS and UST Global for 60+ students',
    },
  ],
};

export default function Achievements() {
  const [activeTab, setActiveTab] = useState('Awards');

  return (
    <div className="page-container">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="section-eyebrow">ACHIEVEMENTS</div>
        <h1>Honours & Recognitions</h1>
      </motion.div>

      <div className="tabs-row">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        className="tab-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'Awards' && (
          <div className="cards-grid">
            {data.Awards.map((item, i) => (
              <div key={i} className="achieve-card glass-card">
                <div className="achieve-icon">{item.icon}</div>
                <h3 className="achieve-title">{item.title}</h3>
                <p className="achieve-detail">{item.detail}</p>
                <p className="achieve-org">{item.org}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Certifications' && (
          <div className="cards-grid">
            {data.Certifications.map((item, i) => (
              <div key={i} className="achieve-card glass-card">
                <div className="cert-badge">CERT</div>
                <h3 className="achieve-title">{item.title}</h3>
                <p className="achieve-detail">{item.platform}</p>
                <a href={item.link} className="cert-btn" target="_blank" rel="noreferrer">
                  View Certificate ↗
                </a>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Leadership' && (
          <div className="leadership-list">
            {data.Leadership.map((item, i) => (
              <motion.div
                key={i}
                className="leadership-card glass-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="leadership-icon">{item.icon}</div>
                <div className="leadership-info">
                  <h3>{item.title} {item.subtitle && <span className="text-muted">{item.subtitle}</span>}</h3>
                  <div className="leadership-duration">{item.duration}</div>
                  <p className="leadership-impact">{item.impact}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* LinkedIn Gallery */}
      <LinkedInGallery />
    </div>
  );
}
