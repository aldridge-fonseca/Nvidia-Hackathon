'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface EmergencyMapProps {
  lat: number;
  lng: number;
  zoom: number;
  markerTitle: string;
  routeCoords?: Array<{ lat: number; lng: number }>;
  dangerZone?: { lat: number; lng: number; radius: number };
}

export default function EmergencyMap({ 
  lat, 
  lng, 
  zoom, 
  markerTitle, 
  routeCoords,
  dangerZone 
}: EmergencyMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    // Load Leaflet CSS dynamically
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    // Initialize map only once
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([lat, lng], zoom);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    // Clear existing layers except the tile layer
    mapRef.current.eachLayer((layer: L.Layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline || layer instanceof L.Circle) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add danger zone (fire location)
    if (dangerZone) {
      // Main fire center - LARGE rectangle
      const fireCenter = [
        [dangerZone.lat - 0.0004, dangerZone.lng - 0.0006],
        [dangerZone.lat + 0.0004, dangerZone.lng + 0.0002],
      ];
      
      L.rectangle(fireCenter as any, {
        color: '#dc2626',
        fillColor: '#ef4444',
        fillOpacity: 0.5,
        weight: 4,
      }).addTo(mapRef.current).bindPopup('<strong>🔥 PRIMARY FIRE</strong><br/>Building Fire - EXTREME DANGER<br/>Temperature: 1200°F');

      // Multiple fire spread rectangles in vicinity - 6 major areas
      const fireRectangles = [
        // West side - large fire
        { 
          bounds: [[dangerZone.lat - 0.0003, dangerZone.lng - 0.0012], [dangerZone.lat + 0.0003, dangerZone.lng - 0.0007]], 
          label: 'West Building Fire', 
          intensity: 'CRITICAL',
          temp: '1100°F'
        },
        // Northwest - medium fire
        { 
          bounds: [[dangerZone.lat + 0.0005, dangerZone.lng - 0.0009], [dangerZone.lat + 0.0009, dangerZone.lng - 0.0005]], 
          label: 'NW Structure Fire', 
          intensity: 'HIGH',
          temp: '950°F'
        },
        // North side
        { 
          bounds: [[dangerZone.lat + 0.0007, dangerZone.lng - 0.0002], [dangerZone.lat + 0.0010, dangerZone.lng + 0.0003]], 
          label: 'North Wing Fire', 
          intensity: 'HIGH',
          temp: '1000°F'
        },
        // Southwest - smaller fire
        { 
          bounds: [[dangerZone.lat - 0.0008, dangerZone.lng - 0.0008], [dangerZone.lat - 0.0005, dangerZone.lng - 0.0004]], 
          label: 'SW Spot Fire', 
          intensity: 'MODERATE',
          temp: '800°F'
        },
        // South - spreading fire
        { 
          bounds: [[dangerZone.lat - 0.0010, dangerZone.lng - 0.0002], [dangerZone.lat - 0.0006, dangerZone.lng + 0.0003]], 
          label: 'South Ground Fire', 
          intensity: 'MODERATE',
          temp: '750°F'
        },
        // Northeast corner
        { 
          bounds: [[dangerZone.lat + 0.0004, dangerZone.lng + 0.0004], [dangerZone.lat + 0.0007, dangerZone.lng + 0.0008]], 
          label: 'NE Hot Spot', 
          intensity: 'LOW',
          temp: '650°F'
        },
      ];

      // Add smoke haze circle (keep this as circle for smoke effect)
      L.circle([dangerZone.lat, dangerZone.lng], {
        color: '#78716c',
        fillColor: '#57534e',
        fillOpacity: 0.12,
        radius: 250,
        weight: 1,
        dashArray: '3, 6',
      }).addTo(mapRef.current).bindPopup('<strong>💨 SMOKE ZONE</strong><br/>Heavy smoke coverage<br/>Visibility < 50ft');

      fireRectangles.forEach((fire) => {
        if (!mapRef.current) return;
        
        const color = fire.intensity === 'CRITICAL' ? '#dc2626' : 
                     fire.intensity === 'HIGH' ? '#f97316' : 
                     fire.intensity === 'MODERATE' ? '#fb923c' : '#fdba74';
        
        const opacity = fire.intensity === 'CRITICAL' ? 0.45 : 
                       fire.intensity === 'HIGH' ? 0.4 : 
                       fire.intensity === 'MODERATE' ? 0.35 : 0.25;

        L.rectangle(fire.bounds as any, {
          color: color,
          fillColor: color,
          fillOpacity: opacity,
          weight: 3,
          dashArray: fire.intensity === 'CRITICAL' ? '10, 5' : '8, 4',
        }).addTo(mapRef.current).bindPopup(`<strong>🔥 ${fire.label}</strong><br/>Intensity: ${fire.intensity}<br/>Temp: ${fire.temp}<br/>Spreading rapidly`);

        // Add flame icons for high intensity areas
        if (fire.intensity === 'CRITICAL' || fire.intensity === 'HIGH') {
          const centerLat = (fire.bounds[0][0] + fire.bounds[1][0]) / 2;
          const centerLng = (fire.bounds[0][1] + fire.bounds[1][1]) / 2;
          
          const flameIcon = L.divIcon({
            className: 'flame-marker',
            html: `
              <div style="
                font-size: 24px;
                animation: flameFlicker 1.5s infinite;
                filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.9));
              ">🔥</div>
              <style>
                @keyframes flameFlicker {
                  0%, 100% { opacity: 1; transform: scale(1); }
                  25% { opacity: 0.8; transform: scale(1.15); }
                  50% { opacity: 0.9; transform: scale(0.9); }
                  75% { opacity: 0.85; transform: scale(1.1); }
                }
              </style>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });
          L.marker([centerLat, centerLng], { icon: flameIcon }).addTo(mapRef.current);
        }
      });

      // Add wind direction indicator
      const windIcon = L.divIcon({
        className: 'wind-marker',
        html: `
          <div style="
            background: rgba(59, 130, 246, 0.2);
            border: 2px solid #3b82f6;
            border-radius: 8px;
            padding: 4px 8px;
            font-size: 11px;
            color: white;
            font-weight: bold;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          ">💨 Wind 12mph W→E</div>
        `,
        iconSize: [100, 30],
        iconAnchor: [50, 15],
      });
      L.marker([dangerZone.lat + 0.0012, dangerZone.lng], { icon: windIcon }).addTo(mapRef.current);
    }

    // Add route polyline with gradient effect
    if (routeCoords && routeCoords.length > 0) {
      // Main evacuation route - thick and prominent
      L.polyline(
        routeCoords.map(coord => [coord.lat, coord.lng]),
        {
          color: '#76B900',
          weight: 6,
          opacity: 0.95,
          dashArray: '12, 8',
          lineJoin: 'round',
          lineCap: 'round',
        }
      ).addTo(mapRef.current).bindPopup('<strong>🛣️ EVACUATION ROUTE</strong><br/>Safe path to shelter<br/>Distance: 520m<br/>Est. Time: 5.5min');

      // Add safety buffer zone around route
      L.polyline(
        routeCoords.map(coord => [coord.lat, coord.lng]),
        {
          color: '#86efac',
          weight: 12,
          opacity: 0.2,
        }
      ).addTo(mapRef.current);

      // Add directional arrows and distance markers along route
      for (let i = 0; i < routeCoords.length - 1; i++) {
        const midLat = (routeCoords[i].lat + routeCoords[i + 1].lat) / 2;
        const midLng = (routeCoords[i].lng + routeCoords[i + 1].lng) / 2;
        
        // Direction arrows
        const arrowIcon = L.divIcon({
          className: 'arrow-marker',
          html: `
            <div style="
              background: linear-gradient(135deg, #76B900 0%, #5F9400 100%);
              border: 3px solid white;
              border-radius: 50%;
              width: 28px;
              height: 28px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              font-weight: bold;
              box-shadow: 0 3px 8px rgba(118, 185, 0, 0.5);
              animation: arrowBounce 2s infinite;
            ">➜</div>
            <style>
              @keyframes arrowBounce {
                0%, 100% { transform: translateX(0); }
                50% { transform: translateX(3px); }
              }
            </style>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        L.marker([midLat, midLng], { icon: arrowIcon })
          .addTo(mapRef.current)
          .bindPopup(`<strong>Checkpoint ${i + 1}</strong><br/>Keep moving forward`);
      }

      // Add waypoint markers at each step
      routeCoords.forEach((coord, index) => {
        if (index === 0 || index === routeCoords.length - 1) return; // Skip start and end
        
        const waypointIcon = L.divIcon({
          className: 'waypoint-marker',
          html: `
            <div style="
              background: white;
              border: 3px solid #76B900;
              border-radius: 50%;
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              font-weight: bold;
              color: #76B900;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">${index}</div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        if (!mapRef.current) return;
        L.marker([coord.lat, coord.lng], { icon: waypointIcon })
          .addTo(mapRef.current)
          .bindPopup(`<strong>Waypoint ${index}</strong><br/>Continue on evacuation route`);
      });

      // Add multiple safety shelter icons and safe zones
      const lastCoord = routeCoords[routeCoords.length - 1];
      
      // Safe zone circle around shelter
      L.circle([lastCoord.lat, lastCoord.lng], {
        color: '#22c55e',
        fillColor: '#86efac',
        fillOpacity: 0.25,
        radius: 80,
        weight: 3,
      }).addTo(mapRef.current).bindPopup('<strong>🛡️ SAFE ZONE</strong><br/>Protected area<br/>No fire risk');

      // Main shelter icon
      const shelterIcon = L.divIcon({
        className: 'shelter-marker',
        html: `
          <div style="
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            border: 4px solid white;
            border-radius: 16px;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            box-shadow: 0 6px 20px rgba(34, 197, 94, 0.6);
            animation: shelterPulse 2s infinite;
          ">🛡️</div>
          <style>
            @keyframes shelterPulse {
              0%, 100% { transform: scale(1); box-shadow: 0 6px 20px rgba(34, 197, 94, 0.6); }
              50% { transform: scale(1.15); box-shadow: 0 8px 30px rgba(34, 197, 94, 0.9); }
            }
          </style>
        `,
        iconSize: [50, 50],
        iconAnchor: [25, 50],
      });

      L.marker([lastCoord.lat, lastCoord.lng], { icon: shelterIcon })
        .addTo(mapRef.current)
        .bindPopup('<strong>🛡️ EMERGENCY SHELTER</strong><br/>CRC Building - SAFE<br/>⚕️ Medical assistance available<br/>👮 Safety officers present<br/>✅ All-clear zone');

      // Add emergency service icons near shelter
      const emergencyIcons = [
        { lat: lastCoord.lat + 0.0002, lng: lastCoord.lng - 0.0002, icon: '🚒', label: 'Fire Trucks' },
        { lat: lastCoord.lat + 0.0002, lng: lastCoord.lng + 0.0002, icon: '🚑', label: 'Medical' },
        { lat: lastCoord.lat - 0.0002, lng: lastCoord.lng, icon: '👮', label: 'Police' },
      ];

      emergencyIcons.forEach((service) => {
        const serviceIcon = L.divIcon({
          className: 'service-marker',
          html: `
            <div style="
              background: white;
              border: 2px solid #22c55e;
              border-radius: 8px;
              padding: 4px 6px;
              font-size: 18px;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            ">${service.icon}</div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        if (!mapRef.current) return;
        L.marker([service.lat, service.lng], { icon: serviceIcon })
          .addTo(mapRef.current)
          .bindPopup(`<strong>${service.label}</strong><br/>Emergency services on site`);
      });
    }

    // Add current location marker
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background: #76B900;
          border: 3px solid white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          animation: pulse 2s infinite;
        "></div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    L.marker([lat, lng], { icon: customIcon })
      .addTo(mapRef.current)
      .bindPopup(`<strong>${markerTitle}</strong><br/>Current Location`);

    // Update map view
    mapRef.current.setView([lat, lng], zoom);

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, zoom, markerTitle, routeCoords, dangerZone]);

  return (
    <>
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
        }
      `}</style>
      <div 
        ref={mapContainerRef} 
        className="w-full h-full rounded-lg"
        style={{ minHeight: '300px' }}
      />
    </>
  );
}
