"use client";

import React from "react";
import { ResumeData } from "@/lib/schema";
import { translations, formatDateRange } from "@/lib/translations";

interface Props {
  data: ResumeData;
}

export const MinimalTemplate: React.FC<Props> = ({ data }) => {
  const lang = data.settings?.language || "ru";
  const t = translations[lang];

  const contactList: string[] = [];
  if (data.personal.city) contactList.push(data.personal.city);
  if (data.personal.phone) contactList.push(data.personal.phone);
  if (data.personal.email) contactList.push(data.personal.email);
  if (data.personal.telegram) contactList.push(`tg: ${data.personal.telegram}`);
  if (data.personal.github) contactList.push(`gh: ${data.personal.github}`);
  if (data.personal.linkedin) contactList.push(`in: ${data.personal.linkedin}`);
  if (data.personal.portfolio) contactList.push(data.personal.portfolio);

  const renderSectionHeading = (title: string) => (
    <div className="mb-2 mt-4">
      <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        {title}
      </h2>
    </div>
  );

  return (
    <div className="text-zinc-900 font-sans text-[11px] leading-relaxed p-8 bg-white min-h-[1050px]">
      {/* Шапка */}
      <div className="pb-3 border-b border-zinc-200">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">
          {data.personal.fullName || "Имя Фамилия"}
        </h1>
        <p className="text-xs font-medium text-zinc-500 mt-0.5">
          {data.personal.targetTitle || data.vacancy.jobTitle}
        </p>

        {contactList.length > 0 && (
          <div className="flex flex-wrap gap-x-2 text-[9.5px] text-zinc-500 mt-2 font-mono">
            {contactList.map((c, i) => (
              <span key={i} className="flex items-center gap-2">
                {c}
                {i < contactList.length - 1 && <span className="text-zinc-300">/</span>}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* О себе */}
      {data.personal.summary && (
        <div>
          {renderSectionHeading(t.sections.summary)}
          <p className="text-zinc-700 leading-relaxed text-[10px]">
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
                <div key={exp.id} className="border-l border-zinc-200 pl-3">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-zinc-900 text-[10.5px]">
                      {exp.position}
                    </span>
                    <span className="text-[9.5px] text-zinc-400 font-mono">
                      {dateStr}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    {exp.company}
                    {exp.city ? `, ${exp.city}` : ""}
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="mt-1 space-y-0.5 text-zinc-700 text-[10px]">
                      {exp.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-zinc-400 mt-0.5">—</span>
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
                <div key={edu.id} className="border-l border-zinc-200 pl-3">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-zinc-900 text-[10.5px]">
                      {edu.institution}
                    </span>
                    <span className="text-[9.5px] text-zinc-400 font-mono">
                      {yearRange}
                    </span>
                  </div>
                  {(edu.degree || edu.faculty) && (
                    <p className="text-[10px] text-zinc-500">
                      {[edu.degree, edu.faculty].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
              );
            })}

            {data.courses && data.courses.length > 0 && (
              <div className="mt-2 pt-1">
                <span className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-wider">
                  {t.sections.courses}
                </span>
                <ul className="mt-1 space-y-0.5 text-[10px] text-zinc-600">
                  {data.courses.map((c) => (
                    <li key={c.id}>
                      <span className="text-zinc-800 font-medium">{c.name}</span> —{" "}
                      {c.organization} ({c.year})
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
          <div className="flex flex-wrap gap-1 text-[10px] text-zinc-700">
            {data.skills.map((skill, i) => (
              <span key={i} className="border border-zinc-200 px-1.5 py-0.5 rounded">
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
          <div className="flex flex-wrap gap-4 text-[10px] text-zinc-700">
            {data.languages.map((l) => (
              <span key={l.id}>
                <span className="text-zinc-900 font-medium">{l.language}</span> ({l.level})
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
            <div className="space-y-1.5">
              {data.extraSections.projects.map((p) => (
                <div key={p.id} className="border-l border-zinc-200 pl-3">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-zinc-900 text-[10.5px]">
                      {p.name}
                    </span>
                    {p.link && (
                      <span className="text-[9.5px] text-zinc-500 font-mono">
                        {p.link}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-600">{p.description}</p>
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
                <ul className="space-y-0.5 text-zinc-600 text-[10px]">
                  {data.extraSections.awards.map((a, i) => (
                    <li key={i}>— {a}</li>
                  ))}
                </ul>
              </div>
            )}

          {data.extraSections.showDriverLicense &&
            data.extraSections.driverLicense && (
              <div>
                {renderSectionHeading(t.sections.driverLicense)}
                <p className="text-zinc-600 text-[10px]">
                  {data.extraSections.driverLicense}
                </p>
              </div>
            )}

          {data.extraSections.showHobbies && data.extraSections.hobbies && (
            <div>
              {renderSectionHeading(t.sections.hobbies)}
              <p className="text-zinc-600 text-[10px]">
                {data.extraSections.hobbies}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
