import { ArrowRight, DollarSign, CreditCard, Wallet } from "lucide-react";
import { Link } from "react-router";
import { useData } from "../../../hooks/useData";

// Default transactions in case API fails
const DEFAULT_TRANSACTIONS = [
  {
    id: "#TXN-98234",
    user: "علی محمدی",
    type: "charge",
    amount: "+100,000",
    status: "success",
    time: "5 دقیقه پیش",
  }
];

interface Transaction {
  id: string;
  user: string;
  type: "charge" | "trip";
  amount: string;
  status: "success" | "failed";
  time: string;
}

export function PaymentReports() {
  const { data: apiTransactions, loading, error } = useData("getTransactions", DEFAULT_TRANSACTIONS);
  
  // Use API data if available, otherwise use defaults
  const transactions = (!loading && Array.isArray(apiTransactions) && apiTransactions.length > 0)
    ? apiTransactions as Transaction[]
    : DEFAULT_TRANSACTIONS;

  // Calculate KPI statistics from transactions
  const todayRevenue = transactions
    .filter(t => t.type === "charge" && t.status === "success")
    .reduce((sum, t) => {
      const amount = parseInt(t.amount.replace(/[^0-9]/g, ""));
      return sum + amount;
    }, 0);
  
  const todayTransactions = transactions.length;
  
  const totalWalletBalance = transactions
    .filter(t => t.type === "charge" && t.status === "success")
    .reduce((sum, t) => {
      const amount = parseInt(t.amount.replace(/[^0-9]/g, ""));
      return sum + amount;
    }, 0) - transactions
    .filter(t => t.type === "trip" && t.status === "success")
    .reduce((sum, t) => {
      const amount = parseInt(t.amount.replace(/[^0-9]/g, ""));
      return sum + Math.abs(amount);
    }, 0);

  const formatRevenue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  const formatWalletBalance = (value: number) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(0)}B`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
    return `${value.toLocaleString()}`;
  };

  const getTypeBadge = (type: string) => {
    if (type === "charge") {
      return <span className="px-2 py-1 rounded text-xs bg-status-active/10 text-status-active">شارژ کیف پول</span>;
    }
    return <span className="px-2 py-1 rounded text-xs bg-primary/10 text-primary">سفر</span>;
  };

  const getStatusBadge = (status: string) => {
    if (status === "success") {
      return <span className="px-2 py-1 rounded text-xs bg-status-active/10 text-status-active">موفق</span>;
    }
    return <span className="px-2 py-1 rounded text-xs bg-status-failed/10 text-status-failed">ناموفق</span>;
  };

  // Debug logging
  if (error) {
    console.warn("Using default transactions due to API error:", error);
  }
  console.log("Transactions being used:", transactions);

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <Link to="/finance">
              <button className="cursor-pointer px-3 py-1 bg-secondary text-secondary-foreground rounded text-xs hover:bg-secondary/80 transition-colors flex items-center gap-1">
                <ArrowRight className="w-3 h-3" />
                بازگشت
              </button>
            </Link>
            <h1 className="text-2xl">گزارش پرداخت/کیف پول</h1>
          </div>
          <p className="text-muted-foreground text-sm">تراکنش‌ها و موجودی کیف پول</p>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">در حال بارگذاری تراکنش‌ها...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Link to="/finance">
            <button className="cursor-pointer px-3 py-1 bg-secondary text-secondary-foreground rounded text-xs hover:bg-secondary/80 transition-colors flex items-center gap-1">
              <ArrowRight className="w-3 h-3" />
              بازگشت
            </button>
          </Link>
          <h1 className="text-2xl font-semibold">گزارش پرداخت/کیف پول</h1>
        </div>
        <p className="text-muted-foreground text-sm">تراکنش‌ها و موجودی کیف پول</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-5 flex items-center justify-between">
          <div>
            <div className="text-muted-foreground text-xs mb-1">درآمد امروز</div>
            <div className="text-2xl font-semibold">{formatRevenue(todayRevenue)}</div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-status-active/10 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-status-active" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 flex items-center justify-between">
          <div>
            <div className="text-muted-foreground text-xs mb-1">تراکنش‌های امروز</div>
            <div className="text-2xl font-semibold">{todayTransactions}</div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 flex items-center justify-between">
          <div>
            <div className="text-muted-foreground text-xs mb-1">کل موجودی کیف پول</div>
            <div className="text-2xl font-semibold">{formatWalletBalance(totalWalletBalance)}</div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h2 className="font-medium">آخرین تراکنش‌ها</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/20">
              <tr>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">شماره تراکنش</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">کاربر</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">نوع</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">مبلغ</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">وضعیت</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">زمان</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="border-b border-border hover:bg-muted/5 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-primary">{txn.id}</td>
                  <td className="px-4 py-3 text-sm">{txn.user}</td>
                  <td className="px-4 py-3">{getTypeBadge(txn.type)}</td>
                  <td className={`px-4 py-3 text-sm font-medium ${txn.amount.startsWith("+") ? "text-status-active" : "text-status-failed"}`}>
                    {txn.amount} تومان
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(txn.status)}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{txn.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}