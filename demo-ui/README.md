# CrisisVision Demo UI# CrisisVision Demo UI



Interactive frontend for the CrisisVision emergency response system.Interactive frontend for the CrisisVision emergency response system.



## OverviewAn impressive, interactive web application that visualizes how your multi-agent AI system orchestrates emergency response using real-time data from weather, maps, news, social media, and knowledge bases.



Web application that visualizes multi-agent AI coordination for emergency response. The system analyzes data from weather, maps, news, social media, and knowledge bases to determine false alarms from real emergencies and provide appropriate guidance.![NVIDIA Branding](https://img.shields.io/badge/NVIDIA-76B900?style=for-the-badge&logo=nvidia&logoColor=white)

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)

## Features![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

### Two Interactive Scenarios
```markdown
# CrisisVision Demo UI

Interactive frontend for the CrisisVision emergency response system. It visualizes multi-agent AI coordination using real-time data from weather, maps, news, social, and emergency resources.

![NVIDIA](https://img.shields.io/badge/NVIDIA-76B900?style=for-the-badge&logo=nvidia&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## Features

- Two scenario flows: False Alarm (CALM) and Real Emergency (URGENT)
- Animated agent execution (Weather, Maps, News, Social, Resource)
- NVIDIA green theme and polished UX
- Optional backend integration for live analysis

## Quick start

Development
```bash
cd demo-ui
npm install
npm run dev
```

Production build
```bash
cd demo-ui
npm install
npm run build
npm start
```

Docker
```bash
# CrisisVision Demo UI

Interactive frontend for the CrisisVision emergency response system. It visualizes multi-agent AI coordination using real-time data from weather, maps, news, social, and emergency resources.

![NVIDIA](https://img.shields.io/badge/NVIDIA-76B900?style=for-the-badge&logo=nvidia&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## Features

- Two scenario flows: False Alarm (CALM) and Real Emergency (URGENT)
- Animated agent execution (Weather, Maps, News, Social, Resource)
- NVIDIA green theme and polished UX
- Optional backend integration for live analysis

## Quick start

Development

```bash
cd demo-ui
npm install
npm run dev
```

Production build

```bash
cd demo-ui
npm install
npm run build
npm start
```

Docker

```bash
cd demo-ui
docker build -t crisisvision-demo .
docker run -p 3000:3000 crisisvision-demo
```

Visit <http://localhost:3000>

## Backend integration (optional)

To connect to the backend orchestrator, create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

The analyze page will call `${NEXT_PUBLIC_API_URL}/analyze` if set, otherwise it defaults to `http://localhost:8000`.

## Project structure

```text
demo-ui/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   ├── analyze/page.tsx    # Live analysis view (uses backend)
│   ├── components/
│   │   └── EmergencyMap.tsx
│   └── scenario/
│       ├── false-alarm/
│       │   ├── page.tsx
│       │   └── page-v2.tsx
│       └── real-emergency/
│           ├── page.tsx
│           ├── page-v2.tsx
│           ├── page-old.tsx
│           └── page-backup.tsx
├── Dockerfile
├── package.json
├── tailwind.config.js
└── next.config.js
```

## Color palette

- NVIDIA Green: `#76B900`
- Dark Green: `#5F9400`
- Black: `#000000`
- Gray: `#1A1A1A`
- Light Gray: `#2D2D2D`

## License

MIT License — see root `LICENSE`.

