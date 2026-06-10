import { useState } from "react";
import { User, Monitor, Bell, Lock } from "lucide-react";

export function Settings() {
  const [activeTab, setActiveTab] = useState<"profile" | "system" | "notifications" | "security">("profile");
  const [notifications, setNotifications] = useState({
    battery: true,
    theft: true,
    newUser: false,
    dailyReport: true,
    systemFailure: true,
  });

  const tabs = [
    { id: "profile" as const, label: "پروفایل", icon: User },
    { id: "system" as const, label: "سیستم", icon: Monitor },
    { id: "notifications" as const, label: "اعلان‌ها", icon: Bell },
    { id: "security" as const, label: "امنیت", icon: Lock },
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl mb-1">تنظیمات</h1>
        <p className="text-muted-foreground text-sm">پیکربندی سیستم و تنظیمات عمومی</p>
      </div>

      {/* Mobile tabs (grid) - visible only on small screens */}
      <div className="grid grid-cols-2 gap-2 mb-6 md:hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Desktop layout: sidebar on the left + content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar - hidden on mobile, visible on md+ */}
        <div className="hidden md:block w-48 flex-shrink-0">
          <div className="bg-card border border-border rounded-lg p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content - same for all screen sizes */}
        <div className="flex-1 bg-card border border-border rounded-lg">
          {activeTab === "profile" && (
            <div>
              <div className="p-5 border-b border-border">
                <h2 className="font-medium mb-1">پروفایل</h2>
                <p className="text-xs text-muted-foreground">اطلاعات شخصی مدیر سیستم</p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 pb-6 mb-6 border-b border-border">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">مدیر سیستم</div>
                    <div className="text-sm text-muted-foreground">admin@bikeshare.ir</div>
                    <button className="cursor-pointer mt-2 px-3 py-1 bg-secondary text-secondary-foreground rounded text-xs hover:bg-secondary/80 transition-colors">
                      تغییر عکس
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">نام</label>
                    <input
                      type="text"
                      defaultValue="محمدرضا"
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">نام خانوادگی</label>
                    <input
                      type="text"
                      defaultValue="احمدی"
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">ایمیل</label>
                  <input
                    type="email"
                    defaultValue="admin@bikeshare.ir"
                    dir="ltr"
                    style={{ textAlign: "right" }}
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">شماره تماس</label>
                  <input
                    type="tel"
                    defaultValue="021-8888-9999"
                    dir="ltr"
                    style={{ textAlign: "right" }}
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button className="cursor-pointer px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm hover:bg-secondary/80 transition-colors">
                    انصراف
                  </button>
                  <button className="cursor-pointer px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">
                    ذخیره تغییرات
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "system" && (
            // ... (unchanged)
            <div>
              <div className="p-5 border-b border-border">
                <h2 className="font-medium mb-1">تنظیمات سیستم</h2>
                <p className="text-xs text-muted-foreground">پیکربندی عمومی پلتفرم</p>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">نام سیستم</label>
                  <input
                    type="text"
                    defaultValue="BikeShare تهران"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">زبان پیش‌فرض</label>
                  <select className="w-full px-4 py-2 bg-input-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20">
                    <option>فارسی</option>
                    <option>English</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">حداکثر مدت سفر (ساعت)</label>
                  <input
                    type="number"
                    defaultValue="4"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button className="cursor-pointer px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm hover:bg-secondary/80 transition-colors">
                    انصراف
                  </button>
                  <button className="cursor-pointer px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">
                    ذخیره
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            // ... (unchanged)
            <div>
              <div className="p-5 border-b border-border">
                <h2 className="font-medium mb-1">تنظیمات اعلان</h2>
                <p className="text-xs text-muted-foreground">کنترل نوع اعلان‌های دریافتی</p>
              </div>
              <div className="p-6">
                {[
                  { key: "battery", label: "اعلان باتری کم", desc: "هشدار دوچرخه‌های زیر ۲۰٪ باتری" },
                  { key: "theft", label: "هشدار سرقت", desc: "تشخیص حرکت بدون سفر فعال" },
                  { key: "newUser", label: "ثبت‌نام کاربر جدید", desc: "اطلاع‌رسانی ثبت‌نام کاربران" },
                  { key: "dailyReport", label: "گزارش روزانه", desc: "ارسال خلاصه روزانه به ایمیل" },
                  { key: "systemFailure", label: "هشدار خرابی سیستم", desc: "اطلاع از قطعی‌های سرویس" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                      className={`cursor-pointer relative w-11 h-6 rounded-full transition-colors ${
                        notifications[item.key as keyof typeof notifications] ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          notifications[item.key as keyof typeof notifications] ? "translate-x-[-20px]" : "translate-x-[-4px]"
                        }`}
                      />
                    </button>
                  </div>
                ))}
                <div className="flex justify-end mt-6">
                  <button className="cursor-pointer px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">
                    ذخیره تنظیمات
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            // ... (unchanged)
            <div>
              <div className="p-5 border-b border-border">
                <h2 className="font-medium mb-1">امنیت</h2>
                <p className="text-xs text-muted-foreground">مدیریت رمز عبور و ورود</p>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">رمز عبور فعلی</label>
                  <input
                    type="password"
                    placeholder="رمز عبور فعلی"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">رمز عبور جدید</label>
                  <input
                    type="password"
                    placeholder="رمز عبور جدید"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">تکرار رمز عبور</label>
                  <input
                    type="password"
                    placeholder="رمز عبور جدید را تکرار کنید"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button className="cursor-pointer px-4 py-2 bg-destructive/10 text-destructive rounded-lg text-sm hover:bg-destructive/20 transition-colors">
                    ابطال همه نشست‌ها
                  </button>
                  <button className="cursor-pointer px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">
                    به‌روزرسانی رمز
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}