// src/components/MapNeshan.tsx
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import L from '@neshan-maps-platform/leaflet';
import '@neshan-maps-platform/leaflet/dist/leaflet.css';
import { useStation } from '../../context/StationContext';
import { getRoute, decodePolyline, RoutingPoint } from '../../services/routingService';

interface MapStation {
  id: number;
  name: string;
  bikesCount: number;
  lat: number;
  lng: number;
}

interface NeshanMapProps {
  stations: MapStation[];
  apiKey: string;
  onStationSelect?: (stationId: number) => void;
  onDestinationSelect?: (station: MapStation) => void;
}

export interface NeshanMapRef {
  flyTo: (lat: number, lng: number, zoom?: number) => void;
  drawRoute: (origin: RoutingPoint, destination: RoutingPoint, type: string) => Promise<any>;
  clearRoute: () => void;
  setPointSelectionMode: (enabled: boolean) => void;
}

export const NeshanMap = forwardRef<NeshanMapRef, NeshanMapProps>(
  function NeshanMap({ stations, apiKey, onStationSelect, onDestinationSelect }, ref) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const routeLayersRef = useRef<L.Layer[]>([]);
    const pointMarkerRef = useRef<L.Marker | null>(null);
    const { setSelectedStationId, setMapRef, setSelectedMapPoint, setRouteInfo } = useStation();

    const clearRoute = () => {
      routeLayersRef.current.forEach(layer => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });
      routeLayersRef.current = [];
    };

    const removePointMarker = () => {
      if (pointMarkerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(pointMarkerRef.current);
        pointMarkerRef.current = null;
      }
    };

    const drawRoute = async (origin: RoutingPoint, destination: RoutingPoint, type: string) => {
      if (!mapInstanceRef.current) return null;
      
      clearRoute();
      removePointMarker();
      
      try {
        const routeData = await getRoute(origin, destination, apiKey, type);
        
        if (!routeData?.routes?.[0]) {
          console.error("No route found");
          return null;
        }
        
        const route = routeData.routes[0];
        let totalDistance = 0;
        let totalDuration = 0;
        const allSteps: any[] = [];
        
        for (const leg of route.legs) {
          totalDistance = leg.distance?.value || 0;
          totalDuration = leg.duration?.value || 0;
          
          for (const step of leg.steps || []) {
            allSteps.push({
              instruction: step.instruction,
              distance: step.distance,
              duration: step.duration,
              name: step.name
            });
            
            if (step.polyline) {
              const decodedStepPoints = decodePolyline(step.polyline);
              const stepLine = L.polyline(decodedStepPoints, {
                color: "#9f4ec1",
                weight: 4,
                opacity: 0.7
              }).addTo(mapInstanceRef.current);
              routeLayersRef.current.push(stepLine);
            }
          }
        }
        
        if (route.overview_polyline?.points) {
          const decodedPoints = decodePolyline(route.overview_polyline.points);
          const polyline = L.polyline(decodedPoints, {
            color: "#b666d2",
            weight: 5,
            opacity: 0.8,
            lineCap: "round",
            lineJoin: "round"
          }).addTo(mapInstanceRef.current);
          routeLayersRef.current.push(polyline);
        }
        
        const originMarker = L.marker([origin.lat, origin.lng]).addTo(mapInstanceRef.current);
        originMarker.bindPopup(`<strong>📍 نقطه شروع</strong><br/>${origin.name || ''}`).openPopup();
        routeLayersRef.current.push(originMarker);
        
        const destMarker = L.marker([destination.lat, destination.lng]).addTo(mapInstanceRef.current);
        destMarker.bindPopup(`<strong>🏁 نقطه مقصد</strong><br/>${destination.name || ''}`);
        routeLayersRef.current.push(destMarker);
        
        const routeInfo = {
          distance: totalDistance,
          distanceText: totalDistance >= 1000 
            ? `${(totalDistance / 1000).toFixed(1)} کیلومتر` 
            : `${Math.round(totalDistance)} متر`,
          duration: totalDuration,
          durationText: totalDuration >= 60 
            ? `${Math.floor(totalDuration / 60)} دقیقه و ${totalDuration % 60} ثانیه` 
            : `${totalDuration} ثانیه`,
          steps: allSteps
        };
        
        setRouteInfo(routeInfo);
        return routeInfo;
        
      } catch (error) {
        console.error("Error drawing route:", error);
        return null;
      }
    };

    let isSelectionMode = false;
    
    const onMapClick = (e: L.LeafletMouseEvent) => {
      if (!isSelectionMode) return;
      
      const { lat, lng } = e.latlng;
      const point = { lat, lng, name: "نقطه انتخاب شده روی نقشه" };
      
      removePointMarker();
      
      const marker = L.marker([lat, lng]).addTo(mapInstanceRef.current!);
      marker.bindPopup(`<strong>📍 نقطه انتخاب شده</strong><br/>${point.name}`).openPopup();
      pointMarkerRef.current = marker;
      
      setSelectedMapPoint(point);
      isSelectionMode = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.getContainer().style.cursor = "";
        mapInstanceRef.current.off("click", onMapClick);
      }
    };

    const setPointSelectionMode = (enabled: boolean) => {
      if (!mapInstanceRef.current) return;
      
      isSelectionMode = enabled;
      if (enabled) {
        mapInstanceRef.current.getContainer().style.cursor = "crosshair";
        mapInstanceRef.current.on("click", onMapClick);
      } else {
        mapInstanceRef.current.getContainer().style.cursor = "";
        mapInstanceRef.current.off("click", onMapClick);
        removePointMarker();
      }
    };

    useImperativeHandle(ref, () => ({
      flyTo: (lat, lng, zoom = 16) => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], zoom);
        }
      },
      drawRoute,
      clearRoute,
      setPointSelectionMode,
    }));

    useEffect(() => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = new L.Map(mapRef.current, {
        key: apiKey,
        maptype: 'neshan',
        poi: true,
        traffic: false,
        center: [36.421339295614146, 54.964152592348924],
        zoom: 13,
        attributionControl: false,
      });
      mapInstanceRef.current = map;
      
      setMapRef({
        flyTo: (lat: number, lng: number, zoom: number = 16) => {
          map.flyTo([lat, lng], zoom);
        },
        drawRoute,
        clearRoute,
        setPointSelectionMode,
      });

      stations.forEach((station) => {
        const marker = L.marker([station.lat, station.lng]).addTo(map);
        
        const popupContent = `
          <div dir="rtl" style="text-align:right; padding:8px; min-width:200px;">
            <strong style="font-size:14px;">🚲 ${station.name}</strong><br/>
            <span style="font-size:12px;">📊 دوچرخه موجود: <strong>${station.bikesCount}</strong></span>
          </div>
        `;
        
        marker.bindPopup(popupContent);
        marker.on('click', () => {
          if (onStationSelect) {
            onStationSelect(station.id);
          }
          setSelectedStationId(station.id);
          if (onDestinationSelect) {
            onDestinationSelect(station);
          }
        });
      });

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }, [stations, apiKey, setSelectedStationId, setMapRef, onStationSelect, onDestinationSelect]);

    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} className="rounded-lg" />;
  }
);