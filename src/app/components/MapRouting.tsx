import { useState, useCallback } from 'react';
import { Navigation, MapPin, X, Car, Bike, Footprints } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RoutingPoint {
  lat: number;
  lng: number;
  name?: string;
}

interface MapRoutingProps {
  onGetRoute: (origin: RoutingPoint, destination: RoutingPoint, type: string) => void;
  isLoading: boolean;
  onClose: () => void;
}

export function MapRouting({ onGetRoute, isLoading, onClose }: MapRoutingProps) {
  const [origin, setOrigin] = useState<RoutingPoint>({ lat: 0, lng: 0, name: "" });
  const [destination, setDestination] = useState<RoutingPoint>({ lat: 0, lng: 0, name: "" });
  const [routeType, setRouteType] = useState<string>("bike");
  const [showOriginInput, setShowOriginInput] = useState(true);

  const handleGetRoute = () => {
    if (origin.lat && origin.lng && destination.lat && destination.lng) {
      onGetRoute(origin, destination, routeType);
    }
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setOrigin({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: "موقعیت فعلی من",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <motion.div
      initial={{ x: 380, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 380, opacity: 0 }}
      className="absolute top-4 right-4 w-96 bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-2xl z-20 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-primary/20 to-transparent border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg">مسیریابی</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Route Type Selection */}
        <div className="flex gap-2">
          <button
            onClick={() => setRouteType("bike")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
              routeType === "bike"
                ? "bg-primary text-white"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <Bike className="w-4 h-4" />
            <span className="text-sm">دوچرخه</span>
          </button>
          <button
            onClick={() => setRouteType("car")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
              routeType === "car"
                ? "bg-primary text-white"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <Car className="w-4 h-4" />
            <span className="text-sm">ماشین</span>
          </button>
          <button
            onClick={() => setRouteType("walk")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
              routeType === "walk"
                ? "bg-primary text-white"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <Footprints className="w-4 h-4" />
            <span className="text-sm">پیاده</span>
          </button>
        </div>

        {/* Origin */}
        <div>
          <label className="block text-sm font-medium mb-2">نقطه شروع</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="آدرس یا نام مبدا..."
              value={origin.name || ""}
              onChange={(e) => setOrigin({ ...origin, name: e.target.value })}
              className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-border text-sm focus:border-primary outline-none"
            />
            <button
              onClick={useCurrentLocation}
              className="px-3 py-2 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors"
              title="موقعیت فعلی من"
            >
              <MapPin className="w-4 h-4 text-primary" />
            </button>
          </div>
        </div>

        {/* Destination */}
        <div>
          <label className="block text-sm font-medium mb-2">نقطه مقصد</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="آدرس یا نام مقصد..."
              value={destination.name || ""}
              onChange={(e) => setDestination({ ...destination, name: e.target.value })}
              className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-border text-sm focus:border-primary outline-none"
            />
            <button
              onClick={() => {
                // You can add station selection here
                console.log("Select from map");
              }}
              className="px-3 py-2 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors"
              title="انتخاب از روی نقشه"
            >
              <MapPin className="w-4 h-4 text-primary" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleGetRoute}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                در حال محاسبه...
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                محاسبه مسیر
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}