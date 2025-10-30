"""
Emergency procedures and protocols knowledge base.
"""

FIRE_PROCEDURES = """
FIRE EMERGENCY PROCEDURES:

Immediate Actions:
1. Activate nearest fire alarm
2. Alert others in the immediate area
3. Exit building using nearest safe exit
4. Do NOT use elevators
5. Close doors behind you to contain fire
6. Stay low if smoke is present
7. Feel doors before opening (heat check)

Evacuation Protocol:
- Move quickly but do not run
- Use stairs, never elevators
- Assist those who need help
- Do not stop to collect belongings
- Proceed to designated assembly point
- Stay clear of building (minimum 500 feet)
- Do not re-enter until cleared by authorities

Safety Guidelines:
- If trapped: Close doors, seal gaps, signal for help
- If clothing catches fire: Stop, Drop, and Roll
- Stay together with your group
- Account for all personnel at assembly point
- Report missing persons to emergency responders

Evacuation Route Selection:
- Primary route: Nearest marked exit
- Secondary route: Alternative if primary blocked
- Avoid smoke-filled areas
- Stay on designated evacuation routes
- Follow directional signage
"""

HURRICANE_PROCEDURES = """
HURRICANE EMERGENCY PROCEDURES:

Before Hurricane:
1. Monitor official weather updates
2. Secure or bring inside loose objects
3. Close storm shutters or board windows
4. Prepare emergency kit (water, food, medicine, flashlight)
5. Charge all electronic devices
6. Fill bathtubs with water for utility use

During Hurricane:
- Stay inside, away from windows
- Move to interior room on lowest floor
- If flooding occurs, move to higher floor
- Do not go outside until all-clear given
- Stay away from floodwater
- Conserve battery power

After Hurricane:
- Wait for official all-clear
- Avoid floodwater (may be contaminated)
- Watch for hazards (downed power lines, debris)
- Do not return home if unsafe
- Document damage for insurance
"""

FLOOD_PROCEDURES = """
FLOOD EMERGENCY PROCEDURES:

Immediate Actions:
1. Move to higher ground immediately
2. Do NOT walk through moving water
3. Do NOT drive through flooded areas
4. Stay away from power lines and electrical wires
5. Listen to emergency broadcasts

Safety Rules:
- 6 inches of water can knock you down
- 12 inches of water can carry away a vehicle
- Turn Around, Don't Drown
- Do not touch electrical equipment if wet
- Avoid contact with floodwater (contamination risk)

Evacuation:
- Leave as soon as advised
- Follow designated evacuation routes
- Do not return until authorities say it's safe
- Be aware of flash flood potential
- Move to higher elevation, not just higher floor
"""

GENERAL_SAFETY = """
GENERAL EMERGENCY SAFETY:

Universal Rules:
1. Stay calm and think clearly
2. Follow official instructions
3. Help others if you can do so safely
4. Do not spread unverified information
5. Keep emergency contacts accessible

Communication:
- Call 911 for life-threatening emergencies
- Use text messages if phone lines are busy
- Check in with family/friends
- Monitor official channels for updates

After Emergency:
- Document everything (photos, notes)
- Contact insurance company
- Be aware of stress and trauma
- Seek medical attention if needed
"""


def get_procedures(emergency_type: str) -> str:
    """
    Returns relevant emergency procedures based on type.
    """
    procedures_map = {
        "fire": FIRE_PROCEDURES,
        "hurricane": HURRICANE_PROCEDURES,
        "flood": FLOOD_PROCEDURES,
        "none": GENERAL_SAFETY
    }
    return procedures_map.get(emergency_type.lower(), GENERAL_SAFETY)
