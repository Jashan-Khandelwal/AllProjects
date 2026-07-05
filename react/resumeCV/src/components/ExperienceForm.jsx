export default function ExperienceForm({
  entries,
  isSubmitted,
  onChange,
  onAdd,
  onRemove,
  onSubmit,
  onEdit,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  if (isSubmitted) {
    return (
      <section className="card">
        <h2>Work Experience</h2>
        {entries.map((entry, idx) => (
          <div key={idx} className="entry-display">
            <p><strong>Company:</strong> {entry.company}</p>
            <p><strong>Position:</strong> {entry.position}</p>
            <p><strong>Responsibilities:</strong> {entry.responsibilities}</p>
            <p><strong>Period:</strong> {entry.from} – {entry.to}</p>
          </div>
        ))}
        <button type="button" onClick={onEdit}>Edit</button>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Work Experience</h2>
      <form onSubmit={handleSubmit}>
        {entries.map((entry, idx) => (
          <div key={idx} className="entry-form">
            <div className="entry-header">
              <span>Entry {idx + 1}</span>
              <button
                type="button"
                onClick={() => onRemove(idx)}
                disabled={entries.length === 1}
              >
                Remove
              </button>
            </div>

            <div className="field">
              <label>Company Name</label>
              <input
                type="text"
                value={entry.company}
                onChange={(e) => onChange(idx, "company", e.target.value)}
                placeholder="Acme Corp"
                required
              />
            </div>

            <div className="field">
              <label>Position Title</label>
              <input
                type="text"
                value={entry.position}
                onChange={(e) => onChange(idx, "position", e.target.value)}
                placeholder="Software Engineer"
                required
              />
            </div>

            <div className="field">
              <label>Main Responsibilities</label>
              <textarea
                value={entry.responsibilities}
                onChange={(e) => onChange(idx, "responsibilities", e.target.value)}
                placeholder="Describe your key responsibilities..."
                rows={3}
                required
              />
            </div>

            <div className="field-row">
              <div className="field">
                <label>From</label>
                <input
                  type="text"
                  value={entry.from}
                  onChange={(e) => onChange(idx, "from", e.target.value)}
                  placeholder="Jan 2022"
                  required
                />
              </div>
              <div className="field">
                <label>To</label>
                <input
                  type="text"
                  value={entry.to}
                  onChange={(e) => onChange(idx, "to", e.target.value)}
                  placeholder="Dec 2023 or Present"
                  required
                />
              </div>
            </div>
          </div>
        ))}

        <div className="form-actions">
          <button type="button" onClick={onAdd}>+ Add Another</button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </section>
  );
}
