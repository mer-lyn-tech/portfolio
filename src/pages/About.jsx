import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import './About.css';

const skillCards = [
  {
    icon: '🔌',
    title: 'IoT & Embedded',
    color: '#00e5ff',
    pills: ['ESP32', 'Arduino Uno', 'MQTT', 'Ultrasonic Sensor', 'IR Sensor', 'Soil Moisture', 'Servo Motor', 'LCD'],
  },
  {
    icon: '🧠',
    title: 'Machine Learning',
    color: '#a78bfa',
    pills: ['Python', 'Scikit-learn', 'Isolation Forest', 'NumPy', 'Pandas', 'Anomaly Detection'],
  },
  {
    icon: '🌐',
    title: 'Web & Backend',
    color: '#f87171',
    pills: ['React.js', 'Node.js', 'HTML5', 'CSS3', 'JavaScript', 'REST APIs'],
  },
  {
    icon: '📱',
    title: 'Mobile & Database',
    color: '#2A9D8F',
    pills: ['Flutter', 'Dart', 'MySQL', 'Firebase', 'Firestore'],
  },
];

const education = [
  {
    icon: '🎓',
    color: '#00e5ff',
    institution: 'Christ College of Engineering (Autonomous), Thrissur',
    degree: 'B.Tech — Computer Science & Engineering',
    duration: '2023 – 2027',
    extra: 'CGPA: 8.63 / 10.0',
    bullets: [
      'Secretary, CODe (Community of Developers) Community',
      'Organised Idea Pitching Competition; volunteered at BEACHHACK\'25',
      'Elected Student Representative (2025–26)',
      'Industrial Visit Coordinator — ICFOSS & UST Global (60+ students)',
    ],
  },
  {
    icon: '🏫',
    color: '#a78bfa',
    institution: 'Christ Vidyanikethan School, Thrissur',
    degree: 'ISC — Class XII',
    duration: '2022 – 2023',
    extra: 'Score: 89% · Science (Biology with Mathematics)',
    bullets: [],
  },
];

const languages = [
  { flag: '🌍', lang: 'English', level: 'Fluent' },
  { flag: '🇮🇳', lang: 'Malayalam', level: 'Native' },
  { flag: '🗣️', lang: 'Hindi', level: 'Intermediate' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function About() {
  return (
    <div className="page-container about-page">

      {/* ── SECTION 1: BIO ── */}
      <motion.div
        className="about-bio-card glass-section"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* LEFT: Photo */}
        <div className="about-photo-col">
          <div className="about-photo-wrapper">
            <svg className="about-brush" viewBox="0 0 420 340" xmlns="http://www.w3.org/2000/svg">
              <path fill="#2A9D8F" opacity="0.75"
                d="M40,210 C20,160 30,90 80,60 C130,30 210,50 280,40 C350,30 400,80 390,150 C380,220 340,280 270,300 C200,320 130,310 80,280 C50,265 50,240 40,210 Z"
              />
            </svg>
            <img src="/casual_pic.jpeg" alt="Merlyn Antony" className="about-photo" />
          </div>
        </div>

        {/* RIGHT: Info */}
        <div className="about-info-col">
          <div className="about-eyebrow">ABOUT ME</div>
          <h1 className="about-name">Merlyn Antony</h1>
          <div className="about-title">B.Tech CSE · IoT &amp; Full-Stack Developer</div>

          <p className="about-bio">
            Final-year B.Tech Computer Science &amp; Engineering student
            at Christ College of Engineering (Autonomous), Thrissur.
            I design and deploy end-to-end solutions spanning IoT hardware,
            embedded systems, cloud backends, and ML-driven analytics.
            Passionate about building technology that solves real problems.
          </p>

          <div className="about-contacts">
            <div className="about-contact-item">
              <Mail size={16} />
              <span>merlynantony0201@gmail.com</span>
            </div>
            <div className="about-contact-item">
              <Phone size={16} />
              <span>+91 8848826521</span>
            </div>
            <div className="about-contact-item">
              <MapPin size={16} />
              <span>Thrissur, Kerala</span>
            </div>
          </div>

          <div className="about-socials">
            <a href="https://linkedin.com/in/merlyn-antony-kunduparambil/" target="_blank" rel="noreferrer" className="social-outline-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
            <a href="https://github.com/mer-lyn-tech" target="_blank" rel="noreferrer" className="social-outline-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
          </div>
        </div>
      </motion.div>

      {/* ── SECTION 2: SKILLS ── */}
      <motion.div
        className="about-section"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="section-eyebrow">TECHNICAL ARSENAL</div>
        <h2 className="about-section-title">Skills &amp; Technologies</h2>

        <div className="skills-grid">
          {skillCards.map((card) => (
            <div key={card.title} className="skill-card" style={{ borderTop: `4px solid ${card.color}` }}>
              <div className="skill-card-icon">{card.icon}</div>
              <h3 className="skill-card-title">{card.title}</h3>
              <div className="skill-pill-row">
                {card.pills.map((pill) => (
                  <span
                    key={pill}
                    className="about-pill"
                    style={{
                      background: `${card.color}1A`,
                      border: `1px solid ${card.color}4D`,
                    }}
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── SECTION 3: EDUCATION ── */}
      <motion.div
        className="about-section"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="section-eyebrow">BACKGROUND</div>
        <h2 className="about-section-title">Education</h2>

        <div className="edu-timeline">
          {education.map((edu, idx) => (
            <div key={idx} className="edu-entry">
              <div className="edu-marker">
                <div className="edu-dot" style={{ background: edu.color, boxShadow: `0 0 10px ${edu.color}80` }} />
                {idx < education.length - 1 && <div className="edu-line" style={{ background: `linear-gradient(to bottom, ${edu.color}, transparent)` }} />}
              </div>
              <div className="edu-card glass-card" style={{ borderLeft: `3px solid ${edu.color}` }}>
                <div className="edu-card-header">
                  <div>
                    <div className="edu-icon">{edu.icon}</div>
                    <h3 className="edu-institution">{edu.institution}</h3>
                    <div className="edu-degree">{edu.degree}</div>
                    <div className="edu-duration" style={{ color: edu.color }}>{edu.duration}</div>
                    <div className="edu-extra">{edu.extra}</div>
                  </div>
                </div>
                {edu.bullets.length > 0 && (
                  <ul className="edu-bullets">
                    {edu.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── SECTION 4: LANGUAGES ── */}
      <motion.div
        className="about-section"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="section-eyebrow">LANGUAGES</div>
        <div className="lang-row">
          {languages.map((l) => (
            <div key={l.lang} className="lang-card glass-card">
              <span className="lang-flag">{l.flag}</span>
              <span className="lang-name">{l.lang}</span>
              <span className="lang-level">{l.level}</span>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
