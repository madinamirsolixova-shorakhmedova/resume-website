"use client";

import React from "react";
import { ResumeData } from "@/lib/schema";
import { translations, formatDateRange } from "@/lib/translations";

interface Props {
  data: ResumeData;
}

export const ClassicTemplate: React.FC<Props> = ({ data }) => {
  const lang = data.settings?.language || "ru";
  const t = translations[lang];

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
    <div className="border-b border-gray-400 pb-1 mb-2 mt-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 font-serif">
        {title}
      </h2>
    </div>
  );

  return (
    <div className="text-gray-900 font-serif text-[11px] leading-relaxed p-8 bg-white min-h-[1050px]">
      {/* Шапка */}
      <div className="text-center pb-3 border-b border-gray-300 mb-3">
        {data.personal.showPhoto && data.personal.photoUrl && (
          <div className="flex justify-center mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.personal.photoUrl}
              alt={data.personal.fullName}
              className="w-16 h-16 rounded-full object-cover border border-gray-300"
            />
          </div>
        )}
        <h1 className="text-xl font-bold text-gray-900 tracking-wide uppercase">
          {data.personal.fullName || "Имя Фамилия"}
        </h1>
        <p className="text-sm font-semibold text-gray-700 mt-0.5">
          {data.personal.targetTitle || data.vacancy.jobTitle}
        </p>

        {contactList.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-2 text-[10px] text-gray-600 mt-1.5 font-sans">
            {contactList.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {c}
                {i < contactList.length - 1 && <span>•</span>}
              </span>
            ))}
          </div>
        )}

        {metaList.length > 0 && (
          <p className="text-[9.5px] italic text-gray-500 mt-1 font-sans">
            {metaList.join("  |  ")}
          </p>
        )}
      </div>

      {/* О себе */}
      {data.personal.summary && (
        <div>
          {renderSectionHeading(t.sections.summary)}
          <p className="text-gray-800 leading-normal font-sans text-[10.5px]">
            {data.personal.summary}
          </p>
        </div>
      )}

      {/* Опыт работы */}
      {!data.hasNoExperience && data.experience && data.experience.length > 0 && (
        <div>
          {renderSectionHeading(t.sections.experience)}
          <div className="space-y-3 font-sans">
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
                      <span className="font-normal text-gray-700">
                        — {exp.company}
                        {exp.city ? `, ${exp.city}` : ""}
                      </span>
                    </span>
                    <span className="text-[10px] italic text-gray-500">{dateStr}</span>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc pl-4 mt-1 space-y-0.5 text-gray-800 text-[10.5px]">
                      {exp.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
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
          <div className="space-y-2 font-sans">
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
                    <span className="text-[10px] italic text-gray-500">{yearRange}</span>
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
              <div className="mt-2 pt-1">
                <span className="font-semibold text-gray-800 text-[10px]">
                  {t.sections.courses}:
                </span>
                <ul className="list-disc pl-4 mt-0.5 space-y-0.5 text-[10px] text-gray-700">
                  {data.courses.map((c) => (
                    <li key={c.id}>
                      <span className="font-semibold">{c.name}</span> — {c.organization} (
                      {c.year})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Навыки */}
      {data.skills && data.skills.length > 0 && (
        <div>
          {renderSectionHeading(t.sections.skills)}
          <p className="text-gray-800 text-[10.5px] font-sans">
            {data.skills.join("  •  ")}
          </p>
        </div>
      )}

      {/* Языки */}
      {data.languages && data.languages.length > 0 && (
        <div>
          {renderSectionHeading(t.sections.languages)}
          <div className="flex flex-wrap gap-x-4 text-[10.5px] font-sans text-gray-800">
            {data.languages.map((l) => (
              <span key={l.id}>
                <strong className="font-semibold">{l.language}:</strong> {l.level}
              </span>
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
            <div className="space-y-1.5 font-sans">
              {data.extraSections.projects.map((p) => (
                <div key={p.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-gray-900 text-[11px]">{p.name}</span>
                    {p.link && (
                      <span className="text-[10px] text-blue-800 underline">{p.link}</span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-700">{p.description}</p>
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
                <ul className="list-disc pl-4 space-y-0.5 text-gray-800 font-sans text-[10.5px]">
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
                <p className="text-gray-800 font-sans text-[10.5px]">
                  {data.extraSections.driverLicense}
                </p>
              </div>
            )}

          {data.extraSections.showHobbies && data.extraSections.hobbies && (
            <div>
              {renderSectionHeading(t.sections.hobbies)}
              <p className="text-gray-800 font-sans text-[10.5px]">
                {data.extraSections.hobbies}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
