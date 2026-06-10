import { useState, useEffect } from "react";
import { Bike, Activity, TrendingUp, BarChart3, DollarSign, Zap, Battery } from "lucide-react";
import { KpiCard } from "../components/KpiCard";
import { AlertCard } from "../components/AlertCard";
import { RevenueChart } from "../components/RevenueChart";
import { UsageChart } from "../components/UsageChart";
import { BikeStatusChart } from "../components/BikeStatusChart";
import { BatteryHealthChart } from "../components/BatteryHealthChart";
import { useData } from "../../hooks/useData";

// Default alerts in case API fails
const DEFAULT_ALERTS = [
  {
    id: "1",
    type: "battery" as const,
    bikeId: "BK-1234",
    message: "سطح باتری کمتر از 10٪ - نیاز به شارژ فوری",
    timestamp: "5 دقیقه پیش",
    severity: "critical" as const,
  },
  {
    id: "2",
    type: "movement" as const,
    bikeId: "BK-5678",
    message: "حرکت بدون سفر فعال - احتمال سرقت",
    timestamp: "12 دقیقه پیش",
    severity: "critical" as const,
  },
];

export function Dashboard() {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1028);

  // Fetch alerts from API
  const { data: apiAlerts, loading, error } = useData("getAlerts", DEFAULT_ALERTS);

  const kpiData = {
    totalBikes: 1247,
    inUseBikes: 89,
    todayRevenue: "۴.۸M",
    systemUptime: "۹۹.۸%",
  };

  // Transform API alerts to match AlertCard expected format
  const alerts = !loading && Array.isArray(apiAlerts) && apiAlerts.length > 0
    ? apiAlerts.map((alert: any) => ({
        id: String(alert.id),
        type: alert.type as "battery" | "movement" | "lock",
        bikeId: alert.bikeId,
        message: alert.message,
        timestamp: alert.timestamp,
        severity: alert.severity as "critical" | "warning",
      }))
    : DEFAULT_ALERTS;

  const handleAlertAction = (alertId: string) => {
    console.log("Action taken for alert:", alertId);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1028);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Debug logging
  if (error) {
    console.warn("Using default alerts due to API error:", error);
  }
  console.log("Alerts being passed to AlertCard:", alerts);

  // Large screen (≥1028px) with fixed height and internal scroll
  if (isLargeScreen) {
    return (
      <div className="p-6 h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          
          {/* Right Side: KPIs and Charts - 8 columns */}
          <div className="lg:col-span-8 flex flex-col gap-3 h-full overflow-y-auto custom-scroll">
            {/* Top Row: 4 KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
              <KpiCard
                title="تعداد کل دوچرخه‌ها"
                value={kpiData.totalBikes}
                icon={<Bike className="w-5 h-5 text-primary" />}
              />
              <KpiCard
                title="دوچرخه‌های در حال استفاده"
                value={kpiData.inUseBikes}
                icon={<Activity className="w-5 h-5 text-primary" />}
                pulse
              />
              <KpiCard
                title="درآمد امروز"
                value={kpiData.todayRevenue}
                icon={<DollarSign className="w-5 h-5 text-primary" />}
                trend={{ value: 12, isPositive: true }}
              />
              <KpiCard
                title="عملکرد سیستم"
                value={kpiData.systemUptime}
                icon={<Zap className="w-5 h-5 text-primary" />}
              />
            </div>

            {/* Charts Grid - 2x2 Grid for 4 Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Chart 1: Revenue Chart */}
              <div className="bg-card border border-border rounded-lg hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">نمودار درآمد</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">۷ روز اخیر (تومان)</p>
                    </div>
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="h-[200px]">
                    <RevenueChart />
                  </div>
                </div>
              </div>

              {/* Chart 2: Usage Chart */}
              <div className="bg-card border border-border rounded-lg hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">نمودار استفاده</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">سفرها در روز</p>
                    </div>
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="h-[200px]">
                    <UsageChart />
                  </div>
                </div>
              </div>

              {/* Chart 3: Bike Status Chart */}
              <div className="bg-card border border-border rounded-lg hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
                <div className="p-2 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">وضعیت دوچرخه‌ها</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">توزیع فعلی ناوگان</p>
                    </div>
                    <BarChart3 className="w-7 h-7 text-primary" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-center gap-6 flex-wrap">
                    <div className="w-28 h-28">
                      <BikeStatusChart />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-status-active"></span>
                        <div className="text-xs">
                          <span className="text-muted-foreground">موجود:</span>
                          <span className="font-semibold mr-1">۸۴۲</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                        <div className="text-xs">
                          <span className="text-muted-foreground">در استفاده:</span>
                          <span className="font-semibold mr-1">۸۹</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-status-pending"></span>
                        <div className="text-xs">
                          <span className="text-muted-foreground">در تعمیر:</span>
                          <span className="font-semibold mr-1">۳۱۶</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart 4: Battery Health Chart*/}
              <div className="bg-card border border-border rounded-lg hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">وضعیت باتری دوچرخه‌ها</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">سطح سلامت باتری ناوگان</p>
                    </div>
                    <Battery className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="h-[200px]">
                    <BatteryHealthChart />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Side: Critical Alerts Card - 4 columns with scroll */}
          <div className="lg:col-span-4 h-full min-h-0 pb-8">
            {loading ? (
              <div className="bg-card border border-border rounded-lg h-full flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">در حال بارگذاری هشدارها...</p>
                </div>
              </div>
            ) : (
              <AlertCard alerts={alerts} onAction={handleAlertAction} />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Small/Medium screen (<1028px) with page scrolling, no internal scrolls
  return (
    <div className="p-4 md:p-6 min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="flex flex-col gap-6">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4">
          <KpiCard
            title="تعداد کل دوچرخه‌ها"
            value={kpiData.totalBikes}
            icon={<Bike className="w-5 h-5 text-primary" />}
          />
          <KpiCard
            title="دوچرخه‌های در حال استفاده"
            value={kpiData.inUseBikes}
            icon={<Activity className="w-5 h-5 text-primary" />}
            pulse
          />
          <KpiCard
            title="درآمد امروز"
            value={kpiData.todayRevenue}
            icon={<DollarSign className="w-5 h-5 text-primary" />}
            trend={{ value: 12, isPositive: true }}
          />
          <KpiCard
            title="عملکرد سیستم"
            value={kpiData.systemUptime}
            icon={<Zap className="w-5 h-5 text-primary" />}
          />
        </div>

        {/* Alerts Section - Full width on mobile */}
        <div>
          {loading ? (
            <div className="bg-card border border-border rounded-lg p-6 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">در حال بارگذاری هشدارها...</p>
              </div>
            </div>
          ) : (
            <AlertCard alerts={alerts} onAction={handleAlertAction} />
          )}
        </div>

        {/* Charts Grid - Stack vertically on mobile */}
        <div className="space-y-5">
          {/* Chart 1: Revenue Chart */}
          <div className="bg-card border border-border rounded-lg hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">نمودار درآمد</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">۷ روز اخیر (تومان)</p>
                </div>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="p-4">
              <div className="h-[250px]">
                <RevenueChart />
              </div>
            </div>
          </div>

          {/* Chart 2: Usage Chart */}
          <div className="bg-card border border-border rounded-lg hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">نمودار استفاده</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">سفرها در روز</p>
                </div>
                <Activity className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="p-4">
              <div className="h-[250px]">
                <UsageChart />
              </div>
            </div>
          </div>

          {/* Chart 3: Bike Status Chart */}
          <div className="bg-card border border-border rounded-lg hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">وضعیت دوچرخه‌ها</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">توزیع فعلی ناوگان</p>
                </div>
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center gap-8 flex-wrap">
                <div className="w-32 h-32">
                  <BikeStatusChart />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-status-active"></span>
                    <div className="text-sm">
                      <span className="text-muted-foreground">موجود:</span>
                      <span className="font-semibold mr-1 text-status-active">۸۴۲</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary"></span>
                    <div className="text-sm">
                      <span className="text-muted-foreground">در استفاده:</span>
                      <span className="font-semibold mr-1 text-primary">۸۹</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-status-pending"></span>
                    <div className="text-sm">
                      <span className="text-muted-foreground">در تعمیر:</span>
                      <span className="font-semibold mr-1 text-status-pending">۳۱۶</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart 4: Battery Health Chart */}
          <div className="bg-card border border-border rounded-lg hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">وضعیت باتری دوچرخه‌ها</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">سطح سلامت باتری ناوگان</p>
                </div>
                <Battery className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="p-4">
              <div className="h-[250px]">
                <BatteryHealthChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}