"use client";

import React, { useState, useEffect, useRef } from "react";
import { ResumeData } from "@/lib/schema";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { ModernTemplate } from "./templates/ModernTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { ZoomIn, ZoomOut, Smartphone, Maximize2 } from "lucide-react";

interface Props {
  data: ResumeData;
}

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

export const ResumePreview: React.FC<Props> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [fitScale, setFitScale] = useState(1);
  const [hasManuallyZoomed, setHasManuallyZoomed] = useState(false);
  const template = data.settings?.template || "classic";

  // Автоматический расчёт масштаба в зависимости от доступной ширины экрана (ПК / смартфон)
  useEffect(() => {
    const calculateFitScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      // Безопасный отступ для мобильных устройств
      const availableWidth = Math.max(260, containerWidth - 24);
      const computed = Math.min(1.0, Number((availableWidth / A4_WIDTH_PX).toFixed(2)));
      setFitScale(computed);

      // Если пользователь не менял масштаб вручную, подстраиваем лист под ширину экрана
      if (!hasManuallyZoomed) {
        setScale(computed);
      }
    };

    calculateFitScale();

    const resizeObserver = new ResizeObserver(() => {
      calculateFitScale();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", calculateFitScale);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", calculateFitScale);
    };
  }, [hasManuallyZoomed]);

  const handleZoomIn = () => {
    setHasManuallyZoomed(true);
    setScale((s) => Math.min(1.5, Number((s + 0.1).toFixed(2))));
  };

  const handleZoomOut = () => {
    setHasManuallyZoomed(true);
    setScale((s) => Math.max(0.3, Number((s - 0.1).toFixed(2))));
  };

  const handleFitScreen = () => {
    setScale(fitScale);
    setHasManuallyZoomed(false);
  };

  const handleActualSize = () => {
    setScale(1.0);
    setHasManuallyZoomed(true);
  };

  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={data} />;
      case "minimal":
        return <MinimalTemplate data={data} />;
      case "classic":
      default:
        return <ClassicTemplate data={data} />;
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center w-full max-w-full">
      {/* Панель управления масштабом (адаптивная, не перекрывает контент) */}
      <div className="sticky top-20 z-20 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-4 bg-white/95 dark:bg-zinc-800/95 backdrop-blur border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded-full shadow-md text-xs text-zinc-600 dark:text-zinc-300">
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-1.5 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          title="Уменьшить масштаб"
          aria-label="Уменьшить"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span className="w-12 text-center font-mono font-bold text-zinc-900 dark:text-zinc-100">
          {Math.round(scale * 100)}%
        </span>

        <button
          type="button"
          onClick={handleZoomIn}
          className="p-1.5 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          title="Увеличить масштаб"
          aria-label="Увеличить"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-0.5" />

        {/* Кнопка "Вписать в экран" (идеальна для телефонов) */}
        <button
          type="button"
          onClick={handleFitScreen}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
            Math.abs(scale - fitScale) < 0.03
              ? "bg-blue-600 text-white shadow-xs"
              : "hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
          }`}
          title="Вписать по ширине экрана"
        >
          <Smartphone className="w-3.5 h-3.5 sm:hidden" />
          <Maximize2 className="w-3.5 h-3.5 hidden sm:inline" />
          <span>По экрану</span>
        </button>

        {/* Кнопка 100% реальный размер A4 */}
        <button
          type="button"
          onClick={handleActualSize}
          className={`px-2 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
            Math.abs(scale - 1.0) < 0.03
              ? "bg-blue-600 text-white shadow-xs"
              : "hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
          }`}
          title="Реальный размер A4 (100%)"
        >
          100%
        </button>
      </div>

      {/* Контейнер листа A4: адаптируется под ширину мобильного экрана без горизонтального скролла */}
      <div className="w-full flex justify-center overflow-x-auto touch-pan-x touch-pan-y pb-6">
        <div
          style={{
            width: `${Math.round(A4_WIDTH_PX * scale)}px`,
            height: `${Math.round(A4_HEIGHT_PX * scale)}px`,
          }}
          className="relative shrink-0 shadow-2xl rounded-lg bg-white border border-zinc-200/90 dark:border-zinc-700 transition-[width,height] duration-150 origin-top overflow-hidden"
        >
          <div
            style={{
              width: `${A4_WIDTH_PX}px`,
              minHeight: `${A4_HEIGHT_PX}px`,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
            className="absolute top-0 left-0 bg-white text-zinc-900 select-text"
          >
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};
