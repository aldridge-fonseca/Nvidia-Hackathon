from fastapi import FastAPI, Query
from typing import Literal, Dict, Any, List
from datetime import datetime, timedelta
import uvicorn

app = FastAPI(title="News MCP Server", version="1.0.0")

EmergencyType = Literal["fire", "hurricane", "flood", "none"]


@app.get("/")
def root():
    return {
        "service": "News Intelligence",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/news")
def get_news(
    location: str = Query(..., description="Location to check news"),
    emergency_type: EmergencyType = Query("none", description="Type of emergency")
) -> Dict[str, Any]:
    """
    Returns news and incident reports based on emergency type.
    """
    
    current_time = datetime.now()
    
    if emergency_type == "fire":
        return {
            "breaking_news": True,
            "incident_type": "Active Fire",
            "location": location,
            "reports": [
                {
                    "source": "Santa Clara Fire Department",
                    "timestamp": (current_time - timedelta(minutes=15)).isoformat(),
                    "headline": "Structure Fire Reported at Santa Clara University",
                    "content": "Fire crews responding to active fire near university library. Multiple units on scene. Evacuation in progress.",
                    "severity": "High",
                    "verified": True
                },
                {
                    "source": "Local News Channel 7",
                    "timestamp": (current_time - timedelta(minutes=12)).isoformat(),
                    "headline": "Campus Evacuations Underway Due to Fire",
                    "content": "Students and staff evacuating campus buildings. Smoke visible from El Camino Real. Avoid the area.",
                    "severity": "High",
                    "verified": True
                },
                {
                    "source": "University Emergency Alert",
                    "timestamp": (current_time - timedelta(minutes=8)).isoformat(),
                    "headline": "Emergency Alert: Immediate Evacuation Required",
                    "content": "All personnel must evacuate immediately. Follow designated evacuation routes. Do not return to buildings.",
                    "severity": "Critical",
                    "verified": True
                }
            ],
            "timeline": [
                {"time": "2:15 PM", "event": "First report of smoke"},
                {"time": "2:18 PM", "event": "Fire alarm activated"},
                {"time": "2:20 PM", "event": "911 call received"},
                {"time": "2:22 PM", "event": "Fire crews dispatched"},
                {"time": "2:28 PM", "event": "First units arrive on scene"},
                {"time": "2:30 PM", "event": "Evacuation order issued"}
            ],
            "official_statements": [
                {
                    "authority": "Santa Clara Fire Chief",
                    "message": "We have an active structure fire. The situation is being managed. Please follow evacuation instructions.",
                    "timestamp": (current_time - timedelta(minutes=10)).isoformat()
                }
            ],
            "affected_area": "Santa Clara University campus, 500 block of El Camino Real",
            "estimated_response_time": "Ongoing",
            "casualties": "No injuries reported at this time"
        }
    
    elif emergency_type == "hurricane":
        return {
            "breaking_news": True,
            "incident_type": "Hurricane Warning",
            "location": location,
            "reports": [
                {
                    "source": "National Weather Service",
                    "timestamp": (current_time - timedelta(hours=2)).isoformat(),
                    "headline": "Hurricane Warning Issued for Bay Area",
                    "content": "Category 2 hurricane expected to make landfall within 6 hours. Winds up to 100 mph. Storm surge 6-10 feet.",
                    "severity": "Critical",
                    "verified": True
                },
                {
                    "source": "California Emergency Services",
                    "timestamp": (current_time - timedelta(hours=1)).isoformat(),
                    "headline": "Mandatory Evacuations Ordered for Low-Lying Areas",
                    "content": "Residents in flood-prone areas must evacuate immediately. Shelters open at designated locations.",
                    "severity": "High",
                    "verified": True
                }
            ],
            "timeline": [
                {"time": "6:00 AM", "event": "Hurricane watch issued"},
                {"time": "10:00 AM", "event": "Upgraded to hurricane warning"},
                {"time": "12:00 PM", "event": "Mandatory evacuations ordered"},
                {"time": "2:00 PM", "event": "Emergency shelters opened"}
            ],
            "official_statements": [
                {
                    "authority": "Governor's Office",
                    "message": "This is a serious storm. Follow evacuation orders. Do not wait until it's too late.",
                    "timestamp": (current_time - timedelta(minutes=30)).isoformat()
                }
            ]
        }
    
    elif emergency_type == "flood":
        return {
            "breaking_news": True,
            "incident_type": "Flash Flood Warning",
            "location": location,
            "reports": [
                {
                    "source": "National Weather Service",
                    "timestamp": (current_time - timedelta(minutes=45)).isoformat(),
                    "headline": "Flash Flood Warning in Effect",
                    "content": "Guadalupe River exceeding flood stage. Immediate flooding of low-lying areas. Move to higher ground.",
                    "severity": "High",
                    "verified": True
                },
                {
                    "source": "Santa Clara County",
                    "timestamp": (current_time - timedelta(minutes=30)).isoformat(),
                    "headline": "Roads Closed Due to Flooding",
                    "content": "Multiple roads impassable. Do not attempt to drive through flooded areas. Turn around, don't drown.",
                    "severity": "High",
                    "verified": True
                }
            ],
            "timeline": [
                {"time": "1:00 PM", "event": "Heavy rainfall begins"},
                {"time": "1:30 PM", "event": "River reaches flood stage"},
                {"time": "2:00 PM", "event": "Flash flood warning issued"},
                {"time": "2:15 PM", "event": "Multiple roads flooded"}
            ]
        }
    
    else:
        return {
            "breaking_news": False,
            "incident_type": "Normal Conditions",
            "location": location,
            "reports": [
                {
                    "source": "Campus Safety",
                    "timestamp": current_time.isoformat(),
                    "headline": "Routine Fire Alarm Test Completed",
                    "content": "Scheduled fire alarm test concluded successfully. No emergency. Normal operations resumed.",
                    "severity": "Low",
                    "verified": True
                }
            ],
            "status": "All clear - no active incidents"
        }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003)
