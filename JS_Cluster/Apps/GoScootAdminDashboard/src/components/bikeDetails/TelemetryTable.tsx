/**
 * TelemetryTable Component
 * Displays bike telemetry/movement history with date filtering and CSV export
 */

import { BikeTelemetry } from '@trungthao/admin_dashboard_dto';

interface TelemetryTableProps {
  telemetry: BikeTelemetry[];
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onExportCSV: () => void;
  formatDate: (timestamp: number) => string;
}

function TelemetryTable({ 
  telemetry, 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange, 
  onExportCSV,
  formatDate 
}: TelemetryTableProps) {
  return (
    <div className="movement-history-section">
      <div className="movement-history-header">
        <h3>Movement History ({telemetry.length} records) 
          <span style={{ 
            fontSize: '12px', 
            color: '#4CAF50', 
            marginLeft: '8px',
            fontWeight: 'normal'
          }}>
            ● Live Updates
          </span>
        </h3>
        <div className="movement-history-controls">
          <div className="date-filters">
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              placeholder="Start Date"
              className="date-input"
            />
            <span>to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              placeholder="End Date"
              className="date-input"
            />
          </div>
          <button onClick={onExportCSV} className="export-btn">
            Export CSV
          </button>
        </div>
      </div>
      <table className="trips-table">
        <thead>
          <tr>
            <th>Battery</th>
            <th>Longitude</th>
            <th>Latitude</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {telemetry.length > 0 ? (
            telemetry.slice(0, 50).map((t) => (
              <tr key={t.id}>
                <td>{t.battery}%</td>
                <td>{t.longitude.toFixed(6)}</td>
                <td>{t.latitude.toFixed(6)}</td>
                <td>{formatDate(t.time)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>
                No telemetry data found for the selected date range
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TelemetryTable;
