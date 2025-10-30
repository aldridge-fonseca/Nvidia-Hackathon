# Implementation Guide

This document provides a detailed technical explanation of the CrisisVision Backend architecture, implementation decisions, and system design.

**Last Updated**: October 29, 2025

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Decisions](#architecture-decisions)
3. [Orchestrator Implementation](#orchestrator-implementation)
4. [MCP Server Design](#mcp-server-design)
5. [Data Flow](#data-flow)
6. [LLM Integration](#llm-integration)
7. [Emergency Classification](#emergency-classification)
8. [Deployment Strategy](#deployment-strategy)

---

## System Overview

CrisisVision Backend is a multi-agent AI system designed to analyze emergency situations and provide intelligent guidance. The system processes data from multiple sources (weather, maps, news, social media, resources) and uses an LLM-powered orchestrator to make decisions.

### Core Components

1. **Orchestrator** - Central coordinator using NVIDIA LLM
2. **MCP Servers** - Five specialized microservices
3. **Knowledge Base** - Emergency procedures and protocols
4. **API Layer** - RESTful endpoints for frontend integration

---

## Architecture Decisions

### Why Microservices?

Each MCP server is independent, allowing:
- Individual scaling based on load
- Easy maintenance and updates
- Fault isolation
- Technology flexibility per service

### Why FastAPI?

- High performance (async support)
- Automatic API documentation (Swagger/OpenAPI)
- Type hints and validation with Pydantic
- Modern Python features

### Why Docker?

- Consistent development and production environments
- Easy deployment and scaling
- Service isolation
- Simplified dependency management

---

## Orchestrator Implementation

### Responsibilities

The orchestrator is the brain of the system:
1. Receives analysis requests from frontend
2. Queries all relevant MCP servers in parallel
3. Aggregates responses from all agents
4. Sends structured data to LLM with detailed prompts
5. Parses LLM response into UI-compatible format
6. Returns final assessment or evacuation plan

### Key Components

**main.py** - Core service implementation
- FastAPI application setup
- Request/response models
- Endpoint handlers
- Error handling

**prompts.py** - LLM prompt engineering
- System prompts for different scenarios
- Structured output instructions
- Emergency classification logic
- Step-by-step guidance generation

**knowledge.py** - Emergency procedures
- Fire safety protocols
- Hurricane preparation steps
- Flood evacuation guidelines
- Medical emergency procedures

### Request Flow

```
Frontend Request
    ↓
Orchestrator receives POST /analyze
    ↓
Parse request (scenario, location, emergency_type)
    ↓
Query all MCP servers in parallel
    ↓
Aggregate responses
    ↓
Build LLM prompt with context
    ↓
Call NVIDIA NIM API
    ↓
Parse LLM response
    ↓
Format for UI
    ↓
Return JSON response
```

### LLM Prompt Structure

For **false alarm detection**:
```
System: You are an emergency analysis AI...

Context:
- Weather: [data from weather MCP]
- Maps: [data from maps MCP]
- News: [data from news MCP]
- Social: [data from social MCP]
- Resources: [data from resource MCP]

Task: Analyze if this is a false alarm...

Output Format:
{
  "is_emergency": false,
  "assessment": "...",
  "confidence": 0.85,
  ...
}
```

For **real emergency**:
```
System: You are an evacuation coordinator...

Context: [same MCP data]

Task: Generate step-by-step evacuation plan...

Output Format:
{
  "is_emergency": true,
  "evacuation_steps": [
    {
      "step": 1,
      "title": "...",
      "coordinates": {...},
      ...
    }
  ]
}
```

---

## MCP Server Design

### Common Pattern

All MCP servers follow the same structure:

```python
from fastapi import FastAPI, Query
from typing import Literal

app = FastAPI()

EmergencyType = Literal["fire", "hurricane", "flood", "none"]

@app.get("/data")
def get_data(
    location: str,
    emergency_type: EmergencyType = "none"
):
    return generate_mock_data(location, emergency_type)

def generate_mock_data(location, emergency_type):
    # Return different data based on emergency_type
    if emergency_type == "fire":
        return fire_specific_data()
    elif emergency_type == "hurricane":
        return hurricane_specific_data()
    # ...
```

### Individual Server Implementations

#### 1. Weather MCP Server
**Port**: 8001

Returns meteorological data:
- Temperature, humidity, wind conditions
- Fire weather index (for fire emergencies)
- Hurricane warnings (for hurricane emergencies)
- Flood risk levels (for flood emergencies)

#### 2. Maps MCP Server
**Port**: 8002

Returns navigation data:
- Current location coordinates
- Nearby landmarks
- Road conditions
- Evacuation routes
- Blocked roads (in emergencies)

#### 3. News MCP Server
**Port**: 8003

Returns incident reports:
- Recent emergency reports
- Official statements
- Incident timeline
- Affected areas

#### 4. Social MCP Server
**Port**: 8004

Returns social media analysis:
- Recent posts about the incident
- Public sentiment
- Eyewitness reports
- Community updates

#### 5. Resource MCP Server
**Port**: 8005

Returns emergency resources:
- Available shelters
- Hospital locations
- Emergency services (fire, police, medical)
- Resource availability

---

## Data Flow

### Non-Emergency Scenario (False Alarm)

```
1. User inputs: "Fire alarm at library"
2. UI sends: POST /analyze {scenario: "fire", emergency_type: "none"}
3. Orchestrator queries all 5 MCP servers
4. MCP servers return calm/normal data
5. LLM analyzes: "Low risk, likely false alarm"
6. Orchestrator formats response for green UI
7. UI displays: Assessment + suggested actions
```

### Emergency Scenario (Real Fire)

```
1. User inputs: "Active fire at library"
2. UI sends: POST /analyze {scenario: "fire", emergency_type: "fire"}
3. Orchestrator queries all 5 MCP servers
4. MCP servers return emergency data:
   - Weather: High fire danger, strong winds
   - Maps: Fire location, safe routes
   - News: Active incident confirmed
   - Social: Multiple reports of smoke
   - Resource: Nearby shelters, emergency services
5. LLM generates: 5-step evacuation plan with GPS coordinates
6. Orchestrator formats response for red UI
7. UI displays: Step-by-step evacuation with map
```

---

## LLM Integration

### NVIDIA NIM Setup

```python
import os
import requests

API_KEY = os.getenv("NVIDIA_API_KEY")
API_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

def call_llm(prompt: str) -> str:
    response = requests.post(
        API_URL,
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "nvidia/nemotron-4-340b-instruct",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.2,
            "max_tokens": 2000
        }
    )
    return response.json()["choices"][0]["message"]["content"]
```

### Why These Settings?

- **temperature: 0.2** - Low randomness for consistent, reliable responses
- **max_tokens: 2000** - Enough for detailed evacuation plans
- **model: nemotron-4-340b** - Large model for complex reasoning

---

## Emergency Classification

### Decision Logic

The system classifies emergencies based on:

1. **Data Source Consensus**
   - All sources report normal conditions → False alarm
   - Multiple sources confirm emergency → Real emergency

2. **Severity Indicators**
   - Weather conditions (fire index, wind speed)
   - Official reports (news, emergency services)
   - Public reports (social media volume/sentiment)
   - Resource mobilization (emergency services active)

3. **Confidence Scoring**
   - High confidence (>0.8): Strong evidence in all sources
   - Medium confidence (0.5-0.8): Mixed signals
   - Low confidence (<0.5): Insufficient data

### Output Formats

**False Alarm Response**:
```json
{
  "is_emergency": false,
  "assessment": "Based on analysis of weather, news, and social media...",
  "confidence": 0.85,
  "data_sources": [
    {"source": "Weather", "query": "...", "response": "..."},
    ...
  ],
  "suggested_actions": [
    "Verify with campus safety",
    "Continue normal activities",
    ...
  ]
}
```

**Emergency Response**:
```json
{
  "is_emergency": true,
  "severity": "high",
  "threat_type": "fire",
  "evacuation_steps": [
    {
      "step": 1,
      "title": "Exit Building Immediately",
      "description": "Leave via nearest exit...",
      "coordinates": {"lat": 37.3496, "lng": -121.9390},
      "distance": "20 meters",
      "time": "< 1 min",
      "warning": "Do not use elevators"
    }
  ],
  "blocked_routes": ["El Camino Real"],
  "safe_shelter": {
    "name": "Athletic Field Emergency Shelter",
    "coordinates": {"lat": 37.3535, "lng": -121.9345},
    "distance": "1000 meters"
  }
}
```

---

## Deployment Strategy

### Docker Compose Architecture

```yaml
services:
  orchestrator:
    build: ./orchestrator
    ports: ["8000:8000"]
    environment:
      - NVIDIA_API_KEY=${NVIDIA_API_KEY}
    depends_on:
      - weather
      - maps
      - news
      - social
      - resource

  weather:
    build: ./mcp_servers/weather
    ports: ["8001:8001"]

  # ... other services
```

### Scaling Considerations

For production deployment:
- Use orchestration platform (Kubernetes, Docker Swarm)
- Add load balancer for orchestrator
- Implement caching (Redis) for MCP responses
- Add monitoring (Prometheus + Grafana)
- Implement rate limiting
- Add authentication/authorization

### Environment Variables

```env
# Required
NVIDIA_API_KEY=your_api_key_here

# Optional (with defaults)
ORCHESTRATOR_PORT=8000
WEATHER_PORT=8001
MAPS_PORT=8002
NEWS_PORT=8003
SOCIAL_PORT=8004
RESOURCE_PORT=8005
LOG_LEVEL=INFO
```

---

## Performance Considerations

### Parallel Execution

MCP servers are queried in parallel using `asyncio`:

```python
import asyncio
import aiohttp

async def query_all_mcps(location, emergency_type):
    tasks = [
        query_weather(location, emergency_type),
        query_maps(location, emergency_type),
        query_news(location, emergency_type),
        query_social(location, emergency_type),
        query_resource(location, emergency_type),
    ]
    results = await asyncio.gather(*tasks)
    return results
```

This reduces total query time from 5× individual time to ~1× (fastest response).

### Caching Strategy

For production:
- Cache MCP responses for 30-60 seconds
- Cache LLM responses for identical requests
- Invalidate cache on new emergency reports

---

## Testing Strategy

### Unit Tests
- Test each MCP server independently
- Test orchestrator prompt generation
- Test response parsing

### Integration Tests
- Test orchestrator → MCP communication
- Test end-to-end flow with mock LLM

### Manual Testing
```bash
# Test weather MCP
curl "http://localhost:8001/weather?location=SantaClara&emergency_type=fire"

# Test orchestrator
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"scenario": "fire", "location": "Library", "emergency_type": "fire"}'
```

---

## Future Enhancements

1. **Real API Integration**
   - Replace mock data with real weather APIs
   - Integrate Google Maps API
   - Connect to news aggregators
   - Add Twitter/social media APIs

2. **Machine Learning**
   - Train custom models for emergency classification
   - Historical incident analysis
   - Predictive risk assessment

3. **Advanced Features**
   - Multi-language support
   - Voice interface
   - Mobile push notifications
   - Real-time updates via WebSocket

4. **Infrastructure**
   - Kubernetes deployment
   - CI/CD pipeline
   - Automated testing
   - Monitoring and alerting

---

## Conclusion

This implementation provides a foundation for an emergency response system with multi-agent coordination. The architecture is scalable, maintainable, and ready for deployment with minimal modifications.

**Status**: Complete and functional
**Ready for**: GitHub public repository, portfolio demonstration, further development

