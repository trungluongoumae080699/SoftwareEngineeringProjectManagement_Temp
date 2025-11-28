/**
 * useBikeMarkers Hook
 * Manages bike markers on the map
 */

import { useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { BikeUpdate } from '@trungthao/admin_dashboard_dto';

export function useBikeMarkers(onNavigate: (page: string, bikeLocation?: [number, number]) => void) {
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const bikeDataRef = useRef<Map<string, BikeUpdate>>(new Map());

  const createMarkerElement = (bike: BikeUpdate) => {
    const el = document.createElement('div');
    el.className = 'bike-dot-marker';
    el.style.width = '12px';
    el.style.height = '12px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = bike.battery_status > 20 ? '#4CAF50' : '#F44336';
    el.style.border = '2px solid white';
    el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
    el.style.cursor = 'pointer';
    el.style.transition = 'all 0.3s ease';

    el.addEventListener('mouseenter', () => {
      el.style.transform = 'scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'scale(1)';
    });
    el.addEventListener('click', () => {
      onNavigate('bike-detail', [bike.longitude, bike.latitude]);
    });

    return el;
  };

  const updateMarkers = useCallback((bikes: BikeUpdate[], map: mapboxgl.Map) => {
    // Store bike data
    bikes.forEach(bike => {
      bikeDataRef.current.set(bike.id, bike);
    });

    const bounds = map.getBounds();
    
    // Filter bikes in viewport
    const bikesInViewport: BikeUpdate[] = [];
    bikeDataRef.current.forEach(bike => {
      const inViewport = 
        bike.longitude >= bounds.getWest() &&
        bike.longitude <= bounds.getEast() &&
        bike.latitude >= bounds.getSouth() &&
        bike.latitude <= bounds.getNorth();
      
      if (inViewport) {
        bikesInViewport.push(bike);
      }
    });

    // Remove markers not in viewport
    markersRef.current.forEach((marker, bikeId) => {
      const bike = bikeDataRef.current.get(bikeId);
      if (!bike) return;
      
      const inViewport = 
        bike.longitude >= bounds.getWest() &&
        bike.longitude <= bounds.getEast() &&
        bike.latitude >= bounds.getSouth() &&
        bike.latitude <= bounds.getNorth();
      
      if (!inViewport) {
        marker.remove();
        markersRef.current.delete(bikeId);
      }
    });

    // Add or update markers in viewport
    bikesInViewport.forEach((bike) => {
      const existingMarker = markersRef.current.get(bike.id);

      if (existingMarker) {
        existingMarker.setLngLat([bike.longitude, bike.latitude]);
      } else {
        const el = createMarkerElement(bike);
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([bike.longitude, bike.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 15 }).setHTML(
              `<strong>Bike ${bike.id}</strong><br/>Battery: ${bike.battery_status}%`
            )
          )
          .addTo(map);

        markersRef.current.set(bike.id, marker);
      }
    });

    return {
      totalCount: bikeDataRef.current.size,
      visibleCount: markersRef.current.size
    };
  }, [onNavigate]);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current.clear();
  }, []);

  return { updateMarkers, clearMarkers };
}
