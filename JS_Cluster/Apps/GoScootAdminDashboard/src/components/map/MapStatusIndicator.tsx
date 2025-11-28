/**
 * MapStatusIndicator Component
 * Displays WebSocket connection status and bike counts
 */

interface MapStatusIndicatorProps {
  wsConnected: boolean;
  totalBikeCount: number;
  visibleBikeCount: number;
}

function MapStatusIndicator({ wsConnected, totalBikeCount, visibleBikeCount }: MapStatusIndicatorProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 1000,
        background: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        fontWeight: 'bold',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ 
          width: '10px', 
          height: '10px', 
          borderRadius: '50%', 
          background: wsConnected ? '#4CAF50' : '#F44336',
          display: 'inline-block'
        }} />
        <span>{wsConnected ? 'Connected' : 'Connecting...'}</span>
      </div>
      <div style={{ marginTop: '5px' }}>
        🚲 {totalBikeCount} Bikes Online
      </div>
      <div style={{ marginTop: '2px', fontSize: '0.85em', color: '#666' }}>
        ({visibleBikeCount} visible in viewport)
      </div>
    </div>
  );
}

export default MapStatusIndicator;
