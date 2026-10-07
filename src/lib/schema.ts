import { z } from "zod";

export const EducationItemSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Укажите учебное заведение"),
  faculty: z.string().optional(),
  degree: z.string().min(1, "Укажите степень или уровень"),
  startYear: z.string().min(1, "Укажите год начала"),
  endYear: z.string().optional(),
  current: z.boolean(),
});

export const CourseItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Укажите название курса"),
  organization: z.string().min(1, "Укажите организацию"),
  year: z.string().min(1, "Укажите год"),
});

export const WorkExperienceItemSchema = z.object({
  id: z.string(),
  position: z.string().min(1, "Укажите должность"),
  company: z.string().min(1, "Укажите компанию"),
  city: z.string().optional(),
  startMonth: z.string().optional(),
  startYear: z.string().min(1, "Укажите год начала"),
  endMonth: z.string().optional(),
  endYear: z.string().optional(),
  current: z.boolean(),
  bullets: z.array(z.string()).min(1, "Добавьте хотя бы одну обязанность или достижение"),
});

export const LanguageItemSchema = z.object({
  id: z.string(),
  language: z.string().min(1, "Укажите язык"),
  level: z.string().min(1, "Укажите уровень"),
});

export const ProjectItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Укажите название проекта"),
  description: z.string().min(1, "Укажите краткое описание"),
  link: z.string().optional(),
});

export const ResumeDataSchema = z.object({
  // Шаг 1: Вакансия
  vacancy: z.object({
    jobTitle: z.string().min(1, "Укажите название вакансии"),
    company: z.string().optional(),
    vacancyText: z.string().optional(),
    keywords: z.array(z.string()),
  }),

  // Шаг 2: Личные данные
  personal: z.object({
    fullName: z.string().min(2, "Укажите фамилию и имя"),
    targetTitle: z.string().min(1, "Укажите желаемую должность"),
    phone: z.string().min(6, "Укажите номер телефона"),
    email: z.string().email("Введите корректный email адрес"),
    city: z.string().min(1, "Укажите город проживания"),
    telegram: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.string().optional(),
    portfolio: z.string().optional(),
    photoUrl: z.string().optional(),
    showPhoto: z.boolean(),
    citizenship: z.string().optional(),
    relocation: z.string().optional(),
    workFormat: z.enum(["any", "office", "hybrid", "remote"]),
    summary: z.string().optional(),
  }),

  // Шаг 3: Образование
  education: z.array(EducationItemSchema),
  courses: z.array(CourseItemSchema),

  // Шаг 4: Опыт работы
  hasNoExperience: z.boolean(),
  experience: z.array(WorkExperienceItemSchema),

  // Шаг 5: Навыки и дополнительно
  skills: z.array(z.string()),
  languages: z.array(LanguageItemSchema),
  
  // Дополнительные секции
  extraSections: z.object({
    showProjects: z.boolean(),
    projects: z.array(ProjectItemSchema),
    showAwards: z.boolean(),
    awards: z.array(z.string()),
    showDriverLicense: z.boolean(),
    driverLicense: z.string().optional(),
    showHobbies: z.boolean(),
    hobbies: z.string().optional(),
  }),

  // Настройки отображения и экспорта
  settings: z.object({
    template: z.enum(["classic", "modern", "minimal"]),
    accentColor: z.string(),
    language: z.string().default("ru"),
  }),
});

export type EducationItem = z.infer<typeof EducationItemSchema>;
export type CourseItem = z.infer<typeof CourseItemSchema>;
export type WorkExperienceItem = z.infer<typeof WorkExperienceItemSchema>;
export type LanguageItem = z.infer<typeof LanguageItemSchema>;
export type ProjectItem = z.infer<typeof ProjectItemSchema>;
export type ResumeData = z.infer<typeof ResumeDataSchema>;

export const defaultResumeData: ResumeData = {
  vacancy: {
    jobTitle: "",
    company: "",
    vacancyText: "",
    keywords: [],
  },
  personal: {
    fullName: "",
    targetTitle: "",
    phone: "",
    email: "",
    city: "",
    telegram: "",
    github: "",
    linkedin: "",
    portfolio: "",
    photoUrl: "",
    showPhoto: false,
    citizenship: "",
    relocation: "",
    workFormat: "remote",
    summary: "",
  },
  education: [
    {
      id: "edu-1",
      institution: "",
      faculty: "",
      degree: "Бакалавр",
      startYear: "",
      endYear: "",
      current: false,
    },
  ],
  courses: [],
  hasNoExperience: false,
  experience: [
    {
      id: "exp-1",
      position: "",
      company: "",
      city: "",
      startMonth: "09",
      startYear: "2021",
      endMonth: "",
      endYear: "",
      current: true,
      bullets: [""],
    },
  ],
  skills: [],
  languages: [
    {
      id: "lang-1",
      language: "Русский",
      level: "Родной",
    },
    {
      id: "lang-2",
      language: "Английский",
      level: "B2",
    },
  ],
  extraSections: {
    showProjects: false,
    projects: [],
    showAwards: false,
    awards: [],
    showDriverLicense: false,
    driverLicense: "Категория B",
    showHobbies: false,
    hobbies: "",
  },
  settings: {
    template: "modern",
    accentColor: "#2563eb",
    language: "ru",
  },
};

export const sampleResumeData: ResumeData = {
  vacancy: {
    jobTitle: "Senior Frontend Developer",
    company: "Яндекс / Финтех",
    vacancyText: `Ищем Senior Frontend разработчика в команду финтех-сервисов.
Требования:
- Отличное знание JavaScript, TypeScript, React 18+ и Next.js.
- Опыт работы с архитектурой веб-приложений, Redux Toolkit, Zustand.
- Опыт оптимизации производительности (Web Vitals, SSR, CSR).
- Понимание REST API, GraphQL, WebSockets.
- Опыт написания тестов (Jest, React Testing Library, Playwright).
- Навыки работы с CI/CD, Docker, Git.
- Умение декомпозировать задачи и проводить качественный Code Review.`,
    keywords: [
      "TypeScript",
      "React",
      "Next.js",
      "Zustand",
      "Redux Toolkit",
      "REST API",
      "GraphQL",
      "WebSockets",
      "Jest",
      "Playwright",
      "CI/CD",
      "Docker",
      "Code Review",
      "Web Vitals",
      "Оптимизация производительности",
    ],
  },
  personal: {
    fullName: "Алексей Смирнов",
    targetTitle: "Senior Frontend Developer",
    phone: "+7 (999) 123-45-67",
    email: "alexey.smirnov.dev@gmail.com",
    city: "Москва",
    telegram: "@alex_frontend",
    github: "github.com/alex-smirnov",
    linkedin: "linkedin.com/in/alexey-smirnov",
    portfolio: "alexsmirnov.dev",
    photoUrl: "",
    showPhoto: false,
    citizenship: "РФ",
    relocation: "Готов к релокации",
    workFormat: "remote",
    summary:
      "Frontend-разработчик с более чем 6 годами опыта проектирования и масштабирования высоконагруженных веб-сервисов. Специализируюсь на React, TypeScript и Next.js. Успешно ускорил загрузку ключевого финтех-продукта на 42% и снизил технический долг в распределенной команде.",
  },
  education: [
    {
      id: "edu-1",
      institution: "Московский государственный технический университет им. Н.Э. Баумана",
      faculty: "Информатика и системы управления",
      degree: "Магистр",
      startYear: "2015",
      endYear: "2021",
      current: false,
    },
  ],
  courses: [
    {
      id: "course-1",
      name: "Advanced TypeScript & Architecture Patterns",
      organization: "Frontend Masters",
      year: "2023",
    },
    {
      id: "course-2",
      name: "Docker & Kubernetes for Frontend Engineers",
      organization: "Coursera",
      year: "2022",
    },
  ],
  hasNoExperience: false,
  experience: [
    {
      id: "exp-1",
      position: "Lead Frontend Engineer",
      company: "VK Tech",
      city: "Москва",
      startMonth: "03",
      startYear: "2022",
      endMonth: "",
      endYear: "",
      current: true,
      bullets: [
        "Спроектировал и внедрил архитектуру микрофронтендов на Next.js и TypeScript, сократив время сборки модулей на 35%",
        "Оптимизировал Core Web Vitals для веб-приложения с 3M+ MAU, повысив First Contentful Paint с 2.8с до 1.1с",
        "Интегрировал REST API и WebSockets для стриминга биржевых котировок в реальном времени с нулевыми задержками",
        "Настроил полный пайплайн CI/CD в Docker и поднял покрытие e2e и unit-тестами (Jest, Playwright) до 85%",
        "Проводил регулярный Code Review и менторил 6 инженеров уровня Middle и Junior",
      ],
    },
    {
      id: "exp-2",
      position: "Senior Frontend Developer",
      company: "Тинькофф",
      city: "Москва",
      startMonth: "08",
      startYear: "2019",
      endMonth: "02",
      endYear: "2022",
      current: false,
      bullets: [
        "Разработал ключевые интерфейсы личного кабинета для юридических лиц с использованием React, Redux Toolkit и Zustand",
        "Внедрил дизайн-систему на Tailwind CSS, что ускорил выпуск новых продуктовых фичей в 2 раза",
        "Оптимизировал сетевые запросы с помощью GraphQL, снизив объем передаваемого трафика на 28%",
      ],
    },
  ],
  skills: [
    "TypeScript",
    "React",
    "Next.js",
    "Zustand",
    "Redux Toolkit",
    "Tailwind CSS",
    "REST API",
    "GraphQL",
    "WebSockets",
    "Jest",
    "Playwright",
    "Docker",
    "CI/CD",
    "Git",
    "Code Review",
    "Web Vitals",
  ],
  languages: [
    {
      id: "lang-1",
      language: "Русский",
      level: "Родной",
    },
    {
      id: "lang-2",
      language: "Английский",
      level: "C1 (Advanced)",
    },
  ],
  extraSections: {
    showProjects: true,
    projects: [
      {
        id: "proj-1",
        name: "ATS Resume Builder Open-Source",
        description: "Клиентское приложение для генерации и проверки ATS-резюме на Next.js, docx и pdf.",
        link: "github.com/alex-smirnov/ats-resume",
      },
    ],
    showAwards: true,
    awards: ["1-е место на VK Fintech Hackathon (2022)", "Спикер конференции Frontend Conf 2023"],
    showDriverLicense: true,
    driverLicense: "Категория B (стаж 7 лет)",
    showHobbies: true,
    hobbies: "Технические статьи на Хабре, бег на полумарафонские дистанции, шахматы",
  },
  settings: {
    template: "modern",
    accentColor: "#1e40af", // Indigo Navy
    language: "ru",
  },
};
