"use client";
import Image from "next/image";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Users, 
  Sprout, 
  Mail, 
  Lock, 
  Eye, 
  UserPlus, 
  ArrowRight 
} from "lucide-react";

import { useNavigate } from "../helpers/hooks/navigate";
import { createAccountUrl, resetPasswordUrl } from "../helpers/api-endpoints";

export default function SignUp() {
  const [ authenticated, setAuthenticated ] = useState({error: true, message: "", token: "", user: {}})

  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex flex-col lg:flex-row bg-slate-900 text-white font-sans overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/Gemini_Generated_Image_kq1rk8kq1rk8kq1r.png"
          alt="Sunset Cityscape"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-900/40" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row w-full min-h-screen">
        
        <div className="flex-1 flex flex-col justify-between p-8 md:p-12 lg:p-16 max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 rounded-xl border border-amber-500/30 backdrop-blur-sm">
              <ShieldCheck className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Stability And Social Cohesion
              </h1>
              <p className="text-xs text-slate-300 font-medium">
                Stronger Communities, Safer Tomorrow.
              </p>
            </div>
          </div>

          <div className="my-12 lg:my-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              Report. Track. <br />
              <span className="text-amber-400">Make a Difference.</span>
            </h2>
            <p className="text-slate-200 text-lg sm:text-xl max-w-lg leading-relaxed">
              A simple way to report community issues, track progress, and help make your neighbourhood safer, cleaner and better for everyone.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-700/50">
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="w-6 h-6 text-amber-400 mb-2" />
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                Safer<br />Communities
              </span>
            </div>
            <div className="flex flex-col items-center text-center border-x border-slate-700/50 px-2">
              <Users className="w-6 h-6 text-amber-400 mb-2" />
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                Stronger<br />Together
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Sprout className="w-6 h-6 text-amber-400 mb-2" />
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                Better<br />Tomorrow
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 text-slate-900">
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900">Reset Password</h3>
              <p className="text-sm text-slate-500 mt-1">
                Enter your email to reset your password
              </p>
            </div>

            <form className="space-y-5" onSubmit={(e) => {
              e.preventDefault()
              console.clear()
              const emailInput = document.querySelector(`#email-input`) as HTMLInputElement
              const passwordInput = document.querySelector(`#password-input`) as HTMLInputElement
              const confirmPasswordInput = document.querySelector(`#confirm-password-input`) as HTMLInputElement
            
              const email = emailInput.value;
              const newPassword = passwordInput.value;
              const confirmNewPassword = confirmPasswordInput.value
            
              fetch(resetPasswordUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, newPassword, confirmNewPassword })
              })
              .then(res => res.json())
              .then(res => {
                console.log("response below.....")
                console.log(res)
                setAuthenticated(res)
            
                if(res?.message?.toLowerCase()?.includes("successful")) {
                  localStorage.setItem(`token`, res?.token)
                  navigate("")
                }
              })
              .catch(err => console.log(err))
            }}>              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 tracking-wide" htmlFor="email">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    id="email-input"
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 tracking-wide" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    id="password-input"
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 tracking-wide" htmlFor="password">
                  ConfirmPassword
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    id="confirm-password-input"
                    placeholder="Confirm your new password"
                    className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {
                authenticated?.error &&
                <p className="text-center text-red-900">{ authenticated.error }</p>
              }
              {
                !authenticated?.error &&
                <p className="text-center text-green-900">{ authenticated.message }</p>
              }

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-semibold rounded-xl text-sm shadow-sm transition-all duration-200 mt-2"
              >
                Create Account
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400 font-medium">or</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-3 px-4 border border-slate-200 hover:bg-slate-50
                text-slate-700 font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2"
              onClick={() => {
                navigate("/login")
              }}
            >
              <UserPlus className="w-4 h-4" />
              Sign in with an existing account
            </button>

            <div className="mt-8 text-center pt-2">
              <p className="text-xs text-slate-500 mb-1">
                Report an issue without an account
              </p>
              <a
                href="/dashboard"
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors"
              >
                Continue as guest <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}