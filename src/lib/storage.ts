import { ResumeData } from "./schema";

const STORAGE_KEY = "ats_resume_builder_draft_v1";

export function saveDraft(data: ResumeData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save draft to localStorage", e);
  }
}

export function loadDraft(): ResumeData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load draft from localStorage", e);
    return null;
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear draft from localStorage", e);
  }
}

/**
 * Генерирует имя файла по шаблону Резюме_ФИО_Должность
 */
export function getExportFileName(data: ResumeData, ext: "docx" | "pdf"): string {
  const namePart = (data.personal.fullName || "Кандидат")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Zа-яА-Я0-9_-]/g, "");

  const rolePart = (data.personal.targetTitle || data.vacancy.jobTitle || "Резюме")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Zа-яА-Я0-9_-]/g, "");

  return `Резюме_${namePart}_${rolePart}.${ext}`;
}
