from fastapi import FastAPI, Query
from typing import Literal, Dict, Any
import uvicorn

app = FastAPI(title="Weather MCP Server", version="1.0.0")

EmergencyType = Literal["fire", "hurricane", "flood", "none"]


@app.get("/")
def root():
    return {
        "service": "Weather Intelligence",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/weather")
def get_weather(
    location: str = Query(..., description="Location to check weather"),
    emergency_type: EmergencyType = Query("none", description="Type of emergency")
) -> Dict[str, Any]:
    """
    Returns weather conditions based on location and emergency type.
    """
    
    if emergency_type == "fire":
        return {
            "location": location,
            "conditions": "Hot and dry with strong winds",
            "temperature": "92°F (33°C)",
            "humidity": "18%",
            "wind": {
                "speed": "22 mph",
                "direction": "Southwest",
                "gusts": "35 mph"
            },
            "fire_weather_index": "Extreme",
            "red_flag_warning": True,
            "visibility": "Reduced due to smoke",
            "air_quality": "Unhealthy (AQI 165)",
            "forecast": "Conditions favorable for rapid fire spread",
            "warnings": [
                "Red Flag Warning in effect until 8 PM",
                "Avoid outdoor exposure due to smoke",
                "Fire danger extremely high"
            ]
        }
    
    elif emergency_type == "hurricane":
        return {
            "location": location,
            "conditions": "Severe thunderstorms with high winds",
            "temperature": "76°F (24°C)",
            "humidity": "95%",
            "wind": {
                "speed": "65 mph",
                "direction": "Northeast",
                "gusts": "85 mph"
            },
            "hurricane_category": "Category 2",
            "storm_surge": "6-8 feet expected",
            "rainfall": "Heavy (8-12 inches expected)",
            "visibility": "Poor (< 0.5 miles)",
            "forecast": "Hurricane conditions for next 6-8 hours",
            "warnings": [
                "Hurricane Warning in effect",
                "Storm surge warning",
                "Flash flood watch",
                "Seek shelter immediately"
            ]
        }
    
    elif emergency_type == "flood":
        return {
            "location": location,
            "conditions": "Heavy rainfall with flooding",
            "temperature": "68°F (20°C)",
            "humidity": "98%",
            "wind": {
                "speed": "12 mph",
                "direction": "East",
                "gusts": "18 mph"
            },
            "rainfall": "Heavy (3 inches in last hour)",
            "flood_stage": "Major flooding",
            "river_level": "15.2 feet (flood stage: 12 feet)",
            "visibility": "Moderate (2 miles)",
            "forecast": "Continued heavy rain for 4-6 hours",
            "warnings": [
                "Flash Flood Warning in effect",
                "Do not attempt to cross flooded roads",
                "Move to higher ground immediately"
            ]
        }
    
    else:
        return {
            "location": location,
            "conditions": "Partly cloudy",
            "temperature": "72°F (22°C)",
            "humidity": "55%",
            "wind": {
                "speed": "8 mph",
                "direction": "West",
                "gusts": "12 mph"
            },
            "visibility": "10 miles",
            "air_quality": "Good (AQI 45)",
            "forecast": "Pleasant conditions expected to continue",
            "warnings": []
        }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
