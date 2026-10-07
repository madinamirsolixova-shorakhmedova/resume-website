import { ResumeData } from "./schema";

export interface MatchResult {
  matchPercentage: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  totalVacancyKeywords: number;
}

/**
 * Нормализует строку для сравнения (удаляет знаки препинания, переводит в lowercase)
 */
export function normalizeString(str: string): string {
  return str.toLowerCase().replace(/[^a-zA-Zа-яА-Я0-9+#]/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Проверяет, содержится ли ключевое слово в тексте
 */
export function containsKeyword(text: string, keyword: string): boolean {
  if (!text || !keyword) return false;
  const normText = ` ${normalizeString(text)} `;
  const normKeyword = normalizeString(keyword);
  if (!normKeyword) return false;
  return normText.includes(` ${normKeyword} `) || normText.includes(normKeyword);
}

/**
 * Собирает весь текстовый контент резюме в одну строку для анализа
 */
export function getResumeFullText(resume: ResumeData): string {
  const parts: string[] = [];

  // Должность и резюме
  if (resume.personal.targetTitle) parts.push(resume.personal.targetTitle);
  if (resume.personal.summary) parts.push(resume.personal.summary);

  // Навыки
  if (resume.skills && resume.skills.length > 0) {
    parts.push(...resume.skills);
  }

  // Опыт работы
  if (!resume.hasNoExperience && resume.experience) {
    for (const exp of resume.experience) {
      if (exp.position) parts.push(exp.position);
      if (exp.company) parts.push(exp.company);
      if (exp.bullets) parts.push(...exp.bullets);
    }
  }

  // Образование
  if (resume.education) {
    for (const edu of resume.education) {
      if (edu.institution) parts.push(edu.institution);
      if (edu.faculty) parts.push(edu.faculty);
      if (edu.degree) parts.push(edu.degree);
    }
  }

  // Курсы
  if (resume.courses) {
    for (const c of resume.courses) {
      if (c.name) parts.push(c.name);
      if (c.organization) parts.push(c.organization);
    }
  }

  // Проекты
  if (resume.extraSections?.showProjects && resume.extraSections.projects) {
    for (const p of resume.extraSections.projects) {
      if (p.name) parts.push(p.name);
      if (p.description) parts.push(p.description);
    }
  }

  return parts.join(" ");
}

/**
 * Вычисляет соответствие резюме ключевым словам из вакансии
 */
export function calculateVacancyMatch(resume: ResumeData): MatchResult {
  const vacancyKeywords = resume.vacancy?.keywords || [];
  if (vacancyKeywords.length === 0) {
    return {
      matchPercentage: 100,
      matchedKeywords: [],
      missingKeywords: [],
      totalVacancyKeywords: 0,
    };
  }

  const fullResumeText = getResumeFullText(resume);
  const matched: string[] = [];
  const missing: string[] = [];

  for (const kw of vacancyKeywords) {
    // Проверяем прямое совпадение в навыках
    const inSkills = resume.skills?.some(
      (s) => normalizeString(s) === normalizeString(kw) || normalizeString(s).includes(normalizeString(kw))
    );

    // Или в общем тексте резюме
    const inText = containsKeyword(fullResumeText, kw);

    if (inSkills || inText) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  }

  const matchPercentage = Math.round((matched.length / vacancyKeywords.length) * 100);

  return {
    matchPercentage,
    matchedKeywords: matched,
    missingKeywords: missing,
    totalVacancyKeywords: vacancyKeywords.length,
  };
}

/**
 * Проверяет совпадение отдельного навыка с ключевыми словами вакансии
 */
export function isSkillMatchingVacancy(skill: string, vacancyKeywords: string[]): boolean {
  if (!skill || !vacancyKeywords || vacancyKeywords.length === 0) return false;
  const normSkill = normalizeString(skill);
  return vacancyKeywords.some((kw) => {
    const normKw = normalizeString(kw);
    return normSkill === normKw || normSkill.includes(normKw) || normKw.includes(normSkill);
  });
}
