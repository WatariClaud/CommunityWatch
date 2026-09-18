"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Shield,
  ArrowLeft,
  MapPin,
  Calendar,
  CheckCircle2,
  Circle,
  ChevronDown,
  FilePlus,
  Home,
  Bell,
  Zap,
  LogOut,
} from "lucide-react";

import { useNavigate } from "../../helpers/hooks/navigate";
import { getSessionProfile, reports } from "@/app/helpers/api-endpoints";

export default function IssueDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [statusNote, setStatusNote] = useState("");
  const [commentText, setCommentText] = useState("");

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState({ name: "Recent Reports", icon: FilePlus, link: `/reports/${params.id}` });
  
  const [report, setReport] = useState<{
    report: {
      id: string;
      title: string;
      category: string;
      categoryIcon: typeof Zap;
      categoryColor: string;
      locationName: string;
      status: string;
      description: string;
      statusBg: string;
      createdAt: string;
      imageUrl: string;
    };
    activities: {
      actionText: string;
      actor: {
        fullName: string;
        avatarUrl: string;
      };
      createdAt: string;
      dotColor: string;
      id: number;
    }[];
  }>({
    report: {
      id: "",
      title: "",
      category: "",
      categoryIcon: Zap,
      categoryColor: "",
      locationName: "",
      status: "new",
      description: "",
      statusBg: "bg-blue-50 text-blue-600",
      createdAt: "",
      imageUrl: "",
    },
    activities: [],
  });

  const [selectedStatus, setSelectedStatus] = useState("new");

  const [ authenticated, setAuthenticated ] = useState({
    error: true,
    message: "",
    token: "",
    user: { id: 0, email: "", fullName: "" }
  })

  const navItems = [
    { name: "Dashboard", icon: Home, link: "/dashboard" },
    { name: "Report Issue", icon: FilePlus, link: "/report-issue" },
    { name: "Recent Reports", icon: FilePlus, link: "/reports" },
    { name: "Notifications", icon: Bell, badge: 2, link: "/notifications" },
  ];

  const statusOrder = ["new", "in_progress", "resolved", "closed"];
  const currentStatus = report?.report?.status || "new";
  const currentIndex = statusOrder.indexOf(currentStatus);

  const getStepState = (stepIndex: number) => {
    if (currentIndex === -1) return "pending";
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  const timelineSteps = [
    {
      label: "Report submitted",
      timestamp: report?.report?.createdAt
        ? new Date(report.report.createdAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : null,
      state: getStepState(0),
    },
    {
      label: "In progress",
      timestamp: null,
      state: getStepState(1),
    },
    {
      label: "Resolved",
      timestamp: null,
      state: getStepState(2),
    },
    {
      label: "Closed",
      timestamp: null,
      state: getStepState(3),
    },
  ];

  const handleStatusUpdate = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch(`${reports}/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status: selectedStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.report) {
          setReport((prev) => ({
            ...prev,
            report: {
              ...prev.report,
              status: data.report.status,
            },
            activities: [
              {
                id: Date.now(),
                actionText: statusNote.trim()
                  ? `Updated status to '${selectedStatus.replace("_", " ")}' - Note: ${statusNote}`
                  : `Updated status to '${selectedStatus.replace("_", " ")}'`,
                actor: {
                  fullName: "You (Admin)",
                  avatarUrl: "/avatar.jpg",
                },
                createdAt: new Date().toISOString(),
                dotColor: "bg-amber-500",
              },
              ...prev.activities,
            ],
          }));

          setStatusNote("");
        }
      })
      .catch((err) => console.log("Status update error:", err));
  };

  const handlePostComment = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(`${reports}/${params.id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ commentText }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.comment) {
          setReport((prev) => ({
            ...prev,
            activities: [
              {
                id: data.comment.id,
                actionText: `Commented: "${data.comment.commentText}"`,
                actor: {
                  fullName: "You (Admin)",
                  avatarUrl: "/avatar.jpg",
                },
                createdAt: new Date().toISOString(),
                dotColor: "bg-blue-500",
              },
              ...prev.activities,
            ],
          }));
          setCommentText("");
        }
      })
      .catch((err) => console.log("Comment post error:", err));
  };

  useEffect(() => {
    if (!params.id) return;

    fetch(`${reports}/${params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setReport(res);
        setSelectedStatus(res.report?.status || "new");
      })
      .catch((err) => console.log("Fetch error:", err));
  }, [params.id]);

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
      setAuthenticated(res)
    })
    .catch(err => console.log(err))
  }, [])
  
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-700">
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col justify-between p-4 shrink-0" style={{
        height: "100vh",
        position: "sticky"
      }}>
        <div>
          <div className="flex items-center gap-3 px-2 py-4 mb-4">
            <div className="bg-amber-400 p-1.5 rounded-lg text-slate-900">
              <Shield className="w-5 h-5 fill-slate-900" />
            </div>
            <span className="font-semibold text-lg tracking-wide text-white">
              CommunityWatch
            </span>
          </div>

          <div className="px-3 mb-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
            Admin
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab.name === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item);
                    navigate(item.link);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-amber-400 border-l-4 border-amber-400 font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
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
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto" style={{
        overflow: "auto",
        height: "100vh"
      }}>
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Issue Details</h1>
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-600 capitalize">
              {report?.report?.status ? report.report.status.replace("_", " ") : "Status Unknown"}
            </span>
          </div>

          <div>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all reports
            </button>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">
              {report?.report?.title}
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {report?.report?.locationName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Reported{" "}
                {report?.report?.createdAt
                  ? new Date(report.report.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-6">
              <div className="relative w-full h-72 rounded-xl overflow-hidden bg-slate-200 border border-slate-200 shadow-sm">
                <Image
                  src={report?.report?.imageUrl || "/placeholder-image.png"}
                  alt="Report view"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  Description
                </h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  {report?.report?.description || "No description provided for this report."}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  Activity Feed
                </h3>
                <div className="space-y-3">
                  {report?.activities?.map((activity, index: number) => (
                    <div
                      key={activity.id || index}
                      className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-start gap-3"
                    >
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-700 shrink-0">
                        <Image
                          src={activity?.actor?.avatarUrl || "/avatar.jpg"}
                          alt={activity?.actor?.fullName || "Admin Avatar"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-900">
                            {activity?.actor?.fullName || "Admin"}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {activity?.createdAt
                              ? new Date(activity.createdAt).toLocaleString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          {activity?.actionText || "No action text provided."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  Comments
                </h3>
                <form onSubmit={handlePostComment} className="space-y-3">
                  <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                    <textarea
                      rows={3}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full text-xs text-slate-700 placeholder:text-slate-400 outline-none resize-none bg-transparent"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-semibold transition-colors shadow-sm"
                    >
                      Post
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Status Timeline
                </h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                  {timelineSteps.map((step, index) => (
                    <div key={index} className="relative">
                      <div className="absolute -left-[30px] top-0 bg-white rounded-full">
                        {step.state === "completed" && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500 text-white" />
                        )}
                        {step.state === "active" && (
                          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                        )}
                        {step.state === "pending" && (
                          <Circle className="w-5 h-5 text-slate-300 fill-slate-50" />
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <p
                          className={`text-xs font-semibold ${
                            step.state === "pending"
                              ? "text-slate-400"
                              : "text-slate-800"
                          }`}
                        >
                          {step.label}
                        </p>
                        {step.timestamp && (
                          <p className="text-[11px] text-slate-400">
                            {step.timestamp}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Update Status
                </h3>

                <form onSubmit={handleStatusUpdate} className="space-y-3">
                  <div className="relative">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-amber-400 cursor-pointer pr-8 capitalize"
                    >
                      <option value="new">Report Submitted</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>

                  <div className="border border-slate-200 rounded-lg p-2.5 bg-white">
                    <textarea
                      rows={3}
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="Add a note (optional)..."
                      className="w-full text-xs text-slate-700 placeholder:text-slate-400 outline-none resize-none bg-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-semibold transition-colors shadow-sm"
                  >
                    Update
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}