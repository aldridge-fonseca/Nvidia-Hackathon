"""
Architecture Diagram Generator using Python

This script generates architecture diagrams programmatically using various Python libraries.
"""

# ============================================
# Option 1: Graphviz (Most Powerful)
# ============================================

"""
Install: pip install graphviz

Pros:
- Publication-quality diagrams
- Fine control over layout
- Export to PNG, SVG, PDF
- Used by many professional tools

Cons:
- Requires Graphviz software installation
"""

def create_graphviz_diagram():
    from graphviz import Digraph
    
    # Create diagram
    dot = Digraph(comment='CrisisVision Architecture')
    dot.attr(rankdir='TB', size='10,10')
    
    # Styling
    dot.attr('node', shape='box', style='rounded,filled', fillcolor='lightblue')
    
    # Nodes
    dot.node('user', '👤 User Input\nQuery + Location', fillcolor='#4F46E5', fontcolor='white')
    dot.node('ui', '🖥️ Next.js UI\nDemo Interface', fillcolor='#0EA5E9', fontcolor='white')
    dot.node('orch', '⚙️ Orchestrator\nFastAPI', fillcolor='#8B5CF6', fontcolor='white')
    
    # Agents
    with dot.subgraph(name='cluster_agents') as c:
        c.attr(label='🤖 MCP Agents', style='filled', color='lightgrey')
        c.node('weather', '🌤️ Weather\n:8001', fillcolor='#10B981', fontcolor='white')
        c.node('maps', '🗺️ Maps\n:8002', fillcolor='#10B981', fontcolor='white')
        c.node('news', '📰 News\n:8003', fillcolor='#10B981', fontcolor='white')
        c.node('social', '💬 Social\n:8004', fillcolor='#10B981', fontcolor='white')
        c.node('resource', '🏥 Resource\n:8005', fillcolor='#10B981', fontcolor='white')
    
    # LLM Stages
    dot.node('stage1', '🚀 Stage 1\nDecision Model\nllama-3.2-1b\n~1-2 sec', 
             fillcolor='#F59E0B', fontcolor='white')
    dot.node('decision', '🎯 Emergency?', shape='diamond', fillcolor='#EC4899', fontcolor='white')
    dot.node('stage2_false', '💚 Stage 2\nFalse Alarm\nllama-3.1-70b\n~3-6 sec', 
             fillcolor='#10B981', fontcolor='white')
    dot.node('stage2_emergency', '🚨 Stage 2\nEmergency\nllama-3.1-70b\n~5-10 sec', 
             fillcolor='#EF4444', fontcolor='white')
    dot.node('display', '📱 Display\nResult', fillcolor='#06B6D4', fontcolor='white')
    
    # Edges
    dot.edge('user', 'ui')
    dot.edge('ui', 'orch')
    dot.edge('orch', 'weather')
    dot.edge('orch', 'maps')
    dot.edge('orch', 'news')
    dot.edge('orch', 'social')
    dot.edge('orch', 'resource')
    
    dot.edge('weather', 'stage1')
    dot.edge('maps', 'stage1')
    dot.edge('news', 'stage1')
    dot.edge('social', 'stage1')
    dot.edge('resource', 'stage1')
    
    dot.edge('stage1', 'decision')
    dot.edge('decision', 'stage2_false', label='No')
    dot.edge('decision', 'stage2_emergency', label='Yes')
    dot.edge('stage2_false', 'display')
    dot.edge('stage2_emergency', 'display')
    
    # Render
    dot.render('architecture', format='png', cleanup=True)
    print("✅ Generated: architecture.png")
    
    return dot


# ============================================
# Option 2: Diagrams (Python Diagrams)
# ============================================

"""
Install: pip install diagrams

Pros:
- Cloud architecture focus
- Beautiful pre-made icons
- Automatic layout
- Great for AWS/Azure/GCP

Cons:
- Requires Graphviz
- Less customization
"""

def create_python_diagrams():
    from diagrams import Diagram, Cluster, Edge
    from diagrams.programming.framework import FastAPI, React
    from diagrams.onprem.client import User
    from diagrams.custom import Custom
    
    with Diagram("CrisisVision Architecture", show=False, direction="TB"):
        user = User("User")
        ui = React("Next.js UI")
        
        with Cluster("Backend"):
            orchestrator = FastAPI("Orchestrator")
            
            with Cluster("MCP Agents"):
                agents = [
                    Custom("Weather", "weather_icon.png"),
                    Custom("Maps", "maps_icon.png"),
                    Custom("News", "news_icon.png"),
                    Custom("Social", "social_icon.png"),
                    Custom("Resource", "resource_icon.png"),
                ]
        
        with Cluster("NVIDIA NIM"):
            stage1 = Custom("Stage 1\n1B Model", "llm_icon.png")
            stage2 = Custom("Stage 2\n70B Model", "llm_icon.png")
        
        user >> ui >> orchestrator
        orchestrator >> agents
        agents >> stage1 >> stage2 >> ui
    
    print("✅ Generated: crisisvision_architecture.png")


# ============================================
# Option 3: Matplotlib (Custom Drawing)
# ============================================

"""
Install: pip install matplotlib

Pros:
- Full control
- No external dependencies (besides matplotlib)
- Can add custom shapes/colors

Cons:
- More code required
- Manual positioning
"""

def create_matplotlib_diagram():
    import matplotlib.pyplot as plt
    import matplotlib.patches as mpatches
    from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
    
    fig, ax = plt.subplots(figsize=(12, 10))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 12)
    ax.axis('off')
    
    # Title
    ax.text(5, 11.5, 'CrisisVision Two-Stage Architecture', 
            ha='center', fontsize=20, fontweight='bold')
    
    # User
    user_box = FancyBboxPatch((4, 10), 2, 0.6, boxstyle="round,pad=0.1",
                              facecolor='#4F46E5', edgecolor='#312E81', linewidth=2)
    ax.add_patch(user_box)
    ax.text(5, 10.3, '👤 User Query', ha='center', va='center', 
            color='white', fontweight='bold')
    
    # UI
    ui_box = FancyBboxPatch((4, 8.8), 2, 0.6, boxstyle="round,pad=0.1",
                            facecolor='#0EA5E9', edgecolor='#0369A1', linewidth=2)
    ax.add_patch(ui_box)
    ax.text(5, 9.1, '🖥️ Next.js UI', ha='center', va='center', 
            color='white', fontweight='bold')
    
    # Orchestrator
    orch_box = FancyBboxPatch((4, 7.6), 2, 0.6, boxstyle="round,pad=0.1",
                              facecolor='#8B5CF6', edgecolor='#6D28D9', linewidth=2)
    ax.add_patch(orch_box)
    ax.text(5, 7.9, '⚙️ Orchestrator', ha='center', va='center', 
            color='white', fontweight='bold')
    
    # 5 Agents
    agents = ['🌤️ Weather', '🗺️ Maps', '📰 News', '💬 Social', '🏥 Resource']
    for i, agent in enumerate(agents):
        x = 1 + i * 1.8
        agent_box = FancyBboxPatch((x, 6), 1.5, 0.5, boxstyle="round,pad=0.1",
                                   facecolor='#10B981', edgecolor='#059669', linewidth=2)
        ax.add_patch(agent_box)
        ax.text(x + 0.75, 6.25, agent, ha='center', va='center', 
                color='white', fontsize=9, fontweight='bold')
    
    # Stage 1
    stage1_box = FancyBboxPatch((3.5, 4.8), 3, 0.8, boxstyle="round,pad=0.1",
                                facecolor='#F59E0B', edgecolor='#D97706', linewidth=3)
    ax.add_patch(stage1_box)
    ax.text(5, 5.35, '🚀 STAGE 1: Decision', ha='center', va='center', 
            color='white', fontsize=11, fontweight='bold')
    ax.text(5, 5.05, '1B Model (~1-2 sec)', ha='center', va='center', 
            color='white', fontsize=9)
    
    # Decision Diamond
    from matplotlib.patches import Polygon
    decision = Polygon([(5, 4.3), (5.5, 3.8), (5, 3.3), (4.5, 3.8)],
                      facecolor='#EC4899', edgecolor='#BE185D', linewidth=2)
    ax.add_patch(decision)
    ax.text(5, 3.8, '🎯', ha='center', va='center', fontsize=16)
    
    # Stage 2 - False Alarm
    false_box = FancyBboxPatch((1, 2), 3, 0.8, boxstyle="round,pad=0.1",
                               facecolor='#10B981', edgecolor='#059669', linewidth=3)
    ax.add_patch(false_box)
    ax.text(2.5, 2.55, '💚 STAGE 2: False Alarm', ha='center', va='center', 
            color='white', fontsize=10, fontweight='bold')
    ax.text(2.5, 2.25, '70B Model (~3-6 sec)', ha='center', va='center', 
            color='white', fontsize=8)
    
    # Stage 2 - Emergency
    emergency_box = FancyBboxPatch((6, 2), 3, 0.8, boxstyle="round,pad=0.1",
                                   facecolor='#EF4444', edgecolor='#DC2626', linewidth=3)
    ax.add_patch(emergency_box)
    ax.text(7.5, 2.55, '🚨 STAGE 2: Emergency', ha='center', va='center', 
            color='white', fontsize=10, fontweight='bold')
    ax.text(7.5, 2.25, '70B Model (~5-10 sec)', ha='center', va='center', 
            color='white', fontsize=8)
    
    # Display
    display_box = FancyBboxPatch((4, 0.5), 2, 0.6, boxstyle="round,pad=0.1",
                                 facecolor='#06B6D4', edgecolor='#0891B2', linewidth=2)
    ax.add_patch(display_box)
    ax.text(5, 0.8, '📱 Display Result', ha='center', va='center', 
            color='white', fontweight='bold')
    
    # Arrows
    def add_arrow(x1, y1, x2, y2, color='black'):
        arrow = FancyArrowPatch((x1, y1), (x2, y2),
                               arrowstyle='->', mutation_scale=20,
                               color=color, linewidth=2)
        ax.add_patch(arrow)
    
    add_arrow(5, 10, 5, 9.4)  # User to UI
    add_arrow(5, 8.8, 5, 8.2)  # UI to Orch
    add_arrow(5, 7.6, 5, 6.5)  # Orch to Agents
    add_arrow(5, 6, 5, 5.6)  # Agents to Stage 1
    add_arrow(5, 4.8, 5, 4.3)  # Stage 1 to Decision
    add_arrow(4.7, 3.5, 3, 2.8, color='green')  # Decision to False
    add_arrow(5.3, 3.5, 7, 2.8, color='red')  # Decision to Emergency
    add_arrow(2.5, 2, 3.5, 1.1, color='green')  # False to Display
    add_arrow(7.5, 2, 6.5, 1.1, color='red')  # Emergency to Display
    
    plt.tight_layout()
    plt.savefig('architecture_matplotlib.png', dpi=300, bbox_inches='tight')
    print("✅ Generated: architecture_matplotlib.png")


# ============================================
# Option 4: PlantUML (Text-based)
# ============================================

"""
Install: pip install plantuml

Pros:
- Text-based (like Mermaid)
- Very powerful
- Great for UML diagrams

Cons:
- Requires Java
- Steeper learning curve
"""

def create_plantuml_diagram():
    plantuml_code = """
    @startuml
    !define RECTANGLE class
    
    skinparam backgroundColor #FFFFFF
    skinparam rectangleBackgroundColor #0EA5E9
    skinparam rectangleBorderColor #0369A1
    
    rectangle "👤 User Input" as User #4F46E5
    rectangle "🖥️ Next.js UI" as UI #0EA5E9
    rectangle "⚙️ Orchestrator" as Orch #8B5CF6
    
    package "🤖 MCP Agents" #10B981 {
        rectangle "🌤️ Weather" as W
        rectangle "🗺️ Maps" as M
        rectangle "📰 News" as N
        rectangle "💬 Social" as S
        rectangle "🏥 Resource" as R
    }
    
    rectangle "🚀 Stage 1\\nDecision Model\\n1B (~1-2s)" as Stage1 #F59E0B
    
    diamond "Emergency?" as Decision #EC4899
    
    rectangle "💚 Stage 2\\nFalse Alarm\\n70B (~3-6s)" as False #10B981
    rectangle "🚨 Stage 2\\nEmergency\\n70B (~5-10s)" as Emergency #EF4444
    
    rectangle "📱 Display" as Display #06B6D4
    
    User --> UI
    UI --> Orch
    Orch --> W
    Orch --> M
    Orch --> N
    Orch --> S
    Orch --> R
    
    W --> Stage1
    M --> Stage1
    N --> Stage1
    S --> Stage1
    R --> Stage1
    
    Stage1 --> Decision
    Decision --> False : No
    Decision --> Emergency : Yes
    False --> Display
    Emergency --> Display
    
    @enduml
    """
    
    with open('architecture.puml', 'w') as f:
        f.write(plantuml_code)
    
    print("✅ Generated: architecture.puml")
    print("   Convert to PNG: java -jar plantuml.jar architecture.puml")


# ============================================
# MAIN
# ============================================

if __name__ == "__main__":
    print("🎨 CrisisVision Architecture Diagram Generator\n")
    
    print("Choose your tool:")
    print("1. Graphviz (Publication-quality)")
    print("2. Python Diagrams (Cloud-focused)")
    print("3. Matplotlib (Custom drawing)")
    print("4. PlantUML (Text-based)")
    print("5. Generate all\n")
    
    choice = input("Enter choice (1-5): ")
    
    if choice == '1' or choice == '5':
        try:
            create_graphviz_diagram()
        except Exception as e:
            print(f"❌ Graphviz error: {e}")
            print("   Install: pip install graphviz")
    
    if choice == '2' or choice == '5':
        try:
            create_python_diagrams()
        except Exception as e:
            print(f"❌ Python Diagrams error: {e}")
            print("   Install: pip install diagrams")
    
    if choice == '3' or choice == '5':
        try:
            create_matplotlib_diagram()
        except Exception as e:
            print(f"❌ Matplotlib error: {e}")
            print("   Install: pip install matplotlib")
    
    if choice == '4' or choice == '5':
        create_plantuml_diagram()
    
    print("\n✅ Done! Check your directory for generated diagrams.")
