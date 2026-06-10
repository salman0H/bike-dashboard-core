import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';

interface Station {
  id: number;
  name: string;
  location: string;
  address: string;
  coordinates: { lat: number; lng: number };
  stats: {
    totalDocks: number;
    availableBikes: number;
    availableDocks: number;
    bikesInUse: number;
  };
  bikeStatus: {
    healthy: number;
    lowBattery: number;
    needsRepair: number;
    missing: number;
  };
  lastUpdated: string;
  status: "active" | "maintenance" | "offline";
  popularity: number;
  nearbyLandmarks: string[];
}

interface MapPoint {
  lat: number;
  lng: number;
  name?: string;
}

interface RouteInfo {
  distance: string;
  duration: string;
  steps: any[];
  polyline: any;
}

interface StationContextType {
  selectedStation: Station | null;
  selectedStationId: number | null;
  setSelectedStation: (station: Station | null) => void;
  setSelectedStationId: (id: number | null) => void;
  getStationById: (id: number) => Station | undefined;
  stations: Station[];
  setStations: (stations: Station[]) => void;
  mapRef: React.MutableRefObject<any>;
  setMapRef: (ref: any) => void;
  flyToStation: (stationId: number) => void;
  centerOnStation: (station: Station) => void;
  // NEW: Map point selection
  selectedMapPoint: MapPoint | null;
  setSelectedMapPoint: (point: MapPoint | null) => void;
  routeInfo: RouteInfo | null;
  setRouteInfo: (route: RouteInfo | null) => void;
  clearRoute: () => void;
  isPointSelectionMode: boolean;
  setPointSelectionMode: (mode: boolean) => void;
}

const StationContext = createContext<StationContextType | undefined>(undefined);

export function StationProvider({ children }: { children: ReactNode }) {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedStationId, setSelectedStationId] = useState<number | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedMapPoint, setSelectedMapPoint] = useState<MapPoint | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [isPointSelectionMode, setPointSelectionMode] = useState(false);
  const mapRef = useRef<any>(null);

  const setMapRef = useCallback((ref: any) => {
    mapRef.current = ref;
  }, []);

  const getStationById = useCallback((id: number) => {
    return stations.find(station => station.id === id);
  }, [stations]);

  const flyToStation = useCallback((stationId: number) => {
    const station = getStationById(stationId);
    if (station && mapRef.current) {
      mapRef.current.flyTo(station.coordinates.lat, station.coordinates.lng, 16);
    }
  }, [getStationById]);

  const centerOnStation = useCallback((station: Station) => {
    if (mapRef.current) {
      mapRef.current.flyTo(station.coordinates.lat, station.coordinates.lng, 16);
    }
  }, []);

  const clearRoute = useCallback(() => {
    setRouteInfo(null);
    if (mapRef.current) {
      mapRef.current.clearRoute();
    }
  }, []);

  return (
    <StationContext.Provider value={{
      selectedStation,
      selectedStationId,
      setSelectedStation,
      setSelectedStationId,
      getStationById,
      stations,
      setStations,
      mapRef,
      setMapRef,
      flyToStation,
      centerOnStation,
      selectedMapPoint,
      setSelectedMapPoint,
      routeInfo,
      setRouteInfo,
      clearRoute,
      isPointSelectionMode,
      setPointSelectionMode,
    }}>
      {children}
    </StationContext.Provider>
  );
}

export function useStation() {
  const context = useContext(StationContext);
  if (context === undefined) {
    throw new Error('useStation must be used within a StationProvider');
  }
  return context;
}