import React, { useState } from 'react';
import TicketForm from '../components/TicketForm';
import AgentOutput from '../components/AgentOutput';
import { useAgent } from '../hooks/useAgent';
import { reviewCode } from '../services/agentService';
import styles from './Page.module.css';

const JIRA_PLACEHOLDER = `Issue Key: PROJ-42
Summary: Add user authentication endpoint

Acceptance Criteria:
1. POST /auth/login accepts { email, password } in JSON body.
2. Returns 401 if credentials are invalid.
3. Returns a signed JWT (expiry 1h) in { token } on success.
4. Password comparison must use bcrypt.compare — never plaintext.
5. All errors must return { error: string } shape.`;

const CODE_PLACEHOLDER = `// Paste the full source code to be reviewed here
// e.g., the output from the Architect Agent, or developer-written code`;

export default function ReviewerPage() {
  const [jiraTicket, setJiraTicket]     = useState('');
  const [submittedCode, setSubmittedCode] = useState('');
  const { data, loading, error, run }   = useAgent(reviewCode);

  const fields = [
    {
      id: 'jiraTicket',
      label: 'Jira Ticket (original requirements)',
      placeholder: JIRA_PLACEHOLDER,
      value: jiraTicket,
      onChange: setJiraTicket,
      rows: 10,
    },
    {
      id: 'submittedCode',
      label: 'Submitted Code',
      placeholder: CODE_PLACEHOLDER,
      value: submittedCode,
      onChange: setSubmittedCode,
      rows: 14,
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pane}>
        <p className={styles.hint}>
          Paste the original Jira ticket and the code to audit. The Reviewer Agent will verify
          every Acceptance Criterion and issue an APPROVED or NEEDS REVISION verdict.
        </p>
        <TicketForm
          fields={fields}
          onSubmit={() => run(jiraTicket, submittedCode)}
          loading={loading}
          submitLabel="Run Code Review"
        />
      </div>
      <div className={styles.pane}>
        <AgentOutput
          title="Reviewer Agent Report"
          content={data?.result}
          verdict={data?.verdict}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}
