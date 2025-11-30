import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { useNavigate } from "react-router-dom";
import "./Bikes.css";

import type { Bike, BikeStatus } from "@trungthao/admin_dashboard_dto";
import { getSessionId, getApiBaseUrl } from "./services/authService";

interface BikesResponse {
  bikes: Bike[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function Bikes() {
  const navigate = useNavigate();
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchVin, setSearchVin] = useState("");
  const [batteryFilter, setBatteryFilter] = useState<string>("");
  const [hubFilter, setHubFilter] = useState<string>("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const fetchBikes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const sessionId = getSessionId();
      if (!sessionId) {
        setError("No session ID found. Please log in.");
        return;
      }

      // Build query params
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());

      if (batteryFilter && !isNaN(Number(batteryFilter))) {
        params.append("battery", batteryFilter);
      }

      if (hubFilter.trim()) {
        params.append("hub", hubFilter.trim());
      }

      const API_BASE_URL = getApiBaseUrl();
      const response = await fetch(`${API_BASE_URL}/dashboard/bikes?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: sessionId,
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (response.status === 401) {
        setError("Session expired. Please log in again.");
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data: BikesResponse = await response.json();
      setBikes(data.bikes);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setPageSize(data.pageSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch bikes");
    } finally {
      setLoading(false);
    }
  }, [currentPage, batteryFilter, hubFilter]);

  useEffect(() => {
    fetchBikes();
  }, [fetchBikes]);

  // Handle search filter (client-side filtering for VIN search)
  const filteredBikes = bikes.filter((bike) =>
    bike.id.toLowerCase().includes(searchVin.toLowerCase())
  );

  const handleBikeClick = (bikeId: string) => {
    navigate(`/bike/${bikeId}`);
  };

  const getStatusStyle = (status: BikeStatus) => {
    switch (status) {
      case "Idle":
        return { background: "#d4edda", color: "#155724" }; // Green - Available
      case "Inuse":
        return { background: "#ffe4c4", color: "#856404" }; // Orange - Being Rent
      case "Reserved":
        return { background: "#fff3cd", color: "#856404" }; // Yellow - Reserved
      default:
        return { background: "#e2e3e5", color: "#383d41" }; // Gray - Unknown
    }
  };

  const getStatusLabel = (status: BikeStatus) => {
    switch (status) {
      case "Idle":
        return "Available";
      case "Inuse":
        return "Being Rent";
      case "Reserved":
        return "Reserved";
      default:
        return status;
    }
  };

  const handleApplyFilters = () => {
    setCurrentPage(1); // Reset to first page when applying filters
    fetchBikes();
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const availableBikes = bikes.filter((bike) => bike.status === "Idle").length;

  return (
    <div className="bike-details-container">
      <Header title="Bikes" />
      <div className="main-content">
        <Sidebar />
        <div className="content-area bikes-content">
          {/* Stats Section */}
          <div className="bikes-stats">
            <p>Total: {total}</p>
            <p>Available: {availableBikes}</p>
          </div>

          {/* Filters Section */}
          <div className="bikes-filters">
            <input
              type="text"
              placeholder="Search Bike's VIN"
              value={searchVin}
              onChange={(e) => setSearchVin(e.target.value)}
              className="search-input"
            />
            <div className="filter-dropdown">
              <span className="filter-icon">☰</span>
              <input
                type="number"
                placeholder="Max Battery %"
                value={batteryFilter}
                onChange={(e) => setBatteryFilter(e.target.value)}
                className="filter-input"
                min="0"
                max="100"
              />
            </div>
            <div className="filter-dropdown">
              <span className="filter-icon">☰</span>
              <input
                type="text"
                placeholder="Hub ID"
                value={hubFilter}
                onChange={(e) => setHubFilter(e.target.value)}
                className="filter-input"
              />
            </div>
            <button className="apply-filter-btn" onClick={handleApplyFilters}>
              Apply Filters
            </button>
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Loading State */}
          {loading ? (
            <div className="loading">Loading bikes...</div>
          ) : (
            <>
              {/* Bikes Table */}
              <div className="bikes-table-container">
                <table className="bikes-table">
                  <thead>
                    <tr>
                      <th>Vin Number</th>
                      <th>Type</th>
                      <th>Current Battery</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBikes.map((bike, index) => (
                      <tr
                        key={bike.id}
                        onClick={() => handleBikeClick(bike.id)}
                        className={bike.status === "Inuse" ? "row-highlighted" : ""}
                      >
                        <td className="vin-cell">{bike.id}</td>
                        <td>{bike.name}</td>
                        <td>{bike.battery_status !== null ? `${bike.battery_status}%` : "N/A"}</td>
                        <td>
                          <span
                            className="status-badge-table"
                            style={getStatusStyle(bike.status)}
                          >
                            {getStatusLabel(bike.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ‹
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages} ({total} bikes)
                </span>
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  ›
                </button>
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}