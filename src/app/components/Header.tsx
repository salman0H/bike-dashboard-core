import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { Bell, User, LogOut, Settings as SettingsIcon, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useData } from "../../hooks/useData";

// Default notifications in case API fails
const DEFAULT_NOTIFICATIONS = [
  { id: 0, message: "پیش فرض", time: "پیش فرض", type: "warning" }
];

interface Notification {
  id: number;
  message: string;
  time: string;
  type: "critical" | "warning" | "success" | "info";
}

export function Header() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  // Fetch notifications from API
  const { data: apiNotifications, loading, error } = useData("getNotifications", DEFAULT_NOTIFICATIONS);
  
  // Use API data if available, otherwise use defaults
  const notifications = (!loading && Array.isArray(apiNotifications) && apiNotifications.length > 0)
    ? apiNotifications as Notification[]
    : DEFAULT_NOTIFICATIONS;

  const notificationCount = notifications.length;

  // Debug logging
  if (error) {
    console.warn("Using default notifications due to API error:", error);
  }
  
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    navigate("/login");
    setShowProfile(false);
  };

  const handleNavigateToProfile = () => {
    navigate("/settings", { state: { activeTab: "profile" } });
    setShowProfile(false);
  };

  const handleNavigateToSettings = () => {
    navigate("/settings");
    setShowProfile(false);
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-status-failed";
      case "warning":
        return "bg-status-pending";
      case "success":
        return "bg-status-active";
      default:
        return "bg-primary";
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-card/95 border-b border-border backdrop-blur-xl bg-opacity-95 shadow-lg shadow-primary/5">
      <div className="flex items-center justify-between h-16 px-6 pr-20">
        {/* Left Section: Empty spacer for balance */}
        <div className="flex-1"></div>

        {/* Center Section: System Title */}
        <div className="flex-1 flex justify-center">
          <h1 className="text-xl font-bold">داشبورد مدیریت</h1>
        </div>

        {/* Right Section: Notifications & Profile with space for hamburger */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="cursor-pointer relative p-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <Bell className="w-5 h-5 hover:text-primary transition-colors" />
              {notificationCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -left-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground shadow-lg shadow-primary/50"
                >
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {notificationCount}
                  </motion.span>
                </motion.span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  ></div>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 top-12 w-80 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-border">
                      <h3 className="font-medium">اعلان‌ها</h3>
                      {loading && (
                        <span className="text-xs text-muted-foreground mr-2">در حال به‌روزرسانی...</span>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="p-4 border-b border-border hover:bg-sidebar-accent transition-colors cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-1.5 ${getNotificationColor(notification.type)}`}
                            ></div>
                            <div className="flex-1">
                              <p className="text-sm">{notification.message}</p>
                              <span className="text-xs text-muted-foreground">
                                {notification.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {notifications.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">هیچ اعلانی وجود ندارد</p>
                        </div>
                      )}
                    </div>
                    <div className="p-3 border-t border-border text-center">
                      <button className="text-sm text-primary hover:underline">
                        مشاهده همه اعلان‌ها
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm font-medium">مدیر سیستم</div>
                  <div className="text-xs text-muted-foreground">admin@bikeshare.ir</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-lg shadow-primary/30">
                  <User className="w-5 h-5" />
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showProfile ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {showProfile && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfile(false)}
                  ></div>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 top-12 w-56 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-2">
                      <button
                        onClick={handleNavigateToProfile}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors text-right cursor-pointer"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm">پروفایل من</span>
                      </button>
                      <button
                        onClick={handleNavigateToSettings}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors text-right cursor-pointer"
                      >
                        <SettingsIcon className="w-4 h-4" />
                        <span className="text-sm">تنظیمات</span>
                      </button>
                      <div className="border-t border-border my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors text-right cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">خروج</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}