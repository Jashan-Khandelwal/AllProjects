export default function CVPreview({ generalInfo, education, experience }) {
  const hasEdu = education.some((e) => e.school || e.degree);
  const hasExp = experience.some((e) => e.company || e.position);

  return (
    <div className="cv-paper">
      <header className="cv-header">
        <h1 className="cv-name">{generalInfo.name || "Your Name"}</h1>
        <div className="cv-contact">
          {generalInfo.email && <span>✉ {generalInfo.email}</span>}
          {generalInfo.phone && <span>☎ {generalInfo.phone}</span>}
        </div>
      </header>

      {hasEdu && (
        <section className="cv-section">
          <h2 className="cv-section-title">Education</h2>
          {education
            .filter((e) => e.school)
            .map((entry, idx) => (
              <div key={idx} className="cv-entry">
                <div className="cv-entry-meta">
                  {entry.start && (
                    <span>
                      {entry.start}
                      {entry.end && ` – ${entry.end}`}
                    </span>
                  )}
                </div>
                <div className="cv-entry-content">
                  <strong>{entry.school}</strong>
                  {entry.degree && <p>{entry.degree}</p>}
                </div>
              </div>
            ))}
        </section>
      )}

      {hasExp && (
        <section className="cv-section">
          <h2 className="cv-section-title">Professional Experience</h2>
          {experience
            .filter((e) => e.company)
            .map((entry, idx) => (
              <div key={idx} className="cv-entry">
                <div className="cv-entry-meta">
                  {entry.from && (
                    <span>
                      {entry.from}
                      {entry.to && ` – ${entry.to}`}
                    </span>
                  )}
                </div>
                <div className="cv-entry-content">
                  <strong>{entry.company}</strong>
                  {entry.position && <p className="cv-position">{entry.position}</p>}
                  {entry.responsibilities && (
                    <p className="cv-responsibilities">{entry.responsibilities}</p>
                  )}
                </div>
              </div>
            ))}
        </section>
      )}

      {!generalInfo.name && !hasEdu && !hasExp && (
        <p className="cv-empty">Start filling in the form to see your CV here.</p>
      )}
    </div>
  );
}
