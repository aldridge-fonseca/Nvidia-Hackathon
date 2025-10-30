# Getting Started with CrisisVision

Complete setup guide for deploying the CrisisVision emergency response system.

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for demo UI)
- NVIDIA NIM API key ([Get one here](https://build.nvidia.com/))
- Git

## Quick Start (5 minutes)

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd nvidia-crisisvision
```

### 2. Backend Setup

```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env and add your NVIDIA API key
# NVIDIA_API_KEY=your_key_here

# Start all services
./start.ps1  # Windows
# or
./start.sh   # Linux/Mac
```

Backend will be running at http://localhost:8000

### 3. Frontend Setup

```bash
cd demo-ui

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be running at http://localhost:3000

### 4. Test the System

Open http://localhost:3000 in your browser and try:

1. **False Alarm Scenario** - Test AI's ability to determine non-emergencies
2. **Real Emergency Scenario** - See evacuation coordination in action

## Full Installation Guide

### Backend Services

The backend consists of 6 microservices orchestrated with Docker Compose:

1. **Orchestrator** (Port 8000) - Main API and LLM coordination
2. **Weather Agent** (Port 8001) - Weather intelligence
3. **Maps Agent** (Port 8002) - Navigation and routing
4. **News Agent** (Port 8003) - Official reports
5. **Social Agent** (Port 8004) - Social media analysis
6. **Resource Agent** (Port 8005) - Emergency resources

#### Starting Backend

```bash
cd backend
docker-compose up --build
```

This will:
- Build Docker images for all services
- Start all 6 containers
- Expose APIs on localhost ports 8000-8005

#### Verifying Backend

```bash
# Check orchestrator health
curl http://localhost:8000/health

# Check individual agents
curl http://localhost:8001/health  # Weather
curl http://localhost:8002/health  # Maps
curl http://localhost:8003/health  # News
curl http://localhost:8004/health  # Social
curl http://localhost:8005/health  # Resources
```

All should return `{"status": "healthy"}`

### Frontend Application

The frontend is a Next.js 14 application with TypeScript.

#### Development Mode

```bash
cd demo-ui
npm install
npm run dev
```

Visit http://localhost:3000

#### Production Build

```bash
cd demo-ui
npm install
npm run build
npm start
```

#### Docker Deployment

```bash
cd demo-ui
docker build -t crisisvision-ui .
docker run -p 3000:3000 crisisvision-ui
```

## Configuration

### Environment Variables

#### Backend (.env)

```bash
# Required
NVIDIA_API_KEY=your_nvidia_api_key_here

# Optional (has defaults)
NVIDIA_API_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=meta/llama-3.1-8b-instruct
LOG_LEVEL=INFO
```

#### Frontend (.env.local)

```bash
# Optional - only needed to connect to backend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Testing

### Backend API Tests

```bash
# Test false alarm analysis
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "scenario": "fire",
    "user_input": "I smell smoke from my neighbor",
    "location": "San Francisco, CA"
  }'

# Test emergency evacuation
curl -X POST http://localhost:8000/evacuate \
  -H "Content-Type: application/json" \
  -d '{
    "emergency_type": "fire",
    "location": "San Francisco, CA",
    "user_input": "Wildfire approaching neighborhood"
  }'
```

### Individual Agent Tests

```bash
# Test with different emergency types: fire, hurricane, flood, none
curl "http://localhost:8001/weather?emergency_type=fire"
curl "http://localhost:8002/maps?emergency_type=fire"
curl "http://localhost:8003/news?emergency_type=fire"
curl "http://localhost:8004/social?emergency_type=fire"
curl "http://localhost:8005/resources?emergency_type=fire"
```

### Frontend Tests

1. Open http://localhost:3000
2. Click "False Alarm Scenario"
3. Watch agents execute
4. Verify CALM response
5. Go back and try "Real Emergency Scenario"
6. Verify URGENT response with evacuation plan

## Troubleshooting

### Backend Issues

**Problem**: Services won't start

```bash
# Check Docker is running
docker --version
docker-compose --version

# View logs
cd backend
docker-compose logs -f

# Restart specific service
docker-compose restart orchestrator
```

**Problem**: NVIDIA API errors

- Verify API key in `.env` is correct
- Check API key has not expired
- Ensure you have API quota remaining
- Visit https://build.nvidia.com/ to check key status

**Problem**: Port already in use

```bash
# Find process using port
netstat -ano | findstr :8000  # Windows
lsof -i :8000                 # Linux/Mac

# Kill process or change port in docker-compose.yml
```

### Frontend Issues

**Problem**: npm install fails

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and try again
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Port 3000 already in use

```bash
# Kill process using port 3000
# Or run on different port
npm run dev -- -p 3001
```

**Problem**: API connection errors

- Verify backend is running at http://localhost:8000
- Check `.env.local` has correct API URL
- Try accessing API directly in browser

## Architecture Overview

```
User Browser
     │
     ▼
┌─────────────────────┐
│   Next.js UI        │
│   (Port 3000)       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Orchestrator       │
│  (Port 8000)        │
│  + NVIDIA NIM LLM   │
└──────────┬──────────┘
           │
     ┌─────┴─────┬─────────┬─────────┬─────────┐
     ▼           ▼         ▼         ▼         ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│Weather  │ │ Maps    │ │ News    │ │ Social  │ │Resource │
│(8001)   │ │ (8002)  │ │ (8003)  │ │ (8004)  │ │ (8005)  │
└─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

## Next Steps

1. **Customize Agents**: Edit `backend/mcp_servers/*/server.py` to modify mock data
2. **Adjust LLM Prompts**: Edit `backend/orchestrator/prompts.py` for different behavior
3. **Add Emergency Types**: Extend system with new emergency scenarios
4. **Deploy to Production**: See `backend/README.md` for deployment guides
5. **Integrate Real APIs**: Replace mock data with real weather, maps, news APIs

## Documentation

- **README.md** - Project overview
- **backend/README.md** - Backend API documentation
- **backend/IMPLEMENTATION.md** - Technical deep-dive
- **backend/TESTING.md** - Comprehensive testing guide
- **backend/FRONTEND_INTEGRATION.md** - UI integration guide
- **demo-ui/README.md** - Frontend documentation

## Support

For issues:
1. Check documentation in `backend/` folder
2. Review `backend/TESTING.md` for troubleshooting
3. Verify environment configuration
4. Check Docker logs: `docker-compose logs -f`

---

**Status**: Ready for deployment
**Version**: 1.0.0
