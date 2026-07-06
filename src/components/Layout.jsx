import React from 'react';
import { Outlet } from 'react-router-dom';
import Galaxy from './Galaxy';
import Navbar from './Navbar';
import './Layout.css';

export default function Layout() {
  return (
    <>
      {/* Fixed full-screen galaxy background — z-index 0 via Galaxy.css */}
      <Galaxy />

      {/* All page content sits above the galaxy */}
      <div className="layout-content">
        <Navbar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}
