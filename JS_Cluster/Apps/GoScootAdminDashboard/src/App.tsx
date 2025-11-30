// // src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./Dashboard";
import Bikes from "./Bikes";
import BikeDetails from "./BikeDetails";
import { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import Alerts from "./Alert";

function App() {
  const [pageTitle, setPageTitle] = useState("");
  // Track current page (simple client-side routing)
  const [currentPage, setCurrentPage] = useState<string>("bike-detail");

  // Store bike location when navigating from BikeDetails to Map
  const [selectedBikeLocation, setSelectedBikeLocation] = useState<
    [number, number] | null
  >(null);

  /**
   * Handle navigation between pages
   * @param page - Page identifier to navigate to
   * @param bikeLocation - Optional bike location to center map on
   */
  const handleNavigate = (page: string, bikeLocation?: [number, number]) => {
    setCurrentPage(page);
    if (bikeLocation) {
      setSelectedBikeLocation(bikeLocation);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        <Route path="/bikes" element={<ProtectedRoute><Bikes /></ProtectedRoute>} />
        <Route
          path="/bike-detail"
          element={<ProtectedRoute><BikeDetails onNavigate={handleNavigate} /></ProtectedRoute>}
        />
        <Route path="/alert" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './Login';
// import SignUp from './SignUp';
// import Map from './Map';
// import WebSocketTest from './TestingScreens/WebSocketTestPage';

// function App() {
//   // TODO: Add proper authentication state management
//   const isAuthenticated = false;

//   return (
//     <WebSocketTest></WebSocketTest>

//   );
// }
