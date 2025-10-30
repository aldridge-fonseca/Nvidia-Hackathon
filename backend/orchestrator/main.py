from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Literal, Optional, List, Dict, Any
import httpx
import json
import os
from prompts import (
    get_system_prompt,
    build_false_alarm_prompt,
    build_emergency_prompt,
    DECISION_SYSTEM_PROMPT,
    build_decision_prompt
)
from knowledge import get_procedures
import uvicorn

app = FastAPI(
    title="CrisisVision Orchestrator",
    description="AI-powered emergency response coordination system",
    version="1.0.0"
)

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "")
NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

MCP_SERVICES = {
    "weather": os.getenv("WEATHER_SERVICE_URL", "http://weather:8001"),
    "maps": os.getenv("MAPS_SERVICE_URL", "http://maps:8002"),
    "news": os.getenv("NEWS_SERVICE_URL", "http://news:8003"),
    "social": os.getenv("SOCIAL_SERVICE_URL", "http://social:8004"),
    "resource": os.getenv("RESOURCE_SERVICE_URL", "http://resource:8005")
}


class AnalysisRequest(BaseModel):
    scenario: str
    location: str
    emergency_type: Literal["fire", "hurricane", "flood", "none"] = "none"


@app.get("/")
def root():
    return {
        "service": "CrisisVision Orchestrator",
        "version": "1.0.0",
        "status": "operational",
        "mcp_services": len(MCP_SERVICES)
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "services": MCP_SERVICES
    }


async def query_mcp_service(service_name: str, endpoint: str, params: dict) -> dict:
    """
    Query an MCP service and return the response.
    """
    try:
        base_url = MCP_SERVICES.get(service_name)
        if not base_url:
            return {"error": f"Service {service_name} not configured"}
        
        url = f"{base_url}{endpoint}"
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json()
    except Exception as e:
        return {"error": str(e)}


async def gather_intelligence(location: str, emergency_type: str) -> Dict[str, Any]:
    """
    Query all MCP services in parallel and gather intelligence data.
    """
    params = {
        "location": location,
        "emergency_type": emergency_type
    }
    
    weather_data = await query_mcp_service("weather", "/weather", params)
    maps_data = await query_mcp_service("maps", "/location", params)
    news_data = await query_mcp_service("news", "/news", params)
    social_data = await query_mcp_service("social", "/social", params)
    resource_data = await query_mcp_service("resource", "/resources", params)
    
    return {
        "weather": weather_data,
        "maps": maps_data,
        "news": news_data,
        "social": social_data,
        "resource": resource_data
    }


def call_nvidia_llm(system_prompt: str, user_prompt: str, model: str = None) -> str:
    """
    Call NVIDIA NIM API for LLM inference.
    
    Args:
        system_prompt: System instructions for the LLM
        user_prompt: User query and context
        model: Optional model override (defaults to env var or nemotron-4-340b)
    """
    if not NVIDIA_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="NVIDIA_API_KEY not configured. Please set the environment variable."
        )
    
    # Use provided model, or fall back to env var, or use default
    llm_model = model or os.getenv("LLM_MODEL", "nvidia/nemotron-4-340b-instruct")
    
    try:
        response = httpx.post(
            NVIDIA_API_URL,
            headers={
                "Authorization": f"Bearer {NVIDIA_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": llm_model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": float(os.getenv("LLM_TEMPERATURE", "0.2")),
                "max_tokens": int(os.getenv("LLM_MAX_TOKENS", "2000"))
            },
            timeout=30.0
        )
        response.raise_for_status()
        
        result = response.json()
        return result["choices"][0]["message"]["content"]
    
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"NVIDIA API error: {e.response.text}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"LLM call failed: {str(e)}"
        )


def parse_llm_response(response_text: str) -> dict:
    """
    Parse LLM response and extract JSON.
    """
    try:
        response_text = response_text.strip()
        
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        response_text = response_text.strip()
        
        return json.loads(response_text)
    
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse LLM response as JSON: {str(e)}\nResponse: {response_text[:500]}"
        )


@app.post("/analyze")
async def analyze_situation(request: AnalysisRequest) -> dict:
    """
    Two-stage analysis:
    1. Fast decision model determines if it's an emergency
    2. Large response model generates detailed guidance
    """
    
    # Gather intelligence from all MCP agents
    intelligence_data = await gather_intelligence(
        request.location,
        request.emergency_type
    )
    
    # ============================================
    # STAGE 1: QUICK DECISION (Small/Fast Model)
    # ============================================
    print("🧠 Stage 1: Quick triage decision...")
    
    decision_prompt = build_decision_prompt(
        request.scenario,
        request.location,
        intelligence_data["weather"],
        intelligence_data["maps"],
        intelligence_data["news"],
        intelligence_data["social"],
        intelligence_data["resource"]
    )
    
    # Use a small, fast model for quick decision
    decision_model = os.getenv("DECISION_MODEL", "nvidia/llama-3.2-nv-embedqa-1b-v2")
    decision_response = call_nvidia_llm(
        DECISION_SYSTEM_PROMPT, 
        decision_prompt,
        model=decision_model
    )
    
    decision = parse_llm_response(decision_response)
    is_emergency = decision.get("is_emergency", False)
    emergency_type = decision.get("emergency_type", "none")
    
    print(f"✅ Decision: {'EMERGENCY' if is_emergency else 'FALSE ALARM'} (confidence: {decision.get('confidence', 0)})")
    
    # ============================================
    # STAGE 2: DETAILED RESPONSE (Large Model)
    # ============================================
    print(f"🤖 Stage 2: Generating detailed {'evacuation plan' if is_emergency else 'assessment'}...")
    
    system_prompt = get_system_prompt(is_emergency)
    
    if is_emergency:
        user_prompt = build_emergency_prompt(
            request.scenario,
            request.location,
            emergency_type,
            intelligence_data["weather"],
            intelligence_data["maps"],
            intelligence_data["news"],
            intelligence_data["social"],
            intelligence_data["resource"]
        )
    else:
        user_prompt = build_false_alarm_prompt(
            request.scenario,
            request.location,
            intelligence_data["weather"],
            intelligence_data["maps"],
            intelligence_data["news"],
            intelligence_data["social"],
            intelligence_data["resource"]
        )
    
    # Use a large, powerful model for detailed response
    response_model = os.getenv("RESPONSE_MODEL", "meta/llama-3.1-70b-instruct")
    llm_response_text = call_nvidia_llm(system_prompt, user_prompt, model=response_model)
    
    result = parse_llm_response(llm_response_text)
    
    # Merge decision metadata with response
    result["decision_metadata"] = {
        "stage1_decision": decision,
        "stage1_model": decision_model,
        "stage2_model": response_model
    }
    
    procedures = get_procedures(emergency_type)
    result["emergency_procedures"] = procedures
    
    result["metadata"] = {
        "scenario": request.scenario,
        "location": request.location,
        "emergency_type": request.emergency_type,
        "intelligence_sources": list(intelligence_data.keys())
    }
    
    return result


@app.post("/test")
async def test_without_llm(request: AnalysisRequest) -> dict:
    """
    Test endpoint: Gather intelligence without calling LLM (for testing).
    """
    intelligence_data = await gather_intelligence(
        request.location,
        request.emergency_type
    )
    
    return {
        "scenario": request.scenario,
        "location": request.location,
        "emergency_type": request.emergency_type,
        "intelligence_data": intelligence_data,
        "note": "This is test mode - no LLM call made"
    }


if __name__ == "__main__":
    port = int(os.getenv("ORCHESTRATOR_PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)
