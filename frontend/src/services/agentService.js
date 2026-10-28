/**
 * agentService.js
 * Thin wrapper around the SprintAgent backend API.
 * All fetch calls go through /api (proxied by Vite → Express in dev).
 */

const BASE = '/api';

/**
 * Calls the Architect Agent endpoint.
 *
 * @param {string} jiraTicket
 * @param {string} folderStructure
 * @returns {Promise<{ result: string }>}
 */
export async function generateArchitecture(jiraTicket, folderStructure) {
  const res = await fetch(`${BASE}/architect/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jiraTicket, folderStructure }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    const msg = data.errors?.[0]?.msg || data.error || 'Architect Agent failed.';
    throw new Error(msg);
  }

  return data;
}

/**
 * Calls the Reviewer Agent endpoint.
 *
 * @param {string} jiraTicket
 * @param {string} submittedCode
 * @returns {Promise<{ verdict: string, result: string }>}
 */
export async function reviewCode(jiraTicket, submittedCode) {
  const res = await fetch(`${BASE}/reviewer/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jiraTicket, submittedCode }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    const msg = data.errors?.[0]?.msg || data.error || 'Reviewer Agent failed.';
    throw new Error(msg);
  }

  return data;
}
