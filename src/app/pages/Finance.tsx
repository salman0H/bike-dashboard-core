import { DollarSign, TrendingUp, Wallet, FileText } from "lucide-react";
import { Link } from "react-router";
import { useData } from "../../hooks/useData";

// Default sections in case API fails
const DEFAULT_SECTIONS = [
  {
    title: "سیاست‌ها",
    description: "مدیریت قیمت‌گذاری و سیاست‌های مالی",
    icon: "FileText",
    path: "/finance/policies",
  },
  {
    title: "گزارش پرداخت/کیف پول",
    description: "مشاهده تراکنش‌ها و موجودی کیف پول کاربران",
    icon: "Wallet",
    path: "/finance/payment-reports",
  },
  {
    title: "گزارش مالی",
    description: "گزارشات استفاده، پرداخت و شارژ",
    icon: "TrendingUp",
    path: "/finance/financial-reports",
  },
];

// Map icon strings to actual components
const iconMap: Record<string, React.ComponentType<any>> = {
  FileText: FileText,
  Wallet: Wallet,
  TrendingUp: TrendingUp,
  DollarSign: DollarSign,
};

interface Section {
  title: string;
  description: string;
  icon: string;
  path: string;
}

export function Finance() {
  const { data: apiSections, loading, error } = useData("getSections", DEFAULT_SECTIONS);
  
  // Use API data if available, otherwise use defaults
  const sections = (!loading && Array.isArray(apiSections) && apiSections.length > 0)
    ? apiSections as Section[]
    : DEFAULT_SECTIONS;

  // Debug logging
  if (error) {
    console.warn("Using default sections due to API error:", error);
  }
  console.log("Sections being used:", sections);

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">امور مالی</h1>
          <p className="text-muted-foreground">مدیریت مالی و گزارشات درآمد سیستم</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">در حال بارگذاری...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">امور مالی</h1>
        <p className="text-muted-foreground">مدیریت مالی و گزارشات درآمد سیستم</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => {
          const Icon = iconMap[section.icon] || FileText;
          return (
            <Link
              key={section.path}
              to={section.path}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all group cursor-pointer"
            >
              <div className="flex flex-col items-start">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">{section.title}</h3>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}