const API_BASE = process.env.REACT_APP_API_BASE_URL;

/**
 * Fetch drone coverage statistics.
 * @returns {Promise<Object>}
 */
export const fetchDroneCoverage = async () => {
  const response = await fetch(`${API_BASE}/api/drone-coverage`);
  if (!response.ok) throw new Error("Failed to fetch drone coverage");
  return response.json();
};

/**
 * Fetch stock take statistics.
 * @returns {Promise<Object>}
 */
export const fetchStockTakeStats = async () => {
  const response = await fetch(`${API_BASE}/api/stock-take-stats`);
  if (!response.ok) throw new Error("Failed to fetch stock take statistics");
  return response.json();
};

/**
 * Fetch relocation statistics.
 * @returns {Promise<Object>}
 */
export const fetchRelocationStats = async () => {
  const response = await fetch(`${API_BASE}/api/relocation-stats`);
  if (!response.ok) throw new Error("Failed to fetch relocation statistics");
  return response.json();
};

/**
 * Fetch movement history.
 * @returns {Promise<Object[]>}
 */
export const fetchMovementHistory = async () => {
  const response = await fetch(`${API_BASE}/api/movement-stats`);
  if (!response.ok) throw new Error("Failed to fetch movement history");
  return response.json();
};
