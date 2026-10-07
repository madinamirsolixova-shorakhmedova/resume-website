import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
} from "docx";
import { saveAs } from "file-saver";
import { ResumeData } from "./schema";
import { translations, formatDateRange } from "./translations";
import { getExportFileName } from "./storage";

export async function generateDocxResume(resume: ResumeData): Promise<void> {
  const lang = resume.settings?.language || "ru";
  const t = translations[lang];
  const accentHex = (resume.settings?.accentColor || "#1e3a8a").replace("#", "");
  const template = resume.settings?.template || "classic";

  const children: Paragraph[] = [];

  // Вспомогательная функция для заголовков секций
  const createSectionHeading = (title: string): Paragraph => {
    let fontColor = "111827";
    const bottomBorder = true;

    if (template === "modern") {
      fontColor = accentHex;
    }

    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 120 },
      border: bottomBorder
        ? {
            bottom: {
              color: template === "modern" ? accentHex : "D1D5DB",
              space: 4,
              style: BorderStyle.SINGLE,
              size: 8,
            },
          }
        : undefined,
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 22, // 11pt
          color: fontColor,
          font: template === "classic" ? "Times New Roman" : "Arial",
        }),
      ],
    });
  };

  // 1. ШАПКА: ФИО и Должность
  children.push(
    new Paragraph({
      alignment: template === "classic" ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({
          text: resume.personal.fullName || "Имя Фамилия",
          bold: true,
          size: 32, // 16pt
          color: template === "modern" ? accentHex : "111827",
          font: template === "classic" ? "Times New Roman" : "Arial",
        }),
      ],
    })
  );

  const targetTitle = resume.personal.targetTitle || resume.vacancy.jobTitle;
  if (targetTitle) {
    children.push(
      new Paragraph({
        alignment: template === "classic" ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { before: 0, after: 100 },
        children: [
          new TextRun({
            text: targetTitle,
            size: 24, // 12pt
            bold: true,
            color: "4B5563",
            font: template === "classic" ? "Times New Roman" : "Arial",
          }),
        ],
      })
    );
  }

  // 2. КОНТАКТЫ
  const contactParts: string[] = [];
  if (resume.personal.city) contactParts.push(resume.personal.city);
  if (resume.personal.phone) contactParts.push(resume.personal.phone);
  if (resume.personal.email) contactParts.push(resume.personal.email);
  if (resume.personal.telegram) contactParts.push(`Telegram: ${resume.personal.telegram}`);
  if (resume.personal.github) contactParts.push(`GitHub: ${resume.personal.github}`);
  if (resume.personal.linkedin) contactParts.push(`LinkedIn: ${resume.personal.linkedin}`);
  if (resume.personal.portfolio) contactParts.push(resume.personal.portfolio);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: template === "classic" ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { before: 0, after: 180 },
        children: [
          new TextRun({
            text: contactParts.join("  •  "),
            size: 19, // 9.5pt
            color: "4B5563",
            font: template === "classic" ? "Times New Roman" : "Arial",
          }),
        ],
      })
    );
  }

  // Гражданство, формат работы
  const metaParts: string[] = [];
  if (resume.personal.workFormat && resume.personal.workFormat !== "any") {
    metaParts.push(`${t.common.workFormat[resume.personal.workFormat]}`);
  }
  if (resume.personal.citizenship) {
    metaParts.push(`${t.common.citizenship}: ${resume.personal.citizenship}`);
  }
  if (resume.personal.relocation) {
    metaParts.push(`${t.common.relocation}: ${resume.personal.relocation}`);
  }

  if (metaParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: template === "classic" ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { before: 0, after: 180 },
        children: [
          new TextRun({
            text: metaParts.join("  |  "),
            size: 18,
            italics: true,
            color: "6B7280",
            font: template === "classic" ? "Times New Roman" : "Arial",
          }),
        ],
      })
    );
  }

  // 3. О СЕБЕ
  if (resume.personal.summary && resume.personal.summary.trim()) {
    children.push(createSectionHeading(t.sections.summary));
    children.push(
      new Paragraph({
        spacing: { before: 40, after: 140 },
        children: [
          new TextRun({
            text: resume.personal.summary,
            size: 21, // 10.5pt
            font: template === "classic" ? "Times New Roman" : "Arial",
            color: "1F2937",
          }),
        ],
      })
    );
  }

  // Функции отрисовки секций
  const renderExperienceSection = () => {
    if (resume.hasNoExperience || !resume.experience || resume.experience.length === 0) return;

    children.push(createSectionHeading(t.sections.experience));

    for (const exp of resume.experience) {
      if (!exp.position && !exp.company) continue;

      const dateStr = formatDateRange(
        exp.startMonth,
        exp.startYear,
        exp.endMonth,
        exp.endYear,
        exp.current,
        lang
      );

      // Должность и Компания + даты
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [
            new TextRun({
              text: exp.position,
              bold: true,
              size: 22,
              color: "111827",
              font: template === "classic" ? "Times New Roman" : "Arial",
            }),
            new TextRun({
              text: ` — ${exp.company}${exp.city ? ` (${exp.city})` : ""}`,
              size: 21,
              color: "374151",
              font: template === "classic" ? "Times New Roman" : "Arial",
            }),
            new TextRun({
              text: dateStr ? `   [${dateStr}]` : "",
              size: 19,
              italics: true,
              color: "6B7280",
              font: template === "classic" ? "Times New Roman" : "Arial",
            }),
          ],
        })
      );

      // Буллеты
      if (exp.bullets && exp.bullets.length > 0) {
        for (const bullet of exp.bullets) {
          if (!bullet || !bullet.trim()) continue;
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { before: 20, after: 30 },
              children: [
                new TextRun({
                  text: bullet.trim(),
                  size: 20, // 10pt
                  color: "374151",
                  font: template === "classic" ? "Times New Roman" : "Arial",
                }),
              ],
            })
          );
        }
      }
    }
  };

  const renderEducationSection = () => {
    if (!resume.education || resume.education.length === 0) return;

    children.push(createSectionHeading(t.sections.education));

    for (const edu of resume.education) {
      if (!edu.institution) continue;

      const yearRange = edu.current
        ? `${edu.startYear} — ${t.common.present}`
        : edu.endYear
        ? `${edu.startYear} — ${edu.endYear}`
        : edu.startYear;

      children.push(
        new Paragraph({
          spacing: { before: 80, after: 20 },
          children: [
            new TextRun({
              text: edu.institution,
              bold: true,
              size: 21,
              color: "111827",
              font: template === "classic" ? "Times New Roman" : "Arial",
            }),
            new TextRun({
              text: yearRange ? `  (${yearRange})` : "",
              size: 19,
              italics: true,
              color: "6B7280",
              font: template === "classic" ? "Times New Roman" : "Arial",
            }),
          ],
        })
      );

      if (edu.degree || edu.faculty) {
        const details = [edu.degree, edu.faculty].filter(Boolean).join(", ");
        children.push(
          new Paragraph({
            spacing: { before: 0, after: 60 },
            children: [
              new TextRun({
                text: details,
                size: 20,
                color: "4B5563",
                font: template === "classic" ? "Times New Roman" : "Arial",
              }),
            ],
          })
        );
      }
    }

    // Курсы
    if (resume.courses && resume.courses.length > 0) {
      const validCourses = resume.courses.filter((c) => c.name);
      if (validCourses.length > 0) {
        children.push(
          new Paragraph({
            spacing: { before: 80, after: 40 },
            children: [
              new TextRun({
                text: t.sections.courses,
                bold: true,
                size: 20,
                color: "374151",
                font: template === "classic" ? "Times New Roman" : "Arial",
              }),
            ],
          })
        );

        for (const course of validCourses) {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { before: 20, after: 20 },
              children: [
                new TextRun({
                  text: course.name,
                  bold: true,
                  size: 20,
                  color: "1F2937",
                  font: template === "classic" ? "Times New Roman" : "Arial",
                }),
                new TextRun({
                  text: ` — ${course.organization} (${course.year})`,
                  size: 19,
                  color: "4B5563",
                  font: template === "classic" ? "Times New Roman" : "Arial",
                }),
              ],
            })
          );
        }
      }
    }
  };

  const renderSkillsSection = () => {
    if (!resume.skills || resume.skills.length === 0) return;

    children.push(createSectionHeading(t.sections.skills));
    children.push(
      new Paragraph({
        spacing: { before: 40, after: 100 },
        children: [
          new TextRun({
            text: resume.skills.join("  •  "),
            size: 20,
            color: "1F2937",
            font: template === "classic" ? "Times New Roman" : "Arial",
          }),
        ],
      })
    );
  };

  const renderLanguagesSection = () => {
    if (!resume.languages || resume.languages.length === 0) return;

    children.push(createSectionHeading(t.sections.languages));
    const langStrings = resume.languages.map((l) => `${l.language}: ${l.level}`);
    children.push(
      new Paragraph({
        spacing: { before: 40, after: 100 },
        children: [
          new TextRun({
            text: langStrings.join("  |  "),
            size: 20,
            color: "1F2937",
            font: template === "classic" ? "Times New Roman" : "Arial",
          }),
        ],
      })
    );
  };

  const renderProjectsSection = () => {
    if (
      !resume.extraSections?.showProjects ||
      !resume.extraSections.projects ||
      resume.extraSections.projects.length === 0
    )
      return;

    children.push(createSectionHeading(t.sections.projects));
    for (const proj of resume.extraSections.projects) {
      if (!proj.name) continue;
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 20 },
          children: [
            new TextRun({
              text: proj.name,
              bold: true,
              size: 21,
              color: "111827",
              font: template === "classic" ? "Times New Roman" : "Arial",
            }),
            new TextRun({
              text: proj.link ? ` [${proj.link}]` : "",
              size: 19,
              color: accentHex,
              font: template === "classic" ? "Times New Roman" : "Arial",
            }),
          ],
        })
      );
      children.push(
        new Paragraph({
          spacing: { before: 0, after: 60 },
          children: [
            new TextRun({
              text: proj.description,
              size: 20,
              color: "374151",
              font: template === "classic" ? "Times New Roman" : "Arial",
            }),
          ],
        })
      );
    }
  };

  const renderExtraSections = () => {
    // Награды
    if (
      resume.extraSections?.showAwards &&
      resume.extraSections.awards &&
      resume.extraSections.awards.length > 0
    ) {
      children.push(createSectionHeading(t.sections.awards));
      for (const award of resume.extraSections.awards) {
        if (!award.trim()) continue;
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({
                text: award.trim(),
                size: 20,
                color: "374151",
                font: template === "classic" ? "Times New Roman" : "Arial",
              }),
            ],
          })
        );
      }
    }

    // Водительские права
    if (
      resume.extraSections?.showDriverLicense &&
      resume.extraSections.driverLicense?.trim()
    ) {
      children.push(createSectionHeading(t.sections.driverLicense));
      children.push(
        new Paragraph({
          spacing: { before: 20, after: 60 },
          children: [
            new TextRun({
              text: resume.extraSections.driverLicense.trim(),
              size: 20,
              color: "374151",
              font: template === "classic" ? "Times New Roman" : "Arial",
            }),
          ],
        })
      );
    }

    // Хобби
    if (resume.extraSections?.showHobbies && resume.extraSections.hobbies?.trim()) {
      children.push(createSectionHeading(t.sections.hobbies));
      children.push(
        new Paragraph({
          spacing: { before: 20, after: 60 },
          children: [
            new TextRun({
              text: resume.extraSections.hobbies.trim(),
              size: 20,
              color: "374151",
              font: template === "classic" ? "Times New Roman" : "Arial",
            }),
          ],
        })
      );
    }
  };

  // Порядок вывода секций: если нет опыта, образование и проекты идут первыми
  if (resume.hasNoExperience) {
    renderEducationSection();
    renderProjectsSection();
    renderSkillsSection();
    renderLanguagesSection();
    renderExtraSections();
  } else {
    renderExperienceSection();
    renderEducationSection();
    renderSkillsSection();
    renderLanguagesSection();
    renderProjectsSection();
    renderExtraSections();
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.6),
              bottom: convertInchesToTwip(0.6),
              left: convertInchesToTwip(0.6),
              right: convertInchesToTwip(0.6),
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = getExportFileName(resume, "docx");
  saveAs(blob, fileName);
}
