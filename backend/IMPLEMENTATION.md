# Implementation Details

This backend coordinates multiple micro-agents and a two-stage LLM flow to determine if a situation is a real emergency and, if so, generate a detailed response.

## Components

- Orchestrator (FastAPI): `orchestrator/main.py`
- Prompt builders: `orchestrator/prompts.py`
- Procedures knowledge base: `orchestrator/knowledge.py`
- Agents (FastAPI): `mcp_servers/{weather,maps,news,social,resource}/server.py`

## Flow

1. Gather intelligence from agents in parallel
2. Decision stage: small instruct chat model classifies emergency vs false alarm
3. Response stage: large instruct model generates calm or urgent guidance

## Default models

- DECISION_MODEL: `nvidia/nemotron-mini-4b-instruct`
- RESPONSE_MODEL: `nvidia/nemotron-4-340b-instruct`

Override via environment variables in `.env`.

## API contract (summary)

POST /analyze

```json
{
  "scenario": "fire | hurricane | flood | none",
  "user_input": "string",
  "location": "string"
}
```

Response (shape varies by classification):

```json
{
  "is_real_emergency": true,
  "confidence": 0.85,
  "summary": "string",
  "steps": ["..."],
  "routes": [
    {"from": "string", "to": "string", "eta_min": 7}
  ],
  "resources": [
    {"name": "shelter a", "address": "...", "phone": "..."}
  ]
}
```

## Error handling

- Timeouts when an agent is unavailable -> continue with partial intelligence
- LLM parse errors -> retry with stricter instructions, return 502 if persistent
- Input validation via Pydantic models

## Configuration

See `.env.example` for available options:

- Ports (per service)
- Log levels
- LLM parameters (temperature, top_p, max_tokens)

## Running locally

Use `start.ps1` (Windows) or `start.sh` (Linux/macOS). Health checks hit `/health` on each service. All images include `curl` for compose healthchecks.
