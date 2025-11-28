import { useState, useRef, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { Bike, Trip, BikeTelemetry, BikeStatus, BikeUpdate } from '@trungthao/admin_dashboard_dto';
import { bikeApi, tripApi } from './services/apiClient';
import { useWebSocket } from './hooks/useWebSocket';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BikeInfoCard from './components/bikeDetails/BikeInfoCard';
import TripsTable from './components/bikeDetails/TripsTable';
import TelemetryTable from './components/bikeDetails/TelemetryTable';
import BikeMap from './components/bikeDetails/BikeMap';
import './BikeDetails.css';

const DEFAULT_BIKE_ID = 'bike-vin-123456';

/** Props for BikeDetails component */
interface BikeDetailsProps {
  /** Callback to navigate to other pages, optionally with bike location */
  onNavigate: (page: string, bikeLocation?: [number, number]) => void;
  /** Optional bike ID to display */
  bikeId?: string;
}

/**
 * BikeDetails component
 * Fetches and displays bike data from server
 */
function BikeDetails({ onNavigate, bikeId = DEFAULT_BIKE_ID }: BikeDetailsProps) {
  // Bike data state
  const [bike, setBike] = useState<Bike | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [telemetry, setTelemetry] = useState<BikeTelemetry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  // WebSocket for real-time updates
  const handleBikeUpdate = useCallback((bikes: BikeUpdate[]) => {
    // Find updates for this specific bike
    const bikeUpdate = bikes.find(b => b.id === bikeId);
    if (!bikeUpdate) return;

    console.log(`🔄 Real-time update for bike ${bikeId}:`, bikeUpdate);

    // Update bike battery status in real-time
    if (bike) {
      setBike(prev => prev ? {
        ...prev,
        battery_status: bikeUpdate.battery_status
      } : null);
    }

    // Update marker position on map
    if (markerRef.current && mapRef.current) {
      const newPosition: [number, number] = [bikeUpdate.longitude, bikeUpdate.latitude];
      markerRef.current.setLngLat(newPosition);

      // Update marker color based on battery
      const markerElement = markerRef.current.getElement();
      if (markerElement) {
        markerElement.style.backgroundColor = bikeUpdate.battery_status > 20 ? '#4CAF50' : '#F44336';
      }

      // Update popup content
      const popup = markerRef.current.getPopup();
      if (popup) {
        popup.setHTML(
          `<strong>${bike?.name || bikeId}</strong><br/>Battery: ${bikeUpdate.battery_status}%`
        );
      }
    }

    // Add new telemetry record to the beginning of the list
    const newTelemetry: BikeTelemetry = {
      id: `live-${Date.now()}`,
      bike_id: bikeId,
      longitude: bikeUpdate.longitude,
      latitude: bikeUpdate.latitude,
      battery: bikeUpdate.battery_status,
      time: Date.now(),
    };

    setTelemetry(prev => [newTelemetry, ...prev.slice(0, 99)]); // Keep last 100 records
  }, [bikeId, bike]);

  useWebSocket(handleBikeUpdate, mapRef.current);

  useEffect(() => {
    const fetchBikeData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [bikeData, tripsData, telemetryData] = await Promise.all([
          bikeApi.getBikeById(bikeId),
          tripApi.getTripsByBike(bikeId),
          bikeApi.getBikeTelemetry(bikeId, 1, 100),
        ]);

        setBike(bikeData);
        setTrips(tripsData);
        setTelemetry(telemetryData);
      } catch (err) {
        console.error('Failed to fetch bike data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load bike data');
      } finally {
        setLoading(false);
      }
    };

    fetchBikeData();
  }, [bikeId]);

  // Filter telemetry by date range
  const filteredTelemetry = telemetry.filter((t) => {
    if (!startDate && !endDate) return true;
    
    const telemetryDate = new Date(t.time);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (start && end) {
      return telemetryDate >= start && telemetryDate <= end;
    } else if (start) {
      return telemetryDate >= start;
    } else if (end) {
      return telemetryDate <= end;
    }
    return true;
  });

  // Export telemetry to CSV
  const exportToCSV = useCallback(() => {
    const headers = ['Battery', 'Longitude', 'Latitude', 'Timestamp'];
    const csvContent = [
      headers.join(','),
      ...filteredTelemetry.map(t => 
        `${t.battery},${t.longitude},${t.latitude},${new Date(t.time).toISOString()}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `bike-${bikeId}-telemetry-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredTelemetry, bikeId]);

  const formatDate = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  }, []);

  const getStatusText = useCallback((status: BikeStatus) => {
    switch (status) {
      case BikeStatus.INUSE:
        return 'In Use';
      case BikeStatus.RESERVED:
        return 'Reserved';
      case BikeStatus.IDLE:
        return 'Available';
      default:
        return status;
    }
  }, []);

  const handleMapClick = useCallback(() => {
    if (telemetry.length > 0) {
      const latest = telemetry[0];
      onNavigate('/', [latest.longitude, latest.latitude]);
    }
  }, [telemetry, onNavigate]);

  if (loading) {
    return (
      <div className="bike-details-container">
        <Header title="Bike Details" />
        <div className="main-content">
          <Sidebar />
          <div className="content-area" style={{ padding: '20px', textAlign: 'center' }}>
            <p>Loading bike details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bike-details-container">
        <Header title="Bike Details" />
        <div className="main-content">
          <Sidebar />
          <div className="content-area" style={{ padding: '20px' }}>
            <div className="error-message" style={{ color: 'red', padding: '20px', background: '#fee', borderRadius: '8px' }}>
              <h3>Error Loading Bike Data</h3>
              <p>{error}</p>
              <button onClick={() => window.location.reload()} style={{ marginTop: '10px', padding: '8px 16px' }}>
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!bike) {
    return (
      <div className="bike-details-container">
        <Header title="Bike Details" />
        <div className="main-content">
          <Sidebar />
          <div className="content-area" style={{ padding: '20px' }}>
            <p>Bike not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (

    <div className="bike-details-container">

      <Header title="Bike Details" />

      <div className="main-content">

        <Sidebar />

        <div className="content-area">
          <BikeInfoCard 
            bike={bike} 
            formatDate={formatDate} 
            getStatusText={getStatusText} 
          />

          <div className="trips-map-section">
            <TripsTable 
              trips={trips}
              selectedTrip={selectedTrip}
              onTripSelect={setSelectedTrip}
              formatDate={formatDate}
            />
            <BikeMap 
              bike={bike}
              telemetry={telemetry}
              onMapClick={handleMapClick}
            />
          </div>

          <TelemetryTable 
            telemetry={filteredTelemetry}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onExportCSV={exportToCSV}
            formatDate={formatDate}
          />
        </div>

      </div>

    </div>

  );

}



export default BikeDetails;
