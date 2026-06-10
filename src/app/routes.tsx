import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Users } from "./pages/Users";
import { Bikes } from "./pages/Bikes";
import { Finance } from "./pages/Finance";
import { Policies } from "./pages/finance/Policies";
import { PaymentReports } from "./pages/finance/PaymentReports";
import { FinancialReports } from "./pages/finance/FinancialReports";
import { Settings } from "./pages/Settings";
import { Permissions } from "./pages/Permissions";

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    // Login page without layout (no sidebar/header)
    path: "/login",
    Component: Login,
  },
  {
    // All authenticated pages with Layout (sidebar + header)
    path: "/",
    Component: Layout,
    children: [
      { 
        index: true, 
        element: <Navigate to="/dashboard" replace /> 
      },
      { 
        path: "dashboard", 
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      { 
        path: "users", 
        element: (
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        )
      },
      { 
        path: "bikes", 
        element: (
          <ProtectedRoute>
            <Bikes />
          </ProtectedRoute>
        )
      },
      { 
        path: "finance", 
        element: (
          <ProtectedRoute>
            <Finance />
          </ProtectedRoute>
        )
      },
      { 
        path: "finance/policies", 
        element: (
          <ProtectedRoute>
            <Policies />
          </ProtectedRoute>
        )
      },
      { 
        path: "finance/payment-reports", 
        element: (
          <ProtectedRoute>
            <PaymentReports />
          </ProtectedRoute>
        )
      },
      { 
        path: "finance/financial-reports", 
        element: (
          <ProtectedRoute>
            <FinancialReports />
          </ProtectedRoute>
        )
      },
      { 
        path: "settings", 
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        )
      },
      { 
        path: "permissions", 
        element: (
          <ProtectedRoute>
            <Permissions />
          </ProtectedRoute>
        )
      },
    ],
  },
]);