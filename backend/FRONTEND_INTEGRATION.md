# Frontend Integration

The Next.js UI calls the backend orchestrator for live analysis via the `/analyze` endpoint.

## Base URL

Set the API base via environment:

```bash
# demo-ui/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

If not set, the UI defaults to `http://localhost:8000`.

## Endpoint

POST `${BASE_URL}/analyze`

Headers:

- Content-Type: application/json

Body (example):

```json
{
  "scenario": "fire",
  "user_input": "I smell smoke in my dorm",
  "location": "San Jose, CA"
}
```

## Example (TypeScript)

```ts
const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function analyze(payload: {
  scenario: string;
  user_input: string;
  location?: string;
}) {
  const res = await fetch(`${apiBase}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Analyze failed: ${res.status}`);
  return res.json();
}
```

## CORS

The backend serves the UI on the same origin in containerized setups. For cross-origin usage, configure CORS accordingly in `orchestrator/main.py`.
