/**
 * BikeInfoCard Component
 * Displays bike information and battery status
 */

import { MdBatteryFull } from 'react-icons/md';
import { Bike, BikeStatus } from '@trungthao/admin_dashboard_dto';

interface BikeInfoCardProps {
  bike: Bike;
  formatDate: (timestamp: number) => string;
  getStatusText: (status: BikeStatus) => string;
}

function BikeInfoCard({ bike, formatDate, getStatusText }: BikeInfoCardProps) {
  return (
    <div className="bike-info-section">
      <div className="bike-image">
        <img src="/bike_type.png" alt="Bike" />
      </div>
      <div className="bike-details">
        <h2 className="vin-number">{bike.name}</h2>
        <p className="bike-model">ID: {bike.id}</p>
        <div className="battery-status">
          <MdBatteryFull 
            className="battery-icon" 
            size={24} 
            style={{ 
              color: (bike.battery_status || 0) > 20 ? '#4CAF50' : '#F44336' 
            }} 
          />
          <span style={{ 
            color: (bike.battery_status || 0) > 20 ? '#4CAF50' : '#F44336',
            fontWeight: 'bold'
          }}>
            {bike.battery_status || 0}%
          </span>
          <span style={{ 
            fontSize: '12px', 
            color: '#666', 
            marginLeft: '8px' 
          }}>
            (Live)
          </span>
        </div>
        <div className="status-badge">{getStatusText(bike.status)}</div>
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          Max Speed: {bike.maximum_speed} km/h<br />
          Max Distance: {bike.maximum_functional_distance} km<br />
          Last Service: {formatDate(bike.last_service_date)}
        </p>
      </div>
    </div>
  );
}

export default BikeInfoCard;
