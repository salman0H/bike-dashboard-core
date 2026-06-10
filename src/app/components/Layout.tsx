import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans rtl" dir="rtl">
      {!isLoginPage && (
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      )}
      
      {/* Main content */}
      <main
        className={`transition-all duration-300 ${
          !isLoginPage && !isMobile && sidebarOpen ? "opacity-25" : ""
        } min-h-screen`}
      >
        {!isLoginPage && <Header />}
        <Outlet />
      </main>
    </div>
  );
}