import React, { useRef, useState } from 'react';
import linkedinPosts from '../data/linkedinPosts';
import './LinkedInGallery.css';

const LinkedInLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#0A66C2" style={{ flexShrink: 0 }}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

function PostCard({ post }) {
  const hasImages = post.images && post.images.length > 0;
  const extraCount = hasImages ? post.images.length - 1 : 0;

  return (
    <div className="lg-card">
      {/* ── DEFAULT STATE: Cover image area (top 55%) ── */}
      <div className="lg-cover-area">
        {hasImages ? (
          <>
            <img
              src={post.images[0]}
              alt={post.date}
              crossOrigin="anonymous"
              onError={e => { e.target.style.display = 'none'; }}
              className="lg-cover-img"
            />
            {extraCount > 0 && (
              <span className="lg-more-badge">📷 +{extraCount} more</span>
            )}
          </>
        ) : (
          <div className="lg-no-img-placeholder">
            <LinkedInLogo size={36} />
          </div>
        )}
      </div>

      {/* ── DEFAULT STATE: Bottom info area (45%) ── */}
      <div className="lg-card-body">
        <div className="lg-card-top">
          <LinkedInLogo size={16} />
          <span className="lg-date">{post.date}</span>
        </div>
        <p className="lg-content">{post.content}</p>
        <div className="lg-card-bottom">
          <span className="lg-likes">❤️ {post.likes}</span>
          <a href={post.url} target="_blank" rel="noreferrer" className="lg-view-link">
            View Post →
          </a>
        </div>
      </div>

      {/* ── HOVER OVERLAY (slides up from bottom) ── */}
      <div className="lg-overlay">
        <div className="lg-overlay-top">
          <LinkedInLogo size={20} />
          <span className="lg-date">{post.date}</span>
        </div>

        {/* Thumbnail strip — show if more than 1 image */}
        {hasImages && post.images.length > 1 && (
          <div className="lg-thumb-strip">
            {post.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`photo ${i + 1}`}
                crossOrigin="anonymous"
                onError={e => { e.target.style.display = 'none'; }}
                className="lg-thumb"
              />
            ))}
          </div>
        )}

        <p className="lg-overlay-content">{post.content}</p>

        <div className="lg-overlay-bottom">
          <span className="lg-likes">❤️ {post.likes}</span>
          <a href={post.url} target="_blank" rel="noreferrer" className="lg-view-link">
            View Post →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LinkedInGallery() {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  };
  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
  };

  return (
    <section className="linkedin-gallery">
      <div className="lg-header">
        <div className="section-eyebrow">LINKEDIN</div>
        <h2 className="lg-title">From My LinkedIn</h2>
        <p className="lg-subtitle">Stay updated with my latest posts and activities</p>
      </div>

      <div className="lg-scroll-area">
        <button className="lg-arrow lg-arrow-left" onClick={scrollLeft} aria-label="Scroll left">‹</button>

        <div className="lg-track" ref={scrollRef}>
          {linkedinPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <button className="lg-arrow lg-arrow-right" onClick={scrollRight} aria-label="Scroll right">›</button>
      </div>

      <div className="lg-footer">
        <a
          href="https://linkedin.com/in/merlyn-antony-kunduparambil/"
          target="_blank"
          rel="noreferrer"
          className="lg-view-all-btn"
        >
          View All on LinkedIn →
        </a>
      </div>
    </section>
  );
}
