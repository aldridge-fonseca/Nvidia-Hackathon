# Frontend Integration Guide

This guide explains how to connect your Next.js demo UI with the CrisisVision backend.

## Overview

The backend provides a single endpoint (`/analyze`) that returns different data structures based on whether it's a false alarm or real emergency. Your UI already expects this data format.

## Quick Integration

### 1. Update Frontend API Calls

Create a new API utility file in your Next.js project:

**File**: `demo-ui/lib/api.ts`

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface AnalysisRequest {
  scenario: string;
  location: string;
  emergency_type: 'fire' | 'hurricane' | 'flood' | 'none';
}

export interface FalseAlarmResponse {
  is_emergency: false;
  assessment: string;
  confidence: number;
  reasoning: string;
  data_sources: Array<{
    source: string;
    query: string;
    response: string;
  }>;
  suggested_actions: string[];
  emergency_procedures: string;
  metadata: any;
}

export interface EmergencyResponse {
  is_emergency: true;
  severity: string;
  threat_type: string;
  evacuation_steps: Array<{
    step: number;
    title: string;
    description: string;
    situation: string;
    action: string;
    coordinates: { lat: number; lng: number };
    distance: string;
    time: string;
    warning: string;
  }>;
  blocked_routes: string[];
  safe_shelter: {
    name: string;
    coordinates: { lat: number; lng: number };
    distance: string;
  };
  emergency_contacts: Array<{
    service: string;
    number: string;
  }>;
  emergency_procedures: string;
  metadata: any;
}

export type AnalysisResponse = FalseAlarmResponse | EmergencyResponse;

export async function analyzeEmergency(
  request: AnalysisRequest
): Promise<AnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}
```

### 2. Update False Alarm Page

**File**: `demo-ui/app/scenario/false-alarm/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { analyzeEmergency, FalseAlarmResponse } from '@/lib/api';

export default function FalseAlarmPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FalseAlarmResponse | null>(null);

  const handleQuickScenario = async (scenario: string, type: 'fire' | 'hurricane' | 'flood') => {
    setLoading(true);
    try {
      const response = await analyzeEmergency({
        scenario: `${scenario} reported at location`,
        location: 'Santa Clara University Library',
        emergency_type: 'none', // Testing as false alarm
      });

      if (!response.is_emergency) {
        setResult(response);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomInput = async (userInput: string) => {
    setLoading(true);
    try {
      const response = await analyzeEmergency({
        scenario: userInput,
        location: 'Santa Clara University Library',
        emergency_type: 'none',
      });

      if (!response.is_emergency) {
        setResult(response);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Quick scenario buttons */}
      <button onClick={() => handleQuickScenario('Wildfire', 'fire')}>
        🔥 Wildfire
      </button>

      {/* Display results */}
      {loading && <div>Analyzing...</div>}
      
      {result && (
        <div>
          <h2>Assessment</h2>
          <p>{result.assessment}</p>
          <p>Confidence: {(result.confidence * 100).toFixed(0)}%</p>

          <h3>Data Sources</h3>
          {result.data_sources.map((source, idx) => (
            <div key={idx}>
              <strong>{source.source}</strong>
              <p>{source.response}</p>
            </div>
          ))}

          <h3>Suggested Actions</h3>
          <ul>
            {result.suggested_actions.map((action, idx) => (
              <li key={idx}>{action}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### 3. Update Real Emergency Page

**File**: `demo-ui/app/scenario/real-emergency/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { analyzeEmergency, EmergencyResponse } from '@/lib/api';
import EmergencyMap from '@/app/components/EmergencyMap';

export default function RealEmergencyPage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<EmergencyResponse | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    loadEmergency();
  }, []);

  const loadEmergency = async () => {
    setLoading(true);
    try {
      const response = await analyzeEmergency({
        scenario: 'Active fire spreading rapidly',
        location: 'Santa Clara University Library',
        emergency_type: 'fire',
      });

      if (response.is_emergency) {
        setResult(response);
      }
    } catch (error) {
      console.error('Emergency analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Analyzing emergency situation...</div>;
  }

  if (!result) {
    return <div>Failed to load emergency data</div>;
  }

  const currentStepData = result.evacuation_steps[currentStep];

  return (
    <div>
      {/* Progress indicator */}
      <div>Step {currentStep + 1} of {result.evacuation_steps.length}</div>

      {/* Current step */}
      <div>
        <h1>{currentStepData.title}</h1>
        <p>{currentStepData.description}</p>
        <p><strong>Warning:</strong> {currentStepData.warning}</p>

        {/* Map */}
        <EmergencyMap
          lat={currentStepData.coordinates.lat}
          lng={currentStepData.coordinates.lng}
          zoom={17}
          markerTitle={currentStepData.title}
          routeCoords={result.evacuation_steps.map(s => s.coordinates)}
          dangerZone={{
            lat: 37.3490,
            lng: -121.9395,
            radius: 100
          }}
        />

        {/* Distance and time */}
        <p>Distance: {currentStepData.distance}</p>
        <p>Time: {currentStepData.time}</p>

        {/* Next step button */}
        {currentStep < result.evacuation_steps.length - 1 && (
          <button onClick={() => setCurrentStep(currentStep + 1)}>
            I've Completed This Step
          </button>
        )}
      </div>

      {/* Blocked routes */}
      {result.blocked_routes.length > 0 && (
        <div>
          <h3>⚠️ Blocked Routes</h3>
          <ul>
            {result.blocked_routes.map((route, idx) => (
              <li key={idx}>{route}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Emergency contacts */}
      <div>
        <h3>Emergency Contacts</h3>
        {result.emergency_contacts.map((contact, idx) => (
          <div key={idx}>
            <strong>{contact.service}:</strong> {contact.number}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 4. Environment Configuration

**File**: `demo-ui/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## Testing Integration

### 1. Start Backend
```bash
cd crisisvision-backend
docker-compose up
```

### 2. Start Frontend
```bash
cd demo-ui
npm run dev
```

### 3. Test Scenarios

**False Alarm:**
1. Go to http://localhost:3000/scenario/false-alarm
2. Click one of the quick scenario buttons
3. Should see: Assessment, confidence score, data sources, suggested actions

**Real Emergency:**
1. Go to http://localhost:3000/scenario/real-emergency
2. Should auto-load 5-step evacuation plan
3. Click through each step
4. Should see: Map updating, step details, warnings

## Error Handling

Add proper error handling:

```typescript
try {
  const response = await analyzeEmergency(request);
  // Handle success
} catch (error) {
  if (error instanceof Error) {
    console.error('API Error:', error.message);
    // Show user-friendly error message
  }
}
```

## Loading States

Show loading indicators:

```typescript
{loading && (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nvidia-green"></div>
    <span className="ml-4">Analyzing situation...</span>
  </div>
)}
```

## CORS Configuration

If you encounter CORS errors, update the orchestrator:

**File**: `orchestrator/main.py`

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your Next.js URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Production Deployment

### Backend
1. Deploy to cloud (AWS, GCP, Azure)
2. Set up domain: `api.crisisvision.com`
3. Enable HTTPS
4. Update CORS to allow your frontend domain

### Frontend
1. Update `.env.production`:
   ```env
   NEXT_PUBLIC_API_URL=https://api.crisisvision.com
   ```
2. Deploy to Vercel/Netlify
3. Test end-to-end

## Troubleshooting

### Backend not responding
```bash
# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f orchestrator
```

### API errors
```bash
# Test backend directly
curl http://localhost:8000/health

# Test with sample request
curl -X POST http://localhost:8000/test \
  -H "Content-Type: application/json" \
  -d '{"scenario": "Fire", "location": "Library", "emergency_type": "fire"}'
```

### TypeScript errors
Make sure the types match the API response format. Check the API documentation at http://localhost:8000/docs

## Performance Optimization

### Caching
```typescript
// Cache results to avoid duplicate API calls
const [cache, setCache] = useState<Map<string, AnalysisResponse>>(new Map());

const getCachedOrFetch = async (key: string, request: AnalysisRequest) => {
  if (cache.has(key)) {
    return cache.get(key)!;
  }
  
  const result = await analyzeEmergency(request);
  setCache(new Map(cache.set(key, result)));
  return result;
};
```

### Loading optimization
```typescript
// Show skeleton while loading
{loading && <SkeletonLoader />}
{result && <ActualContent data={result} />}
```

## Summary

Your integration checklist:
- Create `lib/api.ts` with types and API functions
- Update false-alarm page to call backend
- Update real-emergency page to call backend
- Add environment variable for API URL
- Handle loading and error states
- Test both scenarios end-to-end
- Deploy backend and update production URL

The backend is designed to work with your existing UI structure. The response formats match what your components expect.

