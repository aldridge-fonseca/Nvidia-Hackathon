# CrisisVision Demo UI# CrisisVision Demo UI



Interactive frontend for the CrisisVision emergency response system.Interactive frontend for the CrisisVision emergency response system.



## OverviewAn impressive, interactive web application that visualizes how your multi-agent AI system orchestrates emergency response using real-time data from weather, maps, news, social media, and knowledge bases.



Web application that visualizes multi-agent AI coordination for emergency response. The system analyzes data from weather, maps, news, social media, and knowledge bases to determine false alarms from real emergencies and provide appropriate guidance.![NVIDIA Branding](https://img.shields.io/badge/NVIDIA-76B900?style=for-the-badge&logo=nvidia&logoColor=white)

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)

## Features![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

### Two Interactive Scenarios

## ✨ Features

**Scenario 1: False Alarm**

- User reports seeing smoke at campus### 🎯 Two Interactive Scenarios

- AI analyzes 6 data sources

- Determines it's a permitted BBQ event#### Scenario 1: False Alarm (CALM Response)

- Provides calm, reassuring response- User reports seeing smoke at campus

- AI analyzes 6 data sources

**Scenario 2: Real Emergency**- Determines it's a permitted BBQ event

- Active wildfire threatening campus- Provides calm, reassuring response

- AI coordinates comprehensive evacuation- **Perfect for showing AI judgment and reassurance**

- Step-by-step safety instructions

- Routes, shelters, and emergency contacts#### Scenario 2: Real Emergency (URGENT Response)

- Active wildfire threatening campus

### UI Components- AI coordinates comprehensive evacuation

- Step-by-step safety instructions

- NVIDIA green theme (`#76B900`)- Routes, shelters, and emergency contacts

- Animated components with smooth transitions- **Perfect for showing AI crisis management**

- Real-time agent visualization

- Responsive design for all devices### 🎨 Beautiful UI Design

- Dark theme interface

- ✅ **NVIDIA Green Theme** - Professional branding (`#76B900`)

### AI Pipeline Visualization- ✅ **Animated Components** - Smooth transitions with Framer Motion

- ✅ **Real-time Visualization** - Watch each AI agent execute

1. Router Agent - Plans data collection strategy- ✅ **Responsive Design** - Works on all devices

2. 6 MCP Agents - Execute in parallel (Weather, Maps, News, Social, Resource, RAG)- ✅ **Dark Theme** - Easy on the eyes, professional look

3. Evaluator Agent - Determines severity (CALM vs URGENT)

4. Synthesizer Agent - Generates final response plan### 🤖 AI Pipeline Visualization

5. Thought Process - Expandable AI reasoning

Watch the complete AI orchestration:

## Quick Start1. **Router Agent** - Plans data collection strategy

2. **6 MCP Agents** - Execute in parallel (Weather, Maps, News, Social, Resource, RAG)

### Development Mode3. **Evaluator Agent** - Determines severity (CALM vs URGENT)

4. **Synthesizer Agent** - Generates final response plan

```bash5. **Thought Process** - Expandable AI reasoning

cd demo-ui

npm install## 🚀 Quick Start

npm run dev

```### Option 1: Docker (Recommended)



Visit http://localhost:3000```bash

# From repository root

### Production Builddocker-compose up demo-ui



```bash# Visit http://localhost:3000

cd demo-ui```

npm install

npm run build### Option 2: Development Mode

npm start

``````bash

cd demo-ui

### Docker Deploymentnpm install

npm run dev

```bash

docker build -t crisisvision-demo .# Visit http://localhost:3000

docker run -p 3000:3000 crisisvision-demo```

```

### Option 3: Production Build

## Technology Stack

```bash

- Next.js 14 with App Routercd demo-ui

- TypeScriptnpm install

- Tailwind CSS with custom NVIDIA colorsnpm run build

- Framer Motion for animationsnpm start

- Lucide React for icons

- Docker containerization# Visit http://localhost:3000

```

## Project Structure

## 📋 Technology Stack

```

demo-ui/- **Next.js 14** - React framework with App Router

├── app/- **TypeScript** - Type-safe development

│   ├── layout.tsx          # Root layout- **Tailwind CSS** - Utility-first styling with custom NVIDIA colors

│   ├── page.tsx            # Landing page- **Framer Motion** - Smooth animations and transitions

│   ├── globals.css         # Global styles- **Lucide React** - Beautiful, consistent icon library

│   └── scenario/- **Docker** - Production-ready containerization

│       ├── false-alarm/

│       │   └── page.tsx    # False alarm flow## Getting Started

│       └── real-emergency/

│           └── page.tsx    # Emergency flow### Development Mode

├── Dockerfile

├── package.json```bash

├── tailwind.config.js# Install dependencies

└── next.config.jsnpm install

```

# Run development server

## Scenariosnpm run dev

```

### False Alarm

**URL**: `/scenario/false-alarm`Open [http://localhost:3000](http://localhost:3000) to view the demo.



User reports smoke and worried people at campus. System analyzes data and determines it's a permitted BBQ event.### Docker Deployment



**Response**:```bash

- CALM severity assessment# Build the image

- Green success indicatorsdocker build -t crisisvision-demo .

- Detailed data from all 6 agents

- Reassuring, friendly tone# Run the container

docker run -p 3000:3000 crisisvision-demo

### Real Emergency```

**URL**: `/scenario/real-emergency`

## Scenarios

Active wildfire threatens campus from multiple directions. System orchestrates comprehensive evacuation plan.

### Scenario 1: False Alarm

**Response**:**URL**: `/scenario/false-alarm`

- URGENT severity assessment

- Red alert indicatorsUser reports seeing smoke and worried people at SCU library. The AI system analyzes data from 6 sources and determines it's a permitted BBQ event, providing reassurance.

- Detailed evacuation routes

- Shelter locations and contacts**Features**:

- Authoritative, direct guidance- ✅ CALM severity assessment

- 🟢 Green success indicators

## Color Palette- 📋 Detailed data from all 6 MCP agents

- 💚 Reassuring, friendly response

- NVIDIA Green: `#76B900`

- Dark Green: `#5F9400`### Scenario 2: Real Emergency

- Black: `#000000`**URL**: `/scenario/real-emergency`

- Gray: `#1A1A1A`

- Light Gray: `#2D2D2D`Active wildfire threatens SCU campus from three sides. The AI orchestrates a comprehensive evacuation plan with step-by-step guidance.



## Development**Features**:

- 🚨 URGENT severity assessment

### Environment Variables- 🔴 Red alert indicators

- 🗺️ Detailed evacuation routes

No environment variables required for standalone demo mode. To connect to backend API:- 📍 Shelter locations and contacts

- ⚡ Authoritative, direct guidance

```bash

# Create .env.local## UI Highlights

NEXT_PUBLIC_API_URL=http://localhost:8000

```- **NVIDIA Green Theme**: `#76B900` primary color throughout

- **Animated MCP Cards**: Each agent (Weather, Maps, News, Social, Resource, RAG) has its own card with loading states

### Available Scripts- **Expandable Thought Process**: View AI's reasoning step-by-step

- **Responsive Design**: Works on all screen sizes

```bash- **Smooth Transitions**: Framer Motion animations throughout

npm run dev      # Start development server

npm run build    # Build for production## Project Structure

npm start        # Start production server

npm run lint     # Run ESLint```

```demo-ui/

├── app/

## License│   ├── layout.tsx          # Root layout with metadata

│   ├── page.tsx            # Landing page with scenario selection

MIT License - See LICENSE file for details│   ├── globals.css         # Global styles

│   └── scenario/
│       ├── false-alarm/
│       │   └── page.tsx    # False alarm scenario
│       └── real-emergency/
│           └── page.tsx    # Real emergency scenario
├── Dockerfile              # Production build
├── package.json
├── tailwind.config.js
└── next.config.js
```

## Color Palette

- **NVIDIA Green**: `#76B900`
- **Dark Green**: `#5F9400`
- **Black**: `#000000`
- **Gray**: `#1A1A1A`
- **Light Gray**: `#2D2D2D`

## LinkedIn Demo Ready

This UI is designed specifically for LinkedIn demonstrations:
- Professional NVIDIA branding
- Clear value proposition
- Interactive and engaging
- Shows technical sophistication
- Easy to understand flow

## License

Private demo for NVIDIA CrisisVision project.
