import { Users as UsersIcon, UserPlus, TrendingUp, Search } from "lucide-react";
import { useState } from "react";
import { useData } from "../../hooks/useData";

// Default users in case API fails
const DEFAULT_USERS = [
  {
    id: "1001",
    name: "علی محمدی",
    initials: "ع.م",
    phone: "0912-345-6789",
    trips: 48,
    balance: "120,000",
    status: "active",
    joined: "1402/08/15",
    gradient: "linear-gradient(135deg, #b666d2, #9333ea)",
  },
  {
    id: "1002",
    name: "سارا رضایی",
    initials: "س.ر",
    phone: "0935-678-9012",
    trips: 123,
    balance: "350,000",
    status: "active",
    joined: "1402/06/20",
    gradient: "linear-gradient(135deg, #10b981, #0891b2)",
  },
  {
    id: "1003",
    name: "محمد کریمی",
    initials: "م.ک",
    phone: "0911-234-5678",
    trips: 7,
    balance: "0",
    status: "inactive",
    joined: "1402/10/3",
    gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
  },
  {
    id: "1004",
    name: "فاطمه حسینی",
    initials: "ف.ح",
    phone: "0901-456-7890",
    trips: 89,
    balance: "280,000",
    status: "active",
    joined: "1402/05/11",
    gradient: "linear-gradient(135deg, #6366f1, #b666d2)",
  },
  {
    id: "1005",
    name: "امیر نجفی",
    initials: "ا.ن",
    phone: "0914-789-0123",
    trips: 2,
    balance: "50,000",
    status: "blocked",
    joined: "1402/11/28",
    gradient: "linear-gradient(135deg, #ef4444, #f97316)",
  },
];

interface User {
  id: string;
  name: string;
  initials: string;
  phone: string;
  trips: number;
  balance: string;
  status: "active" | "inactive" | "blocked";
  joined: string;
  gradient: string;
}

export function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Fetch users from API
  const { data: apiUsers, loading, error } = useData("getUsers", DEFAULT_USERS);
  
  // Use API data if available, otherwise use defaults
  const users = (!loading && Array.isArray(apiUsers) && apiUsers.length > 0)
    ? apiUsers as User[]
    : DEFAULT_USERS;

  // Filter users based on search and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.includes(searchTerm) || user.phone.includes(searchTerm) || user.id.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate KPI statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "active").length;
  const newUsersThisMonth = 342; // This would come from API ideally
  const activePercentage = ((activeUsers / totalUsers) * 100).toFixed(1);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="px-2 py-1 rounded text-xs bg-status-active/10 text-status-active">فعال</span>;
      case "inactive":
        return <span className="px-2 py-1 rounded text-xs bg-status-pending/10 text-status-pending">غیرفعال</span>;
      case "blocked":
        return <span className="px-2 py-1 rounded text-xs bg-status-failed/10 text-status-failed">مسدود</span>;
      default:
        return null;
    }
  };

  // Debug logging
  if (error) {
    console.warn("Using default users due to API error:", error);
  }
  console.log("Users being used:", users.length);

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl mb-1">مدیریت کاربران</h1>
          <p className="text-muted-foreground text-sm">مشاهده و مدیریت کاربران سیستم</p>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">در حال بارگذاری کاربران...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl mb-1">مدیریت کاربران</h1>
        <p className="text-muted-foreground text-sm">مشاهده و مدیریت کاربران سیستم</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-5 flex items-center justify-between">
          <div>
            <div className="text-muted-foreground text-xs mb-1">کل کاربران</div>
            <div className="text-2xl font-semibold">{totalUsers.toLocaleString()}</div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <UsersIcon className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 flex items-center justify-between">
          <div>
            <div className="text-muted-foreground text-xs mb-1">کاربران فعال</div>
            <div className="text-2xl font-semibold flex items-center gap-2">
              {activeUsers.toLocaleString()}
              <span className="w-2 h-2 bg-status-active rounded-full animate-pulse"></span>
            </div>
            <div className="text-xs text-status-active mt-1">{activePercentage}٪ از کل کاربران</div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-status-active/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-status-active" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 flex items-center justify-between">
          <div>
            <div className="text-muted-foreground text-xs mb-1">ثبت‌نام این ماه</div>
            <div className="text-2xl font-semibold">{newUsersThisMonth.toLocaleString()}</div>
            <div className="text-xs text-status-active mt-1">↑ ۱۸٪ رشد</div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-medium">لیست کاربران</h2>
          <div className="flex gap-2 items-center flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="جستجو..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-9 px-3 py-2 bg-white/5 border border-border rounded-lg text-sm outline-none focus:border-primary transition-all w-44"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-border rounded-lg text-sm outline-none focus:border-primary transition-all cursor-pointer"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
              <option value="blocked">مسدود</option>
            </select>
            
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors cursor-pointer">
              + کاربر جدید
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/20">
              <tr>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">کاربر</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">شماره تلفن</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">تعداد سفرها</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">موجودی کیف پول</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">وضعیت</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">تاریخ ثبت‌نام</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                        style={{ background: user.gradient }}
                      >
                        {user.initials}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" dir="ltr" style={{ textAlign: "right" }}>
                    {user.phone}
                  </td>
                  <td className="px-4 py-3 text-sm">{user.trips.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">{user.balance} تومان</td>
                  <td className="px-4 py-3">{getStatusBadge(user.status)}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{user.joined}</td>
                  <td className="px-4 py-3">
                    <button className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-xs hover:bg-secondary/80 transition-colors cursor-pointer">
                      ویرایش
                    </button>
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
          
          {/* No results message */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              هیچ کاربری با این مشخصات یافت نشد
            </div>
          )}
        </div>
        
        {/* Table footer with stats */}
        <div className="p-3 border-t border-border text-center text-xs text-muted-foreground">
          نمایش {filteredUsers.length} از {users.length} کاربر
        </div>
      </div>
    </div>
  );
}