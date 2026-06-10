import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { NeshanMap } from "../components/MapNeshan";
import { useData } from "../../hooks/useData";
import { useStation } from "../../context/StationContext";
import {
  MapPin, Bike, ChevronLeft, Battery, Wrench, Clock, Star, TrendingUp,
  CheckCircle, ChevronUp, Target, X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VITE_NESHAN_API_KEY } from  "../../../public/apiKey.json";

const NESHAN_API_KEY = VITE_NESHAN_API_KEY;

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

const DEFAULT_STATIONS: Station[] = [
  {
    id: 0,
    name: "ایستگاه پیش‌فرض",
    location: "مرکز شهر",
    address: "آدرس نامشخص",
    coordinates: { lat: 36.421339295614146, lng: 54.964152592348924 },
    stats: { totalDocks: 20, availableBikes: 0, availableDocks: 20, bikesInUse: 0 },
    bikeStatus: { healthy: 0, lowBattery: 0, needsRepair: 0, missing: 0 },
    lastUpdated: new Date().toISOString(),
    status: "active",
    popularity: 0,
    nearbyLandmarks: [],
  },
];

type SnapState = "peek" | "half" | "full";

export function Bikes() {
  const {
    selectedStationId,
    setSelectedStationId,
    selectedStation,
    setSelectedStation,
    getStationById,
    setStations: setContextStations,
    centerOnStation,
  } = useStation();

  const [showStationList, setShowStationList] = useState(true);
  const [isListCollapsed, setIsListCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedStationId, setHighlightedStationId] = useState<number | null>(null);

  // Mobile bottom-sheet state
  const [snapState, setSnapState] = useState<SnapState>("peek");
  const [isMobile, setIsMobile] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragCurrentY = useRef(0);

  const { data: stations, loading, error } = useData("getStationsData", DEFAULT_STATIONS);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Update context stations
  useEffect(() => {
    if (Array.isArray(stations) && stations.length > 0) {
      setContextStations(stations);
    }
  }, [stations, setContextStations]);

  // Sync selected station from context to local state
  useEffect(() => {
    if (selectedStationId !== null) {
      const station = getStationById(selectedStationId);
      if (station) {
        setSelectedStation(station);
        setHighlightedStationId(selectedStationId);
        setTimeout(() => {
          const element = document.getElementById(`station-${selectedStationId}`);
          if (element) element.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
        const timer = setTimeout(() => setHighlightedStationId(null), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedStationId, getStationById, setSelectedStation]);

  const mapStations = useMemo(() => {
    if (Array.isArray(stations) && stations.length > 0) {
      return stations.map((s: Station) => ({
        id: s.id,
        name: s.name,
        bikesCount: s.stats.availableBikes,
        lat: s.coordinates.lat,
        lng: s.coordinates.lng,
      }));
    }
    return DEFAULT_STATIONS.map((s) => ({
      id: s.id,
      name: s.name,
      bikesCount: s.stats.availableBikes,
      lat: s.coordinates.lat,
      lng: s.coordinates.lng,
    }));
  }, [stations]);

  const filteredStations = useMemo(() => {
    if (Array.isArray(stations) && stations.length > 0) {
      return stations.filter(
        (s: Station) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return [];
  }, [stations, searchTerm]);

  const handleStationSelect = useCallback(
    (station: Station) => {
      setSelectedStation(station);
      setSelectedStationId(station.id);
      centerOnStation(station);
      if (isMobile) setSnapState("peek");
    },
    [setSelectedStation, setSelectedStationId, centerOnStation, isMobile]
  );

  const handleCenterOnStation = useCallback(
    (station: Station) => {
      centerOnStation(station);
      if (isMobile) setSnapState("peek");
    },
    [centerOnStation, isMobile]
  );

  const handleCloseDetails = useCallback(() => {
    setSelectedStation(null);
    setSelectedStationId(null);
  }, [setSelectedStation, setSelectedStationId]);

  const toggleListCollapse = useCallback(() => {
    setIsListCollapsed((prev) => !prev);
  }, []);

  // ── Mobile drag handlers ────────────────────────────────────────────────
  const handleDragStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    dragStartY.current = "touches" in e ? e.touches[0].clientY : e.clientY;
    dragCurrentY.current = dragStartY.current;
  }, []);

  const handleDragEnd = useCallback(() => {
    const delta = dragCurrentY.current - dragStartY.current;
    if (delta < -50) {
      setSnapState((prev) => (prev === "peek" ? "half" : "full"));
    } else if (delta > 50) {
      setSnapState((prev) => (prev === "full" ? "half" : "peek"));
    }
  }, []);

  const handleDragMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    dragCurrentY.current = "touches" in e ? e.touches[0].clientY : e.clientY;
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "فعال";
      case "maintenance": return "در حال تعمیر";
      case "offline": return "غیرفعال";
      default: return "نامشخص";
    }
  };

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 80) return "text-status-active";
    if (popularity >= 50) return "text-status-pending";
    return "text-status-failed";
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("fa-IR");

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">در حال بارگذاری نقشه...</p>
        </div>
      </div>
    );
  }

  if (error) console.warn("Using default stations due to error:", error);

  const totalAvailableBikes =
    stations?.reduce((sum: number, s: Station) => sum + s.stats.availableBikes, 0) || 0;
  const activeStationsCount =
    stations?.filter((s: Station) => s.status === "active").length || 0;
  const currentSelectedStation =
    selectedStation || (selectedStationId ? getStationById(selectedStationId) : null);

  const AdvancedTooltip = ({
    children,
    text,
  }: {
    children: React.ReactNode;
    text: string;
  }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div
        className="relative inline-block"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 z-50"
            >
              <div className="bg-gray-900 text-white text-[10px] py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap">
                {text}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // ── Shared station list content ─────────────────────────────────────────
  // BUG FIX 2 (Desktop double scroll):
  // Removed `style={{ maxHeight: isMobile ? undefined : "calc(100vh - 200px)" }}`
  // from the inner scroll div. The outer panel is already height-constrained by
  // Tailwind's `bottom-4` + `flex flex-col`, so the inner `flex-1 overflow-y-auto`
  // naturally clips to the remaining space — no second scroll context needed.
  const StationListContent = (
    <>
      <div className="p-3 border-b border-border">
        <input
          type="text"
          placeholder="جستجوی ایستگاه..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-border text-sm focus:border-primary outline-none transition"
        />
      </div>

      {/* FIXED: removed maxHeight inline style that caused double scroll on desktop */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scroll">
        {filteredStations.map((station: Station) => (
          <div
            key={station.id}
            id={`station-${station.id}`}
            onClick={() => handleStationSelect(station)}
            className={`group p-3 rounded-xl border transition-all cursor-pointer ${
              selectedStationId === station.id || selectedStation?.id === station.id
                ? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
                : highlightedStationId === station.id
                ? "bg-primary/20 border-primary/50 shadow-md animate-pulse"
                : "bg-white/5 border-border hover:border-primary/50 hover:bg-white/10"
            }`}
          >
            {(selectedStationId === station.id || selectedStation?.id === station.id) && (
              <div className="text-xs text-primary mb-1">✓ انتخاب شده</div>
            )}

            {/* station header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-sm">{station.name}</div>
                  <div className="text-xs text-muted-foreground">{station.location}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  station.status === "active" ? "bg-status-active/10 text-status-active" :
                  station.status === "maintenance" ? "bg-status-pending/10 text-status-pending" :
                  "bg-status-failed/10 text-status-failed"
                }`}>
                  {getStatusText(station.status)}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleCenterOnStation(station); }}
                  className="p-1.5 rounded-lg hover:bg-primary/20 transition-colors opacity-0 group-hover:opacity-100"
                  title="تمرکز روی نقشه"
                >
                  <Target className="w-3.5 h-3.5 text-primary" />
                </button>
              </div>
            </div>

            {/* Station Quantity */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              <div className="text-center p-1.5 rounded-lg bg-white/5">
                <div className="text-lg font-bold text-primary">{station.stats.availableBikes}</div>
                <AdvancedTooltip text="دوچرخه موجود">
                  <Bike className="w-4 h-4 text-primary mx-auto mt-1 cursor-pointer hover:scale-110 transition-transform" />
                </AdvancedTooltip>
              </div>
              <div className="text-center p-1.5 rounded-lg bg-white/5">
                <div className="text-lg font-bold text-status-pending">{station.stats.availableDocks}</div>
                <AdvancedTooltip text="جاهای خالی">
                  <Bike className="w-4 h-4 text-green-400 mx-auto mt-1 cursor-pointer hover:scale-110 transition-transform" />
                </AdvancedTooltip>
              </div>
              <div className="text-center p-1.5 rounded-lg bg-white/5">
                <div className="text-lg font-bold text-status-active">{station.stats.bikesInUse}</div>
                <AdvancedTooltip text="در حال استفاده">
                  <Bike className="w-4 h-4 text-red-500 mx-auto mt-1 cursor-pointer hover:scale-110 transition-transform" />
                </AdvancedTooltip>
              </div>
              <div className="text-center p-1.5 rounded-lg bg-white/5">
                <div className="text-lg font-bold text-foreground">{station.stats.totalDocks}</div>
                <AdvancedTooltip text="کل جایگاه‌ها">
                  <Bike className="w-4 h-4 text-muted-foreground mx-auto mt-1 cursor-pointer hover:scale-110 transition-transform" />
                </AdvancedTooltip>
              </div>
            </div>

            {/* bike status icons */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-status-active" /><span className="text-xs">{station.bikeStatus.healthy}</span></div>
                <div className="flex items-center gap-1"><Battery className="w-3 h-3 text-status-pending" /><span className="text-xs">{station.bikeStatus.lowBattery}</span></div>
                <div className="flex items-center gap-1"><Wrench className="w-3 h-3 text-status-failed" /><span className="text-xs">{station.bikeStatus.needsRepair}</span></div>
              </div>
              <div className="flex items-center gap-1">
                <Star className={`w-3 h-3 ${getPopularityColor(station.popularity)}`} />
                <span className="text-xs">{station.popularity}%</span>
              </div>
            </div>
          </div>
        ))}

        {filteredStations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">هیچ ایستگاهی یافت نشد</p>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-border text-center flex-shrink-0">
        <p className="text-xs text-muted-foreground">
          {activeStationsCount} ایستگاه فعال • {totalAvailableBikes} دوچرخه آماده
        </p>
      </div>
    </>
  );

  // ── Shared station details content ──────────────────────────────────────
  const StationDetailsContent = currentSelectedStation && (
    <>
      <div className="p-4 bg-gradient-to-r from-primary/20 to-transparent border-b border-primary/30 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-base">{currentSelectedStation.name}</h3>
              <p className="text-xs text-muted-foreground">{currentSelectedStation.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              currentSelectedStation.status === "active" ? "bg-status-active/10 text-status-active" :
              currentSelectedStation.status === "maintenance" ? "bg-status-pending/10 text-status-pending" :
              "bg-status-failed/10 text-status-failed"
            }`}>
              {getStatusText(currentSelectedStation.status)}
            </span>
            <button onClick={handleCloseDetails} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
              {isMobile ? <X className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll">
        <div className="p-3 rounded-lg bg-white/5">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">آدرس</span>
          </div>
          <p className="text-sm">{currentSelectedStation.address}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-primary/5 text-center">
            <p className="text-xs text-muted-foreground">کل جایگاه‌ها</p>
            <p className="text-2xl font-bold text-primary">{currentSelectedStation.stats.totalDocks}</p>
          </div>
          <div className="p-3 rounded-lg bg-status-active/5 text-center">
            <p className="text-xs text-muted-foreground">دوچرخه موجود</p>
            <p className="text-2xl font-bold text-status-active">{currentSelectedStation.stats.availableBikes}</p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Bike className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">وضعیت دوچرخه‌ها</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-status-active" /><span className="text-sm">سالم</span></div>
              <span className="text-sm font-medium">{currentSelectedStation.bikeStatus.healthy}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Battery className="w-4 h-4 text-status-pending" /><span className="text-sm">باتری ضعیف</span></div>
              <span className="text-sm font-medium">{currentSelectedStation.bikeStatus.lowBattery}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Wrench className="w-4 h-4 text-status-failed" /><span className="text-sm">نیاز به تعمیر</span></div>
              <span className="text-sm font-medium">{currentSelectedStation.bikeStatus.needsRepair}</span>
            </div>
          </div>
        </div>

        {currentSelectedStation.nearbyLandmarks?.length > 0 && (
          <div className="p-3 rounded-lg bg-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">اماکن نزدیک</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentSelectedStation.nearbyLandmarks.map((lm, idx) => (
                <span key={idx} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{lm}</span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
          <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /><span className="text-sm">محبوبیت</span></div>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${currentSelectedStation.popularity}%` }} />
            </div>
            <span className="text-sm font-medium">{currentSelectedStation.popularity}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground" /><span className="text-sm">آخرین بروزرسانی</span></div>
          <span className="text-sm">{formatDate(currentSelectedStation.lastUpdated)}</span>
        </div>

        <button
          onClick={() => handleCenterOnStation(currentSelectedStation)}
          className="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Target className="w-4 h-4" />
          تمرکز روی نقشه
        </button>
      </div>
    </>
  );

  // ════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Map */}
      <div className="absolute inset-0 z-0">
        <NeshanMap stations={mapStations} apiKey={NESHAN_API_KEY} />
      </div>

      {/* ─────────────────────────── DESKTOP LAYOUT ─────────────────────────── */}
      {!isMobile && (
        <>
          <AnimatePresence>
            {showStationList && !currentSelectedStation && (
              <motion.div
                initial={{ x: 380, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 380, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`absolute top-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-2xl z-10 flex flex-col overflow-hidden transition-all duration-300 ${
                  isListCollapsed ? "w-80 bottom-auto" : "w-96 bottom-4"
                }`}
              >
                <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-transparent flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">ایستگاه‌های دوچرخه</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{activeStationsCount} ایستگاه فعال در شهر</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Bike className="w-5 h-5 text-primary" /></div>
                      <button onClick={toggleListCollapse} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                        <ChevronUp className={`w-4 h-4 transition-transform duration-200 ${isListCollapsed ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                  </div>
                </div>
                {isListCollapsed ? (
                  <div className="p-4 text-center border-t border-border/50">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Bike className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">{stations?.length || 0} ایستگاه</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{totalAvailableBikes.toLocaleString()} دوچرخه آماده</p>
                  </div>
                ) : StationListContent}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {currentSelectedStation && (
              <motion.div
                initial={{ x: 380, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 380, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute top-4 right-4 bottom-4 w-96 bg-card/95 backdrop-blur-sm border border-primary/30 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col"
              >
                {StationDetailsContent}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* ──────────────────────────── MOBILE LAYOUT ──────────────────────────── */}
      {isMobile && (
        <>
          {/* Station details sheet (slides up from bottom) */}
          <AnimatePresence>
            {currentSelectedStation && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-x-0 bottom-0 z-50 bg-card/98 backdrop-blur-md border-t border-primary/30 rounded-t-2xl shadow-2xl flex flex-col"
                style={{ maxHeight: "80vh" }}
              >
                <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                  <div className="w-10 h-1 rounded-full bg-border/60" />
                </div>
                {StationDetailsContent}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Station list bottom sheet with snap states */}
          {/* BUG FIX 1 (Mobile sheet invisible):
              - Changed initial={{ y: "100%" }} → initial={{ y: 0 }}
                The sheet is always rendered at the bottom of the screen; only its
                HEIGHT changes between snap states. Animating `height` while keeping
                `y: "100%"` left the element translated fully off-screen — the height
                animation ran correctly but was never visible.
              - Changed exit={{ y: "100%" }} → exit={{ height: 0 }}
                Consistent with how the sheet enters: shrink away instead of sliding. */}
          <AnimatePresence>
            {!currentSelectedStation && (
              <motion.div
                ref={sheetRef}
                initial={{ y: 0 }}
                animate={{
                  height:
                    snapState === "peek"
                      ? "120px"
                      : snapState === "half"
                      ? "55vh"
                      : "88vh",
                }}
                exit={{ height: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 35 }}
                className="absolute inset-x-0 bottom-0 z-20 bg-card/98 backdrop-blur-md border-t border-border rounded-t-2xl shadow-2xl flex flex-col overflow-hidden"
              >
                {/* Drag handle */}
                <div
                  className="flex-shrink-0 touch-none select-none"
                  onTouchStart={handleDragStart}
                  onTouchMove={handleDragMove}
                  onTouchEnd={handleDragEnd}
                  onMouseDown={handleDragStart}
                  onMouseMove={handleDragMove}
                  onMouseUp={handleDragEnd}
                >
                  <div className="flex justify-center pt-3 pb-2">
                    <div className="w-10 h-1 rounded-full bg-border/60" />
                  </div>
                  <div className="px-4 pb-3 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-base">ایستگاه‌های دوچرخه</h3>
                        <p className="text-xs text-muted-foreground">{activeStationsCount} ایستگاه فعال</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/10">
                          <Bike className="w-4 h-4 text-primary" />
                          <span className="text-xs font-medium text-primary">{totalAvailableBikes} آماده</span>
                        </div>
                        <button
                          onClick={() =>
                            setSnapState((s) =>
                              s === "peek" ? "half" : s === "half" ? "full" : "peek"
                            )
                          }
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <ChevronUp
                            className={`w-4 h-4 transition-transform duration-300 ${
                              snapState === "full"
                                ? "rotate-180"
                                : snapState === "half"
                                ? "rotate-90"
                                : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {snapState !== "peek" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex flex-col flex-1 min-h-0"
                    >
                      {StationListContent}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}