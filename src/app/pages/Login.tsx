import { useState } from "react";
import { useNavigate } from "react-router";
import { Bike, Eye, EyeOff, LogIn } from "lucide-react";
import { motion } from "motion/react";

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hardcoded credentials
  const HARDCODED_USERNAME = "admin";
  const HARDCODED_PASSWORD = "admin123";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      if (username === HARDCODED_USERNAME && password === HARDCODED_PASSWORD) {
        // Store login state
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify({ username, role: "admin" }));
        
        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError("نام کاربری یا رمز عبور اشتباه است");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-600/5"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(182,102,210,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(182,102,210,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Brand Card */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/30 mb-4"
          >
            <Bike className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">BikeShare</h1>
          <p className="text-muted-foreground">پنل مدیریت سیستم اشتراک دوچرخه</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-2 text-right">ورود به حساب کاربری</h2>
            <p className="text-muted-foreground text-sm mb-6 text-right">
              برای دسترسی به پنل مدیریت وارد شوید
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium mb-2 text-right">
                  نام کاربری
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-all text-right"
                  autoComplete="off"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium mb-2 text-right">
                  رمز عبور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-all text-right pl-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-right"
                >
                  {error}
                </motion.div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer w-full py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    در حال ورود...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    ورود به پنل مدیریت
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials Info */}
            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-border text-center">
              <p className="text-xs text-muted-foreground mb-2">📝 اطلاعات ورود آزمایشی:</p>
              <div className="text-sm">
                <span className="text-primary">نام کاربری:</span> <span className="text-foreground">admin</span>
              </div>
              <div className="text-sm mt-1">
                <span className="text-primary">رمز عبور:</span> <span className="text-foreground">admin123</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          © ۱۴۰۳ BikeShare - تمامی حقوق محفوظ است
        </p>
      </motion.div>
    </div>
  );
}