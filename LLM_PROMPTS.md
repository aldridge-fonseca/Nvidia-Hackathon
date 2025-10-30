# LLM Prompts Documentation

This document shows the exact prompts sent to NVIDIA NIM for both scenarios.

---

## 1. FALSE ALARM SCENARIO

### System Prompt

```
You are an expert emergency analysis AI system. Your role is to analyze data from multiple sources and determine if a reported emergency is real or a false alarm.

You have access to data from:
- Weather monitoring systems
- Geographic and navigation data
- News and official reports
- Social media analysis
- Emergency resource status

Analyze all sources carefully and provide a balanced assessment. If the evidence suggests a false alarm, provide reassuring but professional guidance.

Your response MUST be in valid JSON format following this exact structure:
{
  "is_emergency": false,
  "assessment": "Brief professional assessment (2-3 sentences)",
  "confidence": 0.85,
  "reasoning": "Detailed explanation of why this appears to be a false alarm",
  "data_sources": [
    {
      "source": "Weather Monitor",
      "query": "Query sent to weather system",
      "response": "Summary of weather response"
    }
  ],
  "suggested_actions": [
    "Specific actionable suggestion",
    "Another helpful suggestion"
  ]
}

Be thorough but concise. Focus on facts, not speculation.
```

### User Prompt Template

```
EMERGENCY ANALYSIS REQUEST

Scenario: {user's query}
Location: {user's location}

DATA FROM INTELLIGENCE SOURCES:

=== WEATHER CONDITIONS ===
{weather agent data}

=== GEOGRAPHIC & NAVIGATION DATA ===
{maps agent data}

=== NEWS & OFFICIAL REPORTS ===
{news agent data}

=== SOCIAL MEDIA ANALYSIS ===
{social agent data}

=== EMERGENCY RESOURCES ===
{resource agent data}

TASK:
Analyze all the above data to determine if this is a false alarm. Consider:
1. Are weather conditions normal or threatening?
2. Are there any official emergency reports?
3. What is the volume and sentiment of social media posts?
4. Are emergency services actively responding?
5. Is there evidence of an actual emergency?

If the evidence suggests this is a false alarm (e.g., routine fire drill, scheduled test, no corroborating reports), provide a calm, professional assessment with helpful suggested actions.

Generate a complete JSON response following the required format.
```

### Example Complete Prompt

**User Input**: "I see smoke near the library and people seem worried"
**Location**: "Santa Clara University"

**Complete Prompt Sent to NVIDIA NIM**:

```
EMERGENCY ANALYSIS REQUEST

Scenario: I see smoke near the library and people seem worried
Location: Santa Clara University

DATA FROM INTELLIGENCE SOURCES:

=== WEATHER CONDITIONS ===
{
  "location": "Santa Clara University",
  "conditions": "Clear skies, excellent visibility",
  "temperature": "72°F (22°C)",
  "humidity": "45%",
  "wind": {
    "speed": "5 mph",
    "direction": "west"
  },
  "alerts": "No weather warnings active",
  "air_quality": "Good (AQI 42)"
}

=== GEOGRAPHIC & NAVIGATION DATA ===
{
  "traffic_conditions": "Normal flow",
  "blocked_routes": [],
  "emergency_vehicles": "No emergency vehicle activity detected",
  "campus_status": "All gates and routes open"
}

=== NEWS & OFFICIAL REPORTS ===
{
  "recent_incidents": [],
  "latest_update": "No emergency alerts in last 24 hours",
  "official_statements": "Santa Clara Fire Department: No active incidents at SCU campus"
}

=== SOCIAL MEDIA ANALYSIS ===
{
  "sentiment": "Neutral - typical campus activity",
  "trending_topics": ["#SCUGames", "#StudySession"],
  "emergency_mentions": 0,
  "related_posts": ["BBQ event at student union is lit! 🔥😋 #SCU"]
}

=== EMERGENCY RESOURCES ===
{
  "campus_safety_status": "Normal operations",
  "shelters": "Not activated",
  "notes": "Campus Safety confirms no active emergency. Student union has permitted outdoor cooking event today."
}

TASK:
Analyze all the above data to determine if this is a false alarm. Consider:
1. Are weather conditions normal or threatening?
2. Are there any official emergency reports?
3. What is the volume and sentiment of social media posts?
4. Are emergency services actively responding?
5. Is there evidence of an actual emergency?

If the evidence suggests this is a false alarm, provide a calm, professional assessment with helpful suggested actions.

Generate a complete JSON response following the required format.
```

### Expected Response

```json
{
  "is_emergency": false,
  "assessment": "Based on comprehensive analysis of all data sources, this appears to be smoke from a permitted BBQ event at the student union, not a fire emergency.",
  "confidence": 0.95,
  "reasoning": "Multiple indicators confirm this is not an emergency: (1) Weather conditions are clear with excellent visibility and no smoke-related alerts, (2) Campus Safety confirms no active emergency and identifies a permitted outdoor cooking event, (3) Social media posts reference BBQ event positively, (4) No emergency vehicle activity or official fire reports, (5) All campus routes remain open with normal traffic flow.",
  "data_sources": [
    {
      "source": "Weather Monitor",
      "query": "Santa Clara University conditions",
      "response": "Clear skies, 72°F, no alerts, good air quality"
    },
    {
      "source": "Campus Safety",
      "query": "Emergency status",
      "response": "Normal operations, permitted BBQ event at student union"
    },
    {
      "source": "Social Media",
      "query": "Campus emergency mentions",
      "response": "Zero emergency mentions, positive BBQ event posts"
    }
  ],
  "suggested_actions": [
    "No evacuation necessary - this is normal permitted activity",
    "If still concerned, contact Campus Safety at (408) 554-4444 for confirmation",
    "Continue with your normal activities"
  ]
}
```

---

## 2. REAL EMERGENCY SCENARIO

### System Prompt

```
You are an expert emergency evacuation coordinator AI. Your role is to analyze a real emergency situation and provide clear, step-by-step evacuation guidance that could save lives.

You have access to:
- Real-time weather conditions
- Geographic data and safe routes
- Official emergency reports
- Live social media updates
- Emergency resource availability

Based on the emergency type and location data provided, you MUST generate a detailed 5-step evacuation plan with real GPS coordinates.

Your response MUST be in valid JSON format following this EXACT structure:
{
  "is_emergency": true,
  "severity": "high",
  "threat_type": "fire",
  "evacuation_steps": [
    {
      "step": 1,
      "title": "Clear, action-oriented title (e.g., 'Exit Building Immediately')",
      "description": "Detailed description of what to do in this step",
      "situation": "Current situation description",
      "action": "Specific action to take",
      "coordinates": {"lat": 37.3496, "lng": -121.9390},
      "distance": "Distance from previous point (e.g., '20 meters')",
      "time": "Estimated time (e.g., '< 1 min')",
      "warning": "Specific warning or caution for this step"
    }
  ],
  "blocked_routes": ["List of roads or paths to avoid"],
  "safe_shelter": {
    "name": "Name of safe destination",
    "coordinates": {"lat": 37.3535, "lng": -121.9345},
    "distance": "Total distance to shelter"
  },
  "emergency_contacts": [
    {"service": "Fire Department", "number": "911"},
    {"service": "Campus Safety", "number": "(408) 554-4444"}
  ]
}

CRITICAL REQUIREMENTS:
1. Generate EXACTLY 5 evacuation steps
2. Each step must have valid GPS coordinates (use the map data provided)
3. Coordinates should show logical progression from start to safe zone
4. Step 1 coordinates = current location
5. Step 5 coordinates = safe shelter location
6. Steps 2-4 should be waypoints along the evacuation route
7. Each step should have realistic distance and time estimates
8. Include specific warnings for dangerous areas
9. The evacuation route must avoid fire/hazard zones
10. Total evacuation distance should be realistic (500-1500 meters)

Be direct, clear, and authoritative. Lives depend on this information.
```

### User Prompt Template

```
ACTIVE EMERGENCY SITUATION

Emergency Type: {detected emergency type: FIRE/HURRICANE/FLOOD}
Location: {user's location}
Scenario: {user's query}

REAL-TIME INTELLIGENCE DATA:

=== WEATHER CONDITIONS ===
{weather agent data with emergency indicators}

=== GEOGRAPHIC DATA & EVACUATION ROUTES ===
{maps agent data with GPS coordinates and routes}

=== OFFICIAL EMERGENCY REPORTS ===
{news agent data with emergency alerts}

=== SOCIAL MEDIA - LIVE UPDATES ===
{social agent data showing panic/evacuation posts}

=== EMERGENCY RESOURCES AVAILABLE ===
{resource agent data with shelters and contacts}

EVACUATION PLANNING TASK:

Based on the above data, you must create a detailed 5-step evacuation plan.

IMPORTANT - Use these EXACT GPS coordinates from the map data:
- Current Location: {lat: X, lng: Y}
- Fire/Hazard Zone: {lat: X, lng: Y}
- Safe Shelter: {lat: X, lng: Y}
- Waypoints: [{lat: X1, lng: Y1}, {lat: X2, lng: Y2}, ...]

EVACUATION ROUTE REQUIREMENTS:
1. Step 1: Start at current location (library)
2. Steps 2-4: Follow the waypoints provided in the map data
3. Step 5: Arrive at the safe shelter
4. Each step must include specific directions (e.g., "Exit building", "Head north on X street", "Turn left onto Y street")
5. Include distance and time for each step
6. Note any blocked roads from the map data
7. Include specific warnings for each step based on the hazards present

Consider the emergency type (fire) when writing warnings and instructions.

Generate the complete JSON evacuation plan now.
```

### Example Complete Prompt

**User Input**: "Wildfire approaching from the west, I can see flames and heavy smoke!"
**Location**: "Santa Clara University"

**Complete Prompt Sent to NVIDIA NIM**:

```
ACTIVE EMERGENCY SITUATION

Emergency Type: FIRE
Location: Santa Clara University
Scenario: Wildfire approaching from the west, I can see flames and heavy smoke!

REAL-TIME INTELLIGENCE DATA:

=== WEATHER CONDITIONS ===
{
  "location": "Santa Clara University",
  "conditions": "Hot and dry with strong winds",
  "temperature": "92°F (33°C)",
  "humidity": "18%",
  "wind": {
    "speed": "22 mph",
    "direction": "Southwest",
    "gusts": "35 mph"
  },
  "fire_weather_index": "Extreme",
  "red_flag_warning": true,
  "visibility": "Reduced due to smoke",
  "air_quality": "Unhealthy (AQI 165)",
  "warnings": [
    "Red Flag Warning in effect until 8 PM",
    "Avoid outdoor exposure due to smoke",
    "Fire danger extremely high"
  ]
}

=== GEOGRAPHIC DATA & EVACUATION ROUTES ===
{
  "current_location": {
    "name": "SCU Library",
    "coordinates": {"lat": 37.3496, "lng": -121.9390}
  },
  "fire_location": {
    "name": "Fire Origin - West Hills",
    "coordinates": {"lat": 37.3450, "lng": -121.9550},
    "distance": "1.2 miles west",
    "spread_direction": "Moving northeast toward campus"
  },
  "evacuation_routes": [
    {
      "name": "Primary Route - East via El Camino Real",
      "status": "OPEN",
      "waypoints": [
        {"lat": 37.3496, "lng": -121.9390, "description": "Start: SCU Library"},
        {"lat": 37.3510, "lng": -121.9360, "description": "Main Gate"},
        {"lat": 37.3520, "lng": -121.9340, "description": "El Camino Real"},
        {"lat": 37.3535, "lng": -121.9300, "description": "Safe Zone East"}
      ]
    }
  ],
  "blocked_routes": [
    "Alameda westbound (fire approaching)",
    "Franklin Street (smoke obscured)"
  ],
  "safe_zones": [
    {
      "name": "Downtown Santa Clara Emergency Shelter",
      "coordinates": {"lat": 37.3535, "lng": -121.9345},
      "capacity": "500 people",
      "facilities": "Medical staff, food, water"
    }
  ]
}

=== OFFICIAL EMERGENCY REPORTS ===
{
  "alerts": [
    "IMMEDIATE EVACUATION ORDER for Santa Clara University campus",
    "Wildfire has consumed 50 acres and spreading rapidly"
  ],
  "fire_department": "All units responding. DO NOT RETURN TO CAMPUS.",
  "estimated_time_to_impact": "15-20 minutes"
}

=== SOCIAL MEDIA - LIVE UPDATES ===
{
  "sentiment": "High panic",
  "trending": ["#SCUFire", "#Evacuate", "#Emergency"],
  "emergency_mentions": 847,
  "live_updates": [
    "Fire visible from campus library! Everyone evacuating!",
    "Smoke getting very thick, hard to breathe",
    "Highway 101 is backed up but moving east"
  ]
}

=== EMERGENCY RESOURCES AVAILABLE ===
{
  "shelters": [
    {
      "name": "Downtown Santa Clara Emergency Shelter",
      "address": "1500 Warburton Ave",
      "status": "OPEN AND READY"
    }
  ],
  "emergency_contacts": [
    {"service": "Fire Department", "number": "911"},
    {"service": "Campus Safety", "number": "(408) 554-4444"},
    {"service": "Shelter Hotline", "number": "(408) 615-2000"}
  ]
}

EVACUATION PLANNING TASK:

Based on the above data, you must create a detailed 5-step evacuation plan.

IMPORTANT - Use these EXACT GPS coordinates from the map data:
- Current Location: {"lat": 37.3496, "lng": -121.9390}
- Fire/Hazard Zone: {"lat": 37.3450, "lng": -121.9550}
- Safe Shelter: {"lat": 37.3535, "lng": -121.9345}
- Waypoints: [
    {"lat": 37.3496, "lng": -121.9390},
    {"lat": 37.3510, "lng": -121.9360},
    {"lat": 37.3520, "lng": -121.9340},
    {"lat": 37.3535, "lng": -121.9300}
  ]

EVACUATION ROUTE REQUIREMENTS:
1. Step 1: Start at current location (library)
2. Steps 2-4: Follow the waypoints provided in the map data
3. Step 5: Arrive at the safe shelter
4. Each step must include specific directions
5. Include distance and time for each step
6. Note blocked roads: Alameda westbound, Franklin Street
7. Include fire-specific warnings

Generate the complete JSON evacuation plan now.
```

### Expected Response

```json
{
  "is_emergency": true,
  "severity": "high",
  "threat_type": "fire",
  "evacuation_steps": [
    {
      "step": 1,
      "title": "Exit Library Immediately - Go East",
      "description": "Leave the building NOW. Do not collect belongings. Cover nose and mouth with cloth if smoke is present. Head east toward main campus gate.",
      "situation": "Wildfire approaching from west. You have approximately 15-20 minutes to evacuate.",
      "action": "Exit library through east entrance. Move quickly but do not run. Help others if safe to do so.",
      "coordinates": {"lat": 37.3496, "lng": -121.9390},
      "distance": "Starting point",
      "time": "< 1 min",
      "warning": "DO NOT go west. Fire is approaching from that direction. Stay low if smoke is thick."
    },
    {
      "step": 2,
      "title": "Head to Main Campus Gate",
      "description": "Walk east along main campus path toward El Camino Real. Stay on open paths away from buildings.",
      "situation": "Fire is 1.2 miles west and spreading northeast. Wind is pushing smoke toward campus.",
      "action": "Follow crowd toward main gate. Keep moving east. Monitor air quality.",
      "coordinates": {"lat": 37.3510, "lng": -121.9360},
      "distance": "200 meters",
      "time": "2-3 min",
      "warning": "Avoid Alameda westbound - fire approaching. If breathing becomes difficult, use wet cloth over face."
    },
    {
      "step": 3,
      "title": "Exit Campus - Reach El Camino Real",
      "description": "Exit campus through main gate. Turn left (north) on El Camino Real. Traffic may be heavy - stay on sidewalk.",
      "situation": "You are now outside the immediate danger zone. Continue moving away from campus.",
      "action": "Follow El Camino Real northbound. Do NOT return to campus for any reason.",
      "coordinates": {"lat": 37.3520, "lng": -121.9340},
      "distance": "150 meters",
      "time": "2 min",
      "warning": "Do not attempt to drive if roads are congested. Walking is faster and safer."
    },
    {
      "step": 4,
      "title": "Continue to Safe Zone East",
      "description": "Continue north on El Camino Real toward downtown Santa Clara. You are approaching the designated safe zone.",
      "situation": "Fire danger decreasing as you move farther east. Shelter is nearby.",
      "action": "Follow evacuation signs toward Downtown Emergency Shelter. First aid available if needed.",
      "coordinates": {"lat": 37.3535, "lng": -121.9300},
      "distance": "250 meters",
      "time": "3-4 min",
      "warning": "Monitor for emergency vehicles. Give them right of way. Stay hydrated if possible."
    },
    {
      "step": 5,
      "title": "Arrive at Emergency Shelter",
      "description": "You have reached the Downtown Santa Clara Emergency Shelter. Check in with staff. Medical assistance, food, and water available.",
      "situation": "You are now in a safe location away from fire danger.",
      "action": "Report to shelter staff. Provide contact information. Do not leave shelter until all-clear is given.",
      "coordinates": {"lat": 37.3535, "lng": -121.9345},
      "distance": "100 meters",
      "time": "1-2 min",
      "warning": "Remain at shelter until official all-clear. Monitor news and official channels for updates."
    }
  ],
  "blocked_routes": [
    "Alameda westbound - Fire approaching",
    "Franklin Street - Smoke obscured, unsafe"
  ],
  "safe_shelter": {
    "name": "Downtown Santa Clara Emergency Shelter",
    "address": "1500 Warburton Ave",
    "coordinates": {"lat": 37.3535, "lng": -121.9345},
    "distance": "1.1 km total from library",
    "facilities": "Medical staff, food, water, phone charging"
  },
  "emergency_contacts": [
    {"service": "Fire Department", "number": "911"},
    {"service": "Campus Safety", "number": "(408) 554-4444"},
    {"service": "Shelter Hotline", "number": "(408) 615-2000"}
  ]
}
```

---

## Key Differences Between Prompts

### False Alarm Prompt
- **Goal**: Determine if situation is a false alarm
- **Tone**: Analytical and reassuring
- **Output**: Assessment with suggested actions
- **Focus**: Evidence analysis, ruling out emergency
- **Data Sources**: Emphasized to show normalcy

### Emergency Prompt
- **Goal**: Generate life-saving evacuation plan
- **Tone**: Direct, authoritative, urgent
- **Output**: 5-step evacuation with GPS coordinates
- **Focus**: Immediate action, safety, clear directions
- **Data Sources**: Emphasized to show danger and routes

---

## How the System Chooses Which Prompt

The orchestrator uses the `/analyze` endpoint which automatically:

1. **Receives**: User query, location, emergency_type
2. **Calls**: All 5 MCP agents in parallel
3. **Analyzes**: Agent responses to determine if real emergency
4. **Selects**: Appropriate system prompt (false alarm vs emergency)
5. **Builds**: Complete user prompt with all agent data
6. **Calls**: NVIDIA NIM with system + user prompt
7. **Returns**: Parsed JSON response to frontend

Emergency type detection in backend (`main.py`):
- Looks for keywords in user query
- fire/smoke/burn → fire
- hurricane/storm/wind → hurricane
- flood/water/rain → flood
- default → none (false alarm likely)
