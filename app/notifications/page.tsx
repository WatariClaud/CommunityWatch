"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Home,
  FilePlus,
  Bell,
  LogOut,
  Shield,
  CheckCheck,
  ChevronRight,
  FileText,
} from "lucide-react";

import { useNavigate } from "../helpers/hooks/navigate";
import { getSessionProfile, notifications } from "../helpers/api-endpoints";
import { useLanguageStore } from "../helpers/stores/language-store";
import { translations } from "../helpers/translations";
import LanguageSelector from "@/components/language-selector";

export default function Notifications() {
  const navigate = useNavigate();
    
  const { language } = useLanguageStore();
      
  const translation = translations[language].notifications;
  const dashboardTranslation = translations[language].dashboard;

  const [activeTab, setActiveTab] = useState("/notifications");
  const [filter, setFilter] = useState("All");
  const [ authenticated, setAuthenticated ] = useState({
    error: true,
    message: "",
    token: "",
    user: { id: 0, email: "", fullName: "" }
  })

  
  const [recentNotifications, setRecentNotifications] = useState<
    {
      id: "",
      createdAt: "",
      iconBg: "bg-blue-50 text-blue-600",
      isUnread: true,
      message: "",
      reportId: "",
      title: "",
      type: "",
      userId: "",
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
    fetch(notifications, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${localStorage.getItem("token")}`
      },
    })
    .then(res => res.json())
    .then(res => {
      console.log("response below.....")
      console.log(res.notifications)
      setRecentNotifications(res.notifications)
    })
    .catch(err => console.log(err))
  }, [])
  
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
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-amber-400 text-slate-900 font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-amber-400 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
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
                alt={ authenticated?.user?.fullName }
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
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="relative bg-[#111827] text-white px-8 py-12 overflow-hidden">
          <div
            className="absolute inset-0 opacity-40 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('/Gemini_Generated_Image_kq1rk8kq1rk8kq1r.png')",
            }}
          />

          <div className="absolute top-6 right-8 z-20">
            <LanguageSelector />
          </div>

          <div className="relative z-10 max-w-4xl flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                {translation.header.title}
              </h1>

              <p className="text-sm text-slate-300 mt-2">
                {translation.header.description}
              </p>
            </div>

            <button className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-lg transition-colors">
              <CheckCheck className="w-4 h-4 text-amber-400" />
              {translation.actions.markAllAsRead}
            </button>
          </div>
        </div>

        <div className="p-8 max-w-4xl mx-auto -mt-6 relative z-20">
          <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {[translation.filters.all, translation.filters.unread, translation.filters.updates, translation.filters.comments].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filter === tab
                      ? "bg-[#111827] text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-400 font-medium px-2">
              { recentNotifications?.filter(notif => notif.isUnread)?.length } Unread
            </span>
          </div>

          <div className="space-y-3">
            {recentNotifications?.map((item) => {
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border transition-all p-4 shadow-xs flex items-start gap-4 cursor-pointer hover:border-slate-300 ${
                    item.isUnread
                      ? "border-amber-200/80 bg-amber-50/10"
                      : "border-slate-200/80"
                  }`}
                >

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-slate-900">
                          {item.title}
                        </h3>
                        {item.isUnread && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0">
                        {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.message}
                    </p>
                  </div>

                  <div className="self-center pl-2">
                    <ChevronRight className="w-4 h-4 text-slate-400" />
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