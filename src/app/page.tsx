"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResumeData, ResumeDataSchema, defaultResumeData, sampleResumeData } from "@/lib/schema";
import { saveDraft, loadDraft, clearDraft } from "@/lib/storage";
import { Header } from "@/components/Header";
import { StepIndicator } from "@/components/StepWizard/StepIndicator";
import { Step1Vacancy } from "@/components/StepWizard/Step1Vacancy";
import { Step2Personal } from "@/components/StepWizard/Step2Personal";
import { Step3Education } from "@/components/StepWizard/Step3Education";
import { Step4Experience } from "@/components/StepWizard/Step4Experience";
import { Step5SkillsExtra } from "@/components/StepWizard/Step5SkillsExtra";
import { ResumePreview } from "@/components/Preview/ResumePreview";
import { ControlPanel } from "@/components/Preview/ControlPanel";
import { CommunityChatFloatingButton } from "@/components/CommunityChat/CommunityChatFloatingButton";
import { CommunityChatModal } from "@/components/CommunityChat/CommunityChatModal";
import { useUiLanguage } from "@/lib/uiLanguageStore";
import { Eye, Edit3, ShieldCheck, SlidersHorizontal, FileText } from "lucide-react";

export default function Home() {
  const { t } = useUiLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [lastActiveStep, setLastActiveStep] = useState(1);
  const [mobileTab, setMobileTab] = useState<"preview" | "controls">("preview");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<ResumeData>({
    resolver: zodResolver(ResumeDataSchema) as any,
    defaultValues: defaultResumeData,
    mode: "onBlur",
  });

  const { watch, reset, getValues } = form;
  const formData = watch();

  // Загрузка черновика из localStorage при монтировании
  useEffect(() => {
    const saved = loadDraft();
    if (saved) {
      reset(saved);
    }
    setIsLoaded(true);
  }, [reset]);

  // Автосохранение в localStorage с дебаунсом 400мс
  useEffect(() => {
    if (!isLoaded) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveDraft(formData);
    }, 400);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, isLoaded]);

  // Загрузка демонстрационного примера
  const handleLoadSample = () => {
    reset(sampleResumeData);
    setCurrentStep(1);
    setLastActiveStep(1);
  };

  // Сброс данных
  const handleReset = () => {
    clearDraft();
    reset(defaultResumeData);
    setCurrentStep(1);
    setLastActiveStep(1);
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => {
      const next = Math.min(6, prev + 1);
      if (next <= 5) setLastActiveStep(next);
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => {
      const prevStep = Math.max(1, prev - 1);
      if (prevStep <= 5) setLastActiveStep(prevStep);
      return prevStep;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
    if (step <= 5) setLastActiveStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReturnToEdit = () => {
    setCurrentStep(lastActiveStep || 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const isResultStep = currentStep === 6;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Header
        onLoadSample={handleLoadSample}
        onOpenChat={() => setIsChatModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Экран мастера (Шаги 1 - 5) */}
        {!isResultStep ? (
          <div className="max-w-3xl mx-auto">
            {/* Верхняя строка действий мастера */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                {t.wizard.dataEntry}
              </span>
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(6);
                  setMobileTab("preview");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-2xs cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden xs:inline">{t.wizard.previewA4}</span>
                <span className="xs:hidden">A4</span>
              </button>
            </div>

            {/* Индикатор шагов (адаптирован под смартфон и ПК) */}
            <StepIndicator
              currentStep={currentStep}
              totalSteps={5}
              onStepClick={handleStepClick}
            />

            {/* Карточка текущего шага */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm">
              {currentStep === 1 && (
                <Step1Vacancy form={form} onNext={handleNextStep} />
              )}
              {currentStep === 2 && (
                <Step2Personal
                  form={form}
                  onNext={handleNextStep}
                  onBack={handlePrevStep}
                />
              )}
              {currentStep === 3 && (
                <Step3Education
                  form={form}
                  onNext={handleNextStep}
                  onBack={handlePrevStep}
                />
              )}
              {currentStep === 4 && (
                <Step4Experience
                  form={form}
                  onNext={handleNextStep}
                  onBack={handlePrevStep}
                />
              )}
              {currentStep === 5 && (
                <Step5SkillsExtra
                  form={form}
                  onFinish={() => {
                    setCurrentStep(6);
                    setMobileTab("preview");
                  }}
                  onBack={handlePrevStep}
                />
              )}
            </div>

            {/* Мобильная плашка приватности */}
            <div className="flex md:hidden items-center justify-center gap-1.5 text-xs text-zinc-400 mt-6">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{t.header.privacy}</span>
            </div>
          </div>
        ) : (
          /* Экран результата (Шаг 6): Панель настроек + Живой A4 просмотр */
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/80 dark:border-zinc-800 pb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                  {t.preview.title}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {t.preview.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={handleReturnToEdit}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                <span>{t.preview.editBtn}</span>
              </button>
            </div>

            {/* Мобильный переключатель вкладок (Виден только на смартфонах/планшетах < 1024px) */}
            <div className="flex lg:hidden items-center p-1 bg-zinc-200/70 dark:bg-zinc-800/80 rounded-2xl">
              <button
                type="button"
                onClick={() => setMobileTab("preview")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mobileTab === "preview"
                    ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{t.preview.tabPreview}</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileTab("controls")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mobileTab === "controls"
                    ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>{t.preview.tabControls}</span>
              </button>
            </div>

            {/* Основной макет: На мобильном переключается вкладками, на ПК (lg) отображается в 2 колонки */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Колонка: Панель управления и экспорт */}
              <div
                className={`lg:col-span-4 lg:sticky lg:top-20 ${
                  mobileTab === "controls" ? "block" : "hidden lg:block"
                }`}
              >
                <ControlPanel
                  data={formData}
                  onChangeData={(updated) => reset(updated)}
                  onEdit={handleReturnToEdit}
                  onReset={handleReset}
                />
              </div>

              {/* Колонка: Интерактивный предпросмотр листа A4 */}
              <div
                className={`lg:col-span-8 flex justify-center bg-zinc-100/70 dark:bg-zinc-900/40 p-2.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden ${
                  mobileTab === "preview" ? "block" : "hidden lg:block"
                }`}
              >
                <ResumePreview data={formData} />
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full border-t border-zinc-200/80 dark:border-zinc-800 py-6 text-center text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            ATS Resume Generator © {new Date().getFullYear()} — Global Client-Side App
          </span>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>100% Client-Side Privacy: No Server Data Storage</span>
          </div>
        </div>
      </footer>

      {/* Плавающая кнопка чата и отзывов сообщества */}
      <CommunityChatFloatingButton />

      {/* Модальное окно чата из шапки */}
      <CommunityChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
      />
    </div>
  );
}
