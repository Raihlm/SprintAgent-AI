import React, { useState } from 'react';
import TicketForm from '../components/TicketForm';
import AgentOutput from '../components/AgentOutput';
import { useAgent } from '../hooks/useAgent';
import { generateArchitecture } from '../services/agentService';
import styles from './Page.module.css';

const JIRA_PLACEHOLDER = `Issue Key: PROJ-42
Summary: Add user authentication endpoint

Description:
As a developer, I need a POST /auth/login endpoint that validates credentials and returns a JWT.

Acceptance Criteria:
1. POST /auth/login accepts { email, password } in JSON body.
2. Returns 401 if credentials are invalid.
3. Returns a signed JWT (expiry 1h) in { token } on success.
4. Password comparison must use bcrypt.compare — never plaintext.
5. All errors must return { error: string } shape.`;

const FOLDER_PLACEHOLDER = `my-project/
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── utils/
├── package.json
└── .env`;

export default function ArchitectPage() {
  const [jiraTicket, setJiraTicket]         = useState('');
  const [folderStructure, setFolderStructure] = useState('');
  const { data, loading, error, run }       = useAgent(generateArchitecture);

  const fields = [
    {
      id: 'jiraTicket',
      label: 'Jira Ticket',
      placeholder: JIRA_PLACEHOLDER,
      value: jiraTicket,
      onChange: setJiraTicket,
      rows: 10,
    },
    {
      id: 'folderStructure',
      label: 'Repository Folder Structure',
      placeholder: FOLDER_PLACEHOLDER,
      value: folderStructure,
      onChange: setFolderStructure,
      rows: 8,
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pane}>
        <p className={styles.hint}>
          Paste your Jira ticket and repository directory tree below. The Architect Agent will
          generate a full implementation plan and production-ready code.
        </p>
        <TicketForm
          fields={fields}
          onSubmit={() => run(jiraTicket, folderStructure)}
          loading={loading}
          submitLabel="Generate Architecture"
        />
      </div>
      <div className={styles.pane}>
        <AgentOutput
          title="Architect Agent Output"
          content={data?.result}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}
