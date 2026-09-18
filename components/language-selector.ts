"use client";

import { useLanguageStore } from "@/app/helpers/stores/language-store";
import { ChevronDown, Globe } from "lucide-react";
import { createElement, useState } from "react";

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);

  const { language, setLanguage } = useLanguageStore();

  const languages = [
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
  ] as const;

  const currentLanguage = languages.find(
    (item) => item.code === language
  );

  const handleLanguageChange = (code: "en" | "fr") => {
    setLanguage(code);
    setOpen(false);
  };

  return createElement(
    "div",
    { className: "relative" },
    createElement(
      "button",
      {
        type: "button",
        onClick: () => setOpen((prev) => !prev),
        className:
          "flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition-colors",
      },
      createElement(Globe, { className: "w-4 h-4 text-slate-400" }),
      createElement("span", null, currentLanguage?.label),
      createElement(ChevronDown, {
        className: `w-3.5 h-3.5 text-slate-400 transition-transform ${
          open ? "rotate-180" : ""
        }`,
      })
    ),
    open &&
      createElement(
        "div",
        {
          className:
            "absolute right-0 z-50 mt-2 w-36 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden",
        },
        languages.map((item) =>
          createElement(
            "button",
            {
              key: item.code,
              type: "button",
              onClick: () => handleLanguageChange(item.code),
              className: `w-full text-left px-3 py-2.5 text-xs transition-colors ${
                language === item.code
                  ? "bg-amber-50 text-amber-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-50"
              }`,
            },
            item.label
          )
        )
      )
  );
}