export default function GeneralForm({ data, isSubmitted, onChange, onSubmit, onEdit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  if (isSubmitted) {
    return (
      <section className="card">
        <h2>General Information</h2>
        <div className="entry-display">
          <p><strong>Name:</strong> {data.name}</p>
          <p><strong>Email:</strong> {data.email}</p>
          <p><strong>Phone:</strong> {data.phone}</p>
        </div>
        <button type="button" onClick={onEdit}>Edit</button>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>General Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            value={data.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Jane Doe"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="jane@example.com"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="+1 555 000 0000"
            required
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </section>
  );
}
