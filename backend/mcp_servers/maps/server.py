from fastapi import FastAPI, Query
from typing import Literal, Dict, Any, List
import uvicorn

app = FastAPI(title="Maps MCP Server", version="1.0.0")

EmergencyType = Literal["fire", "hurricane", "flood", "none"]


@app.get("/")
def root():
    return {
        "service": "Maps & Navigation",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/location")
def get_location_info(
    location: str = Query(..., description="Location to analyze"),
    emergency_type: EmergencyType = Query("none", description="Type of emergency")
) -> Dict[str, Any]:
    """
    Returns location and navigation data based on emergency type.
    """
    
    base_coords = {"lat": 37.3496, "lng": -121.9390}
    
    if emergency_type == "fire":
        return {
            "current_location": {
                "name": "Santa Clara University Library",
                "coordinates": base_coords,
                "address": "500 El Camino Real, Santa Clara, CA 95053"
            },
            "fire_location": {
                "coordinates": {"lat": 37.3490, "lng": -121.9395},
                "distance": "75 meters",
                "direction": "Southwest"
            },
            "safe_zones": [
                {
                    "name": "Athletic Field Emergency Shelter",
                    "coordinates": {"lat": 37.3535, "lng": -121.9345},
                    "distance": "1000 meters",
                    "capacity": "500 people",
                    "status": "Open and accepting evacuees"
                }
            ],
            "evacuation_routes": [
                {
                    "route_id": 1,
                    "waypoints": [
                        {"lat": 37.3496, "lng": -121.9390, "name": "Library Exit"},
                        {"lat": 37.3502, "lng": -121.9385, "name": "Alviso Street"},
                        {"lat": 37.3515, "lng": -121.9375, "name": "Benton Street"},
                        {"lat": 37.3525, "lng": -121.9355, "name": "Lafayette Street"},
                        {"lat": 37.3535, "lng": -121.9345, "name": "Athletic Field"}
                    ],
                    "total_distance": "1000 meters",
                    "estimated_time": "12-15 minutes walking",
                    "status": "Clear"
                }
            ],
            "blocked_roads": [
                {
                    "name": "El Camino Real",
                    "reason": "Emergency vehicles and fire response",
                    "alternative": "Use Alviso Street instead"
                }
            ],
            "landmarks": [
                {"name": "Benson Memorial Center", "distance": "150m"},
                {"name": "Mission Church", "distance": "200m"},
                {"name": "Leavey Center", "distance": "300m"}
            ],
            "hazards": [
                {
                    "type": "Fire zone",
                    "location": "Southwest of library",
                    "severity": "High",
                    "action": "Avoid area immediately"
                },
                {
                    "type": "Smoke",
                    "location": "Between library and parking structure",
                    "severity": "Moderate",
                    "action": "Use alternate route"
                }
            ]
        }
    
    elif emergency_type == "hurricane":
        return {
            "current_location": {
                "name": location,
                "coordinates": base_coords,
                "elevation": "82 feet above sea level"
            },
            "storm_center": {
                "coordinates": {"lat": 37.2, "lng": -122.1},
                "distance": "25 miles",
                "direction": "Moving northeast at 15 mph"
            },
            "safe_zones": [
                {
                    "name": "Community Shelter - Leavey Center",
                    "coordinates": {"lat": 37.3505, "lng": -121.9385},
                    "elevation": "95 feet",
                    "capacity": "800 people",
                    "status": "Open"
                }
            ],
            "evacuation_routes": [
                {
                    "route_id": 1,
                    "description": "Move to interior room on second floor",
                    "status": "Recommended - Shelter in place"
                }
            ],
            "blocked_roads": [
                "Highway 101 - Flooding",
                "Lawrence Expressway - Tree down"
            ],
            "flood_zones": [
                {
                    "area": "Low-lying areas near creek",
                    "risk": "High",
                    "action": "Evacuate immediately"
                }
            ]
        }
    
    elif emergency_type == "flood":
        return {
            "current_location": {
                "name": location,
                "coordinates": base_coords,
                "elevation": "82 feet above sea level",
                "flood_risk": "Moderate"
            },
            "water_levels": {
                "guadalupe_river": "15.2 feet (Major flood stage)",
                "rising_rate": "6 inches per hour",
                "forecast": "Expected to crest at 16 feet in 2 hours"
            },
            "safe_zones": [
                {
                    "name": "Higher Ground - Leavey Center Upper Floors",
                    "coordinates": {"lat": 37.3505, "lng": -121.9385},
                    "elevation": "120 feet",
                    "status": "Safe"
                }
            ],
            "evacuation_routes": [
                {
                    "route_id": 1,
                    "waypoints": [
                        {"lat": 37.3496, "lng": -121.9390, "elevation": "82ft"},
                        {"lat": 37.3505, "lng": -121.9385, "elevation": "95ft"},
                        {"lat": 37.3510, "lng": -121.9380, "elevation": "110ft"}
                    ],
                    "description": "Move to higher elevation",
                    "status": "Safe - above flood level"
                }
            ],
            "flooded_areas": [
                "Parking lots (elevation < 75ft)",
                "Guadalupe Creek vicinity",
                "El Camino underpass"
            ]
        }
    
    else:
        return {
            "current_location": {
                "name": location,
                "coordinates": base_coords,
                "address": "Santa Clara University, CA 95053"
            },
            "nearby_landmarks": [
                {"name": "Mission Church", "distance": "200m", "direction": "North"},
                {"name": "Benson Center", "distance": "150m", "direction": "East"},
                {"name": "Leavey Center", "distance": "300m", "direction": "Northeast"}
            ],
            "status": "All routes clear",
            "conditions": "Normal"
        }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
