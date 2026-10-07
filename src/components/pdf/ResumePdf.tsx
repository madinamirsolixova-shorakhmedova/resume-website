"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Image,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { ResumeData } from "@/lib/schema";
import { translations, formatDateRange } from "@/lib/translations";
import { getExportFileName } from "@/lib/storage";
import { registerFonts } from "./fonts";

interface ResumePdfProps {
  data: ResumeData;
}

const createPdfStyles = (accentColor: string, template: string) => {
  return StyleSheet.create({
    page: {
      paddingTop: 36,
      paddingBottom: 36,
      paddingHorizontal: 40,
      fontFamily: "Roboto",
      fontSize: 9.5,
      color: "#1f2937",
      lineHeight: 1.35,
    },
    // Header
    headerContainer: {
      marginBottom: 14,
      textAlign: template === "classic" ? "center" : "left",
      borderBottomWidth: template === "minimal" ? 1 : 0,
      borderBottomColor: "#e5e7eb",
      paddingBottom: template === "minimal" ? 10 : 0,
    },
    headerTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: template === "classic" ? "center" : "flex-start",
      gap: 12,
      marginBottom: 4,
    },
    photo: {
      width: 50,
      height: 50,
      borderRadius: template === "modern" ? 25 : 4,
      objectFit: "cover",
    },
    fullName: {
      fontSize: 20,
      fontWeight: "bold",
      color: template === "modern" ? accentColor : "#111827",
    },
    targetTitle: {
      fontSize: 12,
      fontWeight: 500,
      color: "#4b5563",
      marginTop: 2,
      marginBottom: 6,
    },
    contactsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: template === "classic" ? "center" : "flex-start",
      gap: 6,
      color: "#4b5563",
      fontSize: 8.5,
    },
    contactItem: {
      color: "#4b5563",
    },
    separator: {
      color: "#9ca3af",
    },
    metaRow: {
      marginTop: 4,
      fontSize: 8,
      color: "#6b7280",
      fontStyle: "italic",
    },

    // Sections
    sectionContainer: {
      marginTop: 10,
      marginBottom: 4,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      color: template === "modern" ? accentColor : "#111827",
      borderBottomWidth: 1,
      borderBottomColor: template === "modern" ? accentColor : "#d1d5db",
      paddingBottom: 2,
      marginBottom: 6,
    },
    summaryText: {
      fontSize: 9.5,
      color: "#374151",
      lineHeight: 1.4,
    },

    // Experience & Education Items
    itemContainer: {
      marginBottom: 8,
    },
    itemHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    itemTitle: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#111827",
    },
    itemSubtitle: {
      fontSize: 9.5,
      color: "#374151",
    },
    itemDates: {
      fontSize: 8.5,
      color: "#6b7280",
      fontStyle: "italic",
    },
    bulletList: {
      marginTop: 3,
      paddingLeft: 6,
    },
    bulletRow: {
      flexDirection: "row",
      marginBottom: 2,
      paddingRight: 6,
    },
    bulletDot: {
      width: 12,
      fontSize: 9,
      color: template === "modern" ? accentColor : "#4b5563",
    },
    bulletContent: {
      flex: 1,
      fontSize: 9,
      color: "#374151",
      lineHeight: 1.35,
    },

    // Skills
    skillsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
    },
    skillBadge: {
      fontSize: 8.5,
      color: "#1f2937",
      backgroundColor: template === "modern" ? "#f1f5f9" : "transparent",
      paddingHorizontal: template === "modern" ? 6 : 0,
      paddingVertical: template === "modern" ? 2 : 0,
      borderRadius: 3,
      borderWidth: template === "modern" ? 1 : 0,
      borderColor: "#e2e8f0",
      marginRight: template === "modern" ? 4 : 8,
    },

    // Languages
    languagesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    languageItem: {
      fontSize: 9,
      color: "#374151",
    },

    // Extra
    extraItemText: {
      fontSize: 9,
      color: "#374151",
      marginBottom: 2,
    },
  });
};

export const ResumePdfDocument: React.FC<ResumePdfProps> = ({ data }) => {
  const lang = data.settings?.language || "ru";
  const t = translations[lang];
  const accentColor = data.settings?.accentColor || "#1e3a8a";
  const template = data.settings?.template || "classic";
  const styles = createPdfStyles(accentColor, template);

  const contactList: string[] = [];
  if (data.personal.city) contactList.push(data.personal.city);
  if (data.personal.phone) contactList.push(data.personal.phone);
  if (data.personal.email) contactList.push(data.personal.email);
  if (data.personal.telegram) contactList.push(`TG: ${data.personal.telegram}`);
  if (data.personal.github) contactList.push(`GH: ${data.personal.github}`);
  if (data.personal.linkedin) contactList.push(`IN: ${data.personal.linkedin}`);
  if (data.personal.portfolio) contactList.push(data.personal.portfolio);

  const metaList: string[] = [];
  if (data.personal.workFormat && data.personal.workFormat !== "any") {
    metaList.push(t.common.workFormat[data.personal.workFormat]);
  }
  if (data.personal.citizenship) {
    metaList.push(`${t.common.citizenship}: ${data.personal.citizenship}`);
  }
  if (data.personal.relocation) {
    metaList.push(`${t.common.relocation}: ${data.personal.relocation}`);
  }

  // Секция опыта
  const renderExperience = () => {
    if (data.hasNoExperience || !data.experience || data.experience.length === 0) return null;

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{t.sections.experience}</Text>
        {data.experience.map((exp) => {
          if (!exp.position && !exp.company) return null;
          const dateStr = formatDateRange(
            exp.startMonth,
            exp.startYear,
            exp.endMonth,
            exp.endYear,
            exp.current,
            lang
          );

          return (
            <View key={exp.id} style={styles.itemContainer} wrap={false}>
              <View style={styles.itemHeaderRow}>
                <Text style={styles.itemTitle}>
                  {exp.position}{" "}
                  <Text style={styles.itemSubtitle}>
                    — {exp.company}
                    {exp.city ? `, ${exp.city}` : ""}
                  </Text>
                </Text>
                <Text style={styles.itemDates}>{dateStr}</Text>
              </View>

              {exp.bullets && exp.bullets.length > 0 && (
                <View style={styles.bulletList}>
                  {exp.bullets.map((bullet, idx) => {
                    if (!bullet || !bullet.trim()) return null;
                    return (
                      <View key={idx} style={styles.bulletRow}>
                        <Text style={styles.bulletDot}>•</Text>
                        <Text style={styles.bulletContent}>{bullet.trim()}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  // Секция образования
  const renderEducation = () => {
    if (!data.education || data.education.length === 0) return null;

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{t.sections.education}</Text>
        {data.education.map((edu) => {
          if (!edu.institution) return null;
          const yearRange = edu.current
            ? `${edu.startYear} — ${t.common.present}`
            : edu.endYear
            ? `${edu.startYear} — ${edu.endYear}`
            : edu.startYear;

          return (
            <View key={edu.id} style={styles.itemContainer} wrap={false}>
              <View style={styles.itemHeaderRow}>
                <Text style={styles.itemTitle}>{edu.institution}</Text>
                <Text style={styles.itemDates}>{yearRange}</Text>
              </View>
              {(edu.degree || edu.faculty) && (
                <Text style={styles.itemSubtitle}>
                  {[edu.degree, edu.faculty].filter(Boolean).join(", ")}
                </Text>
              )}
            </View>
          );
        })}

        {/* Курсы */}
        {data.courses && data.courses.length > 0 && (
          <View style={{ marginTop: 6 }} wrap={false}>
            <Text style={[styles.itemTitle, { fontSize: 9.5, marginBottom: 3 }]}>
              {t.sections.courses}:
            </Text>
            {data.courses.map((c) => {
              if (!c.name) return null;
              return (
                <View key={c.id} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletContent}>
                    <Text style={{ fontWeight: "bold" }}>{c.name}</Text> — {c.organization} ({c.year})
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  // Секция навыков
  const renderSkills = () => {
    if (!data.skills || data.skills.length === 0) return null;

    return (
      <View style={styles.sectionContainer} wrap={false}>
        <Text style={styles.sectionTitle}>{t.sections.skills}</Text>
        <View style={styles.skillsGrid}>
          {data.skills.map((skill, idx) => (
            <Text key={idx} style={styles.skillBadge}>
              {skill}
              {template !== "modern" && idx < data.skills.length - 1 ? "  •" : ""}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  // Секция языков
  const renderLanguages = () => {
    if (!data.languages || data.languages.length === 0) return null;

    return (
      <View style={styles.sectionContainer} wrap={false}>
        <Text style={styles.sectionTitle}>{t.sections.languages}</Text>
        <View style={styles.languagesContainer}>
          {data.languages.map((l) => (
            <Text key={l.id} style={styles.languageItem}>
              <Text style={{ fontWeight: "bold" }}>{l.language}:</Text> {l.level}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  // Секция проектов
  const renderProjects = () => {
    if (
      !data.extraSections?.showProjects ||
      !data.extraSections.projects ||
      data.extraSections.projects.length === 0
    )
      return null;

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{t.sections.projects}</Text>
        {data.extraSections.projects.map((proj) => {
          if (!proj.name) return null;
          return (
            <View key={proj.id} style={styles.itemContainer} wrap={false}>
              <View style={styles.itemHeaderRow}>
                <Text style={styles.itemTitle}>{proj.name}</Text>
                {proj.link && (
                  <Text style={[styles.itemDates, { color: accentColor }]}>
                    {proj.link}
                  </Text>
                )}
              </View>
              <Text style={styles.itemSubtitle}>{proj.description}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  // Секция дополнительных сведений
  const renderExtras = () => {
    const hasAwards =
      data.extraSections?.showAwards &&
      data.extraSections.awards &&
      data.extraSections.awards.length > 0;
    const hasLicense =
      data.extraSections?.showDriverLicense &&
      data.extraSections.driverLicense?.trim();
    const hasHobbies =
      data.extraSections?.showHobbies && data.extraSections.hobbies?.trim();

    if (!hasAwards && !hasLicense && !hasHobbies) return null;

    return (
      <View style={styles.sectionContainer} wrap={false}>
        {hasAwards && (
          <View style={{ marginBottom: 6 }}>
            <Text style={styles.sectionTitle}>{t.sections.awards}</Text>
            {data.extraSections.awards.map((a, idx) => {
              if (!a.trim()) return null;
              return (
                <View key={idx} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletContent}>{a.trim()}</Text>
                </View>
              );
            })}
          </View>
        )}

        {hasLicense && (
          <View style={{ marginBottom: 6 }}>
            <Text style={styles.sectionTitle}>{t.sections.driverLicense}</Text>
            <Text style={styles.extraItemText}>
              {data.extraSections.driverLicense}
            </Text>
          </View>
        )}

        {hasHobbies && (
          <View>
            <Text style={styles.sectionTitle}>{t.sections.hobbies}</Text>
            <Text style={styles.extraItemText}>{data.extraSections.hobbies}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Шапка */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTopRow}>
            {data.personal.showPhoto && data.personal.photoUrl && (
              /* eslint-disable-next-line jsx-a11y/alt-text */
              <Image src={data.personal.photoUrl} style={styles.photo} />
            )}
            <View>
              <Text style={styles.fullName}>
                {data.personal.fullName || "Имя Фамилия"}
              </Text>
              <Text style={styles.targetTitle}>
                {data.personal.targetTitle || data.vacancy.jobTitle}
              </Text>
            </View>
          </View>

          {/* Контакты */}
          {contactList.length > 0 && (
            <View style={styles.contactsRow}>
              {contactList.map((c, idx) => (
                <React.Fragment key={idx}>
                  <Text style={styles.contactItem}>{c}</Text>
                  {idx < contactList.length - 1 && (
                    <Text style={styles.separator}>•</Text>
                  )}
                </React.Fragment>
              ))}
            </View>
          )}

          {/* Мета (формат, гражданство) */}
          {metaList.length > 0 && (
            <Text style={styles.metaRow}>{metaList.join("  |  ")}</Text>
          )}
        </View>

        {/* О себе */}
        {data.personal.summary && data.personal.summary.trim() && (
          <View style={styles.sectionContainer} wrap={false}>
            <Text style={styles.sectionTitle}>{t.sections.summary}</Text>
            <Text style={styles.summaryText}>{data.personal.summary}</Text>
          </View>
        )}

        {/* Секции с учетом порядка */}
        {data.hasNoExperience ? (
          <>
            {renderEducation()}
            {renderProjects()}
            {renderSkills()}
            {renderLanguages()}
            {renderExtras()}
          </>
        ) : (
          <>
            {renderExperience()}
            {renderEducation()}
            {renderSkills()}
            {renderLanguages()}
            {renderProjects()}
            {renderExtras()}
          </>
        )}
      </Page>
    </Document>
  );
};

/**
 * Генерирует PDF и запускает скачивание файла
 */
export async function generatePdfResume(data: ResumeData): Promise<void> {
  registerFonts();
  const doc = <ResumePdfDocument data={data} />;
  const asPdf = pdf(doc);
  const blob = await asPdf.toBlob();
  const fileName = getExportFileName(data, "pdf");
  saveAs(blob, fileName);
}
