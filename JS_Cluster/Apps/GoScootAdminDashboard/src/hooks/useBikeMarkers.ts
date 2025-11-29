

import { useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { BikeUpdate } from '@trungthao/admin_dashboard_dto';

export function useBikeMarkers(onBikeClick: (bike: BikeUpdate) => void) {
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const bikeDataRef = useRef<Map<string, BikeUpdate>>(new Map());

  const createMarkerElement = (bike: BikeUpdate) => {
    // Container for marker and label
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.cursor = 'pointer';

    // Bike dot marker
    const dot = document.createElement('div');
    dot.className = 'bike-dot-marker';
    dot.style.width = '12px';
    dot.style.height = '12px';
    dot.style.borderRadius = '50%';
    dot.style.backgroundColor = bike.battery_status > 20 ? '#4CAF50' : '#F44336';
    dot.style.border = '2px solid white';
    dot.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
    dot.style.transition = 'all 0.3s ease';

    // Bike ID label
    const label = document.createElement('div');
    label.className = 'bike-id-label';
    label.textContent = bike.id;
    label.style.fontSize = '10px';
    label.style.fontWeight = 'bold';
    label.style.color = '#333';
    label.style.backgroundColor = 'white';
    label.style.padding = '2px 6px';
    label.style.borderRadius = '4px';
    label.style.marginTop = '4px';
    label.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
    label.style.whiteSpace = 'nowrap';
    label.style.pointerEvents = 'none';

    container.appendChild(dot);
    container.appendChild(label);

    container.addEventListener('mouseenter', () => {
      dot.style.boxShadow = '0 4px 8px rgba(0,0,0,0.5)';
      dot.style.borderWidth = '3px';
    });
    container.addEventListener('mouseleave', () => {
      dot.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      dot.style.borderWidth = '2px';
    });
    container.addEventListener('click', () => {
      onBikeClick(bike);
    });

    return container;
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
        // Remove the old marker completely
        existingMarker.remove();
        
        // Create a new marker with updated data
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
  }, [onBikeClick]);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current.clear();
  }, []);

  return { updateMarkers, clearMarkers };
}
