/**
 * BikeMap Component
 * Displays bike location on a small map
 */

import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Bike, BikeTelemetry } from '@trungthao/admin_dashboard_dto';

const MAPBOX_TOKEN = (import.meta as any).env.VITE_MAPBOX_TOKEN || '';

interface BikeMapProps {
  bike: Bike;
  telemetry: BikeTelemetry[];
  onMapClick: () => void;
}

function BikeMap({ bike, telemetry, onMapClick }: BikeMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || !MAPBOX_TOKEN || !bike || !telemetry.length) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const latestTelemetry = telemetry[0];
    const bikeLocation: [number, number] = [latestTelemetry.longitude, latestTelemetry.latitude];

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: bikeLocation,
      zoom: 14,
    });

    const el = document.createElement('div');
    el.style.width = '16px';
    el.style.height = '16px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = (bike.battery_status || 0) > 20 ? '#4CAF50' : '#F44336';
    el.style.border = '3px solid white';
    el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.4)';

    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat(bikeLocation)
      .setPopup(
        new mapboxgl.Popup({ offset: 15 }).setHTML(
          `<strong>${bike.name}</strong><br/>Battery: ${bike.battery_status || 0}%`
        )
      )
      .addTo(map);

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      marker.remove();
      map.remove();
    };
  }, [bike, telemetry]);

  return (
    <div 
      className="map-container" 
      onClick={onMapClick}
      style={{ cursor: 'pointer' }}
      title="Click to view full map"
    >
      <div ref={mapContainerRef} className="trip-map" />
    </div>
  );
}

export default BikeMap;
