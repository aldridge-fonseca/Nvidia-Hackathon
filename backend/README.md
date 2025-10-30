# Backend

FastAPI-based backend for CrisisVision. It orchestrates multiple micro-agents (weather, maps, news, social, resources) and uses NVIDIA NIM chat models to triage and respond to emergencies.

## Services

- orchestrator (port 8000): main API that gathers intelligence and calls LLMs
- weather (8001), maps (8002), news (8003), social (8004), resource (8005): mock intelligence services with /health and data endpoints

## Quick start

Prerequisites: Docker + Docker Compose, NVIDIA NIM API key.

1. Copy env and set key

```bash
cp .env.example .env
# Set NVIDIA_API_KEY=... in .env
```

1. Start stack

```powershell
# Windows
./start.ps1
```

```bash
# Linux / macOS
./start.sh
```

Orchestrator: <http://localhost:8000>

Docs: <http://localhost:8000/docs>

## Key endpoints

- GET /health
- POST /analyze

POST /analyze body (subset):

```json
{
  "scenario": "fire",
  "user_input": "I smell smoke in my house",
  "location": "San Mateo, CA"
}
```

## Environment

See `.env.example` for all options. Important:

- NVIDIA_API_KEY: required
- DECISION_MODEL: default nvidia/nemotron-mini-4b-instruct
- RESPONSE_MODEL: default nvidia/nemotron-4-340b-instruct

## More docs

- Implementation details: ./IMPLEMENTATION.md
- Frontend integration: ./FRONTEND_INTEGRATION.md
- Prompts: ./LLM_PROMPTS.md
- Testing guide: ./TESTING.md
