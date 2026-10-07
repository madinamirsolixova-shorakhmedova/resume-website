export type Language = string;

export interface Translations {
  sections: {
    summary: string;
    experience: string;
    education: string;
    courses: string;
    skills: string;
    languages: string;
    projects: string;
    awards: string;
    driverLicense: string;
    hobbies: string;
    contacts: string;
  };
  common: {
    present: string;
    citizenship: string;
    relocation: string;
    workFormat: {
      any: string;
      office: string;
      hybrid: string;
      remote: string;
    };
    phone: string;
    email: string;
    city: string;
  };
  months: string[];
}

const RAW_TRANSLATIONS: Record<string, Translations> = {
  ru: {
    sections: {
      summary: "О себе",
      experience: "Опыт работы",
      education: "Образование",
      courses: "Курсы и сертификаты",
      skills: "Навыки",
      languages: "Иностранные языки",
      projects: "Проекты",
      awards: "Награды и достижения",
      driverLicense: "Водительские права",
      hobbies: "Интересы и хобби",
      contacts: "Контакты",
    },
    common: {
      present: "по настоящее время",
      citizenship: "Гражданство",
      relocation: "Релокация",
      workFormat: {
        any: "Любой формат",
        office: "В офисе",
        hybrid: "Гибридный график",
        remote: "Удаленная работа",
      },
      phone: "Телефон",
      email: "Email",
      city: "Город",
    },
    months: [
      "Янв", "Фев", "Мар", "Апр", "Май", "Июн",
      "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"
    ],
  },
  en: {
    sections: {
      summary: "Professional Summary",
      experience: "Work Experience",
      education: "Education",
      courses: "Courses & Certifications",
      skills: "Skills",
      languages: "Languages",
      projects: "Projects",
      awards: "Honors & Awards",
      driverLicense: "Driver's License",
      hobbies: "Interests & Hobbies",
      contacts: "Contact",
    },
    common: {
      present: "Present",
      citizenship: "Citizenship",
      relocation: "Relocation",
      workFormat: {
        any: "Any format",
        office: "On-site",
        hybrid: "Hybrid",
        remote: "Remote",
      },
      phone: "Phone",
      email: "Email",
      city: "City",
    },
    months: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
  },
  uz: {
    sections: {
      summary: "Men haqimda",
      experience: "Ish tajribasi",
      education: "Ta'lim",
      courses: "Kurslar va sertifikatlar",
      skills: "Kasbiy ko'nikmalar",
      languages: "Til bilish darajasi",
      projects: "Loyihalar",
      awards: "Yutuqlar va mukofotlar",
      driverLicense: "Haydovchilik guvohnomasi",
      hobbies: "Qiziqishlar va xobbi",
      contacts: "Aloqa ma'lumotlari",
    },
    common: {
      present: "hozirgi vaqtgacha",
      citizenship: "Fuqaroligi",
      relocation: "Ko'chib o'tish",
      workFormat: {
        any: "Ixtiyoriy format",
        office: "Ofisda",
        hybrid: "Gibrid grafik",
        remote: "Masofaviy ish",
      },
      phone: "Telefon",
      email: "Email",
      city: "Shahar",
    },
    months: [
      "Yan", "Fev", "Mar", "Apr", "May", "Iyun",
      "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"
    ],
  },
  es: {
    sections: {
      summary: "Perfil Profesional",
      experience: "Experiencia Laboral",
      education: "Educación",
      courses: "Cursos y Certificaciones",
      skills: "Habilidades",
      languages: "Idiomas",
      projects: "Proyectos",
      awards: "Premios y Reconocimientos",
      driverLicense: "Permiso de Conducir",
      hobbies: "Intereses y Pasatiempos",
      contacts: "Contacto",
    },
    common: {
      present: "Actualmente",
      citizenship: "Nacionalidad",
      relocation: "Disponibilidad para viajar",
      workFormat: {
        any: "Cualquier modalidad",
        office: "Presencial",
        hybrid: "Híbrido",
        remote: "Remoto",
      },
      phone: "Teléfono",
      email: "Email",
      city: "Ciudad",
    },
    months: [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ],
  },
  fr: {
    sections: {
      summary: "Profil Professionnel",
      experience: "Expérience Professionnelle",
      education: "Formation",
      courses: "Certifications & Formations",
      skills: "Compétences",
      languages: "Langues",
      projects: "Projets",
      awards: "Prix et Distinctions",
      driverLicense: "Permis de Conduire",
      hobbies: "Centres d'intérêt",
      contacts: "Coordonnées",
    },
    common: {
      present: "Aujourd'hui",
      citizenship: "Nationalité",
      relocation: "Mobilité",
      workFormat: {
        any: "Tous formats",
        office: "Sur site",
        hybrid: "Hybride",
        remote: "Télétravail",
      },
      phone: "Téléphone",
      email: "Email",
      city: "Ville",
    },
    months: [
      "Janv", "Févr", "Mars", "Avr", "Mai", "Juin",
      "Juil", "Août", "Sept", "Oct", "Nov", "Déc"
    ],
  },
  de: {
    sections: {
      summary: "Kurzprofil",
      experience: "Berufserfahrung",
      education: "Ausbildung",
      courses: "Zertifikate & Weiterbildung",
      skills: "Kenntnisse & Fähigkeiten",
      languages: "Sprachen",
      projects: "Projekte",
      awards: "Auszeichnungen & Erfolge",
      driverLicense: "Führerschein",
      hobbies: "Interessen & Hobbys",
      contacts: "Kontaktdaten",
    },
    common: {
      present: "Heute",
      citizenship: "Staatsangehörigkeit",
      relocation: "Umzugsbereitschaft",
      workFormat: {
        any: "Flexibel",
        office: "Vor Ort",
        hybrid: "Hybrid",
        remote: "Home-Office",
      },
      phone: "Telefon",
      email: "E-Mail",
      city: "Stadt",
    },
    months: [
      "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
      "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"
    ],
  },
  zh: {
    sections: {
      summary: "个人总结",
      experience: "工作经验",
      education: "教育背景",
      courses: "培训与认证",
      skills: "专业技能",
      languages: "语言能力",
      projects: "项目经验",
      awards: "荣誉与奖项",
      driverLicense: "驾照",
      hobbies: "兴趣爱好",
      contacts: "联系方式",
    },
    common: {
      present: "至今",
      citizenship: "国籍",
      relocation: "接受调动",
      workFormat: {
        any: "任意形式",
        office: "线下办公",
        hybrid: "混合办公",
        remote: "远程办公",
      },
      phone: "电话",
      email: "邮箱",
      city: "城市",
    },
    months: [
      "1月", "2月", "3月", "4月", "5月", "6月",
      "7月", "8月", "9月", "10月", "11月", "12月"
    ],
  },
  ar: {
    sections: {
      summary: "الملخص المهني",
      experience: "الخبرة العملية",
      education: "التعليم",
      courses: "الدورات والشهادات",
      skills: "المهارات",
      languages: "اللغات",
      projects: "المشاريع",
      awards: "الجوائز والتكريمات",
      driverLicense: "رخصة القيادة",
      hobbies: "الهوايات والاهتمامات",
      contacts: "معلومات الاتصال",
    },
    common: {
      present: "حتى الآن",
      citizenship: "الجنسية",
      relocation: "الاستعداد للانتقال",
      workFormat: {
        any: "أي نمط",
        office: "حضوري",
        hybrid: "هجين",
        remote: "عن بُعد",
      },
      phone: "الهاتف",
      email: "البريد الإلكتروني",
      city: "المدينة",
    },
    months: [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ],
  },
  pt: {
    sections: {
      summary: "Resumo Profissional",
      experience: "Experiência Profissional",
      education: "Formação Acadêmica",
      courses: "Cursos e Certificações",
      skills: "Habilidades",
      languages: "Idiomas",
      projects: "Projetos",
      awards: "Prêmios e Conquistas",
      driverLicense: "Carteira de Habilitação",
      hobbies: "Interesses e Hobbies",
      contacts: "Contatos",
    },
    common: {
      present: "Atualmente",
      citizenship: "Nacionalidade",
      relocation: "Disponibilidade para mudança",
      workFormat: {
        any: "Qualquer modalidade",
        office: "Presencial",
        hybrid: "Híbrido",
        remote: "Remoto",
      },
      phone: "Telefone",
      email: "Email",
      city: "Cidade",
    },
    months: [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ],
  },
  it: {
    sections: {
      summary: "Profilo Professionale",
      experience: "Esperienza Lavorativa",
      education: "Istruzione e Formazione",
      courses: "Corsi e Certificazioni",
      skills: "Competenze",
      languages: "Lingue",
      projects: "Progetti",
      awards: "Premi e Riconoscimenti",
      driverLicense: "Patente di Guida",
      hobbies: "Interessi e Hobby",
      contacts: "Contatti",
    },
    common: {
      present: "Presente",
      citizenship: "Cittadinanza",
      relocation: "Disponibilità al trasferimento",
      workFormat: {
        any: "Qualsiasi formato",
        office: "In sede",
        hybrid: "Ibrido",
        remote: "Da remoto",
      },
      phone: "Telefono",
      email: "Email",
      city: "Città",
    },
    months: [
      "Gen", "Feb", "Mar", "Apr", "Mag", "Giu",
      "Lug", "Ago", "Set", "Ott", "Nov", "Dic"
    ],
  },
  ja: {
    sections: {
      summary: "職務要約",
      experience: "職務経歴",
      education: "学歴",
      courses: "資格・認定",
      skills: "スキル",
      languages: "語学力",
      projects: "プロジェクト実績",
      awards: "受賞歴",
      driverLicense: "運転免許",
      hobbies: "趣味・特技",
      contacts: "連絡先",
    },
    common: {
      present: "現在",
      citizenship: "国籍",
      relocation: "転勤・転居の可否",
      workFormat: {
        any: "問わない",
        office: "出社",
        hybrid: "ハイブリッド",
        remote: "リモート",
      },
      phone: "電話番号",
      email: "メール",
      city: "現住所",
    },
    months: [
      "1月", "2月", "3月", "4月", "5月", "6月",
      "7月", "8月", "9月", "10月", "11月", "12月"
    ],
  },
  ko: {
    sections: {
      summary: "자기소개 및 요약",
      experience: "경력사항",
      education: "학력사항",
      courses: "교육 및 자격증",
      skills: "보유 기술",
      languages: "외국어 능력",
      projects: "주요 프로젝트",
      awards: "수상 및 활동",
      driverLicense: "운전면허",
      hobbies: "취미 및 특기",
      contacts: "연락처",
    },
    common: {
      present: "현재",
      citizenship: "국적",
      relocation: "근무지 이전 가능",
      workFormat: {
        any: "모두 가능",
        office: "오피스 출근",
        hybrid: "하이브리드",
        remote: "재택근무",
      },
      phone: "연락처",
      email: "이메일",
      city: "거주지",
    },
    months: [
      "1월", "2월", "3월", "4월", "5월", "6月",
      "7월", "8월", "9월", "10월", "11월", "12월"
    ],
  },
  tr: {
    sections: {
      summary: "Özet ve Profil",
      experience: "İş Deneyimi",
      education: "Eğitim",
      courses: "Sertifikalar ve Kurslar",
      skills: "Beceriler",
      languages: "Yabancı Diller",
      projects: "Projeler",
      awards: "Ödüller ve Başarılar",
      driverLicense: "Sürücü Belgesi",
      hobbies: "İlgi Alanları ve Hobiler",
      contacts: "İletişim",
    },
    common: {
      present: "Halen",
      citizenship: "Vatandaşlık",
      relocation: "Taşınma durumu",
      workFormat: {
        any: "Fark etmez",
        office: "Ofisten",
        hybrid: "Hibrit",
        remote: "Uzaktan",
      },
      phone: "Telefon",
      email: "E-posta",
      city: "Şehir",
    },
    months: [
      "Oca", "Şub", "Mar", "Nis", "May", "Haz",
      "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"
    ],
  },
  hi: {
    sections: {
      summary: "व्यावसायिक सारांश",
      experience: "कार्य अनुभव",
      education: "शिक्षा",
      courses: "प्रमाणपत्र और पाठ्यक्रम",
      skills: "कौशल",
      languages: "भाषाएं",
      projects: "परियोजनाएं",
      awards: "पुरस्कार और उपलब्धियां",
      driverLicense: "ड्राइविंग लाइसेंस",
      hobbies: "रुचियां और शौक",
      contacts: "संपर्क",
    },
    common: {
      present: "वर्तमान",
      citizenship: "नागरिकता",
      relocation: "पुनर्वास",
      workFormat: {
        any: "कोई भी",
        office: "कार्यालय",
        hybrid: "हाइब्रिड",
        remote: "रिमोट",
      },
      phone: "फ़ोन",
      email: "ईमेल",
      city: "शहर",
    },
    months: [
      "जन", "फ़र", "मार्च", "अप्रैल", "मई", "जून",
      "जुल", "अग", "सित", "अक्तू", "नव", "दिस"
    ],
  },
  pl: {
    sections: {
      summary: "Podsumowanie Zawodowe",
      experience: "Doświadczenie Zawodowe",
      education: "Wykształcenie",
      courses: "Kursy i Certyfikaty",
      skills: "Umiejętności",
      languages: "Języki",
      projects: "Projekty",
      awards: "Osiągnięcia",
      driverLicense: "Prawo Jazdy",
      hobbies: "Zainteresowania",
      contacts: "Kontakt",
    },
    common: {
      present: "Obecnie",
      citizenship: "Obywatelstwo",
      relocation: "Relokacja",
      workFormat: {
        any: "Dowolny",
        office: "Stacjonarnie",
        hybrid: "Hybrydowo",
        remote: "Zdalnie",
      },
      phone: "Telefon",
      email: "Email",
      city: "Miasto",
    },
    months: [
      "Sty", "Lut", "Mar", "Kwi", "Maj", "Cze",
      "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"
    ],
  },
  nl: {
    sections: {
      summary: "Persoonlijk Profiel",
      experience: "Werkervaring",
      education: "Opleiding",
      courses: "Cursussen & Certificaten",
      skills: "Vaardigheden",
      languages: "Talen",
      projects: "Projecten",
      awards: "Prijzen & Prestaties",
      driverLicense: "Rijbewijs",
      hobbies: "Interesses & Hobby's",
      contacts: "Contactgegevens",
    },
    common: {
      present: "Heden",
      citizenship: "Nationaliteit",
      relocation: "Bereid tot verhuizing",
      workFormat: {
        any: "Alle vormen",
        office: "Op locatie",
        hybrid: "Hybride",
        remote: "Op afstand",
      },
      phone: "Telefoon",
      email: "E-mail",
      city: "Woonplaats",
    },
    months: [
      "Jan", "Feb", "Mrt", "Apr", "Mei", "Jun",
      "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"
    ],
  },
  uk: {
    sections: {
      summary: "Про себе",
      experience: "Досвід роботи",
      education: "Освіта",
      courses: "Курси та сертифікати",
      skills: "Навички",
      languages: "Іноземні мови",
      projects: "Проєкти",
      awards: "Нагороди та досягнення",
      driverLicense: "Водійські права",
      hobbies: "Інтереси та хобі",
      contacts: "Контакти",
    },
    common: {
      present: "по теперішній час",
      citizenship: "Громадянство",
      relocation: "Релокація",
      workFormat: {
        any: "Будь-який",
        office: "В офісі",
        hybrid: "Гібридний",
        remote: "Дистанційно",
      },
      phone: "Телефон",
      email: "Email",
      city: "Місто",
    },
    months: [
      "Січ", "Лют", "Бер", "Кві", "Тра", "Чер",
      "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"
    ],
  },
};

/**
 * Возвращает словарь переводов для любого языка мира.
 * Если точного соответствия нет, безопасно возвращает английский шаблон.
 */
export function getTranslations(lang: string = "ru"): Translations {
  const code = (lang || "ru").toLowerCase().split("-")[0];
  if (RAW_TRANSLATIONS[code]) {
    return RAW_TRANSLATIONS[code];
  }
  return RAW_TRANSLATIONS.en || RAW_TRANSLATIONS.ru;
}

/**
 * Proxy для translations: гарантирует, что translations[lang] вернёт валидный объект
 * для абсолютно любого языка мира без падений и undefined.
 */
export const translations: Record<string, Translations> = new Proxy(RAW_TRANSLATIONS, {
  get(target, prop: string) {
    if (typeof prop !== "string") return undefined;
    const code = prop.toLowerCase().split("-")[0];
    return target[code] || target.en || target.ru;
  },
});

/**
 * Форматирует диапазон дат (например: "Мар 2022 — по настоящее время" или "Mar 2022 — Present")
 */
export function formatDateRange(
  startMonth: string | undefined,
  startYear: string | undefined,
  endMonth: string | undefined,
  endYear: string | undefined,
  isCurrent: boolean | undefined,
  lang: string = "ru"
): string {
  const t = getTranslations(lang);

  const formatSingle = (m?: string, y?: string) => {
    if (!y) return "";
    if (m) {
      const idx = parseInt(m, 10) - 1;
      const monthStr = t.months[idx] || m;
      return `${monthStr} ${y}`;
    }
    return y;
  };

  const start = formatSingle(startMonth, startYear);
  if (!start) return "";

  if (isCurrent) {
    return `${start} — ${t.common.present}`;
  }

  const end = formatSingle(endMonth, endYear);
  if (!end) return start;

  return `${start} — ${end}`;
}
