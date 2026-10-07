"use client";

import React from "react";
import { ResumeData } from "@/lib/schema";
import { translations, formatDateRange } from "@/lib/translations";

interface Props {
  data: ResumeData;
}

export const ModernTemplate: React.FC<Props> = ({ data }) => {
  const lang = data.settings?.language || "ru";
  const t = translations[lang];
  const accentColor = data.settings?.accentColor || "#2563eb";

  const contactList: string[] = [];
  if (data.personal.city) contactList.push(data.personal.city);
  if (data.personal.phone) contactList.push(data.personal.phone);
  if (data.personal.email) contactList.push(data.personal.email);
  if (data.personal.telegram) contactList.push(`Telegram: ${data.personal.telegram}`);
  if (data.personal.github) contactList.push(`GitHub: ${data.personal.github}`);
  if (data.personal.linkedin) contactList.push(`LinkedIn: ${data.personal.linkedin}`);
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

  const renderSectionHeading = (title: string) => (
    <div className="border-b-2 pb-1 mb-2 mt-4" style={{ borderColor: accentColor }}>
      <h2
        className="text-xs font-bold uppercase tracking-wider"
        style={{ color: accentColor }}
      >
        {title}
      </h2>
    </div>
  );

  return (
    <div className="text-gray-900 font-sans text-[11px] leading-relaxed p-8 bg-white min-h-[1050px]">
      {/* Шапка */}
      <div className="flex items-center gap-5 pb-4 border-b border-gray-200">
        {data.personal.showPhoto && data.personal.photoUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={data.personal.photoUrl}
            alt={data.personal.fullName}
            className="w-18 h-18 rounded-xl object-cover shadow-sm border border-gray-200 flex-shrink-0"
          />
        )}
        <div className="flex-1">
          <h1
            className="text-2xl font-extrabold tracking-tight"
            style={{ color: accentColor }}
          >
            {data.personal.fullName || "Имя Фамилия"}
          </h1>
          <p className="text-sm font-semibold text-gray-700 mt-0.5">
            {data.personal.targetTitle || data.vacancy.jobTitle}
          </p>

          {contactList.length > 0 && (
            <div className="flex flex-wrap gap-x-3 text-[10px] text-gray-600 mt-2">
              {contactList.map((c, i) => (
                <span key={i} className="flex items-center gap-1">
                  {c}
                  {i < contactList.length - 1 && <span className="text-gray-300">•</span>}
                </span>
              ))}
            </div>
          )}

          {metaList.length > 0 && (
            <p className="text-[9.5px] text-gray-500 mt-1 font-medium">
              {metaList.join("  |  ")}
            </p>
          )}
        </div>
      </div>

      {/* О себе */}
      {data.personal.summary && (
        <div>
          {renderSectionHeading(t.sections.summary)}
          <p className="text-gray-700 leading-normal text-[10.5px]">
            {data.personal.summary}
          </p>
        </div>
      )}

      {/* Опыт работы */}
      {!data.hasNoExperience && data.experience && data.experience.length > 0 && (
        <div>
          {renderSectionHeading(t.sections.experience)}
          <div className="space-y-3">
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
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-gray-900 text-[11px]">
                      {exp.position}{" "}
                      <span className="font-normal text-gray-600">
                        — {exp.company}
                        {exp.city ? `, ${exp.city}` : ""}
                      </span>
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {dateStr}
                    </span>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="mt-1 space-y-1 text-gray-700 text-[10.5px]">
                      {exp.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span
                            className="font-bold text-sm leading-none mt-0.5"
                            style={{ color: accentColor }}
                          >
                            •
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Образование */}
      {data.education && data.education.length > 0 && (
        <div>
          {renderSectionHeading(t.sections.education)}
          <div className="space-y-2">
            {data.education.map((edu) => {
              if (!edu.institution) return null;
              const yearRange = edu.current
                ? `${edu.startYear} — ${t.common.present}`
                : edu.endYear
                ? `${edu.startYear} — ${edu.endYear}`
                : edu.startYear;

              return (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-gray-900 text-[11px]">
                      {edu.institution}
                    </span>
                    <span className="text-[10px] text-gray-500">{yearRange}</span>
                  </div>
                  {(edu.degree || edu.faculty) && (
                    <p className="text-[10px] text-gray-600">
                      {[edu.degree, edu.faculty].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
              );
            })}

            {/* Курсы */}
            {data.courses && data.courses.length > 0 && (
              <div className="mt-2 pt-1 border-t border-gray-100">
                <span className="font-semibold text-gray-800 text-[10px]">
                  {t.sections.courses}:
                </span>
                <div className="grid grid-cols-2 gap-1.5 mt-1 text-[10px] text-gray-700">
                  {data.courses.map((c) => (
                    <div key={c.id} className="bg-gray-50 px-2 py-1 rounded">
                      <span className="font-semibold text-gray-900">{c.name}</span>
                      <span className="text-gray-500">
                        {" "}
                        — {c.organization} ({c.year})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Навыки */}
      {data.skills && data.skills.length > 0 && (
        <div>
          {renderSectionHeading(t.sections.skills)}
          <div className="flex flex-wrap gap-1.5 mt-1">
            {data.skills.map((skill, i) => (
              <span
                key={i}
                className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-[10px] font-medium border border-gray-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Языки */}
      {data.languages && data.languages.length > 0 && (
        <div>
          {renderSectionHeading(t.sections.languages)}
          <div className="flex flex-wrap gap-3 text-[10.5px] text-gray-800">
            {data.languages.map((l) => (
              <div
                key={l.id}
                className="bg-gray-50 border border-gray-200 px-2.5 py-1 rounded"
              >
                <span className="font-bold text-gray-900">{l.language}:</span>{" "}
                <span className="text-gray-600">{l.level}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Проекты */}
      {data.extraSections?.showProjects &&
        data.extraSections.projects &&
        data.extraSections.projects.length > 0 && (
          <div>
            {renderSectionHeading(t.sections.projects)}
            <div className="space-y-1.5">
              {data.extraSections.projects.map((p) => (
                <div key={p.id} className="bg-gray-50 p-2 rounded border border-gray-200">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-gray-900 text-[11px]">{p.name}</span>
                    {p.link && (
                      <span
                        className="text-[10px] font-medium"
                        style={{ color: accentColor }}
                      >
                        {p.link}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-700 mt-0.5">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Дополнительно */}
      {(data.extraSections?.showAwards ||
        data.extraSections?.showDriverLicense ||
        data.extraSections?.showHobbies) && (
        <div>
          {data.extraSections.showAwards &&
            data.extraSections.awards &&
            data.extraSections.awards.length > 0 && (
              <div>
                {renderSectionHeading(t.sections.awards)}
                <ul className="list-disc pl-4 space-y-0.5 text-gray-700 text-[10.5px]">
                  {data.extraSections.awards.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}

          {data.extraSections.showDriverLicense &&
            data.extraSections.driverLicense && (
              <div>
                {renderSectionHeading(t.sections.driverLicense)}
                <p className="text-gray-700 text-[10.5px]">
                  {data.extraSections.driverLicense}
                </p>
              </div>
            )}

          {data.extraSections.showHobbies && data.extraSections.hobbies && (
            <div>
              {renderSectionHeading(t.sections.hobbies)}
              <p className="text-gray-700 text-[10.5px]">
                {data.extraSections.hobbies}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
