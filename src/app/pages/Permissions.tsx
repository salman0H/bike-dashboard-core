import { useState, useEffect } from "react";
import { Shield, Users, HelpCircle, FileText } from "lucide-react";
import { useData } from "../../hooks/useData";

// Default roles in case API fails
const DEFAULT_ROLES = [
  {
    id: "super-admin",
    name: "سوپر ادمین",
    userCount: 2,
    badge: "کامل",
    badgeColor: "bg-primary/10 text-primary",
    icon: "Shield",
    permissions: {
      users: true,
      bikes: true,
      finance: true,
      settings: true,
      permissions: true,
    },
  },
  {
    id: "operator",
    name: "مدیر عملیاتی",
    userCount: 5,
    badge: "محدود",
    badgeColor: "bg-blue-500/10 text-blue-500",
    icon: "Users",
    permissions: {
      users: true,
      bikes: true,
      finance: false,
      settings: false,
      permissions: false,
    },
  },
];

// Map icon strings to actual components
const iconMap: Record<string, React.ComponentType<any>> = {
  Shield: Shield,
  Users: Users,
  HelpCircle: HelpCircle,
  FileText: FileText,
};

interface Role {
  id: string;
  name: string;
  userCount: number;
  badge: string;
  badgeColor: string;
  icon: string;
  permissions: {
    users: boolean;
    bikes: boolean;
    finance: boolean;
    settings: boolean;
    permissions: boolean;
  };
}

export function Permissions() {
  const { data: apiRoles, loading, error } = useData("getRoles", DEFAULT_ROLES);
  
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES);

  // Update roles when API data arrives
  useEffect(() => {
    if (!loading && Array.isArray(apiRoles) && apiRoles.length > 0) {
      setRoles(apiRoles as Role[]);
    }
  }, [apiRoles, loading]);

  const permissionLabels = {
    users: "مدیریت کاربران",
    bikes: "مدیریت دوچرخه‌ها",
    finance: "گزارش مالی",
    settings: "تنظیمات سیستم",
    permissions: "مدیریت دسترسی‌ها",
  };

  const togglePermission = (roleId: string, permission: keyof typeof roles[0]["permissions"]) => {
    setRoles(
      roles.map((role) =>
        role.id === roleId
          ? { ...role, permissions: { ...role.permissions, [permission]: !role.permissions[permission] } }
          : role
      )
    );
  };

  // Debug logging
  if (error) {
    console.warn("Using default roles due to API error:", error);
  }
  console.log("Roles being used:", roles);

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl mb-1">دسترسی‌ها</h1>
          <p className="text-muted-foreground text-sm">مدیریت نقش‌ها و سطوح دسترسی</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">در حال بارگذاری نقش‌ها...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl mb-1">دسترسی‌ها</h1>
        <p className="text-muted-foreground text-sm">مدیریت نقش‌ها و سطوح دسترسی</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => {
          const Icon = iconMap[role.icon] || Shield;
          return (
            <div key={role.id} className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{role.name}</div>
                  <div className="text-xs text-muted-foreground">{role.userCount} کاربر</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${role.badgeColor}`}>{role.badge}</span>
              </div>
              <div className="space-y-3">
                {Object.entries(permissionLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="text-sm">{label}</div>
                    <button
                      onClick={() => togglePermission(role.id, key as keyof typeof role.permissions)}
                      className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                        role.permissions[key as keyof typeof role.permissions] ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                          role.permissions[key as keyof typeof role.permissions]
                            ? "translate-x-[-18px]"
                            : "translate-x-[-3px]"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}