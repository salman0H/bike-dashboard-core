import { Link, useLocation } from "react-router";
import { Menu, X, Home, Users, Bike, DollarSign, Settings, Shield, ChevronDown, HelpCircle, FileText, BarChart3, Activity } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { useData } from "../../hooks/useData";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface SubMenuItem {
  path: string;
  label: string;
}

interface MenuItem {
  path: string;
  label: string;
  icon: string;
  submenu?: SubMenuItem[];
}

// Default menu items in case API fails
const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { path: "/", label: "صفحه اصلی", icon: "Home" },
  { path: "/users", label: "کاربران", icon: "Users" },
  { path: "/bikes", label: "دوچرخه و دستگاه‌ها", icon: "Bike" },
  {
    path: "/finance",
    label: "امور مالی",
    icon: "DollarSign",
    submenu: [
      { path: "/finance/policies", label: "سیاست‌ها" },
      { path: "/finance/payment-reports", label: "گزارش پرداخت/کیف پول" },
      { path: "/finance/financial-reports", label: "گزارش مالی (استفاده/پرداخت/شارژ)" },
    ],
  },
  { path: "/settings", label: "(پیش فرض)تنظیمات", icon: "Settings" },
  { path: "/permissions", label: "دسترسی‌ها", icon: "Shield" },
];

// Map icon strings to actual Lucide components
const iconMap: Record<string, React.ComponentType<any>> = {
  Home: Home,
  Users: Users,
  Bike: Bike,
  DollarSign: DollarSign,
  Settings: Settings,
  Shield: Shield,
  HelpCircle: HelpCircle,
  FileText: FileText,
  BarChart3: BarChart3,
  Activity: Activity,
};

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();
  const [financeExpanded, setFinanceExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Fetch menu items from API
  const { data: apiMenuItems, loading, error } = useData("getMenuItems", DEFAULT_MENU_ITEMS);
  
  // Use API data if available, otherwise use defaults
  const menuItems = (!loading && Array.isArray(apiMenuItems) && apiMenuItems.length > 0)
    ? apiMenuItems as MenuItem[]
    : DEFAULT_MENU_ITEMS;

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        // Don't close if clicking on hamburger button
        const hamburgerButton = document.querySelector('.hamburger-button');
        if (hamburgerButton && hamburgerButton.contains(event.target as Node)) {
          return;
        }
        onToggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  // Close sidebar when clicking on a link (mobile only)
  const handleLinkClick = () => {
    if (isMobile) {
      onToggle();
    }
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Check if any finance submenu is active to keep it expanded
  useEffect(() => {
    const isFinanceActive = menuItems.find(item => 
      item.path === "/finance" && 
      item.submenu?.some(sub => location.pathname === sub.path)
    );
    if (isFinanceActive) {
      setFinanceExpanded(true);
    }
  }, [location.pathname, menuItems]);

  // Debug logging
  if (error) {
    console.warn("Using default menu items due to API error:", error);
  }

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 p-2.5 rounded-lg bg-primary hover:bg-primary/85 transition-all shadow-lg shadow-primary/30 cursor-pointer hamburger-button"
      >
        {isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
      </button>

      {/* Overlay for mobile - closes sidebar when clicked */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.02 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            ref={sidebarRef}
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed right-0 top-0 bg-card border-l border-border z-40 flex flex-col shadow-2xl ${
              isMobile ? "w-full h-screen" : "w-72 h-screen"
            }`}
          >
            {/* Close button for mobile (inside sidebar) */}
            {isMobile && (
              <button
                onClick={onToggle}
                className="absolute top-4 left-4 z-50 p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto pt-20 px-4 pb-4">
              {/* Logo */}
              <div className="mb-8 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/30">
                    <Bike className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-foreground">BikeShare</h2>
                    <p className="text-xs text-muted-foreground">پنل مدیریت</p>
                  </div>
                </div>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = iconMap[item.icon] || Home;
                  return (
                    <div key={item.path}>
                      {item.submenu ? (
                        <>
                          <button
                            onClick={() => setFinanceExpanded(!financeExpanded)}
                            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                              isActive(item.path)
                                ? "bg-primary/10 text-primary"
                                : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5" />
                              <span className="text-sm">{item.label}</span>
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                financeExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {financeExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="mr-7 mt-1 space-y-1 border-r border-border pr-3">
                                  {item.submenu.map((subItem) => (
                                    <Link
                                      key={subItem.path}
                                      to={subItem.path}
                                      onClick={handleLinkClick}
                                      className={`block px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                                        location.pathname === subItem.path
                                          ? "bg-primary/10 text-primary"
                                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                      }`}
                                    >
                                      {subItem.label}
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          to={item.path}
                          onClick={handleLinkClick}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive(item.path)
                              ? "bg-primary/10 text-primary"
                              : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="flex-shrink-0 border-t border-border p-4">
              <p className="text-xs text-muted-foreground text-center">© ۱۴۰۵ BikeShare</p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}