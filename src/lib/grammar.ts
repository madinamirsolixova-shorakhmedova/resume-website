/**
 * Модуль автоматической проверки и исправления грамматических,
 * пунктуационных и орфографических ошибок на русском, узбекском и английском языках.
 */

import { ResumeData } from "./schema";

export interface GrammarCorrectionResult {
  originalText: string;
  correctedText: string;
  fixesCount: number;
  changes: string[];
}

// Известные названия технологий и инструментов для приведения к каноническому регистру
const TECH_TERMS: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  react: "React",
  "react.js": "React.js",
  nextjs: "Next.js",
  "next.js": "Next.js",
  nodejs: "Node.js",
  "node.js": "Node.js",
  vuejs: "Vue.js",
  "vue.js": "Vue.js",
  vue: "Vue",
  redux: "Redux",
  zustand: "Zustand",
  tailwind: "Tailwind CSS",
  "tailwind css": "Tailwind CSS",
  graphql: "GraphQL",
  "rest api": "REST API",
  rest: "REST",
  docker: "Docker",
  kubernetes: "Kubernetes",
  "ci/cd": "CI/CD",
  postgresql: "PostgreSQL",
  postgres: "PostgreSQL",
  mysql: "MySQL",
  mongodb: "MongoDB",
  redis: "Redis",
  html5: "HTML5",
  css3: "CSS3",
  html: "HTML",
  css: "CSS",
  git: "Git",
  github: "GitHub",
  gitlab: "GitLab",
  figma: "Figma",
  jira: "Jira",
  confluence: "Confluence",
  jest: "Jest",
  playwright: "Playwright",
  cypress: "Cypress",
  vitest: "Vitest",
  webpack: "Webpack",
  vite: "Vite",
  "code review": "Code Review",
};

// Частые опечатки и грамматические ошибки в русском языке
const RU_SPELLING_RULES: Array<[RegExp, string, string]> = [
  [/\bпо\s+настоящие\s+время\b/gi, "по настоящее время", "по настоящее время"],
  [/\bпо\s+настоящее\s+времени\b/gi, "по настоящее время", "по настоящее время"],
  [/\bв\s+течении\s+(года|месяца|двух|трех|пяти|недели|проекта|работы)\b/gi, "в течение $1", "в течение (предлог времени)"],
  [/\bв\s+следствии\b/gi, "вследствие", "вследствие (слитно)"],
  [/\bразработка\s+веб\s+приложений\b/gi, "разработка веб-приложений", "дефис в 'веб-приложений'"],
  [/\bвеб\s+разработка\b/gi, "веб-разработка", "дефис в 'веб-разработка'"],
  [/\bвеб\s+сервис/gi, "веб-сервис", "дефис в 'веб-сервис'"],
  [/\bруководство\s+команды\b/gi, "руководство командой", "падеж: руководство командой"],
  [/\bучавствовал/gi, "участвовал", "лишняя 'в' в 'участвовал'"],
  [/\bпрограмирован/gi, "программирован", "двойная 'м' в 'программирование'"],
  [/\bпрограмист/gi, "программист", "двойная 'м' в 'программист'"],
  [/\bкоммерчесск/gi, "коммерческ", "одна 'с' в 'коммерческий'"],
  [/\bоптимизирывал/gi, "оптимизировал", "суффикс -ова- в 'оптимизировал'"],
  [/\bспроектирывал/gi, "спроектировал", "суффикс -ова- в 'спроектировал'"],
  [/\bвыполнял\s+обязаности\b/gi, "выполнял обязанности", "двойная 'н' в 'обязанности'"],
  [/\bопыт\s+работы\s+более\s+чем\b/gi, "опыт работы более", "стилистика: 'опыт работы более'"],
];

// Частые опечатки в английском языке
const EN_SPELLING_RULES: Array<[RegExp, string, string]> = [
  [/\bexperiance\b/gi, "experience", "spelling: experience"],
  [/\bexperence\b/gi, "experience", "spelling: experience"],
  [/\bdevelopement\b/gi, "development", "spelling: development"],
  [/\bdevlopment\b/gi, "development", "spelling: development"],
  [/\bresponsbilit/gi, "responsibilit", "spelling: responsibility"],
  [/\bmanagment\b/gi, "management", "spelling: management"],
  [/\bachivement\b/gi, "achievement", "spelling: achievement"],
  [/\bacheivement\b/gi, "achievement", "spelling: achievement"],
  [/\bsuccesful\b/gi, "successful", "spelling: successful"],
  [/\bsuccesfully\b/gi, "successfully", "spelling: successfully"],
  [/\bneccessary\b/gi, "necessary", "spelling: necessary"],
  [/\benviroment\b/gi, "environment", "spelling: environment"],
  [/\bmaintainance\b/gi, "maintenance", "spelling: maintenance"],
  [/\bimporve\b/gi, "improve", "spelling: improve"],
  [/\bimporved\b/gi, "improved", "spelling: improved"],
  [/\bprofesional\b/gi, "professional", "spelling: professional"],
  [/\barchitecure\b/gi, "architecture", "spelling: architecture"],
  [/\bprograming\b/gi, "programming", "spelling: programming"],
  [/\bi\s+/g, "I ", "capitalization of 'I'"],
];

// Частые опечатки в узбекском языке (лотин алифбоси)
const UZ_SPELLING_RULES: Array<[RegExp, string, string]> = [
  [/\bmalumot\b/gi, "ma'lumot", "tutuq belgisi: ma'lumot"],
  [/\bmalumotlar\b/gi, "ma'lumotlar", "tutuq belgisi: ma'lumotlar"],
  [/\btalim\b/gi, "ta'lim", "tutuq belgisi: ta'lim"],
  [/\bmasulyat\b/gi, "mas'uliyat", "tutuq belgisi: mas'uliyat"],
  [/\bmasuliyat\b/gi, "mas'uliyat", "tutuq belgisi: mas'uliyat"],
  [/\bmuvafaqiyatli\b/gi, "muvaffaqiyatli", "qo'sh 'f': muvaffaqiyatli"],
  [/\bmuvafaqqiyatli\b/gi, "muvaffaqiyatli", "to'g'ri yozilishi: muvaffaqiyatli"],
  [/\bloyhalar\b/gi, "loyihalar", "to'g'ri yozilishi: loyihalar"],
  [/\bloyha\b/gi, "loyiha", "to'g'ri yozilishi: loyiha"],
  [/\bdasturlaw\b/gi, "dasturlash", "'sh' harfi: dasturlash"],
  [/\byonalishida\b/gi, "yo'nalishida", "tutuq belgisi: yo'nalishida"],
  [/\bqoshimcha\b/gi, "qo'shimcha", "tutuq belgisi: qo'shimcha"],
  [/\bkonikmalar\b/gi, "ko'nikmalar", "tutuq belgisi: ko'nikmalar"],
  [/\btadjriba\b/gi, "tajriba", "to'g'ri yozilishi: tajriba"],
  [/\btadjribasi\b/gi, "tajribasi", "to'g'ri yozilishi: tajribasi"],
  [/\bish\s+tajirbasi\b/gi, "ish tajribasi", "to'g'ri yozilishi: ish tajribasi"],
  [/\bko'chib\s+otish\b/gi, "ko'chib o'tish", "tutuq belgisi: ko'chib o'tish"],
];

/**
 * Проверяет и исправляет грамматику, регистр, пунктуацию и орфографию текста
 */
export function correctTextGrammar(text: string): GrammarCorrectionResult {
  if (!text || text.trim().length === 0) {
    return {
      originalText: text,
      correctedText: text,
      fixesCount: 0,
      changes: [],
    };
  }

  let result = text;
  const changes: string[] = [];

  // 1. Стандартизация пробелов (удаление повторяющихся пробелов)
  if (/ {2,}/.test(result)) {
    result = result.replace(/ {2,}/g, " ");
    changes.push("Удалены лишние пробелы");
  }

  // 2. Исправление пробелов перед знаками препинания: "слово , тест" -> "слово, тест"
  if (/\s+([,.:;!?])/.test(result)) {
    result = result.replace(/\s+([,.:;!?])/g, "$1");
    changes.push("Удалены пробелы перед знаками препинания");
  }

  // 3. Добавление обязательного пробела после запятой, двоеточия, точки с запятой, если после них идет буква
  if (/([,;:])([a-zA-Zа-яА-ЯёЁ])/u.test(result)) {
    result = result.replace(/([,;:])([a-zA-Zа-яА-ЯёЁ])/gu, "$1 $2");
    changes.push("Добавлены недостающие пробелы после знаков препинания");
  }

  // 4. Добавление пробела после точки, восклицательного или вопросительного знака в конце предложения
  if (/([.!?])([A-ZА-ЯЁ])/u.test(result)) {
    result = result.replace(/([.!?])([A-ZА-ЯЁ])/gu, "$1 $2");
    changes.push("Добавлены пробелы между предложениями");
  }

  // 5. Исправление дефисов/тире: " - " или " — "
  if (/\s+-\s+/.test(result)) {
    result = result.replace(/\s+-\s+/g, " — ");
    changes.push("Дефис заменён на аккуратное тире '—'");
  }

  // 6. Исправление специфических апострофов узбекского языка (o‘, g‘ -> o', g')
  if (/[ogOG][`‘ʻ’]/u.test(result)) {
    result = result.replace(/([ogOG])[`‘ʻ’]/gu, "$1'");
    changes.push("Стандартизированы апострофы узбекского алфавита (o', g')");
  }

  // 7. Правила русского языка
  for (const [regex, replacement, desc] of RU_SPELLING_RULES) {
    if (regex.test(result)) {
      result = result.replace(regex, replacement);
      changes.push(`Русский: ${desc}`);
    }
  }

  // 8. Правила английского языка
  for (const [regex, replacement, desc] of EN_SPELLING_RULES) {
    if (regex.test(result)) {
      result = result.replace(regex, replacement);
      changes.push(`English: ${desc}`);
    }
  }

  // 9. Правила узбекского языка
  for (const [regex, replacement, desc] of UZ_SPELLING_RULES) {
    if (regex.test(result)) {
      result = result.replace(regex, replacement);
      changes.push(`O'zbekcha: ${desc}`);
    }
  }

  // 10. Канонический регистр названий технологий (React, TypeScript, Docker, etc.)
  for (const [lowerTerm, properTerm] of Object.entries(TECH_TERMS)) {
    const escaped = lowerTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|[^a-zA-Z0-9_#+])${escaped}(?=[^a-zA-Z0-9_#+]|$)`, "gi");
    if (regex.test(result)) {
      result = result.replace(regex, (match, prefix) => {
        return (prefix || "") + properTerm;
      });
      changes.push(`Капитализация технологии: ${properTerm}`);
    }
  }

  // 11. Заглавная буква в начале текста или первого предложения
  if (result.length > 0 && /^[a-zа-яё]/u.test(result)) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
    changes.push("Заглавная буква в начале предложения");
  }

  // Дедупликация списка изменений
  const uniqueChanges = Array.from(new Set(changes));

  return {
    originalText: text,
    correctedText: result,
    fixesCount: uniqueChanges.length,
    changes: uniqueChanges,
  };
}

/**
 * Проверяет и исправляет грамматику во всех введенных текстовых полях резюме:
 * - Заголовок и текст вакансии
 * - Желаемая должность и блок «О себе»
 * - Буллеты обязанностей и достижений
 * - Названия проектов и описания
 */
export function correctAllResumeTexts(resume: ResumeData): {
  updatedData: ResumeData;
  totalFixes: number;
  report: string[];
} {
  const updated: ResumeData = JSON.parse(JSON.stringify(resume));
  let totalFixes = 0;
  const report: string[] = [];

  // Вакансия
  if (updated.vacancy?.jobTitle) {
    const res = correctTextGrammar(updated.vacancy.jobTitle);
    if (res.correctedText !== updated.vacancy.jobTitle) {
      updated.vacancy.jobTitle = res.correctedText;
      totalFixes += res.fixesCount;
      report.push(...res.changes);
    }
  }

  // О себе
  if (updated.personal?.summary) {
    const res = correctTextGrammar(updated.personal.summary);
    if (res.correctedText !== updated.personal.summary) {
      updated.personal.summary = res.correctedText;
      totalFixes += res.fixesCount;
      report.push(...res.changes);
    }
  }

  // Опыт работы: буллеты
  if (updated.experience && Array.isArray(updated.experience)) {
    for (let i = 0; i < updated.experience.length; i++) {
      const exp = updated.experience[i];
      if (exp.position) {
        const res = correctTextGrammar(exp.position);
        if (res.correctedText !== exp.position) {
          exp.position = res.correctedText;
          totalFixes += res.fixesCount;
        }
      }
      if (exp.bullets && Array.isArray(exp.bullets)) {
        for (let j = 0; j < exp.bullets.length; j++) {
          const bullet = exp.bullets[j];
          if (bullet) {
            const res = correctTextGrammar(bullet);
            if (res.correctedText !== bullet) {
              exp.bullets[j] = res.correctedText;
              totalFixes += res.fixesCount;
              report.push(...res.changes);
            }
          }
        }
      }
    }
  }

  // Проекты
  if (updated.extraSections?.projects && Array.isArray(updated.extraSections.projects)) {
    for (const proj of updated.extraSections.projects) {
      if (proj.description) {
        const res = correctTextGrammar(proj.description);
        if (res.correctedText !== proj.description) {
          proj.description = res.correctedText;
          totalFixes += res.fixesCount;
          report.push(...res.changes);
        }
      }
    }
  }

  return {
    updatedData: updated,
    totalFixes,
    report: Array.from(new Set(report)),
  };
}
