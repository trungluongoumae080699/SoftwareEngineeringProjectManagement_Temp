/**
 * TripsTable Component
 * Displays bike trip history
 */

import { Trip } from '@trungthao/admin_dashboard_dto';

interface TripsTableProps {
  trips: Trip[];
  selectedTrip: string | null;
  onTripSelect: (tripId: string) => void;
  formatDate: (timestamp: number) => string;
}

function TripsTable({ trips, selectedTrip, onTripSelect, formatDate }: TripsTableProps) {
  return (
    <div className="trips-table-container">
      <h3>Last Trips ({trips.length})</h3>
      <table className="trips-table">
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {trips.length > 0 ? (
            trips.slice(0, 10).map((trip) => (
              <tr
                key={trip.id}
                className={selectedTrip === trip.id ? 'selected' : ''}
                onClick={() => onTripSelect(trip.id)}
              >
                <td>{trip.customer_id}</td>
                <td>{trip.trip_status}</td>
                <td>{formatDate(trip.reservation_date)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', padding: '2rem' }}>
                No trips found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TripsTable;
