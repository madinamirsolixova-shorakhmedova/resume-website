"use client";

import React, { useState } from "react";
import { MessageSquare, Sparkles } from "lucide-react";
import { CommunityChatModal } from "./CommunityChatModal";
import { useUiLanguage } from "@/lib/uiLanguageStore";
import { useCommunityChat } from "@/lib/chatStore";

export const CommunityChatFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useUiLanguage();
  const { reviews } = useCommunityChat();

  return (
    <>
      {/* Плавающая кнопка сообщества */}
      <div className="fixed bottom-5 right-4 sm:right-6 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/45 transition-all duration-200 active:scale-95 cursor-pointer border border-white/20"
          title={t.chat.triggerBtn}
          aria-label={t.chat.triggerBtn}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
            <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white" />
            </span>
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs font-bold tracking-tight leading-tight flex items-center gap-1">
              <span>{t.chat.triggerBtn}</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </span>
            <span className="text-[10px] text-blue-100 font-medium leading-none mt-0.5">
              ⭐ 4.9 ({reviews.length} отзывов с + и −)
            </span>
          </div>
        </button>
      </div>

      <CommunityChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
