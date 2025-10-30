from fastapi import FastAPI, Query
from typing import Literal, Dict, Any, List
import uvicorn

app = FastAPI(title="Resource MCP Server", version="1.0.0")

EmergencyType = Literal["fire", "hurricane", "flood", "none"]


@app.get("/")
def root():
    return {
        "service": "Emergency Resource Management",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/resources")
def get_resources(
    location: str = Query(..., description="Location to check resources"),
    emergency_type: EmergencyType = Query("none", description="Type of emergency")
) -> Dict[str, Any]:
    """
    Returns emergency resource availability based on emergency type.
    """
    
    if emergency_type == "fire":
        return {
            "emergency_services": {
                "fire_department": {
                    "status": "Actively responding",
                    "units_deployed": 8,
                    "estimated_response_time": "On scene",
                    "station": "Santa Clara Fire Station #1",
                    "contact": "911"
                },
                "police": {
                    "status": "Traffic control and perimeter security",
                    "units_deployed": 4,
                    "station": "Santa Clara Police Department",
                    "contact": "911"
                },
                "medical": {
                    "status": "Standby",
                    "ambulances_available": 3,
                    "nearest_hospital": "Kaiser Santa Clara Medical Center",
                    "distance": "1.2 miles",
                    "contact": "911"
                }
            },
            "shelters": [
                {
                    "name": "Athletic Field Emergency Shelter",
                    "address": "Santa Clara University Athletic Complex",
                    "coordinates": {"lat": 37.3535, "lng": -121.9345},
                    "capacity": 500,
                    "current_occupancy": 142,
                    "status": "Open",
                    "amenities": [
                        "Water",
                        "First aid",
                        "Medical personnel on site",
                        "Communication center"
                    ],
                    "accessibility": "Wheelchair accessible",
                    "contact": "(408) 555-0100"
                },
                {
                    "name": "Leavey Activities Center",
                    "address": "500 El Camino Real, Santa Clara",
                    "coordinates": {"lat": 37.3505, "lng": -121.9385},
                    "capacity": 800,
                    "current_occupancy": 56,
                    "status": "Open",
                    "amenities": [
                        "Water",
                        "Food",
                        "Restrooms",
                        "Phone charging stations"
                    ],
                    "accessibility": "Wheelchair accessible",
                    "contact": "(408) 555-0200"
                }
            ],
            "medical_facilities": [
                {
                    "name": "Kaiser Santa Clara Medical Center",
                    "type": "Hospital",
                    "distance": "1.2 miles",
                    "trauma_level": "Level II",
                    "emergency_room": "Open",
                    "burn_unit": "Available",
                    "contact": "(408) 236-6400"
                },
                {
                    "name": "El Camino Hospital",
                    "type": "Hospital",
                    "distance": "2.3 miles",
                    "trauma_level": "Level II",
                    "emergency_room": "Open",
                    "contact": "(650) 940-7000"
                }
            ],
            "supplies": {
                "water": "Adequate - distribution at shelters",
                "medical": "Sufficient - additional supplies en route",
                "food": "Available at Leavey Center",
                "blankets": "Adequate",
                "first_aid_kits": "Available at all shelters"
            },
            "evacuation_support": {
                "transportation": "Shuttle buses available for those without vehicles",
                "special_needs": "Assistance available for disabled persons",
                "pets": "Pet-friendly shelter at Athletic Field"
            },
            "emergency_contacts": [
                {"service": "Emergency", "number": "911"},
                {"service": "Campus Safety", "number": "(408) 554-4444"},
                {"service": "Red Cross", "number": "1-800-RED-CROSS"},
                {"service": "Poison Control", "number": "1-800-222-1222"}
            ]
        }
    
    elif emergency_type == "hurricane":
        return {
            "emergency_services": {
                "emergency_management": {
                    "status": "Full activation",
                    "coordination_center": "Santa Clara County EOC",
                    "contact": "911"
                },
                "rescue_teams": {
                    "swift_water_rescue": "Deployed",
                    "search_and_rescue": "On standby",
                    "units_available": 12
                }
            },
            "shelters": [
                {
                    "name": "Leavey Center Hurricane Shelter",
                    "address": "500 El Camino Real",
                    "coordinates": {"lat": 37.3505, "lng": -121.9385},
                    "capacity": 800,
                    "current_occupancy": 423,
                    "status": "Open",
                    "amenities": [
                        "Generator power",
                        "Water",
                        "Food",
                        "Medical staff",
                        "Communications"
                    ],
                    "storm_rated": True,
                    "contact": "(408) 555-0200"
                }
            ],
            "supplies": {
                "water": "72-hour supply secured",
                "food": "MREs available for 1000 people",
                "generators": "Operational",
                "fuel": "Adequate reserves"
            },
            "emergency_contacts": [
                {"service": "Emergency", "number": "911"},
                {"service": "Hurricane Hotline", "number": "1-800-STORM-INFO"},
                {"service": "Red Cross", "number": "1-800-RED-CROSS"}
            ]
        }
    
    elif emergency_type == "flood":
        return {
            "emergency_services": {
                "water_rescue": {
                    "status": "Active operations",
                    "boats_deployed": 6,
                    "swift_water_teams": 3,
                    "contact": "911"
                },
                "evacuation_support": {
                    "buses": "Available for transport to higher ground",
                    "pickup_points": ["Leavey Center", "Benson Center"]
                }
            },
            "shelters": [
                {
                    "name": "Leavey Center (Upper Floors)",
                    "address": "500 El Camino Real",
                    "coordinates": {"lat": 37.3505, "lng": -121.9385},
                    "elevation": "120 feet (above flood level)",
                    "capacity": 600,
                    "status": "Open",
                    "floor": "2nd and 3rd floors only"
                }
            ],
            "supplies": {
                "drinking_water": "Emergency supply at upper floor shelters",
                "sandbags": "Distributed at key locations",
                "rescue_equipment": "Boats and high-water vehicles available"
            },
            "emergency_contacts": [
                {"service": "Emergency", "number": "911"},
                {"service": "Flood Hotline", "number": "1-800-FLOOD-HELP"},
                {"service": "Water Rescue", "number": "Direct to 911"}
            ]
        }
    
    else:
        return {
            "emergency_services": {
                "campus_safety": {
                    "status": "Normal operations",
                    "contact": "(408) 554-4444"
                },
                "fire_department": {
                    "status": "Available",
                    "contact": "911"
                }
            },
            "facilities": [
                {
                    "name": "Campus Safety Office",
                    "location": "Benson Memorial Center",
                    "hours": "24/7",
                    "services": ["Emergency response", "Safety escorts", "Lost and found"]
                },
                {
                    "name": "Cowell Health Center",
                    "location": "870 Market Street",
                    "hours": "Mon-Fri 8:30 AM - 5:00 PM",
                    "services": ["Medical care", "Mental health", "Wellness"]
                }
            ],
            "emergency_contacts": [
                {"service": "Emergency", "number": "911"},
                {"service": "Campus Safety", "number": "(408) 554-4444"},
                {"service": "Health Center", "number": "(408) 554-4501"}
            ],
            "status": "All services operational"
        }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8005)
