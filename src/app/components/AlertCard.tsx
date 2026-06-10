import { AlertTriangle, Battery, Lock } from "lucide-react";
import { motion } from "motion/react";

interface Alert {
  id: string;
  type: "battery" | "movement" | "lock";
  bikeId: string;
  message: string;
  timestamp: string;
  severity: "critical" | "warning";
}

interface AlertCardProps {
  alerts: Alert[];
  onAction: (alertId: string) => void;
}

export function AlertCard({ alerts, onAction }: AlertCardProps) {
  const getIcon = (type: Alert["type"]) => {
    switch (type) {
      case "battery":
        return Battery;
      case "movement":
        return AlertTriangle;
      case "lock":
        return Lock;
    }
  };

  const getStatusColor = (severity: Alert["severity"]) => {
    return severity === "critical" ? "var(--status-failed)" : "var(--status-pending)";
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 col-span-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-destructive/10">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <h2 className="text-xl">مرکز هشدارهای بحرانی</h2>
        </div>
        <span className="text-sm text-muted-foreground">
          {alerts.length} هشدار فعال
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1">
        {alerts.map((alert, index) => {
          const Icon = getIcon(alert.type);
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between gap-4 p-4 rounded-lg bg-muted/5 border border-border hover:border-primary/30"
            >
              <div className="flex items-center gap-4 flex-1">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${getStatusColor(alert.severity)}20` }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: getStatusColor(alert.severity) }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">دوچرخه {alert.bikeId}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${getStatusColor(alert.severity)}20`,
                        color: getStatusColor(alert.severity),
                      }}
                    >
                      {alert.severity === "critical" ? "بحرانی" : "هشدار"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <span className="text-xs text-muted-foreground/70 mt-1 block">
                    {alert.timestamp}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onAction(alert.id)}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors whitespace-nowrap"
              >
                اقدام
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
