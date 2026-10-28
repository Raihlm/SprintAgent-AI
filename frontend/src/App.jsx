import React, { useState } from 'react';
import ArchitectPage from './pages/ArchitectPage';
import ReviewerPage from './pages/ReviewerPage';
import styles from './App.module.css';

const TABS = [
  { id: 'architect', label: '🏗  Architect Agent' },
  { id: 'reviewer',  label: '🔍  Reviewer Agent'  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('architect');

  return (
    <div className={styles.app}>
      {/* ── Header ─────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logo}>⚡</span>
          <div>
            <span className={styles.name}>SprintAgent AI</span>
            <span className={styles.tagline}>Jira-to-Code Automated Workflow</span>
          </div>
        </div>

        {/* ── Tab Nav ─────────────────────────────────── */}
        <nav className={styles.nav} role="tablist" aria-label="Agent selection">
          {TABS.map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* ── Tab Panels ─────────────────────────────────── */}
      <main>
        <div
          id="panel-architect"
          role="tabpanel"
          hidden={activeTab !== 'architect'}
          aria-label="Architect Agent"
        >
          {activeTab === 'architect' && <ArchitectPage />}
        </div>
        <div
          id="panel-reviewer"
          role="tabpanel"
          hidden={activeTab !== 'reviewer'}
          aria-label="Reviewer Agent"
        >
          {activeTab === 'reviewer' && <ReviewerPage />}
        </div>
      </main>
    </div>
  );
}
