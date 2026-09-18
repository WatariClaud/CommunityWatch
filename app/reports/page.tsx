"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Home,
  FilePlus,
  List,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  Shield,
  MapPin,
  Bell,
  LogOut,
  Zap,
  FileText,
} from "lucide-react";

import { useNavigate } from "../helpers/hooks/navigate";
import { getSessionProfile, reports } from "../helpers/api-endpoints";
import { useLanguageStore } from "../helpers/stores/language-store";
import { translations } from "../helpers/translations";
import LanguageSelector from "@/components/language-selector";

export default function CommunityIssues() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cat, setCat] = useState("");
  const [mine, setMine] = useState("false");
  
  const { language } = useLanguageStore();
    
  const translation = translations[language].communityIssues;
  const dashboardTranslation = translations[language].dashboard;
  const [activeTab, setActiveTab] = useState("/reports");

  const [ authenticated, setAuthenticated ] = useState({
    error: true,
    message: "",
    token: "",
    user: { id: 0, email: "", fullName: "" }
  })
  
  const [ recentReports, setRecentReports ] = useState<
    {
      reporter: string | number;
      id: "",
      title: "",
      category: string,
      categoryIcon: typeof Zap,
      categoryColor: "",
      locationName: "",
      status: string,
      statusBg: "bg-blue-50 text-blue-600",
      createdAt: "",
      imageUrl: "",
    }[]
  >([])

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

    if (cat) {
      if(cat.toLowerCase() === "all") {
        params.delete("category");
      } else {
        params.append("category", cat.toLowerCase().replace(/\s+/g, "_"));
      }
    }

    if (mine === "true") {
      params.append("mine", "true");
    }

    fetch(`${reports}?${params.toString()}`, {
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
  }, [cat, mine]);

  const navItems = [
    {
      name: dashboardTranslation.navigation.dashboard,
      icon: Home,
      link: "/dashboard",
    },
    {
      name: dashboardTranslation.navigation.reportIssue,
      icon: FilePlus,
      link: "/report-issue",
    },
    {
      name: dashboardTranslation.navigation.recentReports,
      icon: FileText,
      link: "/reports",
    },
    {
      name: dashboardTranslation.navigation.notifications,
      icon: Bell,
      badge: 2,
      link: "/notifications",
    },
  ];

  const categories = [
    {
      value: "All",
      label: translation.filters.all,
    },
    {
      value: "Mine",
      label: translation.filters.mine,
    },
    {
      value: "Infrastructure",
      label: translation.filters.infrastructure,
    },
    {
      value: "Public Safety",
      label: translation.filters.publicSafety,
    },
    {
      value: "Sanitation",
      label: translation.filters.sanitation,
    },
    {
      value: "Utilities",
      label: translation.filters.utilities,
    },
    {
      value: "Other",
      label: translation.filters.other,
    },
  ];

  const stats = [
    {
      title: translation.stats.totalReports,
      value: recentReports?.length,
      icon: List,
      iconBg: "bg-slate-100 text-slate-600",
    },
    {
      title: translation.stats.resolved,
      value: recentReports?.filter(
        (report) => report?.status === "resolved"
      )?.length,
      icon: CheckCircle2,
      iconBg: "bg-emerald-100 text-emerald-600",
    },
    {
      title: translation.stats.inProgress,
      value: recentReports?.filter(
        (report) => report?.status === "in_progress"
      )?.length,
      icon: Clock,
      iconBg: "bg-blue-100 text-blue-600",
    },
    {
      title: translation.stats.new,
      value: recentReports?.filter(
        (report) => report?.status === "new"
      )?.length,
      icon: AlertTriangle,
      iconBg: "bg-rose-100 text-rose-500",
    },
  ]

  console.clear()
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-700">
      <aside className="w-64 bg-[#111827] text-white flex flex-col justify-between p-4 shrink-0">
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
                      ? "bg-amber-400 text-slate-900 font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
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
                alt="User Profile"
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
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            <LogOut className="w-4 h-4" />
            { dashboardTranslation.navigation.logout }
          </button>
        </div>
      </aside>
 
      <main className="flex-1 overflow-y-auto">
        <div className="relative bg-[#111827] text-white px-8 py-12 overflow-hidden">
          <div
            className="absolute inset-0 opacity-50 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('/Gemini_Generated_Image_kq1rk8kq1rk8kq1r.png')",
            }}
          />

          <div className="absolute top-6 right-8 z-20">
            <LanguageSelector />
          </div>

          <div className="relative z-10 max-w-4xl">
            <h1 className="text-3xl font-extrabold tracking-tight">
              {translation.header.title}
            </h1>

            <p className="text-sm text-slate-300 mt-2">
              {translation.header.description}
            </p>
          </div>
        </div>

        <div className="p-8 max-w-5xl mx-auto mt-6 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-4"
                >
                  <div className={`p-3 rounded-full ${stat.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      {stat.title}
                    </p>
                    <p className="text-xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => {
                  setSelectedCategory(category.value);

                  if (category.value.toLowerCase() === "mine") {
                    setMine("true");
                    setCat("");
                  } else {
                    setMine("false");
                    setCat(category.value);
                  }
                }}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  selectedCategory === category.value
                    ? "bg-[#1e293b] text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          
          <div className="space-y-4">
            {recentReports?.map((issue) => {
              const statusLabel = {
                resolved: translation.status.resolved,
                in_progress: translation.status.inProgress,
                new: translation.status.new,
              }[issue.status] || issue.status;
              return (
                <div
                  key={issue.id}
                  className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                      <Image
                        src={issue.imageUrl || "/placeholder-image.png"}
                        alt={issue.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-semibold text-slate-900 text-sm">
                        {issue.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{issue.locationName}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${issue.statusBg}`}
                      >
                        {statusLabel}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-2">
                        {issue.createdAt}
                      </p>
                    </div>
                    <ChevronRight
                      className="w-5 h-5 text-slate-400"
                      onClick={() => navigate(`/reports/${issue.id}`)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}