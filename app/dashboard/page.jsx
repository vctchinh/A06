"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  BarChart3,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

const SimpleLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#101922] font-[Work_Sans]">
      <aside className="w-64 bg-[#1A202C] border-r border-gray-800 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <span className="text-xl font-bold text-white">UserSystem</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg transition-all"
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg cursor-not-allowed transition-all">
            <Users size={20} />
            <span>User Management</span>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-sm hover:bg-red-600 transition-all duration-200"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-[#1A202C] border-b border-gray-800 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="w-full text-white font-semibold text-center text-3xl">
            Dashboard
          </h2>
        </header>

        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-white text-3xl font-bold mb-2">Overview</h1>
            <p className="text-[#9dabb9]">
              Chào mừng trở lại, {user?.email || "Người dùng"}. Dưới đây là tình
              hình hệ thống đăng ký người dùng.
            </p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  footerText,
  icon: Icon,
  iconColor,
  footerColor,
  children,
}) => (
  <div className="bg-[#1A202C] p-6 rounded-xl flex flex-col shadow-lg border border-gray-800">
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm font-medium text-[#9dabb9]">{title}</p>
      {children ? (
        children
      ) : (
        <div
          className={`p-2 rounded-lg bg-opacity-10 ${iconColor?.replace(
            "text-",
            "bg-"
          )}`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      )}
    </div>
    <p className="text-4xl font-bold text-white tracking-tight">{value}</p>
    <p className={`text-sm mt-2 font-medium ${footerColor}`}>{footerText}</p>
  </div>
);

const ChartPlaceholder = () => (
  <div className="bg-[#101922] h-80 rounded-lg border border-dashed border-gray-700 flex flex-col items-center justify-center text-center text-[#9dabb9]">
    <BarChart3 className="w-16 h-16 mb-4 opacity-50" />
    <p className="text-sm font-medium text-white">User Growth Analytics</p>
    <p className="text-xs text-gray-500 mt-1">
      Data visualization (Chart.js/Recharts) will render here.
    </p>
  </div>
);

const DashboardPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [regPeriod, setRegPeriod] = useState("week");
  const [chartTimeRange, setChartTimeRange] = useState("12m");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#101922]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#101922]">
        <div className="text-white text-xl">Redirecting to login...</div>
      </div>
    );
  }

  const getRegistrationCount = () => {
    if (regPeriod === "day") return "12";
    if (regPeriod === "week") return "86";
    return "340";
  };

  const getRegistrationFooter = () => {
    if (regPeriod === "day") return "+2% so với hôm qua";
    if (regPeriod === "week") return "+15% so với tuần trước";
    return "+12% so với tháng trước";
  };

  return (
    <SimpleLayout>
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Users"
          value="1,254"
          footerText="+45 user mới tháng này"
          icon={UserCheck}
          iconColor="text-emerald-500"
          footerColor="text-gray-400"
        />

        <StatCard
          title="Disabled Accounts"
          value="23"
          footerText="Cần xem xét lại"
          icon={UserX}
          iconColor="text-pink-500"
          footerColor="text-gray-400"
        />

        <StatCard
          title="New Registrations"
          value={getRegistrationCount()}
          footerText={getRegistrationFooter()}
          footerColor="text-emerald-400"
        >
          <div className="flex bg-[#2D3748] rounded-lg p-1 gap-1">
            {["Day", "Week", "Month"].map((period) => (
              <button
                key={period}
                onClick={() => setRegPeriod(period.toLowerCase())}
                className={`px-3 py-1 text-xs rounded-md transition-all font-medium ${
                  regPeriod === period.toLowerCase()
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </StatCard>
      </div>

      <div className="bg-[#1A202C] p-6 rounded-xl border border-gray-800 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-500" />
              Growth Analytics
            </h3>
            <p className="text-sm text-[#9dabb9] mt-1">
              Số lượng người dùng đăng ký theo thời gian.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#2D3748] p-1 rounded-lg border border-gray-700">
            <select
              className="bg-transparent border-none text-white text-sm px-3 py-1 cursor-pointer focus:ring-0 outline-none"
              value={chartTimeRange}
              onChange={(e) => setChartTimeRange(e.target.value)}
            >
              <option value="12m" className="bg-[#2D3748]">
                Last 12 Months
              </option>
              <option value="6m" className="bg-[#2D3748]">
                Last 6 Months
              </option>
              <option value="30d" className="bg-[#2D3748]">
                Last 30 Days
              </option>
            </select>
          </div>
        </div>

        <ChartPlaceholder />
      </div>
    </SimpleLayout>
  );
};

export default DashboardPage;
