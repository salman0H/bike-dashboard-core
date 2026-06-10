// src/components/KpiCard.tsx
import { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;  // This should be ReactNode, not a component
  trend?: { value: number; isPositive: boolean };
  pulse?: boolean;
  status?: string;
}

export function KpiCard({ title, value, icon, trend, pulse, status }: KpiCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 flex items-center justify-between hover:border-primary/50 transition-all">
      <div>
        <div className="text-muted-foreground text-sm">{title}</div>
        <div className="text-3xl font-semibold flex items-center gap-2 mt-1">
          {value}
          {pulse && (
            <div className="relative w-2 h-2">
              <div className="absolute w-2 h-2 bg-status-active rounded-full"></div>
              <div className="absolute w-2 h-2 bg-status-active rounded-full animate-ping"></div>
            </div>
          )}
        </div>
        {trend && (
          <div className={`text-xs mt-1.5 ${trend.isPositive ? "text-status-active" : "text-destructive"}`}>
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}٪ نسبت به دیروز
          </div>
        )}
      </div>
      <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
    </div>
  );
}