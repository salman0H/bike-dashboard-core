import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export function Policies() {
  const [startFare, setStartFare] = useState(2000);
  const [ratePerMinute, setRatePerMinute] = useState(500);
  const [dailyCap, setDailyCap] = useState(50000);
  const [freeMinutes, setFreeMinutes] = useState(15);

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
          <h1 className="text-2xl font-semibold m-0">سیاست‌ها</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          مدیریت قیمت‌گذاری و سیاست‌های مالی
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-lg font-medium">تعرفه پایه</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                کرایه شروع سفر (تومان)
              </label>
              <input
                type="number"
                value={startFare}
                onChange={(e) => setStartFare(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-gray/15 text-foreground focus:border-primary outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                نرخ هر دقیقه (تومان)
              </label>
              <input
                type="number"
                value={ratePerMinute}
                onChange={(e) => setRatePerMinute(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-gray/15 text-foreground focus:border-primary outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                سقف روزانه (تومان)
              </label>
              <input
                type="number"
                value={dailyCap}
                onChange={(e) => setDailyCap(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-gray/15 text-foreground focus:border-primary outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                رایگان اول (دقیقه)
              </label>
              <input
                type="number"
                value={freeMinutes}
                onChange={(e) => setFreeMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-gray/15 text-foreground focus:border-primary outline-none transition"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Link to="/finance">
              <button className="cursor-pointer px-4 py-2 rounded-lg bg-secondary text-foreground border border-border hover:bg-secondary/80 transition">
                انصراف
              </button>
            </Link>
            <Link to="/finance">
              <button className="cursor-pointer px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition">
                ذخیره تغییرات
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}