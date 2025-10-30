from fastapi import FastAPI, Query
from typing import Literal, Dict, Any, List
from datetime import datetime, timedelta
import uvicorn

app = FastAPI(title="Social MCP Server", version="1.0.0")

EmergencyType = Literal["fire", "hurricane", "flood", "none"]


@app.get("/")
def root():
    return {
        "service": "Social Media Analysis",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/social")
def get_social_data(
    location: str = Query(..., description="Location to analyze"),
    emergency_type: EmergencyType = Query("none", description="Type of emergency")
) -> Dict[str, Any]:
    """
    Returns social media analysis based on emergency type.
    """
    
    current_time = datetime.now()
    
    if emergency_type == "fire":
        return {
            "analysis_period": "Last 30 minutes",
            "total_posts": 847,
            "sentiment": {
                "urgent": 72,
                "concerned": 23,
                "informational": 5
            },
            "trending_keywords": [
                "#SCUFire",
                "#SantaClaraFire",
                "#CampusEvacuation",
                "#EmergencyAlert"
            ],
            "posts": [
                {
                    "platform": "Twitter",
                    "user": "@SCU_Student2025",
                    "timestamp": (current_time - timedelta(minutes=5)).isoformat(),
                    "content": "Huge fire near the library! Everyone evacuating now. Smoke everywhere. #SCUFire",
                    "engagement": {"likes": 234, "shares": 89},
                    "verified": False,
                    "credibility": "High - multiple corroborating posts"
                },
                {
                    "platform": "Twitter",
                    "user": "@Campus_Safety_SCU",
                    "timestamp": (current_time - timedelta(minutes=8)).isoformat(),
                    "content": "ALERT: Active fire on campus. Follow evacuation procedures. Use designated routes. Stay calm.",
                    "engagement": {"likes": 1203, "shares": 456},
                    "verified": True,
                    "credibility": "Official source"
                },
                {
                    "platform": "Instagram",
                    "user": "@scu_daily",
                    "timestamp": (current_time - timedelta(minutes=10)).isoformat(),
                    "content": "Fire trucks everywhere. Can see flames from Benson. Please be safe everyone! 🚒🔥",
                    "engagement": {"likes": 567, "comments": 123},
                    "verified": False,
                    "credibility": "High - visual confirmation"
                },
                {
                    "platform": "Facebook",
                    "user": "SCU Parents Group",
                    "timestamp": (current_time - timedelta(minutes=12)).isoformat(),
                    "content": "Parents: Fire reported on campus. Students are being evacuated safely. Official updates coming from university.",
                    "engagement": {"reactions": 2103, "shares": 234},
                    "verified": False,
                    "credibility": "Medium"
                },
                {
                    "platform": "Twitter",
                    "user": "@Local_Reporter",
                    "timestamp": (current_time - timedelta(minutes=15)).isoformat(),
                    "content": "Breaking: Fire at Santa Clara University. Multiple fire crews responding. Heavy smoke visible. #Breaking",
                    "engagement": {"likes": 892, "shares": 334},
                    "verified": True,
                    "credibility": "High - journalist"
                }
            ],
            "eyewitness_reports": {
                "total": 156,
                "with_photos": 43,
                "with_video": 12
            },
            "geographic_concentration": {
                "primary": "Santa Clara University campus",
                "radius": "0.5 miles",
                "report_density": "Very High"
            },
            "misinformation_risk": "Low - consistent reports from multiple sources",
            "public_response": "High awareness, following official guidance"
        }
    
    elif emergency_type == "hurricane":
        return {
            "analysis_period": "Last 2 hours",
            "total_posts": 3421,
            "sentiment": {
                "worried": 58,
                "preparing": 32,
                "informational": 10
            },
            "trending_keywords": [
                "#HurricaneWarning",
                "#BayAreaStorm",
                "#StaySafe",
                "#Evacuate"
            ],
            "posts": [
                {
                    "platform": "Twitter",
                    "user": "@NWS_BayArea",
                    "timestamp": (current_time - timedelta(minutes=30)).isoformat(),
                    "content": "Hurricane warning remains in effect. Winds increasing. Storm surge expected. Seek shelter now. #Hurricane",
                    "engagement": {"likes": 5432, "shares": 2341},
                    "verified": True,
                    "credibility": "Official source"
                },
                {
                    "platform": "Twitter",
                    "user": "@LocalResident",
                    "timestamp": (current_time - timedelta(minutes=45)).isoformat(),
                    "content": "Wind is getting scary. Power just went out. Trees bending like crazy. Stay safe everyone.",
                    "engagement": {"likes": 432, "shares": 87},
                    "verified": False,
                    "credibility": "Medium"
                }
            ],
            "eyewitness_reports": {
                "total": 412,
                "reporting_damage": 87,
                "reporting_flooding": 134
            }
        }
    
    elif emergency_type == "flood":
        return {
            "analysis_period": "Last hour",
            "total_posts": 1876,
            "sentiment": {
                "urgent": 64,
                "concerned": 28,
                "informational": 8
            },
            "trending_keywords": [
                "#FlashFlood",
                "#Flooding",
                "#RoadsClosed",
                "#StaySafe"
            ],
            "posts": [
                {
                    "platform": "Twitter",
                    "user": "@SCCounty_Roads",
                    "timestamp": (current_time - timedelta(minutes=20)).isoformat(),
                    "content": "Multiple roads closed due to flooding. DO NOT drive through water. Turn around, don't drown. #FlashFlood",
                    "engagement": {"likes": 876, "shares": 234},
                    "verified": True,
                    "credibility": "Official source"
                },
                {
                    "platform": "Twitter",
                    "user": "@Driver_Alert",
                    "timestamp": (current_time - timedelta(minutes=25)).isoformat(),
                    "content": "Water up to my door handles on El Camino. Had to turn back. Don't risk it people!",
                    "engagement": {"likes": 234, "shares": 67},
                    "verified": False,
                    "credibility": "High"
                }
            ],
            "eyewitness_reports": {
                "total": 223,
                "reporting_flooding": 198
            }
        }
    
    else:
        return {
            "analysis_period": "Last hour",
            "total_posts": 12,
            "sentiment": {
                "neutral": 83,
                "informational": 17
            },
            "trending_keywords": [],
            "posts": [
                {
                    "platform": "Twitter",
                    "user": "@Campus_Safety_SCU",
                    "timestamp": (current_time - timedelta(minutes=30)).isoformat(),
                    "content": "Fire alarm test scheduled for 2 PM today. This is a routine drill. No emergency.",
                    "engagement": {"likes": 23, "shares": 4},
                    "verified": True,
                    "credibility": "Official source"
                }
            ],
            "eyewitness_reports": {
                "total": 2,
                "reporting_emergency": 0
            },
            "public_response": "Normal activity, no unusual concerns"
        }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8004)
