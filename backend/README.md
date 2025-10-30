# CrisisVision Backend

Multi-agent emergency response system with real-time threat analysis and intelligent decision support.

## Overview

Multi-agent orchestration architecture for emergency situation analysis. Aggregates data from weather, geographic, news, social media, and resource sources to provide actionable intelligence and evacuation guidance.

## Architecture

```
┌─────────────────┐
│   Frontend UI   │
└────────┬────────┘
         │
┌────────▼────────────┐
│   Orchestrator      │  (Coordinates all agents)
└────────┬────────────┘
         │
    ┌────┴────┐
    │  Agents │
    └────┬────┘
         │
┌────────┴──────────────────────────────┐
│                                        │
│  ┌──────────┐  ┌──────────┐          │
│  │ Weather  │  │   Maps   │          │
│  └──────────┘  └──────────┘          │
│                                        │
│  ┌──────────┐  ┌──────────┐          │
│  │   News   │  │  Social  │          │
│  └──────────┘  └──────────┘          │
│                                        │
│  ┌──────────┐                         │
│  │ Resource │                         │
│  └──────────┘                         │
└────────────────────────────────────────┘
```

## Features

- Multi-source intelligence aggregation
- Emergency classification and severity assessment
- Step-by-step evacuation routing with GPS coordinates
- Containerized microservices architecture
- RESTful API with automatic documentation

## Tech Stack

- Python 3.11 with FastAPI
- Docker and Docker Compose
- MCP (Model Context Protocol) for agent communication
- NVIDIA NIM for LLM inference
- TypeScript with Next.js (frontend)

## Quick Start

### Prerequisites

- Docker and Docker Compose
- NVIDIA API key for LLM access

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crisisvision-backend
```

2. Configure environment:
```bash
cp .env.example .env
# Add your NVIDIA_API_KEY to .env
```

3. Start services:
```bash
docker-compose up --build
```

4. Access the API at `http://localhost:8000/docs`

### Running Without Docker

Each service can run independently:

```bash
# Orchestrator
cd orchestrator
pip install -r requirements.txt
python main.py

# Individual MCP Servers
cd mcp_servers/weather
pip install -r requirements.txt
python server.py
```

## API Endpoints

### Orchestrator

**POST** `/analyze`
```json
{
  "scenario": "fire",
  "location": "Santa Clara University Library",
  "emergency_type": "fire"
}
```

Response for **false alarm**:
```json
{
  "is_emergency": false,
  "assessment": "Analysis indicates this is likely a false alarm...",
  "confidence": 0.85,
  "data_sources": [...],
  "suggested_actions": [...]
}
```

Response for **real emergency**:
```json
{
  "is_emergency": true,
  "severity": "high",
  "evacuation_steps": [
    {
      "step": 1,
      "title": "Exit Building Immediately",
      "description": "...",
      "coordinates": {"lat": 37.3496, "lng": -121.9390},
      "distance": "20 meters",
      "time": "< 1 min",
      "warning": "..."
    }
  ],
  "blocked_routes": [...],
  "emergency_contacts": [...]
}
```

## MCP Server Protocols

Each MCP server accepts an `emergency_type` parameter:

- `"fire"` - Fire-related emergency
- `"hurricane"` - Hurricane/storm emergency
- `"flood"` - Flood emergency
- `"none"` - Non-emergency situation

Example:
```python
# Weather MCP Server
response = weather_server.get_conditions(
    location="Santa Clara, CA",
    emergency_type="fire"
)
```

## Configuration

Configuration is managed through environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `NVIDIA_API_KEY` | NVIDIA NIM API key | Yes |
| `ORCHESTRATOR_PORT` | Orchestrator service port | No (default: 8000) |
| `LOG_LEVEL` | Logging verbosity | No (default: INFO) |

## Development

### Project Structure

```
crisisvision-backend/
├── orchestrator/           # Main orchestration service
│   ├── main.py
│   ├── prompts.py         # LLM prompt templates
│   ├── knowledge.py       # Emergency procedures
│   ├── requirements.txt
│   └── Dockerfile
├── mcp_servers/           # Microservices
│   ├── weather/
│   ├── maps/
│   ├── news/
│   ├── social/
│   └── resource/
├── docker-compose.yml
├── .env.example
└── README.md
```

### Adding a New MCP Server

1. Create server directory in `mcp_servers/`
2. Implement `server.py` with `emergency_type` parameter
3. Add Dockerfile and requirements.txt
4. Update docker-compose.yml
5. Register with orchestrator

## Testing

```bash
# Test individual MCP server
curl http://localhost:8001/weather?location=SantaClara&emergency_type=fire

# Test orchestrator
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"scenario": "fire", "location": "Library", "emergency_type": "fire"}'
```

## License

MIT License - See LICENSE file for details

## Contributing

This is a demonstration project for educational purposes.
