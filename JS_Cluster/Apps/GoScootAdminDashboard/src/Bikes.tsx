import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "./BikeDetails";

export default function Dashboard() {
  return (
    <div className="bike-details-container">
      <Header title="Bikes" />
      <div className="main-content">
        <Sidebar />
        <div>
          <h1 style={{padding: 10}}>Bikes Page</h1>
        </div>
      </div>
    </div>
  );
}