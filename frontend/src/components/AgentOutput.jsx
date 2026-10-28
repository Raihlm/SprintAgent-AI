import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './AgentOutput.module.css';

/**
 * AgentOutput
 * Renders the markdown response from an agent inside a styled card.
 *
 * Props:
 *  - title   {string}  Card header label.
 *  - content {string}  Markdown string from the agent.
 *  - verdict {string?} Optional "APPROVED" | "NEEDS REVISION" badge.
 *  - loading {bool}    Shows skeleton / spinner while request is in flight.
 *  - error   {string?} Error message to display instead of content.
 */
export default function AgentOutput({ title, content, verdict, loading, error }) {
  return (
    <section className={styles.card} aria-live="polite" aria-label={title}>
      <header className={styles.header}>
        <span className={styles.title}>{title}</span>
        {verdict && (
          <span
            className={`${styles.badge} ${
              verdict === 'APPROVED' ? styles.approved : styles.revision
            }`}
          >
            {verdict === 'APPROVED' ? '✅ APPROVED' : '❌ NEEDS REVISION'}
          </span>
        )}
      </header>

      <div className={styles.body}>
        {loading && (
          <div className={styles.loading} aria-label="Loading response">
            <span className={styles.spinner} />
            <span>Agent is processing…</span>
          </div>
        )}

        {!loading && error && (
          <p className={styles.error} role="alert">{error}</p>
        )}

        {!loading && !error && content && (
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}

        {!loading && !error && !content && (
          <p className={styles.placeholder}>Output will appear here after you run the agent.</p>
        )}
      </div>
    </section>
  );
}
