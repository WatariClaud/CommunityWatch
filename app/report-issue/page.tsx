"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Home,
  FilePlus,
  Bell,
  LogOut,
  Shield,
  ChevronDown,
  MapPin,
  UploadCloud,
  Construction,
  ShieldAlert,
  Trash2,
  Zap,
  MoreHorizontal,
  ChevronRight,
  Navigation,
  FileText,
} from "lucide-react";

import { useNavigate } from "../helpers/hooks/navigate";
import { getSessionProfile, reports } from "../helpers/api-endpoints";
import { translations } from "../helpers/translations";
import { useLanguageStore } from "../helpers/stores/language-store";
import LanguageSelector from "@/components/language-selector";

export default function ReportIssue() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("/report-issue");
  const [currentStep, setCurrentStep] = useState(1);

  const { language } = useLanguageStore();
  
  const translation = translations[language].reportIssue;
  const dashboardTranslation = translations[language].dashboard;
  
  const [ authenticated, setAuthenticated ] = useState({
    error: true,
    message: "",
    token: "",
    user: { id: 0, email: "", fullName: "" }
  })

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

  const steps = [
    { id: 1, label: translation.steps.issueDetails },
    { id: 2, label: translation.steps.location },
    { id: 3, label: translation.steps.photos },
    { id: 4, label: translation.steps.review },
  ];

  const categories = [
    {
      title: translation.categories.infrastructure.title,
      desc: translation.categories.infrastructure.description,
      icon: Construction,
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: translation.categories.publicSafety.title,
      desc: translation.categories.publicSafety.description,
      icon: ShieldAlert,
      bg: "bg-red-50",
      text: "text-red-500",
    },
    {
      title: translation.categories.sanitation.title,
      desc: translation.categories.sanitation.description,
      icon: Trash2,
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      title: translation.categories.utilities.title,
      desc: translation.categories.utilities.description,
      icon: Zap,
      bg: "bg-blue-50",
      text: "text-blue-500",
    },
    {
      title: translation.categories.other.title,
      desc: translation.categories.other.description,
      icon: MoreHorizontal,
      bg: "bg-purple-50",
      text: "text-purple-600",
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
  console.clear()
                    console.log({isActive, activeTab}, item)
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
              <p className="text-xs text-slate-400 truncate">{ authenticated?.user?.email }</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-2 px-2 py-2 text-sm text-slate-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto" style={{
        overflow: "auto",
        height: "100vh"
      }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{translation.header.title}</h1>
            <p className="text-xs text-slate-500 mt-1">
              {translation.header.description}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-slate-500 hover:text-slate-700">
              <Bell className="w-5 h-5" />
            </button>
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-200">
              <Image src="/avatar.jpg" alt="User Avatar" fill className="object-cover" />
            </div>
            <div className="relative">
              <LanguageSelector />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between max-w-2xl mx-auto mb-10 text-xs">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-semibold ${
                    step.id === currentStep
                      ? "bg-amber-400 text-slate-900"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {step.id}
                </div>
                <span
                  className={`font-medium ${
                    step.id === currentStep ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-slate-300" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2" htmlFor="report-title">
               {translation.form.issue}
              </label>
              <input
                type="text"
                id="report-title"
                placeholder={translation.form.issuePlaceholder}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-700 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2" htmlFor="report-category">
                {translation.form.category}
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg
                    t ext-xs text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-xs"
                  id="report-category"
                >
                  <option value="">{translation.form.selectCategory}</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="public_safety">Public Safety</option>
                  <option value="sanitation">Sanitation</option>
                  <option value="utilities">Utilities</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2" htmlFor="report-description">
                {translation.form.description}
              </label>
              <textarea
                rows={4}
                placeholder= {translation.form.descriptionPlaceholder}
                id="report-description"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-700 shadow-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2" htmlFor="report-location">
                {translation.form.location}
              </label>
              <div className="relative mb-3">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="report-location"
                  placeholder= {translation.form.locationPlaceholder}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-700 shadow-xs"
                />
              </div>

              <div className="relative h-44 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                <Image
                  src="/map-placeholder.jpg"
                  alt="Map Location"
                  fill
                  className="object-cover"
                />
                <button className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#111827] text-white text-[11px] font-medium px-3 py-1.5 rounded-md shadow-md hover:bg-slate-800 transition-colors">
                  <Navigation className="w-3 h-3 fill-white" />
                  {translation.form.upload}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2" htmlFor="report-image">
                {translation.form.addPhoto} <span className="text-slate-400 font-normal">({translation.form.optional})</span>
              </label>
              <div className="border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-lg p-6 text-center bg-slate-50/50 transition-colors cursor-pointer">
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-700">
                  {translation.form.upload}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  {translation.form.fileTypes}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-3
                rounded-lg text-xs transition-colors shadow-xs mt-4"
              onClick={() => {
                const reportTitleInput = document.querySelector(`#report-title`) as HTMLInputElement;
                const reportCategoryInput = document.querySelector(`#report-category`) as HTMLInputElement;
                const reportDescriptionInput = document.querySelector(`#report-description`) as HTMLInputElement;
                const reportLocationInput = document.querySelector(`#report-location`) as HTMLInputElement;

                const title = reportTitleInput.value;
                const category = reportCategoryInput.value;
                const description = reportDescriptionInput.value;
                const locationName = reportLocationInput.value;

                fetch(reports, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${localStorage.getItem("token")}`
                  },
                  body: JSON.stringify({ title, category, description, locationName })
                })
                .then(res => res.json())
                .then(res => {
                  console.log("response below.....")
                  console.log(res)
                  if(res.report.id) navigate("/reports")
                })
                .catch(err => console.log(err))
              }}
            >
              {translation.form.submit}
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 mb-4">Categories</h3>
              <div className="space-y-4">
                {categories.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${cat.bg} ${cat.text} shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          {cat.title}
                        </p>
                        <p className="text-[11px] text-slate-400 leading-tight">
                          {cat.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-5">
              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-blue-900">
                    {translation.safety.title}
                  </h4>
                  <p className="text-[11px] text-blue-700/80 mt-1 leading-relaxed">
                    {translation.safety.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}