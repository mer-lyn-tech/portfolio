import React from 'react';
import { motion } from 'framer-motion';
import LinkedInGallery from '../components/LinkedInGallery';
import './Home.css';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.div 
      className="home-container"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="hero-columns">
        {/* LEFT COLUMN */}
        <motion.div className="hero-left" variants={itemVariants}>
          <h1 className="hero-heading">
            Hey There,<br/>
            I'm Merlyn<br/>
            Antony
          </h1>
          <a href="mailto:merlynantony0201@gmail.com" className="hero-email">
            merlynantony0201@gmail.com
          </a>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">5</span>
              <span className="stat-label">PROJECTS BUILT</span>
            </div>
          </div>
        </motion.div>

        {/* CENTER COLUMN */}
        <motion.div className="hero-center" variants={itemVariants}>
          <div className="image-wrapper">
            {/* Teal freeform brush stroke SVG */}
            <svg className="brush-stroke" viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
              <path 
                fill="var(--teal-brush)" 
                d="M48.1,241.6c-13.4-32.9-20.9-74.1,2.8-100.9C79.7,107,144.9,94.2,192.5,74.9c53.3-21.6,104.9-56,163.6-55.7c47.9,0.2,95.5,23.3,109.8,69.5c15.1,48.6-6.6,101.4-17.6,149.6c-9,39.3-17.5,79.5-44.4,108.6c-27.4,29.7-74.6,33.5-115,26.7c-48.2-8.1-94.8-24.9-143.6-30.8C101.6,337.5,58,318.5,48.1,241.6z"
              />
            </svg>
            <img src="/casual_pic.jpeg" alt="Merlyn Antony" className="hero-photo" />
          </div>
        </motion.div>

        {/* RIGHT COLUMN */}
        <motion.div className="hero-right" variants={itemVariants}>
          <p className="hero-tagline">
            "I build intelligent systems,<br/>
            And I love what I do."
          </p>
        </motion.div>
      </div>

      {/* LinkedIn Gallery */}
      <LinkedInGallery />
    </motion.div>
  );
}
