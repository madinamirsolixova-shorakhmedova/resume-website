"use client";

import React from "react";
import { Briefcase, User, GraduationCap, Clock, Award, Check } from "lucide-react";
import { useUiLanguage } from "@/lib/uiLanguageStore";

interface Props {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

export const StepIndicator: React.FC<Props> = ({
  currentStep,
  totalSteps,
  onStepClick,
}) => {
  const { t } = useUiLanguage();

  const STEPS = [
    { id: 1, title: t.stepper.steps.vacancy, icon: Briefcase },
    { id: 2, title: t.stepper.steps.personal, icon: User },
    { id: 3, title: t.stepper.steps.education, icon: GraduationCap },
    { id: 4, title: t.stepper.steps.experience, icon: Clock },
    { id: 5, title: t.stepper.steps.skills, icon: Award },
  ];

  const progressPercent = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);
  const currentStepInfo = STEPS.find((s) => s.id === currentStep) || STEPS[0];

  return (
    <div className="w-full mb-6 sm:mb-8">
      {/* Мобильная строка состояния (Шаг X из 5) */}
      <div className="flex sm:hidden items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md">
            {t.stepper.step} {currentStep}/{totalSteps}
          </span>
          <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">
            {currentStepInfo.title}
          </span>
        </div>
        <span className="text-xs font-semibold text-zinc-400 font-mono">
          {progressPercent}%
        </span>
      </div>

      {/* Прогресс-бар */}
      <div className="relative mb-4 sm:mb-6">
        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Сетка шагов (адаптирована под тач на мобильных и просторный вид на ПК) */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {STEPS.map((s) => {
          const Icon = s.icon;
          const isCompleted = currentStep > s.id;
          const isCurrent = currentStep === s.id;

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onStepClick(s.id)}
              className="flex flex-col items-center text-center group cursor-pointer py-1"
              aria-label={`${t.stepper.step} ${s.id}: ${s.title}`}
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all ${
                  isCurrent
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105"
                    : isCompleted
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                    : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-400 dark:text-zinc-500 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[2.5]" />
                ) : (
                  <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                )}
              </div>
              <span
                className={`hidden sm:block text-[11px] sm:text-xs mt-2 font-medium transition-colors line-clamp-1 ${
                  isCurrent
                    ? "text-blue-600 dark:text-blue-400 font-bold"
                    : isCompleted
                    ? "text-zinc-700 dark:text-zinc-300"
                    : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                {s.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
