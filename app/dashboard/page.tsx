"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Calendar,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Download,
  ListFilter,
  Shield,
  Zap,
  Bell,
  Globe,
  ChevronDown
} from "lucide-react";

import { useNavigate } from "../helpers/hooks/navigate";
import { getSessionProfile, reports } from "../helpers/api-endpoints";
import { useLanguageStore } from "../helpers/stores/language-store";
import { translations } from "../helpers/translations";
import LanguageSelector from "@/components/language-selector";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("/dashboard");
  const { language } = useLanguageStore();

  const translation = translations[language].dashboard;

  const [ authenticated, setAuthenticated ] = useState({
    error: true,
    message: "",
    token: "",
    user: { id: 0, email: "", fullName: "" }
  })

  const [ recentReports, setRecentReports ] = useState<
  
    {
      id: "",
      title: "",
      category: "",
      categoryIcon: typeof Zap,
      categoryColor: "",
      locationName: "",
      status: string,
      statusBg: "bg-blue-50 text-blue-600",
      createdAt: "",
    }[]
  >([])

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [recentActivities, setRecentActivities] = useState<
    { id: string | number; text: string; time: string; dotColor: string }[]
  >([]);

  useEffect(() => {
    fetch(`${reports}/activity`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data.activities) {
          setRecentActivities(data.activities);
        }
      })
      .catch((err) => console.log("Activity fetch error:", err));
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetch(getSessionProfile, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${localStorage.getItem("token")}`
      },
    })
    .then(res => res.json())
    .then(res => {
      console.log("response below.....")
      console.log(res)
      setAuthenticated(res)
    })
    .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch.trim()) {
      params.append("searchQuery", debouncedSearch.trim());
    }

    const queryString = params.toString();
    const url = queryString ? `${reports}?${queryString}` : reports;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${localStorage.getItem("token")}`
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setRecentReports(res.reports);
      })
      .catch((err) => console.log(err));
  }, [debouncedSearch]);

  const navItems = [
    {
      name: translation.navigation.dashboard,
      icon: LayoutDashboard,
      link: "/dashboard",
    },
    {
      name: translation.navigation.reportIssue,
      icon: LayoutDashboard,
      link: "/report-issue",
    },
    {
      name: translation.navigation.recentReports,
      icon: FileText,
      link: "/reports",
    },
    {
      name: translation.navigation.notifications,
      icon: Bell,
      badge: 2,
      link: "/notifications",
    },
  ];

  const stats = [
    {
      title: translation.stats.totalReports,
      value: recentReports?.length,
      change: "12%",
      isPositive: true,
      icon: FileText,
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      title: translation.stats.resolved,
      value: recentReports?.filter(report => report?.status === "resolved")?.length,
      change: "25%",
      isPositive: true,
      icon: CheckCircle2,
      iconBg: "bg-green-50 text-green-600",
    },
    {
      title: translation.stats.inProgress,
      value: recentReports?.filter(report => report?.status === "in_progress")?.length,
      change: "14%",
      isPositive: false,
      icon: Clock,
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      title: translation.stats.new,
      value: recentReports?.filter(report => report?.status === "new")?.length,
      change: "40%",
      isPositive: false,
      icon: AlertTriangle,
      iconBg: "bg-red-50 text-red-500",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-700">
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col justify-between p-4 shrink-0" style={{
        height: "100vh",
        position: "sticky"
      }}>
        <div>
          <div className="flex items-center gap-2 px-2 py-4 mb-6">
            <div className="bg-amber-400 p-1.5 rounded-lg text-slate-900">
              <Shield className="w-5 h-5 fill-slate-900" />
            </div>
            <span className="font-semibold text-lg tracking-wide text-white">
              CommunityWatch
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.link;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.link)
                    navigate(item.link)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-800 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-700 shrink-0">
              <Image
                src="/avatar.jpg"
                alt="Admin Profile"
                fill
                className="object-cover"
              />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{ authenticated?.user?.fullName }</p>
              <p className="text-xs text-slate-400 truncate">
                { authenticated?.user?.email }
              </p>
            </div>
          </div>
          <button
            className="w-full flex items-center gap-2 px-2 py-2 text-sm text-slate-400 hover:text-white transition-colors"
            onClick={() => {
              console.clear()
              localStorage.removeItem("token");
              navigate("/");
            }}
            >
            <LogOut className="w-4 h-4" />
            {translation.navigation.logout}
          </button>
        </div>
      </aside>
 
      <main className="flex-1 p-8 overflow-y-auto" style={{
        overflow: "auto",
        height: "100vh"
      }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{ translation.header.title }</h1>
            <p className="text-sm text-slate-500 mt-1">
              { translation.header.description }
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={translation.header.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs w-64
                  focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
              />
            </div>

            <div className="relative">
              <LanguageSelector />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs font-medium text-slate-500">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium">
                  {stat.isPositive ? (
                    <span className="flex items-center text-emerald-600 gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      &uarr; {stat.change}
                    </span>
                  ) : (
                    <span className="flex items-center text-rose-500 gap-0.5">
                      <TrendingDown className="w-3.5 h-3.5" />
                      &darr; {stat.change}
                    </span>
                  )}
                  <span className="text-slate-400 ml-1">{translation.stats.fromLast30Days}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-4">
              {translation.reports.title}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-medium tracking-wider">
                    <th className="pb-3 px-2">ID</th>
                    <th className="pb-3 px-2">Title</th>
                    <th className="pb-3 px-2">Category</th>
                    <th className="pb-3 px-2">Location</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2">Date</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {
                    recentReports.length === 0 &&
                    <tr>
                      <td colSpan={5} className="font-bold text-xl">
                        <p className="mt-5">{translation.reports.noReports}</p>
                        <button className="flex items-center justify-center gap-2
                          bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold
                          py-2.5 px-4 rounded-lg text-xs transition-colors shadow-xs mt-10"
                        onClick={() => navigate("report-issue")}
                        >
                          { translation.reports.reportIssue }
                        </button>
                      </td>
                    </tr>
                  }
                    {recentReports.length > 0 && recentReports.map((report) => {
                      return (
                        <tr key={report.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-2 font-medium text-slate-400">
                            {report.id}
                          </td>
                          <td className="py-3.5 px-2 font-medium text-slate-800">
                            {report.title}
                          </td>
                          <td className="py-3.5 px-2">
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <span>{report.category}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-2 text-slate-500">
                            {report.locationName}
                          </td>
                          <td className="py-3.5 px-2">
                            <span
                              className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${report.statusBg}`}
                            >
                              {report.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 text-slate-400">
                            {report.createdAt}
                          </td>
                          <td className="py-3.5 px-2 text-right">
                            <button
                              className="px-3 py-1 border border-slate-200 rounded-md text-slate-600 hover:bg-slate-100 font-medium"
                              onClick={() => navigate(`/reports/${report.id}`)}
                            >
                              {translation.reports.view}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">
                {translation.reports.actions}
              </h2>
              <div className="space-y-3">
                <button
                  className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 
                  ext-slate-900 font-semibold py-2.5 px-4 rounded-lg text-xs transition-colors shadow-xs"
                  onClick={() => navigate("/reports")}
                >
                  <ListFilter className="w-4 h-4" />
                  {translation.quickActions.viewAllReports}
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium py-2.5 px-4 rounded-lg text-xs border border-slate-200 transition-colors">
                  <Download className="w-4 h-4 text-slate-500" />
                  {translation.quickActions.exportReport}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">
                {translation.activity.title}
              </h2>
              <div className="relative pl-4 space-y-5 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200">
                {
                  recentActivities.map((act) => (
                    <div key={act.id} className="relative text-xs">
                      <div
                        className={`absolute -left-[19px] top-1 w-2 h-2 rounded-full ring-4 ring-white ${act.dotColor}`}
                      />
                      <p className="font-medium text-slate-700 leading-snug">
                        {act.text}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {act.time}
                      </p>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}