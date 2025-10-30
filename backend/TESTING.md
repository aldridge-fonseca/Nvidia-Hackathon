# CrisisVision Backend - Testing Guide

## Quick Test Commands

### 1. Test Individual MCP Servers

**Weather Service**
```bash
# Fire scenario
curl "http://localhost:8001/weather?location=Santa%20Clara&emergency_type=fire"

# Hurricane scenario
curl "http://localhost:8001/weather?location=Santa%20Clara&emergency_type=hurricane"

# Normal conditions
curl "http://localhost:8001/weather?location=Santa%20Clara&emergency_type=none"
```

**Maps Service**
```bash
curl "http://localhost:8002/location?location=Santa%20Clara%20University&emergency_type=fire"
```

**News Service**
```bash
curl "http://localhost:8003/news?location=Santa%20Clara&emergency_type=fire"
```

**Social Service**
```bash
curl "http://localhost:8004/social?location=Santa%20Clara&emergency_type=fire"
```

**Resource Service**
```bash
curl "http://localhost:8005/resources?location=Santa%20Clara&emergency_type=fire"
```

### 2. Test Orchestrator (Without LLM)

Test intelligence gathering without calling NVIDIA API:

```bash
curl -X POST http://localhost:8000/test \
  -H "Content-Type: application/json" \
  -d '{
    "scenario": "Fire alarm at library",
    "location": "Santa Clara University Library",
    "emergency_type": "fire"
  }'
```

### 3. Test Full System (With LLM)

**False Alarm Scenario**
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "scenario": "Fire alarm activated",
    "location": "Santa Clara University Library",
    "emergency_type": "none"
  }'
```

**Real Fire Emergency**
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "scenario": "Active fire reported",
    "location": "Santa Clara University Library",
    "emergency_type": "fire"
  }'
```

**Hurricane Emergency**
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "scenario": "Hurricane warning",
    "location": "Santa Clara University",
    "emergency_type": "hurricane"
  }'
```

**Flood Emergency**
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "scenario": "Flash flood warning",
    "location": "Santa Clara University",
    "emergency_type": "flood"
  }'
```

## PowerShell Commands (Windows)

For Windows users, here are the equivalent PowerShell commands:

**Test Weather MCP**
```powershell
Invoke-WebRequest -Uri "http://localhost:8001/weather?location=SantaClara&emergency_type=fire" | Select-Object -Expand Content
```

**Test Orchestrator (False Alarm)**
```powershell
$body = @{
    scenario = "Fire alarm activated"
    location = "Santa Clara University Library"
    emergency_type = "none"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/analyze" -Method Post -Body $body -ContentType "application/json"
```

**Test Orchestrator (Real Emergency)**
```powershell
$body = @{
    scenario = "Active fire reported"
    location = "Santa Clara University Library"
    emergency_type = "fire"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/analyze" -Method Post -Body $body -ContentType "application/json"
```

## Expected Response Formats

### False Alarm Response
```json
{
  "is_emergency": false,
  "assessment": "Analysis indicates this is likely a false alarm...",
  "confidence": 0.85,
  "reasoning": "Weather conditions are normal, no official reports...",
  "data_sources": [
    {
      "source": "Weather Monitor",
      "query": "Fire weather conditions...",
      "response": "Normal conditions, 72°F, humidity 55%..."
    }
  ],
  "suggested_actions": [
    "Verify with campus safety",
    "Continue normal activities"
  ],
  "emergency_procedures": "...",
  "metadata": {...}
}
```

### Emergency Response
```json
{
  "is_emergency": true,
  "severity": "high",
  "threat_type": "fire",
  "evacuation_steps": [
    {
      "step": 1,
      "title": "Exit Building Immediately",
      "description": "...",
      "situation": "...",
      "action": "...",
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
  },
  "emergency_contacts": [...],
  "emergency_procedures": "...",
  "metadata": {...}
}
```

## Troubleshooting

### Services Not Responding

Check service health:
```bash
curl http://localhost:8000/health
curl http://localhost:8001/health
curl http://localhost:8002/health
```

### NVIDIA API Errors

If you see "NVIDIA_API_KEY not configured":
1. Check your `.env` file has `NVIDIA_API_KEY=your_key_here`
2. Restart Docker containers: `docker-compose restart`
3. Verify the key is valid at https://build.nvidia.com/

### JSON Parse Errors

If LLM response fails to parse:
- Check NVIDIA API quota/limits
- Try the `/test` endpoint first to verify MCP data is correct
- Review orchestrator logs: `docker-compose logs orchestrator`

### Docker Issues

View logs:
```bash
docker-compose logs -f orchestrator
docker-compose logs -f weather
```

Restart everything:
```bash
docker-compose down
docker-compose up --build
```

## Integration with Frontend

Your Next.js frontend should call:
```javascript
const response = await fetch('http://localhost:8000/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    scenario: userInput,
    location: 'Santa Clara University Library',
    emergency_type: isEmergency ? 'fire' : 'none'
  })
});

const data = await response.json();
```

## Performance Notes

- MCP servers respond in < 100ms
- Orchestrator intelligence gathering: ~200ms (parallel queries)
- LLM inference: 2-5 seconds
- Total response time: 2-6 seconds

## Next Steps

1. Test all MCP servers individually
2. Test orchestrator without LLM (`/test` endpoint)
3. Test full system with LLM (`/analyze` endpoint)
4. Integrate with your Next.js frontend
5. Deploy to production environment
