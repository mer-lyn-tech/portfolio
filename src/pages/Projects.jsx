import React from 'react';
import { motion } from 'framer-motion';
import './Projects.css';

const projects = [
  {
    title: 'AI-Based Smart Power Monitoring & Anomaly Detection System',
    description: 'Full-stack IoT energy monitor using ESP32 with ML-based anomaly detection via Isolation Forest algorithm',
    tags: ['ESP32', 'IoT Sensors', 'Firebase', 'Python', 'Isolation Forest', 'ML'],
    date: 'March 2026',
    github: 'https://github.com/mer-lyn-tech',
    demo: '#',
    award: null,
  },
  {
    title: 'Civic Reporting Management System',
    description: 'Web platform for citizens to report civic issues directly to local governing authorities with real-time status tracking',
    tags: ['Python Flask', 'HTML', 'CSS', 'JavaScript', 'MySQL', 'RESTful APIs'],
    date: 'July 2025',
    note: 'Presented at Christ College Project Expo 2025',
    github: 'https://github.com/mer-lyn-tech',
    demo: '#',
    award: null,
  },
  {
    title: 'Faculty Task Management System',
    description: 'Full-featured task manager for faculty with CRUD operations, deadline tracking, and MySQL relational database',
    tags: ['Node.js', 'Express.js', 'MySQL', 'JavaScript', 'REST APIs'],
    date: 'January 2025',
    github: 'https://github.com/mer-lyn-tech',
    demo: '#',
    award: null,
  },
  {
    title: 'Smart Car Parking System',
    description: 'Automated parking using ultrasonic & IR sensors with servo-controlled gates and live LCD slot count display',
    tags: ['Microcontroller', 'Ultrasonic Sensor', 'IR Sensor', 'Servo Motor', 'LCD'],
    date: 'March 2024',
    github: 'https://github.com/mer-lyn-tech',
    demo: null,
    award: null,
  },
  {
    title: 'Automated Waste Segregation System',
    description: 'Real-time dry/wet waste classifier using sensors and Arduino servo control.',
    tags: ['Arduino Uno', 'Soil Moisture Sensor', 'Ultrasonic Sensor', 'Servo Motor'],
    date: 'January 2024',
    github: 'https://github.com/mer-lyn-tech',
    demo: null,
    award: '🥉 3rd Prize — Drishti Expo',
  },
];

export default function Projects() {
  return (
    <div className="page-container projects-container">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="section-eyebrow">PROJECTS</div>
        <h1>Things I've Built</h1>
      </motion.div>

      <div className="projects-grid">
        {projects.map((proj, idx) => (
          <motion.div
            key={idx}
            className="project-card glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
          >
            <div className="project-card-header">
              <div className="project-date">{proj.date}</div>
              {proj.award && <div className="project-award">{proj.award}</div>}
            </div>
            <h3 className="project-title">{proj.title}</h3>
            <p className="project-desc">{proj.description}</p>
            {proj.note && <div className="project-note">📌 {proj.note}</div>}
            <div className="project-tags">
              {proj.tags.map(tag => (
                <span key={tag} className="skill-pill small-pill">{tag}</span>
              ))}
            </div>
            <div className="project-buttons">
              {proj.github && (
                <a href={proj.github} target="_blank" rel="noreferrer" className="proj-btn btn-github">
                  GitHub ↗
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
