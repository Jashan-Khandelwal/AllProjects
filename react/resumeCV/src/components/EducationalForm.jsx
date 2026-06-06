import { useState } from "react";

export default function EducationalForms() {
  const emptyEntry = {
    school: "",
    degree: "",
    start: "",
    end: "",
    location: "",
  };
  const [forms, setForms] = useState([{ ...emptyEntry }]);

  const handleChange = (idx, e) => {
    const { name, value } = e.target;
    setForms((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [name]: value };
      return next;
    });
  };

  const addForm = () => setForms((prev) => [...prev, { ...emptyEntry }]);

  const removeForm = (idx) =>
    setForms((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(forms); // all entries here
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Education Details</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {forms.map((form, idx) => (
          <div
            key={idx}
            className="rounded-2xl border p-4 space-y-3 shadow-sm bg-white"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">Entry {idx + 1}</span>
              <button
                type="button"
                onClick={() => removeForm(idx)}
                className="text-sm px-3 py-1 rounded-md border hover:bg-gray-50 disabled:opacity-50"
                disabled={forms.length === 1}
              >
                Remove
              </button>
            </div>

            <input
              type="text"
              name="school"
              placeholder="School"
              value={form.school}
              onChange={(e) => handleChange(idx, e)}
              className="w-full border p-2 rounded-md"
              required
            />

            <input
              type="text"
              name="degree"
              placeholder="Degree"
              value={form.degree}
              onChange={(e) => handleChange(idx, e)}
              className="w-full border p-2 rounded-md"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="start"
                placeholder="Start (e.g., 2021)"
                value={form.start}
                onChange={(e) => handleChange(idx, e)}
                className="w-full border p-2 rounded-md"
                required
              />
              <input
                type="text"
                name="end"
                placeholder="End (e.g., 2025 or Present)"
                value={form.end}
                onChange={(e) => handleChange(idx, e)}
                className="w-full border p-2 rounded-md"
                required
              />
            </div>

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={(e) => handleChange(idx, e)}
              className="w-full border p-2 rounded-md"
              required
            />
          </div>
        ))}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={addForm}
            className="px-4 py-2 rounded-md border hover:bg-gray-50"
          >
            Add another
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Submit all
          </button>
        </div>
      </form>
    </div>
  );
}
