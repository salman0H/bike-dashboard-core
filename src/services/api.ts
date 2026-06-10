// src/services/api.ts
const API_BASE_URL = "http://localhost:3002";

export const api = {
  // Generic fetch function
  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`);
      if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
      return response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return [] as T;
    }
  },

  // Specific data endpoints
  getStations: () => api.get<any[]>("stationsLocation"),
  getStationsData: () => api.get<any[]>("stationsData"),
  getMenuItems: () => api.get<any[]>("menuItem"),
  getNotifications: () => api.get<any[]>("notifications"),
  getMonthlyData: () => api.get<any[]>("monthlyData"),
  getTransactions: () => api.get<any[]>("transactions"),
  getSections: () => api.get<any[]>("sections"),
  getRoles: () => api.get<any[]>("roles"),
  getAlerts: () => api.get<any[]>("alerts"),
  getUsers: () => api.get<any[]>("userData"),
};