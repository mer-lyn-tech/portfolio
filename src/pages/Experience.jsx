import React from 'react';
import { motion } from 'framer-motion';
import './Experience.css';

const experiences = [
  {
    company: 'IIIT-Kottayam - PM VIKAS',
    role: 'IoT Intern',
    duration: 'June 2026 – August 2026 (Ongoing)',
    type: 'Offline Internship · 1.5 months · IoT Domain',
    bullets: [
      'Selected for offline IoT internship covering Electronics, Networking, Arduino Programming, and hands-on hardware project modules',
      'Building foundational embedded systems knowledge progressing toward hardware-based IoT prototypes',
      'Working with real components: sensors, microcontrollers, actuators',
    ],
    tags: ['IoT', 'ESP32', 'Arduino', 'Electronics', 'Networking'],
  },
  {
    company: 'GJ Infotech',
    role: 'Flutter Intern',
    duration: 'June 2026 – Present',
    type: 'Offline Internship',
    bullets: [
      'Developing cross-platform mobile applications with Flutter & Dart',
      'Participating in full SDLC: requirements, UI design, testing, deployment',
      'Building reusable widget components and integrating REST APIs and Firebase backends into production-grade apps',
    ],
    tags: ['Flutter', 'Dart', 'Firebase', 'REST APIs', 'Mobile Dev'],
  },
];

export default function Experience() {
  return (
    <div className="page-container exp-container">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="section-eyebrow">EXPERIENCE</div>
        <h1>Work & Internships</h1>
      </motion.div>

      <div className="timeline">
        {experiences.map((exp, idx) => (
          <motion.div
            key={idx}
            className="timeline-entry"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            viewport={{ once: true }}
          >
            <div className="timeline-marker">
              <div className="timeline-dot" />
              {idx < experiences.length - 1 && <div className="timeline-line" />}
            </div>
            <div className="timeline-card glass-card">
              <div className="timeline-header">
                <div>
                  <h2 className="exp-role">{exp.role}</h2>
                  <div className="exp-company">{exp.company}</div>
                </div>
                <div className="exp-duration">{exp.duration}</div>
              </div>
              {exp.type && <div className="exp-type">{exp.type}</div>}
              <ul className="exp-bullets">
                {exp.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
              <div className="exp-tags">
                {exp.tags.map(tag => (
                  <span key={tag} className="skill-pill">{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
