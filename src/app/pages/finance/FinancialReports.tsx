import { ArrowRight, BarChart3, LineChart as LineChartIcon } from "lucide-react";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useData } from "../../../hooks/useData";

// Default monthly data in case API fails
const DEFAULT_MONTHLY_DATA = [
  { month: "فروردین", revenue: 0 },
  { month: "اردیبهشت", revenue: 0 },
  { month: "خرداد", revenue: 0 },
  { month: "تیر", revenue: 0 },
  { month: "مرداد", revenue: 0 },
  { month: "شهریور", revenue: 0 },
  { month: "مهر", revenue: 0 },
  { month: "آبان", revenue: 0 },
  { month: "آذر", revenue: 0 },
  { month: "دی", revenue: 0 },
  { month: "بهمن", revenue: 0 },
  { month: "اسفند", revenue: 0 },
];

interface MonthlyData {
  month: string;
  revenue: number;
}

export function FinancialReports() {
  const [chartType, setChartType] = useState<"recharts" | "simple">("recharts");
  const { data: apiData, loading, error } = useData("getMonthlyData", DEFAULT_MONTHLY_DATA);
  
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>(DEFAULT_MONTHLY_DATA);

  // Update monthly data when API data arrives
  useEffect(() => {
    if (!loading && Array.isArray(apiData) && apiData.length > 0) {
      setMonthlyData(apiData as MonthlyData[]);
    }
  }, [apiData, loading]);

  const maxRevenue = monthlyData.length > 0 
    ? Math.max(...monthlyData.map((d) => d.revenue))
    : 0;

  const totalRevenue = monthlyData.reduce((sum, d) => sum + d.revenue, 0);
  const averageRevenue = monthlyData.length > 0 
    ? totalRevenue / monthlyData.length 
    : 0;
  const highestMonth = monthlyData.find((d) => d.revenue === maxRevenue);

  // Debug logging
  if (error) {
    console.warn("Using default monthly data due to API error:", error);
  }
  console.log("Monthly data being used:", monthlyData);

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Link to="/finance">
              <button className="cursor-pointer px-3 py-1 bg-secondary text-secondary-foreground rounded text-xs hover:bg-secondary/80 transition-colors flex items-center gap-1">
                <ArrowRight className="w-3 h-3" />
                بازگشت
              </button>
            </Link>
            <h1 className="text-2xl font-semibold m-0">گزارش مالی جامع</h1>
          </div>
          <p className="text-muted-foreground mt-1">گزارشات استفاده، پرداخت و شارژ</p>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">در حال بارگذاری داده‌های مالی...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link to="/finance">
            <button className="cursor-pointer px-3 py-1 bg-secondary text-secondary-foreground rounded text-xs hover:bg-secondary/80 transition-colors flex items-center gap-1">
              <ArrowRight className="w-3 h-3" />
              بازگشت
            </button>
          </Link>
          <h1 className="text-2xl font-semibold m-0">گزارش مالی جامع</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          گزارشات استفاده، پرداخت و شارژ
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">درآمد ماهانه ۱۴۰۳</h2>
            <p className="text-xs text-muted-foreground mt-0.5">(میلیون تومان)</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setChartType("recharts")}
              className={`cursor-pointer p-2 rounded-lg transition ${
                chartType === "recharts"
                  ? "bg-primary text-white"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              <LineChartIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType("simple")}
              className={`cursor-pointer p-2 rounded-lg transition ${
                chartType === "simple"
                  ? "bg-primary text-white"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-6">
          {chartType === "recharts" ? (
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="month"
                    stroke="#a0a0ab"
                    style={{ fontSize: "11px", fontFamily: "Vazirmatn" }}
                  />
                  <YAxis
                    stroke="#a0a0ab"
                    style={{ fontSize: "11px", fontFamily: "Vazirmatn" }}
                    tickFormatter={(value) => `${value}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#16161d",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontFamily: "Vazirmatn",
                    }}
                    labelStyle={{ color: "#e5e5e7" }}
                    formatter={(value: number) => [`${value} میلیون تومان`, "درآمد"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#b666d2"
                    strokeWidth={2}
                    dot={{ fill: "#b666d2", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="space-y-3">
              {monthlyData.map((item) => (
                <div key={item.month} className="flex items-center gap-3">
                  <div className="w-20 text-sm text-muted-foreground">{item.month}</div>
                  <div className="flex-1">
                    <div className="h-8 bg-white/5 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-end px-3 text-xs text-white font-medium transition-all"
                        style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                      >
                        {item.revenue}M
                      </div>
                    </div>
                  </div>
                  <div className="w-12 text-sm text-foreground text-left">
                    {item.revenue}M
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Additional Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="text-muted-foreground text-sm mb-1">کل درآمد سال</div>
          <div className="text-3xl font-semibold text-status-active">
            {(totalRevenue / 1000).toFixed(1)}B
          </div>
          <div className="text-xs text-muted-foreground mt-2">تومان</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="text-muted-foreground text-sm mb-1">میانگین درآمد ماهانه</div>
          <div className="text-3xl font-semibold text-primary">
            {averageRevenue.toFixed(0)}M
          </div>
          <div className="text-xs text-muted-foreground mt-2">میلیون تومان</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="text-muted-foreground text-sm mb-1">بیشترین درآمد ماه</div>
          <div className="text-3xl font-semibold text-status-active">{maxRevenue}M</div>
          <div className="text-xs text-muted-foreground mt-2">
            {highestMonth?.month || "—"}
          </div>
        </div>
      </div>
    </div>
  );
}