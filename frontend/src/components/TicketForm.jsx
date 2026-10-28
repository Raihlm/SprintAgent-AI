import React from 'react';
import styles from './TicketForm.module.css';

/**
 * TicketForm
 * Shared input form for both the Architect and Reviewer pages.
 *
 * Props:
 *  - fields   {Array<{id, label, placeholder, value, onChange, rows?}>}
 *  - onSubmit {Function} Called with the synthetic form event (preventDefault handled here).
 *  - loading  {bool}     Disables the submit button while the agent is running.
 *  - submitLabel {string} Button text.
 */
export default function TicketForm({ fields, onSubmit, loading, submitLabel = 'Run Agent' }) {
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(e);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {fields.map(({ id, label, placeholder, value, onChange, rows = 6 }) => (
        <div key={id} className={styles.field}>
          <label htmlFor={id} className={styles.label}>{label}</label>
          <textarea
            id={id}
            className={styles.textarea}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            required
            disabled={loading}
            spellCheck={false}
          />
        </div>
      ))}

      <button
        type="submit"
        className={styles.btn}
        disabled={loading || fields.some(f => !f.value.trim())}
      >
        {loading ? (
          <>
            <span className={styles.spinner} />
            Processing…
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}
